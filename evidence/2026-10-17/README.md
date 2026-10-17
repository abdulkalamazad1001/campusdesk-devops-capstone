# Verification — 17 October 2026

Owner: **T. Abdul Kalam Azad, 24BCS10053**. This directory records real runs for
CampusDesk in this repository. All dates in JSON/transcripts use UTC; browser
screenshots may display the Mac's India time zone.

| Requirement | Current evidence |
|---|---|
| M1, M4: application and Compose | [Compose build](compose-build.txt), [desktop/mobile and CRUD captures](browser-compose/) |
| M2: isolated API tests | [40 passing local tests](pytest.txt); [PostgreSQL CI results](ci-39049385857/test-results/pytest-results.xml) |
| M5: CI and publication | [Successful run 39049385857](https://github.com/abdulkalamazad1001/campusdesk-devops-capstone/actions/runs/39049385857), source `736090660383464cbec4e5f6dcaa29b6fcdef2cc` |
| M6: image security | [AMD64 Trivy](ci-39049385857/trivy-reports-amd64/), [ARM64 Trivy](ci-39049385857/trivy-reports-arm64/), [source/dependency/history gates](ci-39049385857/source-security-reports/) |
| M7: Terraform | [Init](terraform-init.txt), [61-resource plan](terraform-plan.txt), [initial apply](terraform-apply.txt), [successful recovery](terraform-apply-resume.txt), [no-change plan](terraform-post-apply-plan.txt), [AWS Console](aws/) |
| M8: EKS deployment | [Two Ready workers](aws-nodes.txt), [Helm deployment and running workloads](aws-helm-deploy.txt), [real AWS browser checks](browser-aws/browser-results.json) |
| M8: local Ingress | [17 browser checks](browser-kind/browser-results.json), [application](application-desktop.png) |
| M9: observability | [Live monitoring screenshots and API results](monitoring/), [31,274 successful requests](load.txt), [HPA scaled 2 → 4](autoscaling.txt) |
| Troubleshooting | [Bad image and Service selector](troubleshooting.txt), [404 readiness failure and repair](readiness-troubleshooting.txt) |
| M10: presentation | [12-slide PDF](../../demo/slides.pdf); narrated walkthrough is being assembled |

Both images on both architectures reported **zero HIGH/CRITICAL findings** in
this run; the gate would have failed on either severity. This result describes
those image versions and the scanner database used on that date, not a guarantee
that no vulnerabilities exist. No CVE remediation is claimed when none was reported.

The browser checks exercise real create, update, persistence and deletion. The
outage, pagination-boundary and empty-list cases are explicitly mocked and marked
in each browser-results JSON; they are not presented as cloud deployment proof.

The initial Terraform apply created 54 resources before a local DNS lookup failed
for the AWS OIDC endpoint. Resuming from the saved state created the remaining
7 resources, and the follow-up plan found no drift. Temporary DNS workarounds
preserved normal TLS certificate validation. The AWS app uses synthetic data only.

AWS cleanup and the final narrated video are still in progress. Their completion
will be recorded here after verification. Older `evidence/shared-aws/` images
belong to the credited TaskBoard exercise and are not used as CampusDesk proof.
