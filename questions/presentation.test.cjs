const {JSDOM,VirtualConsole}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),bank=JSON.parse(fs.readFileSync(root+'/question-bank.json'));
const domains=[JSON.parse(fs.readFileSync(root+'/content-bank.json')),JSON.parse(fs.readFileSync(root+'/unit3/bank.json'))];
const subjects=new Map(domains.flatMap(b=>b.subjects).map(s=>[s.subject||s.id,s]));
for(const q of bank.questions){
 if(['Mathematics','Sciences'].includes(subjects.get(q.subject)?.area))assert(q.working?.length>=2,q.id+' needs labelled working');
 if(q.partMarks){assert.equal(q.partMarks.reduce((n,m)=>n+m,0),q.marks);q.partMarks.forEach((m,i)=>assert(q.question.includes('('+String.fromCharCode(97+i)+') ')));}
 if(q.working)for(const step of q.working){assert(step.heading);assert(step.lines.length);assert(step.lines.every(s=>typeof s==='string'&&s.length&&!s.includes('\n')));}
}
const known={
'maths_general-regression-v0':['ŷ = 23','Residual = 2'],'maths_general-regression-v1':['ŷ = 28','Residual = 2'],'maths_general-regression-v2':['ŷ = 27','Residual = -3'],
'maths_general-sequence-v0':['231.53'],'maths_general-sequence-v1':['405.00'],'maths_general-sequence-v2':['175.69'],
'maths_methods-ci':['0.5520','0.6480'],'physics-magnetic':['0.012 N','0 N'],'physics-circular':['8.0 m s⁻²','4.0 N'],'chemistry-redox':['+1.10 V'],'chemistry-equilibrium':['Kc = 16'],
'biology-quadrat':['1,000 plants'],'biology-energy':['12.5%'],'marine_science-fish':['400 fish'],'earth_science-water':['−2 GL','9 GL'],'psychology-memory':['7.5 words','10 words','2.5 words'],
'geography-cover':['150 km²','−15 percentage points','25%'],'geography-population':['203,000 people']};
for(const [id,values] of Object.entries(known)){const text=bank.questions.find(q=>q.id===id).working.flatMap(s=>s.lines).join('\n');for(const expected of values)assert(text.includes(expected),id+': '+expected);}
let rendered=0;
for(const mode of ['unit3','ea']){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM('<!doctype html><head></head><body><div id="entry"></div></body>',{url:'https://practice.example/',runScripts:'outside-only',virtualConsole:vc}),w=dom.window,d=w.document;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 let course=null;w.PRACTICE_QUESTIONS={...bank,questions:[]};w.QuestionHost={mode,anchors:['entry'],courses:()=>course?[course]:[]};w.eval(fs.readFileSync(root+'/question-practice.js','utf8'));
 const open=d.querySelector('.qp-open'),dialog=d.querySelector('dialog');
 for(const q of bank.questions.filter(q=>q.scopes[mode])){
  const scope=q.scopes[mode];course={route:scope.route,name:subjects.get(q.subject).name,area:subjects.get(q.subject).area,topics:scope.topics,context:'Class focus'};w.PRACTICE_QUESTIONS.questions=[q];w.QuestionPractice.refreshButtons();open.click();
  const prompt=dialog.querySelector('.qp-prompt');assert.equal(prompt.textContent,q.question);assert.equal(w.getComputedStyle(prompt).whiteSpace,'pre-line');
  const answer=d.getElementById('qp-answer');assert(answer.hidden);dialog.querySelector('[aria-controls=qp-answer]').click();assert(!answer.hidden);
  if(q.working){const steps=answer.querySelectorAll('.qp-working>li'),lines=answer.querySelectorAll('.qp-working-line');assert.equal(steps.length,q.working.length);assert.equal(lines.length,q.working.reduce((n,s)=>n+s.lines.length,0));assert.equal(w.getComputedStyle(lines[0]).display,'block');}
  if(q.practiceType)assert(dialog.textContent.includes(q.practiceType));dialog.querySelector('.qp-top button').click();rendered++;
 }
 assert.deepEqual(errors,[]);w.close();
}
const legal=bank.questions.find(q=>q.id==='legal-review');assert(legal.question.includes('two viewpoints and their consequences'));assert(legal.question.includes('two legal alternatives'));assert(legal.question.includes('recommendation using legal criteria'));assert(legal.stimulus.includes('Source 3'));assert(legal.practiceType);
console.log(`PASS: ${rendered} mode-specific questions: question line breaks, separate worked lines, labelled steps, hidden answers and part marks; quantitative working fixtures and direct Legal prompt.`);
