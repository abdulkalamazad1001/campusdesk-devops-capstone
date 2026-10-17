"""Capture actual command output with timestamps and exit codes; never synthesize results."""
import argparse
import json
import os
import shutil
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--output", type=Path, default=root / "evidence")
parser.add_argument("--compose-build", action="store_true")
options = parser.parse_args()
evidence = options.output.resolve()
evidence.mkdir(parents=True, exist_ok=True)
kubectl = ["kubectl", "--context", "kind-campusdesk"]
helm = os.environ.get("HELM") or shutil.which("helm") or "helm"
terraform = os.environ.get("TERRAFORM") or shutil.which("terraform") or "terraform"
python = sys.executable
checks = [
    ("pytest", [python, "-m", "pytest", "-v"], root / "backend"),
    ("ruff", [python, "-m", "ruff", "check", "."], root / "backend"),
    ("compose", ["docker", "compose", "ps"], root),
    ("non-root", ["docker", "image", "inspect", "campusdesk-backend:local", "campusdesk-frontend:local", "--format", "{{.RepoTags}} user={{.Config.User}}"], root),
    ("kubernetes", kubectl + ["-n", "campusdesk", "get", "pods,svc,ingress,hpa"], root),
    ("helm", [helm, "--kube-context", "kind-campusdesk", "list", "-n", "campusdesk"], root),
    ("terraform-validate", [terraform, "-chdir=terraform", "validate", "-no-color"], root),
    ("argocd", kubectl + ["-n", "argocd", "get", "application", "campusdesk", "-o", "json"], root),
    ("metrics", ["curl", "-fsS", "http://localhost:8000/metrics"], root),
    ("commit-history", ["git", "log", "-15", "--format=%h %s"], root),
]
summary = []
if options.compose_build:
    checks.insert(0, ("compose-build", ["docker", "compose", "up", "--build", "-d"], root))
for name, command, cwd in checks:
    captured = datetime.now(UTC).isoformat()
    try:
        result = subprocess.run(command, check=False, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=900 if name == "compose-build" else 180)
    except (OSError, subprocess.TimeoutExpired) as error:
        result = subprocess.CompletedProcess(command, 1, "", str(error))
    record = {"name": name, "capturedAt": captured, "command": command, "exitCode": result.returncode,
              "stdout": result.stdout, "stderr": result.stderr}
    (evidence / f"{name}.json").write_text(json.dumps(record, indent=2), encoding="utf-8")
    (evidence / f"{name}.txt").write_text(f"Captured at {captured}\nCommand: {' '.join(command)}\nExit code: {result.returncode}\n\n{result.stdout}\n{result.stderr}", encoding="utf-8")
    summary.append({"name": name, "exitCode": result.returncode, "capturedAt": captured})
    print(f"{name}: exit {result.returncode}")
(evidence / "checks.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
raise SystemExit(1 if any(check["exitCode"] != 0 for check in summary) else 0)
