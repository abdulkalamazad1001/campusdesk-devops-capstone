// Record additional README demonstrations using real commands and disposable objects.
// Requires the existing healthy kind-campusdesk and Compose deployments.
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const {chromium}=require('playwright');
const out=path.join(root,'evidence/2026-10-17/final-audit');
const scratch=path.join(root,'evidence/local/verification-supplement');
await fs.mkdir(out,{recursive:true});await fs.mkdir(scratch,{recursive:true});
const release=JSON.parse(await fs.readFile(path.join(root,'helm/campusdesk/values-release.json'),'utf8'));
const image=`${release.frontend.repository}:${release.frontend.tag}`;
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir:scratch,size:{width:1280,height:720}}});
const page=await context.newPage(),video=page.video(),began=performance.now(),chapters=[],logs=[];
const kube=['--context','kind-campusdesk','-n','campusdesk'];
const service='campusdesk-audit-selector',deployment='campusdesk-audit-image';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function display(title,note,text){
 await page.setContent(`<body style="margin:0;padding:30px;background:#f4f7f5;color:#19392e;font-family:Arial"><div style="font-size:12px;color:#587466">CAMPUSDESK · LIVE COMMAND RECORDING · ${new Date().toISOString()}</div><h1 style="font-size:28px;margin:22px 0 10px">${esc(title)}</h1><p style="font-size:17px;margin:0 0 22px">${esc(note)}</p><pre style="font:14px/1.3 monospace;white-space:pre-wrap;overflow-wrap:anywhere">${esc(text)}</pre></body>`);
 await page.evaluate(()=>{
  const pre=document.querySelector('pre');
  for(let size=14;size>=10 && document.documentElement.scrollHeight>720;size--){pre.style.fontSize=size+'px';pre.style.lineHeight='1.2';}
 });
}
async function command(command,args){
 let output='';const child=spawn(command,args,{cwd:root,env:process.env});
 child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>output+=b);
 const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',resolve);});
 const record={at:new Date().toISOString(),command:[command,...args],exitCode:code,output};logs.push(record);
 if(code!==0)throw Error(`${command} exited ${code}: ${output}`);
 return output;
}
async function step(name,note,cmd,args,{hold=4500,tail=24}={}){
 const start=(performance.now()-began)/1000;chapters.push({name,start});
 await display(name,note,`$ ${cmd} ${args.join(' ')}\n\nRunning…`);
 const result=await command(cmd,args);
 const shown=result.split('\n').slice(-tail).join('\n');
 await display(name,note,`$ ${cmd} ${args.join(' ')}\n\n${shown}\nExit code: 0`);
 await page.screenshot({path:path.join(out,`supplement-${String(chapters.length).padStart(2,'0')}.png`)});
 await wait(hold);
}
let madeService=false,madeDeployment=false,ok=false;
try{
 // Refuse to overwrite anything that predated this run.
 for(const [kind,name] of [['service',service],['deployment',deployment]]){
  const existing=await command('kubectl',[...kube,'get',kind,name,'--ignore-not-found','-o','name']);
  if(existing.trim())throw Error('Disposable object already exists: '+name);
 }
 chapters.push({name:'Verification supplement',start:(performance.now()-began)/1000});
 await display('CampusDesk | Additional verification','Database, registry, Helm and live failure diagnosis','T. Abdul Kalam Azad · 24BCS10053\n\nThis session runs real commands against the local project.\n\nThe main narrated video covers slides, CI, AWS, GitOps and monitoring.\nThe failure exercises below create and remove only two dedicated demo objects.');await wait(5000);
 chapters.push({name:'FastAPI documentation',start:(performance.now()-began)/1000});
 await page.goto('http://localhost:8000/docs');await page.getByText('/api/tickets',{exact:true}).first().waitFor();
 await page.screenshot({path:path.join(out,'api-swagger.png'),fullPage:true});await wait(5000);
 await step('Database | Alembic revision and ticket schema','The running Compose PostgreSQL database stores the application data.','docker',['compose','exec','-T','postgres','psql','-U','campusdesk','-d','campusdesk','-c','SELECT version_num FROM alembic_version;','-c','\\d tickets'],{hold:7000,tail:28});
 await step('Database | Persisted demonstration tickets','Synthetic ticket data from the real database; no real student requests.','docker',['compose','exec','-T','postgres','psql','-U','campusdesk','-d','campusdesk','-c','SELECT id,title,status,priority FROM tickets ORDER BY id LIMIT 5;']);
 await step('Containers | Running stack and non-root users','The app images use unprivileged runtime accounts.','docker',['compose','ps']);
 await step('Container identity | backend','The backend container runs as UID 10001.','docker',['compose','exec','-T','backend','id']);
 await step('Container identity | frontend','The Nginx runtime runs as UID 101.','docker',['compose','exec','-T','frontend','id']);
 await step('Registry | Public, SHA-tagged images','An anonymous registry query verifies both architectures for the tested release.','.venv/bin/python',['evidence/2026-10-17/final-audit/verify-registry.py'],{hold:7500,tail:35});
 await step('Terraform | Infrastructure source','This is the source used for the completed AWS deployment and cleanup.','sed',['-n','1,30p','terraform/main.tf'],{hold:6500,tail:30});
 await step('Helm | Release inventory','The bootstrap Helm release is retained. Argo CD now reconciles the app chart.','helm',['--kube-context','kind-campusdesk','list','-n','campusdesk'],{hold:6500});
 await step('Service fault | Create an incorrect selector','Only a new demo Service is affected; application Services stay available.','kubectl',[...kube,'create','service','clusterip',service,'--tcp=8000:8000']);madeService=true;
 await step('Diagnose | No matching endpoints','The demo selector does not match the backend pod labels.','kubectl',[...kube,'get','endpointslices','-l',`kubernetes.io/service-name=${service}`,'-o','wide']);
 await step('Repair | Select the real backend labels','The Service should now discover the existing healthy replicas.','kubectl',[...kube,'set','selector',`service/${service}`,'app=backend']);
 await step('Verify | Ready endpoints restored','The output now lists backend pod addresses.','kubectl',[...kube,'get','endpointslices','-l',`kubernetes.io/service-name=${service}`,'-o','wide']);
 const eps=JSON.parse(await command('kubectl',[...kube,'get','endpointslices','-l',`kubernetes.io/service-name=${service}`,'-o','json']));
 if(!eps.items.some(s=>s.endpoints?.some(e=>e.conditions?.ready)))throw Error('Ready endpoints not restored');
 await step('Image fault | Create a nonexistent tag','This is a separate demo Deployment, not an application rollout.','kubectl',[...kube,'create','deployment',deployment,`--image=${release.frontend.repository}:intentionally-missing-audit`]);madeDeployment=true;
 let failed=false;
 for(let i=0;i<60;i++){
  const pods=JSON.parse(await command('kubectl',[...kube,'get','pods','-l',`app=${deployment}`,'-o','json']));
  if(pods.items.some(p=>p.status.containerStatuses?.some(c=>['ErrImagePull','ImagePullBackOff'].includes(c.state?.waiting?.reason)))){failed=true;break;}
  await display('Waiting for the image failure','The demo image tag is intentionally nonexistent.',pods.items.map(p=>`${p.metadata.name}  ${p.status.phase}  ${p.status.containerStatuses?.[0]?.state?.waiting?.reason||'Pending'}`).join('\n'));await wait(2000);
 }
 if(!failed)throw Error('Expected image pull failure was not observed');
 await step('Diagnose | Image pull failure','The pod status and events identify why the container cannot start.','kubectl',[...kube,'describe','pods','-l',`app=${deployment}`],{hold:7500,tail:19});
 await step('Repair | Use the verified image SHA','Switch only the disposable Deployment to the already-tested frontend image.','kubectl',[...kube,'set','image',`deployment/${deployment}`,`*=${image}`]);
 await step('Verify | Successful rollout','Kubernetes replaces the failed pod with a healthy container.','kubectl',[...kube,'rollout','status',`deployment/${deployment}`,'--timeout=120s']);
 await step('Verify | Repaired pod is Running','The demo image fault is resolved.','kubectl',[...kube,'get','pods','-l',`app=${deployment}`]);
 await step('Cleanup | Remove only the demo objects','The two temporary troubleshooting objects are deleted.','kubectl',[...kube,'delete',`service/${service}`,`deployment/${deployment}`]);madeService=false;madeDeployment=false;
 await step('Final health | Original application is ready','The verified release, Argo CD and Prometheus remain healthy.','.venv/bin/python',['evidence/2026-10-17/verify-local.py'],{hold:6500,tail:24});
 ok=true;
}finally{
 if(madeService)await command('kubectl',[...kube,'delete','service',service,'--ignore-not-found']);
 if(madeDeployment)await command('kubectl',[...kube,'delete','deployment',deployment,'--ignore-not-found']);
 await fs.writeFile(path.join(out,'supplement-commands.json'),JSON.stringify({capturedAt:new Date().toISOString(),success:ok,records:logs},null,2));
 await fs.writeFile(path.join(out,'supplement-commands.txt'),logs.map(r=>`${r.at}\n$ ${r.command.join(' ')}\n${r.output}\nExit code: ${r.exitCode}\n`).join('\n').split('\n').map(line=>line.trimEnd()).join('\n'));
 await context.close();await browser.close();
}
if(!ok)throw Error('Supplement did not complete');
const raw=await video.path(),dest=path.join(root,'demo/verification-supplement.mp4');
execFileSync('ffmpeg',['-v','error','-y','-i',raw,'-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-an','-movflags','+faststart',dest]);
const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',dest],{encoding:'utf8'}));
await fs.writeFile(path.join(out,'supplement-chapters.json'),JSON.stringify({duration,chapters},null,2));
console.log(JSON.stringify({video:'demo/verification-supplement.mp4',duration,scenes:chapters.length,success:ok}));
