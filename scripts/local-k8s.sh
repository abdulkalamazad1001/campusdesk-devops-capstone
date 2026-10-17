#!/usr/bin/env bash
# Bootstrap CampusDesk on macOS/Linux. Every Kubernetes command targets our Kind cluster.
set -euo pipefail
cd "$(dirname "$0")/.."
IMAGE_TAG="${1:-local}"
HELM="${HELM:-helm}"
PYTHON="${PYTHON:-python3}"
for tool in docker kind kubectl "$HELM" "$PYTHON"; do
  command -v "$tool" >/dev/null || { echo "Missing prerequisite: $tool" >&2; exit 1; }
done
docker info >/dev/null
clusters="$(kind get clusters)"
if ! printf '%s\n' "$clusters" | grep -qx campusdesk; then
  kind create cluster --config k8s/kind.yaml --wait 180s
fi
K=(kubectl --context kind-campusdesk)
crd="$("${K[@]}" get crd applications.argoproj.io -o name --ignore-not-found)"
if [ -n "$crd" ]; then
  managed="$("${K[@]}" -n argocd get application campusdesk -o name --ignore-not-found)"
  if [ -n "$managed" ]; then
    echo 'CampusDesk is managed by Argo CD. Push changes through GitOps instead of running Helm bootstrap.' >&2
    exit 1
  fi
fi
docker build --provenance=false -t "campusdesk-backend:$IMAGE_TAG" backend
docker build --provenance=false -t "campusdesk-frontend:$IMAGE_TAG" frontend
kind load docker-image "campusdesk-backend:$IMAGE_TAG" "campusdesk-frontend:$IMAGE_TAG" --name campusdesk
"${K[@]}" apply -f k8s/namespace.yaml
# Generate credentials in memory and send them over stdin; never print or store them in Git.
"$PYTHON" - <<'PY'
import json
import secrets
import subprocess

command = ["kubectl", "--context", "kind-campusdesk", "-n", "campusdesk"]
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
    result = subprocess.run(command + ["get", "secret", name, "-o", "name", "--ignore-not-found"],
                            check=True, capture_output=True, text=True)
    if result.stdout.strip():
        continue
    obj = {"apiVersion": "v1", "kind": "Secret", "type": "Opaque",
           "metadata": {"name": name, "namespace": "campusdesk"}, "stringData": data}
    subprocess.run(command + ["create", "-f", "-"], input=json.dumps(obj), text=True, check=True)
PY
"$HELM" repo add traefik https://traefik.github.io/charts --force-update
"$HELM" repo update traefik
"$HELM" upgrade --install traefik traefik/traefik --version 34.4.1 \
  --namespace ingress-system --create-namespace --kube-context kind-campusdesk \
  -f k8s/traefik-values.yaml --wait --timeout 5m
"${K[@]}" apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.7.2/components.yaml
# Kind's kubelet has a self-signed certificate. This exception is confined to kind-campusdesk.
"${K[@]}" -n kube-system patch deployment metrics-server --type=json \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
"$HELM" upgrade --install campusdesk helm/campusdesk --namespace campusdesk \
  --kube-context kind-campusdesk -f helm/campusdesk/values-local.yaml \
  --set "backend.tag=$IMAGE_TAG" --set "frontend.tag=$IMAGE_TAG" \
  --wait --wait-for-jobs --timeout 8m
"${K[@]}" -n campusdesk get pods,svc,ingress,hpa
printf '\nApp: http://campusdesk.localhost:8088\nPrometheus: http://localhost:9090\nGrafana: http://localhost:3001\n'
