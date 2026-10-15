// Behaviour checks without a browser: a minimal DOM double exercises rendering/events.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(root+'/question-bank.json'));
const ui=fs.readFileSync(root+'/question-practice.js','utf8');
const u=JSON.parse(fs.readFileSync(root+(fs.existsSync(root+'/unit3-game')?'/unit3-game':'/unit3')+'/bank.json'));
const ea=JSON.parse(fs.readFileSync(root+(fs.existsSync(root+'/ea-maintenance')?'/ea-maintenance':'')+'/content-bank.json'));
const pure={};vm.runInNewContext(ui,pure);const eligible=pure.QuestionPractice.eligible;
assert.equal(data.questions.length,new Set(data.questions.map(q=>q.id)).size);
for(const q of data.questions){
 assert.equal(q.marks,q.points.reduce((n,p)=>n+p.marks,0));assert(q.answer.length);if(q.partMarks)assert.equal(q.marks,q.partMarks.reduce((a,b)=>a+b,0));if(q.answerLayout==='steps')assert(q.working?.length>=2,q.id+' missing steps');assert(q.sources.every(s=>s.url.startsWith('https://')));
 for(const [mode,s] of Object.entries(q.scopes)){
  const course=(mode==='unit3'?u:ea).subjects.find(x=>x.id===s.route);assert(course,q.id+' missing route');
  const topics=course.topics.map(t=>typeof t==='string'?t:t.title);assert(s.topics.every(t=>topics.includes(t)),q.id+' missing topic');
  assert.equal(eligible([q],mode,{route:s.route,topics:s.topics}).length,1);
  assert.equal(eligible([q],mode,{route:s.route,topics:[]}).length,0);
  assert.equal(eligible([q],mode,{route:'wrong',topics:s.topics}).length,0);
  assert.equal(eligible([q],mode,{route:s.route,topics:s.topics},'not-selected').length,0);
  assert.equal(eligible([q],mode,{route:s.route,topics:s.topics},'',q.difficulty).length,1);
  assert.equal(eligible([q],mode,{route:s.route,topics:s.topics},'',q.difficulty==='easy'?'hard':'easy').length,0);
 }
}
assert(eligible(data.questions,'unit3',{route:'legal',topics:u.subjects.find(s=>s.id==='legal').topics}).every(q=>!q.id.includes('treaty')));
assert(eligible(data.questions,'unit3',{route:'french-ia2',topics:u.subjects.find(s=>s.id==='french-ia2').topics}).length>=25);
assert(eligible(data.questions,'ea',{route:'literature',topics:ea.subjects.find(s=>s.id==='literature').topics.map(t=>t.title)}).length>=25);
let doc;
class Node{
 constructor(tag,text=''){this.tag=tag;this.children=[];this.events={};this.attrs={};this._text=text;this._value='';this.hidden=false;this.style={setProperty(){}};}
 set textContent(t){this._text=String(t);this.children=[];}get textContent(){return this._text+this.children.map(c=>c.textContent).join(' ');}
 append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=[];this._text='';this._value='';this.append(...nodes);if(this.tag==='select'&&nodes.length)this._value=nodes[0].value;}
 add(n){if(!this.children.length)this._value=n.value;this.append(n);}set value(v){this._value=v;}get value(){return this._value;}
 setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,f){(this.events[k]||=[]).push(f);}fire(k){for(const f of this.events[k]||[])f({target:this});}focus(){doc.activeElement=this;}showModal(){this.open=true;}close(){this.open=false;this.fire('close');}
}
const walk=n=>[n,...n.children.flatMap(walk)];let renders=0;
for(const q of data.questions)for(const [mode,scope] of Object.entries(q.scopes)){
 const anchor=new Node('div'),focus=new Node('button');doc={head:new Node('head'),body:new Node('body'),activeElement:focus,createElement:t=>new Node(t),getElementById:()=>anchor};
 const course={route:scope.route,name:'Test subject',topics:scope.topics,area:'Sciences',context:'Chosen focus'};
 const ctx={document:doc,PRACTICE_QUESTIONS:{...data,questions:[q]},QuestionHost:{mode,anchors:['start'],courses:()=>[course],current:()=>scope.route},Option:function(t,v){const n=new Node('option',t);n.value=v;return n;},print:()=>{}};
 vm.runInNewContext(ui,ctx);anchor.children[0].fire('click');const dialog=doc.body.children[0];assert(dialog.open);
 let nodes=walk(dialog),answer=nodes.find(n=>n.id==='qp-answer'),reveal=nodes.find(n=>n.attrs['aria-controls']==='qp-answer');assert(answer.hidden);assert.equal(reveal.attrs['aria-expanded'],'false');
 assert(dialog.textContent.includes(q.question));assert(!dialog.textContent.includes('{option}'));assert.equal(nodes.filter(n=>n.tag==='td').length,q.table?q.table.rows.flat().length:0);
 reveal.fire('click');assert(!answer.hidden);assert.equal(reveal.attrs['aria-expanded'],'true');const expected=q.working?q.working.flatMap(step=>[step.heading,...step.lines]):q.answer;assert(expected.every(a=>answer.textContent.includes(a)));if(q.working)assert.equal(walk(answer).filter(n=>n.className==='qp-working-line').length,q.working.reduce((n,step)=>n+step.lines.length,0));
 const checks=walk(answer).filter(n=>n.tag==='input');assert.equal(checks.length,q.points.length);for(const check of checks){check.checked=true;check.fire('change');}
 assert(answer.textContent.includes(`Self-check: ${q.marks} / ${q.marks}`));checks[0].checked=false;checks[0].fire('change');assert(answer.textContent.includes(`Self-check: ${q.marks-q.points[0].marks} / ${q.marks}`));
 reveal.fire('click');assert(answer.hidden);dialog.close();assert.equal(doc.activeElement,focus);
 // Unmatched difficulty produces a recoverable empty state, never an undefined question.
 const selects=walk(dialog).filter(n=>n.tag==='select');selects[2].value=q.difficulty==='easy'?'hard':'easy';selects[2].fire('change');assert(walk(dialog).some(n=>n.tag==='button'&&n.disabled&&/question/.test(n.textContent)));assert(dialog.textContent.includes('No question is available'));
 renders++;
}
// Standalone exports embed all question assets and have valid JavaScript.
for(const p of [(fs.existsSync(root+'/unit3-game')?root+'/unit3-game':root+'/unit3')+'/index.html',(fs.existsSync(root+'/ea-maintenance')?root+'/ea-maintenance':root)+'/EA_Study_Randomiser.html']){
 const html=fs.readFileSync(p,'utf8');assert(html.includes('window.PRACTICE_QUESTIONS'));assert(html.includes('window.QuestionHost'));assert(!html.includes('__QUESTION_'));
 for(const [i,m] of [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].entries())new vm.Script(m[1],{filename:p+'#'+i});
}
console.log(`${data.questions.length} bank records validated; ${renders} mode-specific render/reveal/self-check/empty-filter tests passed. Both standalone exports parse.`);
