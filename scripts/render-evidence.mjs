// Render authentic transcripts as clearly labeled screenshots; never synthesize results.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const {chromium}=require('playwright');
const folder=path.resolve(process.argv[2] || 'evidence/2026-10-17');
const names=process.argv.slice(3);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 for(const name of names){
  const original=await fs.readFile(path.join(folder,name),'utf8');
  const tail=Number(process.env.EVIDENCE_TAIL || 0);
  const content=tail ? `Last ${tail} lines of the original transcript:\n\n`+original.split('\n').slice(-tail).join('\n') : original;
  await page.setContent(`<html><body style="margin:0;padding:35px;background:#f6f9f7;color:#19392e;font-family:Arial"><h1>CampusDesk | ${escape(name)}</h1><p>Authentic captured command output, rendered for readability. Original transcript and timestamp retained alongside this image.</p><pre style="font:14px/1.45 monospace;white-space:pre-wrap;overflow-wrap:anywhere">${escape(content)}</pre></body></html>`);
  await page.screenshot({path:path.join(folder,name.replace(/\.[^.]+$/,'')+'-output.png'),fullPage:true});
 }
}finally{await browser.close();}
