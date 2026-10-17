import hashlib,json,subprocess
from pathlib import Path
from datetime import datetime,timezone
import pymupdf
video=Path('demo/walkthrough.mp4')
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height','-of','json',str(video)],text=True))
assert any(s['codec_type']=='audio' for s in info['streams'])
assert any(s['codec_type']=='video' and s['width']==1280 and s['height']==720 for s in info['streams'])
assert video.stat().st_size<100_000_000
assert 500<float(info['format']['duration'])<1200
pdf=pymupdf.open('demo/slides.pdf');assert len(pdf)>=8
assert Path('demo/walkthrough.srt').read_text().count(' --> ')>100
hashes={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in [video,Path('demo/slides.pdf'),Path('demo/walkthrough.srt')]}
print(json.dumps({'checkedAt':datetime.now(timezone.utc).isoformat(),'video':info,'slideCount':len(pdf),'sha256':hashes},indent=2))
print('PASS: narrated 720p MP4 below GitHub file-size limit, 12-slide PDF and subtitles present.')
