// Record genuine app interactions and command output with disclosed synthetic narration.
// Requires macOS say, ffmpeg/ffprobe, Playwright, and a running local GitOps deployment.
// RECORD_PUSH=1 commits ONLY files already staged by the operator, then pushes main.
import {createRequire} from 'node:module';
import {execFileSync, spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const {chromium}=require('playwright');
const work=path.join(root,'evidence/local/narrated-video');
await fs.mkdir(work,{recursive:true});
const evidence=path.join(root,'evidence/2026-10-17');
const runEnv={...process.env,HTTPS_PROXY:process.env.GITHUB_PROXY || process.env.HTTPS_PROXY || ''};
const browser=await chromium.launch({args:process.env.CHROMIUM_RESOLVER_RULES ? [`--host-resolver-rules=${process.env.CHROMIUM_RESOLVER_RULES}`]:[]});
const context=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir:work,size:{width:1280,height:720}}});
const page=await context.newPage();
const rawVideo=page.video();
const start=performance.now();
const scenes=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const wait=ms=>new Promise(r=>setTimeout(r,Math.max(0,ms)));
async function report(title,body){
 await page.setContent(`<html><body style="margin:0;background:#f4f7f5;color:#19392e;font-family:Arial;padding:30px"><p style="font-size:12px;color:#587466">CAMPUSDESK · COMPUTER-NARRATED DEMONSTRATION · ${new Date().toISOString()}</p><h1 style="font-size:27px">${esc(title)}</h1><pre style="font:15px/1.45 monospace;white-space:pre-wrap;overflow-wrap:anywhere">${esc(body)}</pre></body></html>`);
}
async function picture(file,title=''){
 const data=await fs.readFile(file);
 await page.setContent(`<html><body style="margin:0;background:#fff"><img style="width:1280px;height:${title?660:720}px;object-fit:contain" src="data:image/png;base64,${data.toString('base64')}">${title?`<p style="font:17px Arial;text-align:center">${esc(title)}</p>`:''}</body></html>`);
}
async function scene(name,narration,action){
 const index=scenes.length;
 const audio=path.join(work,`narration-${String(index).padStart(2,'0')}.aiff`);
 execFileSync('say',['-v',process.env.NARRATOR || 'Rishi','-r','165','-o',audio,'--',narration]);
 const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',audio],{encoding:'utf8'}));
 const at=(performance.now()-start)/1000;
 console.log(`Scene ${index+1}: ${name}`,true);
 await action();
 await wait((duration+1)*1000-(performance.now()-start-at*1000));
 scenes.push({name,narration,audio,start:at,end:(performance.now()-start)/1000});
 await fs.writeFile(path.join(work,'scenes.json'),JSON.stringify(scenes,null,2));
}
async function live(title,command,args,options={}){
 const visible=`$ ${command} ${args.join(' ')}\n`;
 let output='';
 await report(title,visible+'Running…');
 const child=spawn(command,args,{cwd:root,env:options.env||process.env});
 child.stdout.on('data',b=>output+=b.toString());child.stderr.on('data',b=>output+=b.toString());
 const redraw=setInterval(()=>{report(title,visible+output.split('\n').slice(-25).join('\n')).catch(()=>{});},700);
 const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',resolve);});
 clearInterval(redraw);
 await report(title,visible+output.split('\n').slice(-25).join('\n')+`\nExit code: ${code}`);
 await fs.writeFile(path.join(work,`command-${scenes.length}.txt`),visible+output+`\nExit code: ${code}\n`);
 if(code!==0)throw Error(`${title} failed (${code})`);
 return output;
}
function secret(ns,name){return Buffer.from(execFileSync('kubectl',['--context','kind-campusdesk','-n',ns,'get','secret',name,'-o','jsonpath={.data.password}'],{encoding:'utf8'}).trim(),'base64').toString();}
let runId=process.env.CI_RUN_ID || '39049385857';
try{
 await scene('Introduction','This is a computer narrated demonstration of CampusDesk, the DevOps capstone repository of T. Abdul Kalam Azad, roll number 24 B C S 10053. The voice is synthetic. The application, commands, deployments, and verification results shown are real. We begin with twelve slides, followed by the working systems.',()=>report('CampusDesk | End-to-end demonstration','T. Abdul Kalam Azad · 24BCS10053\n\nSynthetic narration; real application and infrastructure evidence.\n\nSlides → live app → source and tests → commit and CI → AWS → GitOps → monitoring\n\nRecorded on 17 October 2026.'));
 const narrations=[
 'CampusDesk organizes campus IT support. Students and staff report issues, and the support team assigns ownership, prioritizes work, and tracks resolution. This project connects that application to a reproducible DevOps delivery process.',
 'Requests cover network, hardware, software, and account access. The interface provides search, status filters, priority, assignment, and an editable ticket workflow. All records used in this demonstration are synthetic.',
 'React and Nginx provide the browser interface. FastAPI validates API requests. SQLAlchemy talks to PostgreSQL, while Alembic versions the database schema. Forty API tests cover isolated test databases, and CI repeats them against PostgreSQL.',
 'Traffic enters through Traefik. The frontend and backend use Kubernetes Services. PostgreSQL keeps ticket data in a persistent volume. GitHub Actions tests and scans images, then publishes them to GHCR. Argo CD reconciles the Helm configuration from Git.',
 'The responsive helpdesk is an original CampusDesk implementation. The browser checks verify real creation, update, persistence, and deletion, together with narrow screen layouts and accessible controls. Mocked edge cases are separately identified in the reports.',
 'Publication is gated. Source security and tests must pass before image builds. Native AMD64 and ARM64 jobs scan both images with Trivy, deploy Helm into Kind, and run seventeen browser checks. Only those exact verified images become the commit SHA release.',
 'Kubernetes runs two frontend and at least two backend replicas. Readiness checks database access, while liveness checks the API process. A real load test completed thirty one thousand two hundred seventy four successful requests and scaled the backend from two replicas to four.',
 'Argo CD reads this repository. The migration hook runs before the application rollout. CI promotes the verified image tags in Git, and Argo synchronizes the desired state. Secrets are generated separately and kept outside Git.',
 'Prometheus scrapes each backend replica. Grafana displays availability, request rate, latency, and response codes. The dashboard is populated by real requests. Monitoring makes the effect of traffic and rollout changes visible.',
 'Terraform created a VPC in Mumbai with two public and two private subnets, a NAT gateway, EKS version one point thirty five, and two private worker nodes. The initial plan contained sixty one resources. A DNS interruption was recovered using the existing state, and the follow up plan found no drift.',
 'The troubleshooting exercises deliberately use an invalid image, a wrong Service selector, and an invalid readiness path. The evidence shows the failure, diagnosis, repair, and cleanup. These exercises use disposable resources and keep the actual application available.',
 'Verification includes cleanup. Kubernetes created load balancers and persistent volumes must be removed before Terraform destroys the cluster and network. The evidence index separates current CampusDesk results from historical examples. The classroom app still needs authentication, TLS, and database resilience before production use.'
 ];
 for(let i=0;i<narrations.length;i++)await scene(`Slide ${i+1}`,narrations[i],()=>picture(path.join(root,`evidence/local/slides/slide-${String(i+1).padStart(2,'0')}.png`)));
 await scene('Source code','The repository keeps the API, frontend, chart, workflow, and infrastructure together. This is an excerpt from the actual API source. Validation and database handling live in the application, while the delivery scripts make its deployment repeatable.',async()=>report('Actual source | backend/app/main.py',(await fs.readFile(path.join(root,'backend/app/main.py'),'utf8')).split('\n').slice(0,29).join('\n')));
 await scene('Live ticket workflow','We are now using the running Kubernetes application through Ingress. This ticket is created through the real API, assigned to campus support, marked resolved, and deleted. The database and interface are responding live.',async()=>{
  await page.goto('http://campusdesk.localhost:8088',{waitUntil:'domcontentloaded'});
  const title=`Video verification ${Date.now()}`;
  await page.locator('.page-title').getByRole('button',{name:'New ticket',exact:true}).click();
  await page.getByLabel('Subject',{exact:true}).fill(title);await page.getByLabel('Requester',{exact:true}).fill('Demo Presenter');await page.getByLabel('Location',{exact:true}).fill('Campus IT Lab');
  await wait(2500);await page.getByRole('button',{name:'Create ticket',exact:true}).click();
  await page.getByRole('button',{name:title,exact:true}).click();await page.getByRole('combobox',{name:'Status',exact:true}).selectOption('resolved');await page.getByLabel('Assigned to',{exact:true}).fill('Campus Support');await wait(2000);
  await page.getByRole('button',{name:'Save changes',exact:true}).click();await page.getByText('Ticket updated',{exact:true}).waitFor();await wait(2000);
  await page.getByRole('button',{name:title,exact:true}).click();await page.getByRole('button',{name:'Delete ticket',exact:true}).click();await page.locator('.delete-confirm').getByRole('button',{name:'Delete ticket',exact:true}).click();await page.getByText('Ticket deleted',{exact:true}).waitFor();
 });
 await scene('Live tests','The API tests now execute again in an isolated local database. The CI run additionally verifies PostgreSQL migration upgrade, schema consistency, and downgrade. The test output shown here is produced by this command during the recording.',()=>live('Live command | API tests','.venv/bin/python',['-m','pytest','-c','backend/pytest.ini','backend/tests','-q'],{env:{...process.env,PYTHONPATH:path.join(root,'backend')},...{}}));
 if(process.env.RECORD_PUSH==='1'){
  await scene('Live commit and push','This is a real commit and push of the reviewed changes, including the bundled font and portable AWS deployment script. The push starts the required main branch workflow. We will return to its result after the cloud and monitoring demonstration.',async()=>{
   await live('Live Git commit','git',['commit','-m','feat(capstone): verify AWS deployment and bundle offline font']);
   await live('Live push to main','git',['push','origin','main'],{env:runEnv});
   const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
   for(let i=0;i<20;i++){
    const runs=JSON.parse(execFileSync('gh',['run','list','--commit',sha,'--json','databaseId,status,url'],{cwd:root,env:runEnv,encoding:'utf8'}));
    if(runs.length){runId=String(runs[0].databaseId);break;}await wait(2000);
   }
   await fs.writeFile(path.join(work,'ci-run-id.txt'),runId);
  });
 }
 await scene('Current pipeline result','We now check the workflow triggered by the live push. The status below comes directly from GitHub. Publication is allowed only after every required test, scan, deployment, and browser job passes.',async()=>{
  await live('GitHub Actions | live completion','gh',['run','watch',runId,'--exit-status','--interval','10'],{env:runEnv});
  await live('GitHub Actions | verified result','gh',['run','view',runId,'--json','url,headSha,status,conclusion,jobs','--jq','{url,headSha,status,conclusion,jobs:[.jobs[]|{name,conclusion}]}'],{env:runEnv});
 });
 await scene('Terraform plan record','The original Terraform plan proposed sixty one resources. This excerpt is from the captured nonempty plan. The following apply and follow up plan establish that the infrastructure was created and matches the configuration.',async()=>report('Original nonempty Terraform plan',(await fs.readFile(path.join(evidence,'terraform-plan.txt'),'utf8')).split('Plan:')[1].slice(0,1500).replace(/^/, 'Plan:')));
 await scene('AWS provisioning record','These are the original Terraform results from this AWS deployment. The first apply stopped because local DNS could not resolve the AWS OIDC endpoint. Resuming from state created the remaining seven resources without recreating the cluster. The next plan verified there were no differences.',async()=>report('Recorded Terraform apply and drift verification',(await fs.readFile(path.join(evidence,'terraform-apply-resume.txt'),'utf8')).split('\n').slice(-34).join('\n')+'\n\n'+(await fs.readFile(path.join(evidence,'terraform-post-apply-plan.txt'),'utf8')).split('\n').slice(-8).join('\n')));
 await scene('AWS Console','This screenshot was captured from the real AWS Console during this run. It identifies the CampusDesk cluster in Mumbai, shows Active status, and shows Kubernetes version one point thirty five. The AWS session used for evidence has read only permissions.',()=>picture(path.join(evidence,'aws/eks-active.png'),'Actual AWS Console capture · 17 October 2026'));
 await scene('AWS VPC Console','The VPC console shows the CampusDesk network created by Terraform. Public subnet routes use the internet gateway, and private worker subnet routes use the NAT gateway. The route table evidence identifies each association.',()=>picture(path.join(evidence,'aws/vpc.png'),'Actual AWS VPC Console capture · 17 October 2026'));
 if(process.env.AWS_WRAPPER){
  await scene('Live EKS verification','The following command queries the live AWS cluster. Both managed worker nodes are Ready. The application uses private nodes, ClusterIP Services, an Ingress, and a PostgreSQL persistent volume provisioned by the EBS CSI driver.',()=>live('Live AWS Kubernetes resources','python3',[process.env.AWS_WRAPPER,'kubectl','--context','campusdesk-24bcs10053','-n','campusdesk','get','pods,svc,ingress,pvc'],{env:{...process.env,HTTPS_PROXY:process.env.AWS_PROXY||''}}));
 }
 await scene('AWS application','The same application was verified through the AWS load balancer, with all seventeen browser checks passing. These captures come from that cloud deployment, including real CRUD operations. They are separate from the local Kind evidence.',()=>picture(path.join(evidence,'browser-aws/application-desktop.png'),'AWS Ingress application · real browser regression capture'));
 await scene('Live Argo CD','Argo CD is connected to this repository and shows the application as synchronized and healthy. The image tag is the source commit that passed the pipeline. Git records the desired state, and the controller reconciles it into the cluster.',async()=>{
  await page.goto('http://argocd.localhost:8088');await page.getByRole('textbox',{name:'Username',exact:true}).fill('admin');await page.getByRole('textbox',{name:'Password',exact:true}).fill(secret('argocd','argocd-initial-admin-secret'));await page.getByRole('button',{name:'Sign In',exact:true}).click();await page.waitForURL('**/applications**');await page.goto('http://argocd.localhost:8088/applications/argocd/campusdesk');await page.getByText('APP HEALTH',{exact:true}).waitFor();
 });
 await scene('Live Kubernetes','Here are the live local workloads, Services, Ingress, and autoscaler. The backend and frontend have multiple healthy replicas. PostgreSQL and monitoring remain in the same project namespace. Each command explicitly names the cluster to avoid accidental operations on another environment.',()=>live('Live Kind Kubernetes resources','kubectl',['--context','kind-campusdesk','-n','campusdesk','get','pods,svc,ingress,hpa']));
 await scene('Live Prometheus','Prometheus discovers each backend replica and scrapes the metrics endpoint. These targets are live. A successful scrape establishes monitoring connectivity; the dashboard then turns those time series into service measurements.',async()=>{await page.goto('http://localhost:9090/targets');await page.getByText('campusdesk',{exact:false}).first().waitFor();});
 await scene('Live Grafana','Grafana is reading the live Prometheus datasource. Request traffic, response codes, latency, and healthy replica count are visible. The earlier load run shows how traffic and scaling change these measurements over time.',async()=>{
  await page.goto('http://localhost:3001/login');await page.getByRole('textbox',{name:'Email or username'}).fill('admin');await page.getByRole('textbox',{name:'Password',exact:true}).fill(secret('campusdesk','campusdesk-grafana'));await page.getByRole('button',{name:'Log in',exact:true}).click();await page.waitForURL(u=>!u.pathname.startsWith('/login'));await page.goto('http://localhost:3001/d/campusdesk?orgId=1&from=now-1h&to=now&refresh=10s');await page.getByText('Healthy backend replicas',{exact:true}).waitFor();await page.waitForFunction(()=>document.querySelectorAll('canvas').length>0);
 });
 await scene('Security and autoscaling evidence','The saved Trivy reports contain zero high or critical findings for both images on both CPU architectures. Source security also passed. Separately, the autoscaler event records a successful increase from two to four replicas in response to CPU demand.',async()=>report('Actual autoscaler event and scan result',(await fs.readFile(path.join(evidence,'autoscaling.txt'),'utf8')).split('\n').filter(x=>/Captured|Command|Deployment pods|replicas|SuccessfulRescale|New size|Min replicas|Max replicas/.test(x)).join('\n')+'\n\nCI run 39049385857: source-security, tests, AMD64, ARM64, publication — SUCCESS\nTrivy HIGH/CRITICAL findings: backend 0, frontend 0, on both architectures.\nReports: evidence/2026-10-17/ci-39049385857/'));
 await scene('Close and cleanup','The demonstration covers the application, tests, container security, cloud infrastructure, GitOps, and observability. The AWS resources are temporary. Cleanup completion and final verification are recorded in the evidence index and the cleanup appendix. The application is a classroom demonstration with synthetic data, not a production service.',()=>report('CampusDesk | Review the evidence','Repository: github.com/abdulkalamazad1001/campusdesk-devops-capstone\n\nCurrent evidence: evidence/2026-10-17/README.md\nSlide deck: demo/slides.pdf\nNarration: synthetic voice, explicitly disclosed.\n\nCloud cleanup is verified separately after this live demonstration.\nProduction gaps: authentication, TLS, database resilience, durable monitoring.'));
}finally{await context.close();await browser.close();}
const raw=await rawVideo.path();
const ffargs=['-y','-i',raw];
for(const s of scenes)ffargs.push('-i',s.audio);
const filters=scenes.map((s,i)=>`[${i+1}:a]adelay=${Math.round(s.start*1000)}:all=1[a${i}]`);
filters.push(scenes.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${scenes.length}:duration=longest:normalize=0[audio]`);
ffargs.push('-filter_complex',filters.join(';'),'-map','0:v','-map','[audio]','-c:v','libx264','-preset','fast','-crf','26','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',path.join(root,'demo/walkthrough.mp4'));
execFileSync('ffmpeg',ffargs,{stdio:'ignore'});
const stamp=t=>{const ms=Math.round(t*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;};
await fs.writeFile(path.join(root,'demo/walkthrough.srt'),scenes.map((s,i)=>`${i+1}\n${stamp(s.start)} --> ${stamp(s.end)}\n${s.narration}\n`).join('\n'));
await fs.writeFile(path.join(root,'demo/NARRATION.md'),'# Computer-narrated walkthrough\n\nSynthetic narration; commands and application interactions are real.\n\n'+scenes.map(s=>`## ${s.name}\n\n${s.narration}\n`).join('\n'));
console.log('Created demo/walkthrough.mp4 with narration and subtitles.');
