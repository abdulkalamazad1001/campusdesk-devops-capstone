# Final assignment audit

Reviewed on 17 October 2026 against Nency Ravaliya’s
[README](https://github.com/Nency-Ravaliya/devsecops-python/blob/bab00cc8d433b5d07a8e80f9b0006a48d5df7919/README.md),
[grading rubric](https://github.com/Nency-Ravaliya/devsecops-python/blob/bab00cc8d433b5d07a8e80f9b0006a48d5df7919/GRADING.md), and
[submission instructions](https://github.com/Nency-Ravaliya/devsecops-python/blob/bab00cc8d433b5d07a8e80f9b0006a48d5df7919/SUBMISSION.md).
The reference commit is `bab00cc8d433b5d07a8e80f9b0006a48d5df7919`.

The technical implementation and presentation artifacts are complete. The owner has
subsequently confirmed that the course form has been submitted. This submission
status is owner-reported; a form receipt was not independently checked. This audit
records evidence coverage; it does not assign the instructor’s grade or replace
the student’s explanation.

| Module | Verified project result | Direct evidence |
|---|---|---|
| M1 — application | Helpdesk CRUD, responsive React UI, PostgreSQL and Alembic | [API](backend/app/main.py), [migration](backend/alembic/versions/0001_tickets.py), [current browser checks](evidence/2026-10-17/final-audit/browser-kind/browser-results.json), [database schema](evidence/2026-10-17/final-audit/supplement-03.png), [Swagger](evidence/2026-10-17/final-audit/api-swagger.png) |
| M2 — tests | 40 passing API cases using isolated test data; lint passes | [Fresh pytest output](evidence/2026-10-17/final-audit/pytest-output.png), [test isolation](backend/tests/conftest.py), [PostgreSQL CI tests](evidence/2026-10-17/ci-39050953328/test-results/pytest-results.xml), [Ruff](evidence/2026-10-17/final-audit/lint.txt) |
| M3 — Git | Public repository, meaningful history, ignore rules; form submission confirmed by owner | [History screenshot](evidence/2026-10-17/commit-history-output.png), [.gitignore](.gitignore), [47-commit secret scan](evidence/2026-10-17/final-audit/full-history-secrets.txt) |
| M4 — containers | Both images built; non-root runtimes; healthy Compose stack | [Build/start transcript](evidence/2026-10-17/compose-build-output.png), [Compose browser](evidence/2026-10-17/browser-compose/application-desktop.png), [backend UID](evidence/2026-10-17/final-audit/supplement-06.png), [frontend UID](evidence/2026-10-17/final-audit/supplement-07.png) |
| M5 — CI / registry | Main-push pipeline passes tests/builds and publishes full-SHA images | [Green run](https://github.com/abdulkalamazad1001/campusdesk-devops-capstone/actions/runs/39050953328), [workflow](.github/workflows/campusdesk.yml), [backend package screenshot](evidence/2026-10-17/ghcr-backend.png), [frontend package screenshot](evidence/2026-10-17/ghcr-frontend.png), [current anonymous registry verification](evidence/2026-10-17/final-audit/registry-output.png) |
| M6 — image security | Both architectures scanned; HIGH/CRITICAL failures block publication | [Backend scan](evidence/2026-10-17/ci-39050953328/trivy-reports-amd64/backend-trivy-output.png), [frontend scan](evidence/2026-10-17/ci-39050953328/trivy-reports-amd64/frontend-trivy-output.png), [explanation](README.md#trivy-result-explained) |
| M7 — AWS / Terraform | Real Mumbai VPC, subnets, EKS and workers; deployment subsequently destroyed | [Plan](evidence/2026-10-17/terraform-plan-output.png), [VPC](evidence/2026-10-17/aws/vpc.png), [subnets](evidence/2026-10-17/aws/vpc-subnets.png), [EKS](evidence/2026-10-17/aws/eks-active.png), [node group](evidence/2026-10-17/aws/eks-nodegroup.png), [destroy](evidence/2026-10-17/terraform-destroy-output.png), [fresh cleanup check](evidence/2026-10-17/final-audit/aws-cleanup-output.png) |
| M8 — Kubernetes / Helm | Two replicas per application tier, Services, Ingress, Helm deployment | [EKS workloads](evidence/2026-10-17/aws-helm-deploy-output.png), [Helm release](evidence/2026-10-17/aws-helm-list-output.png), [AWS browser](evidence/2026-10-17/browser-aws/application-desktop.png), [current local health](evidence/2026-10-17/final-audit/release-health-output.png), [chart validation](evidence/2026-10-17/final-audit/helm-lint.txt) |
| M9 — monitoring | Application metrics, two UP targets and populated Grafana panels | [Fresh metrics output](evidence/2026-10-17/final-audit/metrics-output.png), [Prometheus](evidence/2026-10-17/final-audit/monitoring/prometheus-targets.png), [Grafana](evidence/2026-10-17/final-audit/monitoring/grafana-dashboard.png), [monitoring configuration](monitoring/) |
| M10 — presentation | Full README, 12-slide PDF and narrated walkthrough in the repository | [Main video](demo/walkthrough.mp4), [slides](demo/slides.pdf), [chapter times](demo/NARRATION.md), [media verification](evidence/2026-10-17/media-verification.txt), [additional live demonstration](demo/verification-supplement.mp4) |

## README demonstrations beyond the module table

The main video begins with slides and includes source, CRUD, a recorded push and
its successful CI result, Terraform/AWS evidence, Argo CD, Kubernetes, Prometheus,
Grafana and cleanup. Its original command recordings and edited narration are
identified in [the video notes](demo/README.md).

The [supplement](demo/verification-supplement.mp4) shows Swagger, the actual
PostgreSQL schema and persisted synthetic tickets, both container user IDs,
anonymous registry manifests, Terraform source, the Helm release, a Service
selector failure and repair, an image-pull failure and repair, and removal of the
two dedicated demo resources. It is a silent screen recording with explanations
on screen. [The timestamped commands](evidence/2026-10-17/final-audit/supplement-commands.txt)
and [chapter index](evidence/2026-10-17/final-audit/supplement-chapters.json) accompany it.

Autoscaling is supported by the earlier [31,274-request load run](evidence/2026-10-17/load.txt)
and [observed 2-to-4 scale-out](evidence/2026-10-17/autoscaling-output.png).
The additional [readiness failure exercise](evidence/2026-10-17/readiness-troubleshooting.txt)
records a failed probe, repair and cleanup. Neither is inferred merely from YAML.

## Release and evidence scope

- The tested application release remains `f9bdd3af7bae550b433845272db006b7a08e34e2`.
  The backend/frontend application source, Dockerfiles, workflow and Terraform HCL
  have not changed since that green release. Later changes concern documentation,
  evidence, presentation editing and the supplemental recording script.
- Anonymous registry checks confirm AMD64 and ARM64 manifests for both current
  images. Earlier package-page screenshots show the prior verified release;
  the dated evidence index explains the distinction.
- Current local checks pass 40 API tests, 17 browser checks, frontend build, Ruff,
  Helm lint and Terraform validation. Argo CD is Synced/Healthy with two available
  replicas in each application tier. Browser report entries identify mocked cases.
- AWS cleanup was rechecked using read-only queries. No active project resources
  remain in the listed checks. The KMS key remains scheduled for deletion on
  16 November 2026. AWS was not recreated for this audit.
- The new audit adds explicit current metrics/database proof and supplementary
  troubleshooting video, and corrects the stale narration description. The course
  form was deferred during the technical audit; the owner has since confirmed
  completing it.
