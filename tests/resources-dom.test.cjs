const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');const bank=require('../content-bank.json');
const key='mrs-knox-ea-study-2026-v1';const errors=[];
function load(saved,standalone=false){
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,standalone?'EA_Study_Randomiser.html':'index.html'),'utf8'),{url:'https://study.example/',runScripts:'outside-only',virtualConsole:vc});
 const w=dom.window;w.HTMLElement.prototype.scrollIntoView=function(){};
 if(saved)w.localStorage.setItem(key,saved);
 if(standalone){for(const script of w.document.querySelectorAll('script'))w.eval(script.textContent);}
 else for(const f of ['bank.js','engine.js','app.js'])w.eval(fs.readFileSync(path.join(root,f),'utf8'));
 return w;
}
let w=load();const $=q=>w.document.querySelector(q),$$=q=>[...w.document.querySelectorAll(q)];
const change=(element,checked)=>{element.checked=checked;element.dispatchEvent(new w.Event('change'));};
assert.deepEqual($$('#subject-list legend').map(x=>x.textContent),['Select your English','Select your Maths','Select your electives']);
for(let step=0;step<3;step++){
 for(const box of $$('[data-step="'+step+'"] input[name=subject]')){const s=bank.subjects.find(s=>s.id===box.value);change(box,true);if(s.option)w.document.getElementById('option-'+s.id).value=s.option.text?'Environmental policy':s.option.values[0];}
 if(step<2)$('#setup-next').click();else $('#setup-save').click();
}
assert.equal($('#study').hidden,false);assert.equal($$('#website-subject option').length,48);assert.equal($$('#session-subjects input:checked').length,3);
assert.equal($$('#session-subjects input:disabled').length,45);
for(const s of bank.subjects){
 if($('#session-config').hidden)$('#change-session').click();
 while($('#session-subjects input:checked'))change($('#session-subjects input:checked'),false);
 change($(`#session-subjects input[value="${s.id}"]`),true);$('#generate').click();
 assert.equal($('#task-subject').textContent,s.name);
 const actual=$$('#resource-links a').map(x=>x.href);
 for(const r of s.resources)assert(actual.includes(r.url),`${s.name} missing ${r.name}`);
 assert(actual.includes(s.page));
 const before=w.localStorage.getItem(key);$('#website-subject').value=s.id;$('#website-subject').dispatchEvent(new w.Event('change'));
 assert.deepEqual($$('#website-links a').map(x=>x.href),actual);assert.equal(w.localStorage.getItem(key),before,'Browsing websites must not change task or progress');
}
const saved=w.localStorage.getItem(key),last=$('#task-subject').textContent;w.close();w=load(saved);assert.equal($('#task-subject').textContent,last);assert.equal($$('#session-subjects input:checked').length,1);
$('#edit-setup').click();$('#subject-search').value='legal';$('#subject-search').dispatchEvent(new w.Event('input'));assert.equal($$('[data-subject]').filter(x=>!x.hidden).length,1);$('#cancel-setup').click();assert.equal($('#study').hidden,false);w.close();
w=load(saved,true);assert.equal($('#task-subject').textContent,last);assert($$('#resource-links a').length>=2);w.close();assert.deepEqual(errors,[]);
console.log('PASS: all 48 subjects display correct websites on tasks and in the picker; browsing preserves progress; saved state, session limits, search and standalone work.');
