"""Run a real command, stream its output, and save timestamped evidence with its exit code."""
import argparse
import json
import subprocess
import sys
import time
from datetime import UTC, datetime
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("name")
parser.add_argument("--output", type=Path, default=Path("evidence/local/current"))
parser.add_argument("--cwd", type=Path, default=Path.cwd())
parser.add_argument("command", nargs=argparse.REMAINDER)
args = parser.parse_args()
command = args.command
if command and command[0] == "--":
    command = command[1:]
if not command:
    parser.error("Supply a command after --")
args.output.mkdir(parents=True, exist_ok=True)
start = datetime.now(UTC).isoformat()
timer = time.monotonic()
print(f"Captured at: {start}\nCommand: {' '.join(command)}", flush=True)
lines = []
process = subprocess.Popen(command, cwd=args.cwd, stdout=subprocess.PIPE,
                           stderr=subprocess.STDOUT, text=True, bufsize=1)
for line in process.stdout:
    lines.append(line)
    print(line, end="", flush=True)
code = process.wait()
duration = round(time.monotonic() - timer, 2)
record = {"capturedAt": start, "finishedAt": datetime.now(UTC).isoformat(),
          "command": command, "cwd": str(args.cwd.resolve()), "exitCode": code,
          "durationSeconds": duration, "stdout": "".join(lines)}
(args.output / f"{args.name}.json").write_text(json.dumps(record, indent=2) + "\n")
(args.output / f"{args.name}.txt").write_text(
    f"Captured at: {start}\nCommand: {' '.join(command)}\nExit code: {code}\n"
    f"Duration: {duration}s\n\n{record['stdout']}")
print(f"\nExit code: {code}; duration: {duration}s", flush=True)
sys.exit(code)
