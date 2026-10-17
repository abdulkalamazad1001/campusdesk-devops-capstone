// Add readable source excerpts and verified cleanup evidence to the recorded demo.
// Removes only the middle of the CI wait; preserves its narration and final result.
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const {chromium}=require('playwright');
const root=process.cwd(), work=path.join(root,'evidence/local/narrated-video');
const scenes=JSON.parse(await fs.readFile(path.join(work,'scenes.json'),'utf8'));
const read=async name=>fs.readFile(path.join(root,name),'utf8');
const probe=file=>Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',file],{encoding:'utf8'}));
const run=args=>execFileSync('ffmpeg',['-y',...args],{stdio:'ignore'});
const original=path.join(work,'original-walkthrough.mp4');
await fs.copyFile(path.join(root,'demo/walkthrough.mp4'),original);
const duration=Math.min(probe(original),scenes.at(-1).end+1), additions=[], clips=[];
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1280,height:720}});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const encoding=['-c:v','libx264','-preset','fast','-crf','26','-pix_fmt','yuv420p','-r','25','-c:a','aac','-ar','48000','-ac','2','-b:a','128k'];
async function card(name,title,body,narration){
 const png=path.join(work,name+'.png'),audio=path.join(work,name+'.aiff'),video=path.join(work,name+'.mp4');
 await page.setContent(`<html><body style="margin:0;padding:30px;background:#f4f7f5;color:#19392e;font-family:Arial"><p style="font-size:12px">CAMPUSDESK · ACTUAL REPOSITORY / CAPTURED COMMAND EVIDENCE</p><h1 style="font-size:27px">${esc(title)}</h1><pre style="font:15px/1.3 monospace;white-space:pre-wrap;overflow-wrap:anywhere">${esc(body)}</pre></body></html>`);
 if(await page.evaluate(()=>document.documentElement.scrollHeight>720))throw Error('Evidence card overflows: '+name);
 await page.screenshot({path:png});
 execFileSync('say',['-v','Rishi','-r','165','-o',audio,'--',narration]);
 const seconds=probe(audio)+1;
 run(['-loop','1','-framerate','25','-i',png,'-i',audio,'-t',String(seconds),...encoding,'-af','apad',video]);
 return {file:video,duration:seconds,name:title,narration};
}
try{
 const dirs=execFileSync('git',['ls-tree','--name-only','HEAD'],{encoding:'utf8'}).trim().split('\n').filter(x=>!x.endsWith('.md')&&!x.startsWith('.')).join('   ');
 additions.push(await card('source-layout','Codebase | folders and REST endpoints',dirs+'\n\nbackend/app/main.py — actual route declarations:\n'+(await read('backend/app/main.py')).split('\n').filter(x=>x.startsWith('@app.')).join('\n'),'The repository separates backend, frontend, Helm, Kubernetes, Terraform, GitOps, monitoring, and delivery scripts. These are the real API route declarations: health, readiness, metrics, statistics, and ticket list, read, create, update, and delete. A commit SHA connects this source to the exact published container release.'));
 additions.push(await card('source-isolation','Codebase | migration and isolated test database',(await read('backend/alembic/versions/0001_tickets.py')).split('\n').slice(12,19).join('\n')+'\n\nbackend/tests/conftest.py — test transaction cleanup:\n'+(await read('backend/tests/conftest.py')).split('\n').slice(64,81).join('\n'),'Alembic creates the tickets schema before the application starts. The tests use a dedicated database and a transaction per test. The dependency override supplies the test session, and rollback removes the test changes. CI exercises the same migration on PostgreSQL.'));
 additions.push(await card('source-containers','Codebase | non-root container builds','backend/Dockerfile — selected actual lines:\n'+(await read('backend/Dockerfile')).split('\n').filter(x=>/FROM|pip install|adduser|USER|CMD/.test(x)).join('\n')+'\n\nfrontend/Dockerfile:\n'+await read('frontend/Dockerfile'),'The backend installs dependencies and runs as user ten thousand and one. The frontend uses a Node build stage and copies only the compiled site into unprivileged Nginx, running as user one hundred and one. Trivy scans both runtime images before CI publishes them.'));
 const ciRecord=JSON.parse(await read('evidence/2026-10-17/github-actions-39050953328.json'));
 const ciData=JSON.parse(ciRecord.stdout);
 if(ciData.conclusion!=='success')throw Error('CI did not pass');
 const ciCard=await card('ci-result','Verified result | the workflow triggered in this video',ciData.url+'\nSource: '+ciData.headSha+'\nStatus: '+ciData.status+' / '+ciData.conclusion+'\n\n'+ciData.jobs.map(j=>j.name+' — '+j.conclusion).join('\n'),'The workflow triggered by the recorded push completed successfully. Both native architectures passed their build, Trivy scan, Kubernetes deployment, and browser checks. The publish job then released both images and updated GitOps. This result comes from the GitHub API, and the full workflow URL and source commit are shown here.');
 for(let attempt=0;attempt<90;attempt++){
  try{await fs.access('evidence/2026-10-17/aws-cleanup-verification.json');await fs.access('evidence/2026-10-17/terraform-destroy.txt');break;}
  catch{if(attempt===89)throw Error('Timed out waiting for verified cleanup');await new Promise(resolve=>setTimeout(resolve,10000));}
 }
 const cleanupText=await read('evidence/2026-10-17/terraform-destroy.txt');
 const verification=JSON.parse(await read('evidence/2026-10-17/aws-cleanup-verification.json'));
 if(verification.exitCode!==0 || !cleanupText.includes('Destroy complete!'))throw Error('Cleanup is not verified');
 const verified=JSON.parse(verification.stdout.slice(0,verification.stdout.lastIndexOf('}')+1));
 const cleanupSummary='Verified at: '+verified.checkedAt+'\n'+Object.entries(verified.checks).map(([key,value])=>key+': '+value.length+' remaining').join('\n')+'\nKMS: '+verified.kms.state+' (scheduled deletion)';
 const cleanup=await card('cleanup-appendix','Verified AWS cleanup | actual command results',cleanupText.split('\n').filter(x=>x.includes('Destroy complete!')).join('\n')+'\n\n'+cleanupSummary,'After recording the live AWS demonstration, the application and ingress releases were removed, including the load balancer and database volume. Terraform then destroyed the sixty one managed resources. The follow up AWS queries found no remaining active resources in the listed project checks. The KMS key is scheduled for deletion after its required waiting period. Local Kind remains available for review.');
 async function segment(start,end){
  if(end<=start)return;
  const file=path.join(work,`segment-${clips.length}.mp4`);
  run(['-ss',String(start),'-i',original,'-t',String(end-start),...encoding,file]);
  clips.push({file,duration:end-start,start,end});
 }
 const source=scenes.find(s=>s.name==='Source code'), ci=scenes.find(s=>s.name==='Current pipeline result');
 await segment(0,source.end);
 clips.push(...additions);
 const cutStart=ci.start+28,cutEnd=ci.end-12;
 if(cutEnd>cutStart+10){await segment(source.end,cutStart);await segment(cutEnd,ci.end);}
 else await segment(source.end,ci.end);
 clips.push(ciCard);
 await segment(ci.end,duration);
 clips.push(cleanup);
 const list=path.join(work,'concat.txt');
 await fs.writeFile(list,clips.map(c=>`file '${c.file}'`).join('\n'));
 run(['-f','concat','-safe','0','-i',list,'-c','copy','-movflags','+faststart',path.join(root,'demo/walkthrough.mp4')]);
 let elapsed=0;const cues=[];
 for(const clip of clips){
  if(clip.narration)cues.push({start:elapsed,end:elapsed+clip.duration,narration:clip.narration,name:clip.name});
  else for(const s of scenes){if(s.start>=clip.start&&s.start<clip.end)cues.push({...s,start:elapsed+s.start-clip.start,end:elapsed+Math.min(s.end,clip.end)-clip.start});}
  elapsed+=clip.duration;
 }
 const stamp=t=>{const ms=Math.round(t*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;};
 const subtitles=[];
 for(const c of cues){
  const words=c.narration.split(/\s+/), chunks=[];
  for(let i=0;i<words.length;i+=12)chunks.push(words.slice(i,i+12).join(' '));
  const span=Math.min(c.end-c.start,words.length/2.6);
  chunks.forEach((text,i)=>subtitles.push(`${subtitles.length+1}\n${stamp(c.start+i*span/chunks.length)} --> ${stamp(c.start+(i+1)*span/chunks.length)}\n${text}\n`));
 }
 await fs.writeFile('demo/walkthrough.srt',subtitles.join('\n'));
 await fs.writeFile('demo/NARRATION.md','# Walkthrough narration\n\nComputer-generated voice (macOS Rishi). Genuine application interactions, repository excerpts, commands and dated captures. The middle of the CI waiting interval is omitted; its starting narration and final result are retained. Source explanation and verified cleanup are inserted as labeled evidence cards.\n\n'+cues.map(c=>`## ${Math.floor(c.start/60)}:${String(Math.floor(c.start)%60).padStart(2,'0')} — ${c.name}\n\n${c.narration}\n`).join('\n'));
 await fs.writeFile(path.join(work,'final-edit.json'),JSON.stringify({duration:elapsed,clips,cues},null,2));
 console.log(`Final walkthrough: ${elapsed.toFixed(1)} seconds.`);
}finally{await browser.close();}
