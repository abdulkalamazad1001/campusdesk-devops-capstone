# Walkthrough narration and chapters

Narrated by T. Abdul Kalam Azad using his own microphone recording. Long pauses, an interruption and repeated takes were removed. Speech was lightly cleaned and leveled; slides and genuine recorded demonstrations were retimed to match. The transcript and optional captions normalize technical spellings and omit some spoken fillers. No synthetic voice is used in this version.

## 0:00 — Introduction

Hello everyone. My name is T. Abdul Kalam Azad, and my roll number is 24 B C S 10053. Today, I’m presenting CampusDesk, my DevOps capstone project. It’s a campus IT helpdesk for reporting and managing support requests. I’ll start with the slides, then explain the code and show the application, CI pipeline, AWS deployment, GitOps, and monitoring. The walkthrough uses real project recordings and verification results.

## 0:28 — Slide 1

CampusDesk organizes campus IT support. Students and staff report issues, and the support team assigns ownership, prioritizes work, and tracks resolution. This project connects that application to a reproducible DevOps delivery process.

## 0:47 — Slide 2

Requests cover network, hardware, software, and account access. The interface provides search, status filters, priority, assignment, and an editable ticket workflow. All records used in this demonstration are synthetic.

## 1:04 — Slide 3

React and Nginx provide the browser interface. FastAPI validates API requests. SQLAlchemy talks to PostgreSQL, while Alembic versions the database schema. Forty API tests cover isolated test databases, and CI repeats them against PostgreSQL.

## 1:27 — Slide 4

Traffic enters through Traefik. The frontend and backend use Kubernetes Services. PostgreSQL keeps ticket data in a persistent volume. GitHub Actions tests and scans images, then publishes them to GHCR. Argo CD reconciles the Helm configuration from Git.

## 1:49 — Slide 5

The responsive helpdesk is an original CampusDesk implementation. The browser checks verify real creation, update, persistence, and deletion, together with narrow screen layouts and accessible controls. Mocked edge cases are separately identified in the reports.

## 2:08 — Slide 6

Publication is gated. Source security and tests must pass before image builds. Native AMD64 and ARM64 jobs scan both images with Trivy, deploy Helm into Kind, and run seventeen browser checks. Only those exact verified images become the commit SHA release.

## 2:30 — Slide 7

Kubernetes runs two frontend and at least two backend replicas. Readiness checks database access, while liveness checks the API process. A real load test completed thirty one thousand two hundred seventy four successful requests and scaled the backend from two replicas to four.

## 2:52 — Slide 8

Argo CD reads this repository. The migration hook runs before the application rollout. CI promotes the verified image tags in Git, and Argo synchronizes the desired state. Secrets are generated separately and kept outside Git.

## 3:09 — Slide 9

Prometheus scrapes each backend replica. Grafana displays availability, request rate, latency, and response codes. The dashboard is populated by real requests. Monitoring makes the effect of traffic and rollout changes visible.

## 3:26 — Slide 10

Terraform created a VPC in Mumbai with two public and two private subnets, a NAT gateway, EKS version one point thirty five, and two private worker nodes. The initial plan contained sixty one resources. A DNS interruption was recovered using the existing state, and the follow up plan found no drift.

## 3:48 — Slide 11

The troubleshooting exercises deliberately use an invalid image, a wrong Service selector, and an invalid readiness path. The evidence shows the failure, diagnosis, repair, and cleanup. These exercises use disposable resources and keep the actual application available.

## 4:08 — Slide 12

Verification includes cleanup. Kubernetes created load balancers and persistent volumes must be removed before Terraform destroys the cluster and network. The evidence index separates current CampusDesk results from historical examples. The classroom app still needs authentication, TLS, and database resilience before production use.

## 4:29 — Source code

Let’s look at the code. The repository contains the backend API, React frontend, Helm chart, GitHub Actions workflow, and Terraform infrastructure. The API handles validation and database operations, while the deployment scripts make the setup repeatable.

## 4:47 — Codebase | folders and REST endpoints

The repository separates backend, frontend, Helm, Kubernetes, Terraform, GitOps, monitoring, and delivery scripts. These are the real API route declarations: health, readiness, metrics, statistics, and ticket list, read, create, update, and delete. A commit SHA connects this source to the exact published container release.

## 5:10 — Codebase | migration and isolated test database

Alembic creates the tickets schema before the application starts. The tests use a dedicated database and a transaction per test. The dependency override supplies the test session, and rollback removes the test changes. CI exercises the same migration on PostgreSQL.

## 5:31 — Codebase | non-root container builds

