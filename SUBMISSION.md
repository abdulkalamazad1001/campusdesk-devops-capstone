# CampusDesk Submission

**Name:** T. Abdul Kalam Azad
**Roll number:** 24BCS10053
**Repository:** https://github.com/abdulkalamazad1001/campusdesk-devops-capstone

The capstone was developed inside the course homework repository
(`scaler-devops-homework/capstone-campusdesk`) and extracted here with its full Git
history, so every rubric path (`backend/`, `frontend/`, `helm/`, `k8s/`, `terraform/`,
`monitoring/`, `demo/`) is at the repository root.

## Checklist

| Item | Where | Status |
|---|---|---|
| App runs via `docker compose up --build` | [`docker-compose.yml`](docker-compose.yml) | Done |
| At least 4 REST endpoints | [`backend/app/main.py`](backend/app/main.py) | Done: GET/POST/PUT/DELETE `/api/tickets`, plus `/api/stats` |
| Alembic migration | [`backend/alembic/versions/`](backend/alembic/versions/) | Done |
| pytest passes, 5+ tests | [`backend/tests/`](backend/tests/) | Done: 40 tests |
| `backend/Dockerfile` builds, non-root | [`backend/Dockerfile`](backend/Dockerfile) | Done: UID 10001 |
| `frontend/Dockerfile` multi-stage, non-root | [`frontend/Dockerfile`](frontend/Dockerfile) | Done: Node build, Nginx runtime, UID 101 |
| Workflow runs on push to `main`, pytest in pipeline | [`.github/workflows/campusdesk.yml`](.github/workflows/campusdesk.yml) | Done |
| Images in GHCR with SHA tags | Repository **Packages** | Done after the first green run |
| Trivy scan in pipeline, fails on HIGH/CRITICAL | Workflow `build-scan-deploy` job | Done; [explanation](README.md#trivy-result-explained) |
| No secrets committed | Gitleaks scans the full history in CI | Done: no leaks |
| `terraform plan`, VPC + EKS Console, `terraform destroy` | [`terraform/`](terraform/), [runbook](terraform/README.md) | **Student to run in AWS**; screenshots go in `evidence/aws/` |
| `kubectl get pods`, `helm list`, app via Ingress | [`k8s/`](k8s/), [`helm/campusdesk/`](helm/campusdesk/) | Done on local Kind |
| `/metrics`, Prometheus targets UP, Grafana dashboard | [`monitoring/`](monitoring/) | Done on local Kind |
| README with all technical sections | [`README.md`](README.md) | Done |
| Slides (8+ slides) | [`demo/slides.pdf`](demo/slides.pdf) | Done: 12 slides |
| Narrated presentation video | `demo/` | **Student to record** using [the script](demo/VIDEO-SCRIPT.md) |

## Evidence

[`evidence/`](evidence/README.md) holds real test reports, scan reports and captures
from the running system. `evidence/shared-aws/` contains screenshots from a shared
TaskBoard AWS exercise with collaborator attribution; it is not CampusDesk's own AWS
deployment, which is documented in the Terraform runbook.
`demo/local-walkthrough.mp4` is a silent automated rehearsal, not the final video.
