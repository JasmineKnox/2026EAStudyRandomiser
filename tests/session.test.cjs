const assert=require('node:assert/strict'),E=require('../engine.js'),bank=require('../content-bank.json');
for(let n=1;n<=3;n++)for(let time=n*5;time<=180;time++){
 const ids=['english','maths_methods','legal'].slice(0,n),plan=E.sessionPlan(time,ids);
 assert.equal(plan.reduce((a,b)=>a+b.minutes,0),time);assert(plan.every(b=>b.minutes>=5&&b.minutes<=20));assert(ids.every(id=>plan.some(b=>b.subject===id)));
}
for(const [minutes,subjects] of [[4,['legal']],[181,['legal']],[10,['legal','english','maths_methods']],[30,[]],[30,['legal','english','maths_methods','biology']]])assert.throws(()=>E.sessionPlan(minutes,subjects));
assert.deepEqual(E.sessionPlan(30,['english','maths_methods','legal']).map(x=>x.minutes),[10,10,10]);
for(const s of bank.subjects)for(const mode of ['easy','medium','hard']){
 const options={[s.id]:s.option?.text?'Environmental policy':s.option?.values?.[0]},t=E.eligible(s,options)[0];
 for(const method of E.METHODS[t.kind])for(const minutes of [5,10,20]){
  const task=E.sessionTask(s,t,method,options,minutes,mode);assert.equal(task.minutes,minutes);assert.equal(task.mode,mode);assert(task.steps.every(x=>x&&!/undefined|\{option\}|Spend \d+ minutes|for 12 minutes|one precise choices/.test(x)));assert(task.checkSteps.length>=1);assert(task.helpSteps.length>=1);
  if(mode==='easy')assert(task.steps.some(x=>x.includes('three key words')));
  if(mode==='hard')assert(task.steps.some(x=>/Justify|justify/.test(x)));
 }
}
const prompts=E.splitInstructions('1. Explain the law. 2. Apply it. 3. Evaluate the result.');assert.deepEqual(prompts,['Explain the law.','Apply it.','Evaluate the result.']);
console.log('PASS: exact session durations, complete subject coverage, block sizes, invalid sessions, all subject/mode strategies, timing directions and dot-point prompts.');

// Every topic uses its actual title in easy scaffolding and checking, including selected texts.
for(const s of bank.subjects)for(const t of s.topics){
 const options={[s.id]:t.option||(s.option?.text?'Environmental policy':s.option?.values?.[0])};
 const task=E.sessionTask(s,t,E.METHODS[t.kind][0],options,20,'easy');
 assert(task.steps[0].includes(task.title));assert(task.help.includes(t.focus[0]));assert(task.check.includes(task.title));
 assert(!/named topic|first focus point|this exact topic|your selected text|in the target language/.test([...task.steps,task.help,task.check,task.materials].join(' ')));
}
const english=bank.subjects.find(s=>s.id==='english'),structure=english.topics.find(t=>t.title==='Structure and development in {option}');
assert(structure);const othello=E.sessionTask(english,structure,'evidence',{english:'Othello'},20,'easy');
assert(othello.steps[0].includes('“Structure and development in Othello”'));assert(othello.materials.includes('Othello'));
console.log('PASS: specific topic names, focus points, selected text and Othello scaffolding across the entire bank.');
