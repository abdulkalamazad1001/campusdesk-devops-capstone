# Verification — 17 October 2026

[Final assignment audit](../../FINAL-AUDIT.md) provides the module-by-module review,
fresh validation results and supplementary live demonstration.

Owner: **T. Abdul Kalam Azad, 24BCS10053**. This directory records real runs for
CampusDesk in this repository. All dates in JSON/transcripts use UTC; browser
screenshots may display the Mac's India time zone.

| Requirement | Current evidence |
|---|---|
| M1, M4: application and Compose | [Compose build](compose-build.txt), [desktop/mobile and CRUD captures](browser-compose/) |
| M2: isolated API tests | [40 passing local tests](pytest.txt); [PostgreSQL CI results](ci-39050953328/test-results/pytest-results.xml) |
| M3: public Git history | [Meaningful commits](commit-history-output.png), [final submission-file secret scan](final-secret-scan.txt) |
| M5: CI and publication | [Successful run 39050953328](https://github.com/abdulkalamazad1001/campusdesk-devops-capstone/actions/runs/39050953328), source `f9bdd3af7bae550b433845272db006b7a08e34e2` |
| M6: image security | [AMD64 Trivy](ci-39050953328/trivy-reports-amd64/), [ARM64 Trivy](ci-39050953328/trivy-reports-arm64/), [source/dependency/history gates](ci-39050953328/source-security-reports/) |
| M7: Terraform | [Init](terraform-init.txt), [61-resource plan](terraform-plan.txt), [initial apply](terraform-apply.txt), [successful recovery](terraform-apply-resume.txt), [no-change plan](terraform-post-apply-plan.txt), [AWS Console](aws/) |
| M8: EKS deployment | [Two Ready workers](aws-nodes.txt), [Helm deployment and running workloads](aws-helm-deploy.txt), [real AWS browser checks](browser-aws/browser-results.json) |
| M8: local Ingress | [17 browser checks](browser-kind/browser-results.json), [application](application-desktop.png) |
| M9: observability | [Final release monitoring and Argo CD](monitoring-final/), [31,274 successful requests](load.txt), [HPA scaled 2 → 4](autoscaling.txt) |
| Troubleshooting | [Bad image and Service selector](troubleshooting.txt), [404 readiness failure and repair](readiness-troubleshooting.txt) |
| M10: presentation | [12-slide PDF](../../demo/slides.pdf), [MP4 narrated in my own voice](../../demo/walkthrough.mp4), [chapters and narration](../../demo/NARRATION.md), [subtitles](../../demo/walkthrough.srt) |

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
preserved normal TLS certificate validation. The AWS app uses synthetic data only. Public/private subnet classification is
verified by [route-table associations](aws-routing.txt); the separate automatic
public-IP assignment flag does not determine whether a subnet is public.

AWS cleanup completed at 17:09 UTC on 17 October 2026. [Pre-destroy cleanup](aws-pre-destroy.txt)
removed the Helm releases, load balancer and database PVC. [Terraform destroy](terraform-destroy-output.png)
completed with **61 resources destroyed** and [an empty state](terraform-empty-state.txt).
The [post-cleanup AWS queries](aws-cleanup-verification.txt), with their [verification source](verify-cleanup.py),
found no remaining project cluster, VPC, subnets, active NAT gateways, Elastic IP,
load balancers, active instances, database/worker volumes or network interfaces.
The KMS key is `PendingDeletion`, scheduled for 16 November 2026. A detached CNI
interface was verified unattached and removed to unblock the final subnet/security-group deletion;
[the command succeeded](aws-cni-cleanup.txt). No unrelated account resources were deleted.

The final narrated MP4 includes this cleanup result; [media verification](media-verification.txt)
records its 11:05 duration, audio/video streams and file hashes. [Local release verification](final-local-verification.txt)
confirms the expected image SHA, two available replicas per application tier,
Argo CD Synced/Healthy and Prometheus targets UP. The local Kind environment remains
available for review. Older `evidence/shared-aws/` images belong to the credited
TaskBoard exercise and are not used as CampusDesk proof.

The initial multi-platform release `7360906` was used for the AWS deployment and
its 17 passing cloud browser checks. The subsequent `f9bdd3a` release bundles
the font locally and adds the portable AWS script; it passed all CI gates and
was automatically deployed to local Kind by Argo CD at promotion `0e38680`.
[The exact final CI result](github-actions-39050953328.txt) identifies each job.
Registry screenshots show the earlier verified SHA; package links and the final
CI report identify the later release. Both image versions are retained in GHCR.
