# Verification Evidence

**Current verification:** [17 October 2026 — CampusDesk on macOS, Kind and AWS EKS](2026-10-17/README.md). Earlier reports below remain historical records.


These files come from actual local commands, real browser interactions and GitHub
Actions artifacts. The sample ticket records are explicitly synthetic demo data.

| Evidence | Origin |
|---|---|
| `application-desktop.png`, `application-mobile.png` | Running Docker Compose UI |
| `ticket-create.png`, `ticket-mobile.png` | Real ticket creation forms |
| `browser-results.json` | Playwright CRUD, responsive layout, error/retry checks |
| `ingress-browser-results.json` | The same checks against the newly promoted local Kubernetes release |
| `pytest.txt`, `ruff.txt` | Captured local checks, command, timestamp and exit code |
| `compose.txt`, `non-root.txt` | Running containers and configured runtime UIDs |
| `kubernetes.txt`, `helm.txt` | Actual Kind cluster workloads and Helm release |
| `prometheus-targets.png`, `.json` | Real scrape targets and UP status |
| `grafana-dashboard.png`, `live-metrics.json` | Actual application traffic and dashboard |
| `argocd-application.png`, `argocd.json` | Real GitOps application status |
| `terraform-validate.txt` | Actual validation; not an AWS plan/apply claim |
| `trivy-*-initial.json` | Initial scans, including the original backend findings |
| `trivy-backend.json`, `trivy-frontend.json` | Rescans of the remediated local images |
| `ci-run-38638277372/` | Downloaded reports from the successful GitHub Actions run |
| `ci-run-38639295103/` | Reports from the successful automated-promotion workflow |
| `ci-run-38644518494/` | Previous successful workflow: 20 API tests, 17 browser checks and both scans |
| `ci-run-38765329150/` | Latest successful workflow, including all four source-security gates |
| `audit-2026-10-15/` | Fresh local rechecks and redacted whole-repository history findings; see grading audit |
| `application-320.png`, `application-768.png`, `application-1920.png`, `ticket-320.png` | Additional actual responsive-layout captures |
| `github-actions.png`, `registry-*.png` | Actual GitHub run and public package pages |
| `application-ingress.png` | Application reached through local Kubernetes Ingress |
| `*-output.png` | Browser-rendered, clearly labeled original command transcripts |
| `compose-build.txt`, `compose-build-output.png` | Actual successful Compose build/start command |
| `metrics-output.png` | Actual curl response from the backend metrics endpoint |
| `trivy-*-output.png` | Rendered original artifacts from the labeled CI run |
| `troubleshooting.txt` | Observed failures, fixes, verification and cleanup |
| `commit-history.txt` | Real project source history |
| `autoscaling.txt`, `load-test.txt` | Observed four-replica HPA scale-out and real bounded load results |

The `.txt` transcripts are original captured outputs. Browser-rendered transcript
images are labeled as captured output and are not presented as native terminal
screenshots. CampusDesk's AWS deployment was deferred; separately credited shared
AWS terminal images are in `shared-aws/`. No AWS Console screenshot is present.

## Security Findings And Resolution

The first Debian-based backend image contained HIGH findings in operating-system
packages and unused package-installer dependencies. `CVE-2025-47273`, for example,
concerned path traversal in an older setuptools package index implementation.
The backend was rebuilt on patched Alpine with only runtime application dependencies;
pip was removed after installation because the running service does not install packages.
Both final image scans returned no HIGH/CRITICAL findings. The CI reports independently
verify both published images. This is a point-in-time result against Trivy's database,
not a guarantee of complete application security.

The earlier CI directories are historical. The latest verified release is the one
identified in [the submission checklist](../SUBMISSION.md) and
[final audit](../FINAL-AUDIT.md); each report preserves its own origin.

## Reproduce

```powershell
node scripts/browser-check.mjs
.venv/Scripts/python scripts/collect-evidence.py
node scripts/capture-monitoring.mjs
python scripts/troubleshooting-check.py
```

Browser tooling is pinned in the frontend lockfile. Run `npm --prefix frontend ci`
and `node frontend/node_modules/playwright/cli.js install chromium`.
Use `collect-evidence.py --compose-build` to additionally capture a real rebuild/start.
For architecture rendering only, install Graphviz WASM in the ignored tools directory:
`npm install --prefix ../tools/browser @hpcc-js/wasm-graphviz`.
## Reference-Inspired Follow-Up

- `source-security-local/`: actual local Bandit, pip-audit, npm audit and redacted
  Gitleaks reports. All four exit codes were zero; see `summary.json`.
- `source-security-initial-gitleaks.json`: original redacted public-fingerprint
  false positives, with the exact-value exception explained in `../security/README.md`.
- `readiness-troubleshooting.txt`: isolated Running/NotReady failure, repair,
  successful Service request and namespace cleanup.
- `ci-run-38765329150/`: historical artifacts from the successful workflow run
  that verified the source-security and readiness follow-up. Current release
  coverage is documented in [the final audit](../FINAL-AUDIT.md).

## Shared AWS Material

[Shared AWS screenshots and attribution](shared-aws/README.md) contain unchanged
files from Shaikh Suja Rahaman's repository. The student reports instructor permission
for shared-work evidence. These are separate from this workspace's independently
executed CampusDesk evidence and do not claim a CampusDesk AWS deployment.

