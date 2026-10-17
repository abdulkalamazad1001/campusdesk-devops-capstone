# Walkthrough narration

Computer-generated voice (macOS Rishi). Genuine application interactions, repository excerpts, commands and dated captures. The middle of the CI waiting interval is omitted; its starting narration and final result are retained. Source explanation and verified cleanup are inserted as labeled evidence cards.

## 0:00 — Introduction

This is a computer narrated demonstration of CampusDesk, the DevOps capstone repository of T. Abdul Kalam Azad, roll number 24 B C S 10053. The voice is synthetic. The application, commands, deployments, and verification results shown are real. We begin with twelve slides, followed by the working systems.

## 0:25 — Slide 1

CampusDesk organizes campus IT support. Students and staff report issues, and the support team assigns ownership, prioritizes work, and tracks resolution. This project connects that application to a reproducible DevOps delivery process.

## 0:42 — Slide 2

Requests cover network, hardware, software, and account access. The interface provides search, status filters, priority, assignment, and an editable ticket workflow. All records used in this demonstration are synthetic.

## 1:00 — Slide 3

React and Nginx provide the browser interface. FastAPI validates API requests. SQLAlchemy talks to PostgreSQL, while Alembic versions the database schema. Forty API tests cover isolated test databases, and CI repeats them against PostgreSQL.

## 1:20 — Slide 4

Traffic enters through Traefik. The frontend and backend use Kubernetes Services. PostgreSQL keeps ticket data in a persistent volume. GitHub Actions tests and scans images, then publishes them to GHCR. Argo CD reconciles the Helm configuration from Git.

## 1:40 — Slide 5

The responsive helpdesk is an original CampusDesk implementation. The browser checks verify real creation, update, persistence, and deletion, together with narrow screen layouts and accessible controls. Mocked edge cases are separately identified in the reports.

## 1:58 — Slide 6

Publication is gated. Source security and tests must pass before image builds. Native AMD64 and ARM64 jobs scan both images with Trivy, deploy Helm into Kind, and run seventeen browser checks. Only those exact verified images become the commit SHA release.

## 2:18 — Slide 7

Kubernetes runs two frontend and at least two backend replicas. Readiness checks database access, while liveness checks the API process. A real load test completed thirty one thousand two hundred seventy four successful requests and scaled the backend from two replicas to four.

## 2:37 — Slide 8

Argo CD reads this repository. The migration hook runs before the application rollout. CI promotes the verified image tags in Git, and Argo synchronizes the desired state. Secrets are generated separately and kept outside Git.

## 2:54 — Slide 9

Prometheus scrapes each backend replica. Grafana displays availability, request rate, latency, and response codes. The dashboard is populated by real requests. Monitoring makes the effect of traffic and rollout changes visible.

## 3:11 — Slide 10

Terraform created a VPC in Mumbai with two public and two private subnets, a NAT gateway, EKS version one point thirty five, and two private worker nodes. The initial plan contained sixty one resources. A DNS interruption was recovered using the existing state, and the follow up plan found no drift.

## 3:33 — Slide 11

The troubleshooting exercises deliberately use an invalid image, a wrong Service selector, and an invalid readiness path. The evidence shows the failure, diagnosis, repair, and cleanup. These exercises use disposable resources and keep the actual application available.

## 3:53 — Slide 12

Verification includes cleanup. Kubernetes created load balancers and persistent volumes must be removed before Terraform destroys the cluster and network. The evidence index separates current CampusDesk results from historical examples. The classroom app still needs authentication, TLS, and database resilience before production use.

## 4:17 — Source code

The repository keeps the API, frontend, chart, workflow, and infrastructure together. This is an excerpt from the actual API source. Validation and database handling live in the application, while the delivery scripts make its deployment repeatable.

## 4:35 — Codebase | folders and REST endpoints

The repository separates backend, frontend, Helm, Kubernetes, Terraform, GitOps, monitoring, and delivery scripts. These are the real API route declarations: health, readiness, metrics, statistics, and ticket list, read, create, update, and delete. A commit SHA connects this source to the exact published container release.

## 4:59 — Codebase | migration and isolated test database

Alembic creates the tickets schema before the application starts. The tests use a dedicated database and a transaction per test. The dependency override supplies the test session, and rollback removes the test changes. CI exercises the same migration on PostgreSQL.

## 5:18 — Codebase | non-root container builds

