# CampusDesk submission

**Name:** T. Abdul Kalam Azad

**Roll number:** 24BCS10053

**Repository:** https://github.com/abdulkalamazad1001/campusdesk-devops-capstone

The existing CampusDesk repository and its development history are preserved.
The [final assignment audit](FINAL-AUDIT.md) maps the current instructor requirements
to verified results and identifies the deferred form submission.
The dated evidence below comes from this project's own application and AWS deployment.

| Module | Implementation and review evidence |
|---|---|
| M1 — application | [FastAPI CRUD](backend/app/main.py), [Alembic migration](backend/alembic/versions/0001_tickets.py), [React frontend](frontend/), [desktop/mobile and CRUD captures](evidence/2026-10-17/browser-compose/) |
| M2 — tests | [40 isolated API tests](backend/tests/), [pytest output](evidence/2026-10-17/pytest-output.png), [PostgreSQL CI results](evidence/2026-10-17/ci-39050953328/test-results/pytest-results.xml) |
| M3 — Git | [Meaningful commit history](evidence/2026-10-17/commit-history-output.png), public repository, [ignore rules](.gitignore), [full-history secret scan](evidence/2026-10-17/ci-39050953328/source-security-reports/gitleaks.txt) |
| M4 — containers | [Backend Dockerfile](backend/Dockerfile), [multi-stage frontend Dockerfile](frontend/Dockerfile), both non-root; [Compose](docker-compose.yml), [successful build](evidence/2026-10-17/compose-build-output.png) |
| M5 — CI / registry | [Successful run 39050953328](https://github.com/abdulkalamazad1001/campusdesk-devops-capstone/actions/runs/39050953328), [workflow](.github/workflows/campusdesk.yml), [backend package](https://github.com/users/abdulkalamazad1001/packages/container/package/campusdesk-capstone-backend), [frontend package](https://github.com/users/abdulkalamazad1001/packages/container/package/campusdesk-capstone-frontend) |
| M6 — security | Trivy blocks HIGH/CRITICAL before publishing; [AMD64 reports](evidence/2026-10-17/ci-39050953328/trivy-reports-amd64/), [ARM64 reports](evidence/2026-10-17/ci-39050953328/trivy-reports-arm64/), [findings explanation](README.md#trivy-result-explained) |
| M7 — Terraform / AWS | [61-resource plan](evidence/2026-10-17/terraform-plan.txt), [successful apply recovery](evidence/2026-10-17/terraform-apply-resume.txt), [no-drift plan](evidence/2026-10-17/terraform-post-apply-plan.txt), [own VPC/EKS Console captures](evidence/2026-10-17/aws/), [cleanup](evidence/2026-10-17/README.md) |
| M8 — Kubernetes / Helm | [Chart](helm/campusdesk/), [EKS workloads](evidence/2026-10-17/aws-helm-deploy-output.png), [Helm list](evidence/2026-10-17/aws-helm-list-output.png), [AWS browser checks](evidence/2026-10-17/browser-aws/), [local resources](evidence/2026-10-17/kubernetes-output.png) |
| M9 — observability | [Prometheus targets and Grafana dashboard](evidence/2026-10-17/monitoring/), [actual HPA scale-out](evidence/2026-10-17/autoscaling-output.png) |
| M10 — documentation / demo | [README](README.md), [12-slide PDF](demo/slides.pdf), [MP4 narrated in my own voice](demo/walkthrough.mp4), [chapters / transcript](demo/NARRATION.md), [subtitles](demo/walkthrough.srt) |

The final tested application source is `f9bdd3af7bae550b433845272db006b7a08e34e2`.
Both public images carry that full SHA and support AMD64 and ARM64. CI tests and
scans each architecture, then publishes the exact verified images and promotes
`helm/campusdesk/values-release.json`. Subsequent evidence/documentation commits
are identified separately from the application release.

See the [dated evidence index](evidence/2026-10-17/README.md) for timestamps,
recording notes, the DNS recovery and cleanup status. The final video uses the
owner’s recorded narration. Historical `evidence/shared-aws/` belongs to the credited
TaskBoard exercise and is not used as CampusDesk deployment proof.

The course [submission form](https://forms.gle/XWAP1vAumDJgAPM1A) accepts this
repository URL. Form submission is intentionally deferred at the owner’s request. Publishing
this project does not submit the form, and no submission receipt is claimed.
