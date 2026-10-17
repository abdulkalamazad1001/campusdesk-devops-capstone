#!/usr/bin/env bash
# Deploy to the EKS cluster in this repository's Terraform state.
set -euo pipefail
cd "$(dirname "$0")/.."
HELM="${HELM:-helm}"
cluster="$(terraform -chdir=terraform output -raw cluster_name)"
region="$(terraform -chdir=terraform output -raw region)"
aws eks update-kubeconfig --region "$region" --name "$cluster" --alias "$cluster"
K=(kubectl --context "$cluster")
"${K[@]}" wait --for=condition=Ready nodes --all --timeout=5m
"${K[@]}" apply -f k8s/namespace.yaml -f k8s/storage-aws.yaml
python3 - "$cluster" <<'PY'
import json
import secrets
import subprocess
import sys

command = ["kubectl", "--context", sys.argv[1], "-n", "campusdesk"]
password = secrets.token_hex(24)
items = {
    "campusdesk-db": {
        "POSTGRES_USER": "campusdesk", "POSTGRES_DB": "campusdesk",
        "POSTGRES_PASSWORD": password,
        "DATABASE_URL": f"postgresql+psycopg://campusdesk:{password}@postgres:5432/campusdesk",
    },
    "campusdesk-grafana": {"password": secrets.token_hex(24)},
}
for name, data in items.items():
    existing = subprocess.run(command + ["get", "secret", name, "-o", "name", "--ignore-not-found"],
                              check=True, capture_output=True, text=True)
    if existing.stdout.strip():
        continue
    obj = {"apiVersion": "v1", "kind": "Secret", "type": "Opaque",
           "metadata": {"name": name, "namespace": "campusdesk"}, "stringData": data}
    subprocess.run(command + ["create", "-f", "-"], input=json.dumps(obj), text=True, check=True)
PY
"$HELM" repo add traefik https://traefik.github.io/charts --force-update
"$HELM" repo update traefik
"$HELM" upgrade --install traefik traefik/traefik --version 34.4.1 \
  --namespace ingress-system --create-namespace --kube-context "$cluster" \
  -f terraform/k8s/traefik-aws-values.yaml --wait --timeout 10m
hostname=""
for ((attempt=0; attempt<60; attempt++)); do
  hostname="$("${K[@]}" -n ingress-system get svc traefik -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"
  [ -n "$hostname" ] && break
  sleep 5
done
[ -n "$hostname" ] || { echo 'Load balancer hostname not assigned' >&2; exit 1; }
"${K[@]}" apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.7.2/components.yaml
"$HELM" upgrade --install campusdesk helm/campusdesk --namespace campusdesk \
  --kube-context "$cluster" -f helm/campusdesk/values-aws.yaml \
  -f helm/campusdesk/values-release.json --set "ingress.host=$hostname" \
  --wait --wait-for-jobs --timeout 10m
"${K[@]}" -n campusdesk get pods,svc,ingress,hpa,pvc
printf '\nCampusDesk: http://%s\n' "$hostname"
