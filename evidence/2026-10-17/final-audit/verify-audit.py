"""Verify the final review package against the captured runs and local deliverables."""
import hashlib
import json
import re
import subprocess
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent

def read(name):
    return json.loads((HERE / name).read_text())

checks = {}
for name in ['pytest', 'lint', 'frontend-build', 'helm-lint', 'terraform-validate',
             'release-health', 'metrics', 'registry', 'aws-cleanup', 'full-history-secrets']:
    assert read(name + '.json')['exitCode'] == 0, name
    checks[name] = 'PASS'
assert '40 passed' in read('pytest.json')['stdout']
browser = read('browser-kind/browser-results.json')
assert len(browser['passed']) == 17
assert read('gitleaks.json') == []
ci = read('reference-and-ci.json')['applicationCI']
assert ci['conclusion'] == 'success' and all(j['conclusion'] == 'success' for j in ci['jobs'])
assert read('reference-and-ci.json')['project']['visibility'] == 'PUBLIC'
recording = read('supplement-commands.json')
assert recording['success'] and all(r['exitCode'] == 0 for r in recording['records'])
commands = recording['records']
assert any('ImagePullBackOff' in r['output'] or 'ErrImagePull' in r['output'] for r in commands)
assert any('successfully rolled out' in r['output'] for r in commands)
for kind, name in [('service', 'campusdesk-audit-selector'), ('deployment', 'campusdesk-audit-image')]:
    remaining = subprocess.check_output(['kubectl', '--context', 'kind-campusdesk', '-n', 'campusdesk',
                                         'get', kind, name, '--ignore-not-found', '-o', 'name'], text=True)
    assert not remaining.strip(), name
checks['supplement-failure-repair-cleanup'] = 'PASS'
missing = []
for filename in ['FINAL-AUDIT.md', 'README.md', 'SUBMISSION.md', 'demo/README.md', 'demo/NARRATION.md',
                 'evidence/2026-10-17/README.md']:
    p = ROOT / filename
    for link in re.findall(r'\]\(([^)]+)\)', p.read_text()):
        if link.startswith(('http:', 'https:', '#', 'mailto:')):
            continue
        target = urllib.parse.unquote(link.split('#')[0])
        if target and not (p.parent / target).exists():
            missing.append([filename, link])
assert not missing, missing
checks['local-documentation-links'] = 'PASS'
media = {}
for name in ['walkthrough.mp4', 'verification-supplement.mp4']:
    p = ROOT / 'demo' / name
    info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
                     'format=duration,size:stream=codec_type,codec_name,width,height', '-of', 'json', str(p)], text=True))
    assert any(s['codec_type'] == 'video' and s['width'] == 1280 and s['height'] == 720 for s in info['streams'])
    assert p.stat().st_size < 100_000_000
    if name == 'walkthrough.mp4':
        assert any(s['codec_type'] == 'audio' for s in info['streams'])
    media[name] = {'durationSeconds': float(info['format']['duration']), 'bytes': p.stat().st_size,
                   'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
print(json.dumps({'checkedAt': datetime.now(timezone.utc).isoformat(), 'checks': checks,
                  'apiTestsPassed': 40, 'browserChecksPassed': len(browser['passed']),
                  'ciJobsPassed': len(ci['jobs']), 'media': media,
                  'deferredAction': 'Course submission form, at owner request'}, indent=2))
print('PASS: project evidence, presentation files, documentation links and demo cleanup verified.')
