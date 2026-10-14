const fs=require('fs'),assert=require('assert'),vm=require('vm');
const bank=JSON.parse(fs.readFileSync(__dirname+'/bank.json')),E=require('./tasks.js').Unit3Engine;
let count=0;const exercised=new Set();
for(const s of bank.subjects){
 assert(s.syllabus.startsWith('https://www.qcaa.qld.edu.au/'));assert(s.resources.length>0);assert(new Set(s.topics).size===s.topics.length);
 for(const topic of s.topics)for(const difficulty of ['easy','medium','hard'])for(let i=0;i<E.methods[s.kind].length;i++){
 const t=E.task(s,topic,'Class focus',10,difficulty,()=>((i+.1)/E.methods[s.kind].length));
 assert(t.intro.includes(topic),s.id+' '+t.method);assert(t.steps.length>=2);assert(!JSON.stringify(t).includes('undefined'));assert(!JSON.stringify(t).includes('{option}'));assert(t.checks.length===3);exercised.add(t.method);count++;
 }
}
for(const mins of [5,10,20,30,45,60,90,180])for(let n=1;n<=3;n++){
 if(mins<n*5){assert.throws(()=>E.plan(mins,['a','b','c'].slice(0,n)));continue;}
 const p=E.plan(mins,['a','b','c'].slice(0,n));assert.equal(p.reduce((a,x)=>a+x.minutes,0),mins);assert.equal(new Set(p.map(x=>x.subject)).size,n);assert(p.every(b=>b.minutes>=5));
}
assert.throws(()=>E.plan(30,[]));assert.throws(()=>E.plan(30,['a','a']));assert.throws(()=>E.plan(30,['a','b','c','d']));assert.throws(()=>E.plan(NaN,['a']));
const allCourses=[...new Set(bank.subjects.map(s=>s.subject))];
const savedCourses=E.limitSelections(bank,[...allCourses,...allCourses,'unknown']);
assert.equal(savedCourses.length,11);
for(const [group,limit] of Object.entries(E.LIMITS))assert.equal(savedCourses.filter(id=>E.group(bank.subjects.find(s=>s.subject===id))===group).length,limit);
assert.equal(E.limitSelections(bank,['legal','economics','business','accounting','biology','chemistry']).length,6);
assert.deepEqual(E.activeSubjects(savedCourses,[savedCourses[0],savedCourses[0],'unknown',...savedCourses]),savedCourses.slice(0,3));
assert.deepEqual(E.activeSubjects(['legal','economics'],['biology','economics']),['economics']);
assert.deepEqual(E.activeSubjects(['legal'],null),[]);
for(const area of [...new Set(bank.subjects.map(s=>s.area))])assert.equal(new Set(bank.subjects.filter(s=>s.area===area).map(E.subjectColour)).size,1);
assert.equal(E.subjectColour({area:'Mathematics'}),'blue');assert.equal(E.subjectColour({area:'Sciences'}),'gold');assert.equal(E.subjectColour({area:'Humanities and Social Sciences'}),'coral');
const lit=bank.literatureTexts;
assert.equal(lit.texts.length,102);assert.equal(new Set(lit.texts.map(t=>t.id)).size,102);assert(lit.texts.every(t=>t.title&&t.author));
assert(E.literatureOptions(lit,2027,'woolf').some(t=>t.title==='Mrs Dalloway'));
assert(E.literatureOptions(lit,2027,'poetry').some(t=>t.author==='Maya Angelou'));
assert(!E.literatureOptions(lit,2026,'Pride and Prejudice').length);assert(E.literatureOptions(lit,2027,'Pride and Prejudice').length);
assert(!E.literatureOptions(lit,2027,'The Winter Road').length);assert(E.literatureOptions(lit,2028,'The Winter Road').length);
assert(E.literatureOptions(lit,2026,'Hamlet').length);assert(E.literatureOptions(lit,2029,'Hamlet').length);
assert.equal(E.literatureContext({title:'Mrs Dalloway',author:'Virginia Woolf'},'identity'),'Mrs Dalloway — Virginia Woolf. Class focus: identity');
const literature=bank.subjects.find(s=>s.subject==='literature'),essential=bank.subjects.find(s=>s.subject==='essential_english'),eal=bank.subjects.find(s=>s.subject==='english_add_lang');
assert(E.courseProblem(literature,{topics:['x'],context:''}));assert(!E.courseProblem(literature,{topics:['x'],litText:'lit-12',context:'Mrs Dalloway — Virginia Woolf'}));
assert(E.courseProblem(essential,{topics:['x'],context:'  '}));assert(!E.courseProblem(essential,{topics:['x'],context:bank.ciaTopics.options[0].context}));
assert(E.courseProblem(eal,{topics:['x'],context:''}));assert(!E.courseProblem(eal,{topics:['x'],context:'Selected class text'}));
assert(bank.ciaTopics.options.every(t=>t.label.startsWith('2026')));
assert.equal(new Set(bank.subjects.map(s=>s.subject)).size,37);assert.equal(bank.subjects.length,46);
for(const id of ['maths_general','maths_methods','maths_specialist'])assert.equal(bank.subjects.find(s=>s.subject===id).topics.length,5);
assert(bank.subjects.filter(s=>s.kind==='science').every(s=>E.methods[s.kind].every(m=>m.startsWith('data-'))));
assert(!bank.subjects.some(s=>s.subject==='english'||s.subject==='pe'||s.subject==='design'));
const html=fs.readFileSync(__dirname+'/index.html','utf8'),app=fs.readFileSync(__dirname+'/app.js','utf8');
assert(!html.includes('__BANK__')&&!html.includes('__APP__')&&!html.includes('__ENGINE__'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
// Check only real template markup; scripts contain escaped dynamic attributes.
const template=fs.readFileSync(__dirname+'/template.html','utf8').split('<script>')[0];
const templateIds=[...template.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(templateIds).size,templateIds.length);
for(const [,id] of app.matchAll(/\$\('([a-z][a-z-]*)'\)/g))assert(templateIds.includes(id),'Missing UI element: '+id);
let scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);assert.equal(scripts.length,3);scripts.forEach((s,i)=>new vm.Script(s,{filename:'inline-'+i+'.js'}));
const contrastPairs=[['#2F4841','#FFFFFF'],['#202322','#EB967E'],['#202322','#E8BC55'],['#202322','#87B5D6'],['#202322','#B6A0D5'],['#963F2C','#FBE9E3'],['#775600','#FBF2D8'],['#634A88','#F0EAF8'],['#315F83','#E8F2F9'],['#202322','#FAFAF7']];
const lum=h=>h.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((n,c,i)=>n+c*[.2126,.7152,.0722][i],0);
for(const [a,b] of contrastPairs){const l=[lum(a),lum(b)].sort((a,b)=>b-a);assert((l[0]+.05)/(l[1]+.05)>=4.5);}
console.log(`${count} task combinations; ${exercised.size} methods; exam coverage, timing, rotation, inline scripts, UI element references and text contrast checks passed.`);
