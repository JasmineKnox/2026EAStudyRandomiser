const assert=require('node:assert/strict');
const bank=require('../content-bank.json');
const E=require('../engine.js');
const state=()=>({selected:bank.subjects.map(s=>s.id),options:Object.fromEntries(bank.subjects.filter(s=>s.option).map(s=>[s.id,s.option.text?'Environmental policy':s.option.values[0]])),history:[],queue:[]});
assert.equal(bank.subjects.length,48);
assert.equal(new Set(bank.subjects.map(s=>s.id)).size,48);
assert.equal(bank.subjects.reduce((n,s)=>n+s.topics.length,0),426);
for(const s of bank.subjects){
 assert(s.syllabus.startsWith('https://www.qcaa.qld.edu.au/'));
 assert(s.topics.length>=5);
 for(const t of s.topics){
  assert.equal(t.focus.length,3);
  for(const m of E.METHODS[t.kind]){
   const task=E.makeTask(s,t,m,{[s.id]:t.option||s.option?.values?.[0]||'Environmental policy'});
   assert(task.steps.length>=3);assert(task.steps.every(x=>typeof x==='string'&&!/undefined|\{option\}/.test(x)));assert(task.check&&task.help);
  }
 }
}
let s=state();s.active=['legal','chemistry','english'];const visits=Array.from({length:3},()=>E.next(bank,s).subject);assert.equal(new Set(visits).size,3);
const last=visits.at(-1);assert.notEqual(E.next(bank,s).subject,last);
s=state();s.selected=['legal'];
const legal=Array.from({length:100},()=>E.next(bank,s));assert(legal.every(x=>x.subject==='legal'));
for(let i=1;i<legal.length;i++){assert.notEqual(legal[i].topic,legal[i-1].topic);assert.notEqual(legal[i].method,legal[i-1].method);}
assert(bank.subjects.find(s=>s.id==='legal').topics.every(t=>['4.1','4.3'].includes(t.unit)));
for(const [id,allowed] of [['business',['4.2']],['accounting',['4.2','4.3']],['economics',['4.1','4.3']],['geography',['4.2']]])assert(bank.subjects.find(s=>s.id===id).topics.every(t=>allowed.includes(t.unit)));
s=state();s.selected=['modern_history'];s.options.modern_history='Mass migrations since 1848';
assert(Array.from({length:80},()=>E.next(bank,s)).every(t=>!/Cold War/.test(t.title)));
s.options.modern_history='Cold War and its aftermath, 1945–2014';
assert(Array.from({length:80},()=>E.next(bank,s)).every(t=>!/mass migration/i.test(t.title)));
s=state();s.selected=['english'];s.options.english='The Dry';
assert(Array.from({length:20},()=>E.next(bank,s)).every(t=>t.title.includes('The Dry')));
const quick=E.next(bank,s,{quick:true});assert.equal(quick.minutes,5);
assert.throws(()=>E.next(bank,{selected:[],options:{}}));
const a={selected:['legal','chemistry'],options:{},queue:[],history:[]};E.next(bank,a);a.selected=['chemistry'];assert.equal(E.next(bank,a).subject,'chemistry');
console.log('PASS: all task combinations, subject rotation, repeats, selection filters, EA boundaries and quick tasks.');

// Saved subjects can exceed three, but the active study session cannot.
const saved=['legal','chemistry','english','modern_history'];
for(const active of [['legal'],['legal','chemistry'],['legal','chemistry','english']]){
 const session={selected:saved,active,options:{english:'The Dry'},queue:[],history:[]};
 const cycle=Array.from({length:active.length},()=>E.next(bank,session).subject);
 assert.deepEqual([...cycle].sort(),[...active].sort());
 assert(Array.from({length:30},()=>E.next(bank,session)).every(t=>active.includes(t.subject)));
}
const session={selected:saved,active:['legal','chemistry','english'],options:{english:'The Dry'},queue:['chemistry','english'],history:[]};
session.active=['legal'];assert.equal(E.next(bank,session).subject,'legal');
session.active=[];assert.throws(()=>E.next(bank,session));
session.active=['legal','chemistry','english','modern_history','legal','unknown'];
assert.deepEqual(E.activeSubjects(session),['legal','chemistry','english']);
assert.deepEqual(E.activeSubjects({selected:saved}),['legal','chemistry','english']);
session.selected=['chemistry'];assert.deepEqual(E.activeSubjects(session),['chemistry']);
assert.throws(()=>E.next(bank,session,{subjectId:'legal'}));
console.log('PASS: one-, two- and three-subject sessions, rotation, exclusions, switching, empty selection and selection limit.');