The backend installs dependencies. The frontend uses a Node build stage and copies only the compiled site into unprivileged Nginx, running as user one hundred and one. Trivy scans both runtime images before CI publishes them.

## 5:49 — Live ticket workflow

Here, the recording shows CampusDesk running through Kubernetes Ingress. A ticket is created through the real API, assigned to campus support, marked as resolved, and then deleted. These actions use the application’s actual database.

## 6:04 — Live tests

Next, the recording shows the API tests running in an isolated local database. All forty tests pass. The CI workflow also tests against PostgreSQL and checks migration upgrade, schema consistency, and downgrade.

## 6:22 — Live commit and push

This recording shows a real commit and push, including the locally bundled font and the portable AWS deployment script. Pushing to the main branch triggers the GitHub Actions workflow. Next, we’ll look at that run and its result.

## 6:38 — Current pipeline result

This is the workflow triggered by the push shown in the recording. Its status comes directly from GitHub. The images can only be published after the required tests, security scans, Kubernetes deployment, and browser checks pass. The quiet middle of the waiting period has been shortened in the video.

## 6:56 — Verified result | the workflow triggered in this video

The workflow triggered by the recorded push completed successfully. Both native architectures passed their build, Trivy scan, Kubernetes deployment, and browser checks. The publish job then released both images and updated GitOps. This result comes from the GitHub API, and the full workflow URL and source commit are shown here.

## 7:18 — Terraform plan record

The original Terraform plan proposed sixty one resources. This excerpt is from the captured nonempty plan. The following apply and follow up plan establish that the infrastructure was created and matches the configuration.

## 7:34 — AWS provisioning record

These are the original Terraform results from this AWS deployment. The first apply stopped because local DNS could not resolve the AWS OIDC endpoint. Resuming from state created the remaining seven resources without recreating the cluster. The next plan verified there were no differences.

## 7:56 — AWS Console

This screenshot comes from the actual AWS Console during the deployment. It shows the CampusDesk cluster in Mumbai, with Active status and Kubernetes version one point thirty five. The cluster was later removed after the demonstration, and I’ll show the cleanup evidence at the end.

## 8:11 — AWS VPC Console

The VPC console shows the CampusDesk network created by Terraform. Public subnet routes use the internet gateway, and private worker subnet routes use the NAT gateway. The route table evidence identifies each association.

## 8:24 — Live EKS verification

This command output was captured while the AWS cluster was running. The application used private worker nodes, ClusterIP Services, an Ingress, and a PostgreSQL persistent volume. The EBS CSI driver provisioned the database volume, and the separate node checks confirmed that both workers were Ready.

## 8:42 — AWS application

The same application was verified through the AWS load balancer, with all seventeen browser checks passing. These captures come from that cloud deployment, including real CRUD operations. They are separate from the local Kind evidence.

## 8:54 — Live Argo CD

In this recording, Argo CD is connected to the repository and shows CampusDesk as Synced and Healthy. The application images use the source commit that passed CI. Git stores the desired configuration, and Argo CD applies it to the local Kubernetes cluster.

## 9:13 — Live Kubernetes

These are the local workloads, Services, Ingress, and autoscaler captured during the demonstration. Both the backend and frontend have multiple healthy replicas. PostgreSQL and monitoring run in the project namespace. Each command names its Kubernetes context explicitly, so the intended cluster is clear.

## 9:32 — Live Prometheus

Here, Prometheus discovers the backend replicas and scrapes their metrics endpoints. Both targets are UP in this capture. This confirms that Prometheus can collect the application metrics, which are then used by the Grafana dashboard.

## 9:46 — Live Grafana

Grafana reads from the Prometheus data source. The dashboard shows healthy replicas, request traffic, response codes, and latency. These graphs contain real request data, including the earlier load test, so we can see how the service behaved.

## 10:01 — Security and autoscaling evidence

The saved Trivy reports contain zero high or critical findings for both images on both CPU architectures. Source security also passed. Separately, the autoscaler event records a successful increase from two to four replicas in response to CPU demand.

## 10:20 — Close and cleanup

That covers the application, testing, container security, infrastructure, GitOps, and monitoring. The project is a classroom demonstration using synthetic ticket data. Before production use, I would add authentication, HTTPS, database backups, and stronger resilience. Finally, let’s check that the temporary AWS resources were cleaned up.

## 10:43 — Verified AWS cleanup | actual command results

After the cloud recording, the application and ingress releases were removed, along with the load balancer and database volume. Terraform then reported sixty one resources destroyed. The follow-up checks found no remaining active resources in the project checks. The KMS key is scheduled for deletion, and the local Kind environment remains available for review.
