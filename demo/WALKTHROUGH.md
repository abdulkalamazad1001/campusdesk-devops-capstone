# Presentation walkthrough

The delivered [walkthrough.mp4](walkthrough.mp4) begins with the 12-slide deck,
then demonstrates the source, application, live tests and push, successful CI,
Terraform and this project's own AWS Console evidence, Argo CD, Kubernetes,
Prometheus, Grafana and cleanup. [Delivery notes](README.md) explain the recorded human
narration and editing; [the transcript](NARRATION.md) provides chapter times.

`local-walkthrough.mp4` remains a historical silent rehearsal. Shared TaskBoard
screenshots are historical references and are not evidence for the CampusDesk
AWS deployment. Current evidence is in [the dated index](../evidence/2026-10-17/README.md).

## Explain These In Your Own Words

- Git preserves source history; GitHub hosts it and runs Actions.
- Docker images package the application; Kubernetes manages running containers.
- Terraform provisions cloud infrastructure; Helm packages Kubernetes resources.
- CI tests changes before publishing; Argo CD reconciles desired state from Git.
- Liveness tests the process; readiness tests whether requests can be served.
- HPA needs Metrics Server and CPU requests to calculate utilization.
- Prometheus collects time series; Grafana visualizes them.
- A clean Trivy report means no matching findings in its database at scan time,
  not proof of complete security.

Capture your final narration with these concepts understood. Never show credentials,
browser authorization codes or decoded Kubernetes Secrets in the recording.

## Review before presenting

Understand the concepts above and be ready to explain the implementation in your
own words. Review the dated command transcripts, including the initial DNS
failure, recovery and cleanup. The [submission checklist](../SUBMISSION.md)
links each module to its implementation and evidence.