The backend installs dependencies and runs as user ten thousand and one. The frontend uses a Node build stage and copies only the compiled site into unprivileged Nginx, running as user one hundred and one. Trivy scans both runtime images before CI publishes them.

## 5:37 — Live ticket workflow

We are now using the running Kubernetes application through Ingress. This ticket is created through the real API, assigned to campus support, marked resolved, and deleted. The database and interface are responding live.

## 5:53 — Live tests

The API tests now execute again in an isolated local database. The CI run additionally verifies PostgreSQL migration upgrade, schema consistency, and downgrade. The test output shown here is produced by this command during the recording.

## 6:10 — Live commit and push

This is a real commit and push of the reviewed changes, including the bundled font and portable AWS deployment script. The push starts the required main branch workflow. We will return to its result after the cloud and monitoring demonstration.

## 6:27 — Current pipeline result

We now check the workflow triggered by the live push. The status below comes directly from GitHub. Publication is allowed only after every required test, scan, deployment, and browser job passes.

## 7:07 — Verified result | the workflow triggered in this video

The workflow triggered by the recorded push completed successfully. Both native architectures passed their build, Trivy scan, Kubernetes deployment, and browser checks. The publish job then released both images and updated GitOps. This result comes from the GitHub API, and the full workflow URL and source commit are shown here.

## 7:29 — Terraform plan record

The original Terraform plan proposed sixty one resources. This excerpt is from the captured nonempty plan. The following apply and follow up plan establish that the infrastructure was created and matches the configuration.

## 7:44 — AWS provisioning record

These are the original Terraform results from this AWS deployment. The first apply stopped because local DNS could not resolve the AWS OIDC endpoint. Resuming from state created the remaining seven resources without recreating the cluster. The next plan verified there were no differences.

## 8:04 — AWS Console

This screenshot was captured from the real AWS Console during this run. It identifies the CampusDesk cluster in Mumbai, shows Active status, and shows Kubernetes version one point thirty five. The AWS session used for evidence has read only permissions.

## 8:23 — AWS VPC Console

The VPC console shows the CampusDesk network created by Terraform. Public subnet routes use the internet gateway, and private worker subnet routes use the NAT gateway. The route table evidence identifies each association.

## 8:39 — Live EKS verification

The following command queries the live AWS cluster. Both managed worker nodes are Ready. The application uses private nodes, ClusterIP Services, an Ingress, and a PostgreSQL persistent volume provisioned by the EBS CSI driver.

## 8:56 — AWS application

The same application was verified through the AWS load balancer, with all seventeen browser checks passing. These captures come from that cloud deployment, including real CRUD operations. They are separate from the local Kind evidence.

## 9:12 — Live Argo CD

Argo CD is connected to this repository and shows the application as synchronized and healthy. The image tag is the source commit that passed the pipeline. Git records the desired state, and the controller reconciles it into the cluster.

## 9:28 — Live Kubernetes

Here are the live local workloads, Services, Ingress, and autoscaler. The backend and frontend have multiple healthy replicas. PostgreSQL and monitoring remain in the same project namespace. Each command explicitly names the cluster to avoid accidental operations on another environment.

## 9:49 — Live Prometheus

Prometheus discovers each backend replica and scrapes the metrics endpoint. These targets are live. A successful scrape establishes monitoring connectivity; the dashboard then turns those time series into service measurements.

## 10:04 — Live Grafana

Grafana is reading the live Prometheus datasource. Request traffic, response codes, latency, and healthy replica count are visible. The earlier load run shows how traffic and scaling change these measurements over time.

## 10:20 — Security and autoscaling evidence

The saved Trivy reports contain zero high or critical findings for both images on both CPU architectures. Source security also passed. Separately, the autoscaler event records a successful increase from two to four replicas in response to CPU demand.

## 10:38 — Close and cleanup

The demonstration covers the application, tests, container security, cloud infrastructure, GitOps, and observability. The AWS resources are temporary. Cleanup completion and final verification are recorded in the evidence index and the cleanup appendix. The application is a classroom demonstration with synthetic data, not a production service.

## 11:03 — Verified AWS cleanup | actual command results

After recording the live AWS demonstration, the application and ingress releases were removed, including the load balancer and database volume. Terraform then destroyed the sixty one managed resources. The follow up AWS queries found no remaining active resources in the listed project checks. The KMS key is scheduled for deletion after its required waiting period. Local Kind remains available for review.
