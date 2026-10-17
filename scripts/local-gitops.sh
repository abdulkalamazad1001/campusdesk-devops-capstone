#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
HELM="${HELM:-helm}"
K=(kubectl --context kind-campusdesk)
"${K[@]}" -n campusdesk get secret campusdesk-db campusdesk-grafana -o name
"$HELM" repo add argo https://argoproj.github.io/argo-helm --force-update
"$HELM" repo update argo
"$HELM" upgrade --install argocd argo/argo-cd --version 10.10.3 \
  --namespace argocd --create-namespace --kube-context kind-campusdesk \
  -f gitops/values-argocd.yaml --wait --timeout 8m
"${K[@]}" wait --for=condition=Established crd/applications.argoproj.io --timeout=60s
"${K[@]}" apply -f gitops/argocd-ingress.yaml -f gitops/application.yaml
"${K[@]}" -n argocd wait --for=jsonpath='{.status.sync.status}'=Synced application/campusdesk --timeout=600s
"${K[@]}" -n argocd wait --for=jsonpath='{.status.health.status}'=Healthy application/campusdesk --timeout=600s
printf '\nGitOps ready: http://argocd.localhost:8088\nUsername: admin; initial password is in argocd-initial-admin-secret in namespace argocd.\n'
