# Submission Screenshots (16 October 2026)

All captured from the running systems on 16 October 2026. Terminal images show the
real output of the commands named in their title bar; browser images are direct
captures of the live pages.

| Module | Screenshot |
|---|---|
| M1 | [App desktop](m1-app-desktop.png), [app mobile](m1-app-mobile.png), [API docs](m1-api-swagger.png) |
| M2 | [`pytest -v`: 40 passed](m2-pytest-passing.png) |
| M3 | [GitHub commit history](m3-github-commit-history.png), [`git log`](m3-commit-history.png) |
| M4 | [`docker compose up --build`](m4-docker-compose-up-build.png), [app at localhost:3000](m4-browser-localhost-3000.png), [non-root users](m4-non-root-users.png) |
| M5 | [Green pipeline run 38917011474](m5-pipeline-success.png), [Actions runs](m5-actions-runs.png), [GHCR backend](m5-ghcr-backend-sha-tag.png), [GHCR frontend](m5-ghcr-frontend-sha-tag.png) |
| M6 | [Trivy backend](m6-trivy-backend.png), [Trivy frontend](m6-trivy-frontend.png): 0 HIGH/CRITICAL |
| M7 | Pending: captured from the student's own AWS account per the [runbook](../../terraform/README.md) |
| M8 | [Namespace](m8-namespace-apply.png), [`helm upgrade --install`](m8-helm-upgrade-install.png), [pods](m8-kubectl-get-pods.png), [svc/ingress](m8-kubectl-get-svc-ingress.png), [`helm list`](m8-helm-list.png), [app via Ingress](m8-app-via-ingress.png) |
| M9 | [`/metrics`](m9-metrics-endpoint.png), [Prometheus targets UP](m9-prometheus-targets-up.png), [Grafana dashboard](m9-grafana-dashboard.png) |

The `helm upgrade --install` capture is a separate scratch release (`campusdesk-demo`),
removed afterwards; while it ran, Prometheus and Grafana also counted its two backend pods.
