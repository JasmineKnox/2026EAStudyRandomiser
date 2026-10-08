const assert=require('node:assert/strict');
const bank=require('../content-bank.json');
const fs=require('node:fs'),path=require('node:path');
for(const s of bank.subjects){
 assert(s.resources?.length>=1,`${s.name} needs a supplementary website`);
 const urls=new Set();
 for(const r of s.resources){
  const url=new URL(r.url);
  assert.equal(url.protocol,'https:');
  assert(!url.hostname.endsWith('qcaa.qld.edu.au'),`${s.name} must have non-QCAA resources`);
  assert(!urls.has(r.url),`${s.name} has a duplicate link`);urls.add(r.url);
  assert(r.note.length>30&&r.access.length>0,`${s.name} needs usable directions and access information`);
 }
}
const standalone=fs.readFileSync(path.join(__dirname,'../EA_Study_Randomiser.html'),'utf8');
assert(!/<script src=|<link rel="stylesheet"/.test(standalone),'Standalone must contain its own code and styles');
assert(standalone.includes('Study websites for your subjects'));
console.log(`PASS: every one of ${bank.subjects.length} subjects has non-QCAA help, safe URLs, usable notes and access information; standalone has no external assets.`);
