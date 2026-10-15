const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');const bank=JSON.parse(fs.readFileSync(root+'/question-bank.json'));
let topics=0,routes=0,minimum=Infinity;const byId=new Map(bank.questions.map(q=>[q.id,q]));assert.equal(byId.size,bank.questions.length);
for(const [mode,file] of [['ea','content-bank.json'],['unit3','unit3/bank.json']]){
 const subjects=JSON.parse(fs.readFileSync(root+'/'+file)).subjects;
 for(const s of subjects){
  routes++;const qs=bank.questions.filter(q=>q.scopes[mode]?.route===s.id);minimum=Math.min(minimum,qs.length);assert(qs.length>=25,mode+'/'+s.id+' has fewer than 25');
  const fingerprints=qs.map(q=>JSON.stringify([q.question,q.stimulus,q.table]));assert.equal(new Set(fingerprints).size,qs.length,mode+'/'+s.id+' repeats a question and stimulus');
  for(const t of s.topics){const title=typeof t==='string'?t:t.title;topics++;assert(qs.filter(q=>q.scopes[mode].topics.includes(title)).length>=3,mode+'/'+s.id+'/'+title+' needs three questions');}
 }
}
let fixtures=0;
function includes(id,term){const q=byId.get(id);assert(q,id);assert((q.answer.join(' ')+' '+JSON.stringify(q.working||[])).includes(term),id+': missing '+term);fixtures++;}
// Fixed expected results independent of the construction expressions.
includes('maths_general-expanded-regression-0','13');includes('maths_general-expanded-arithmetic-0','156');includes('maths_general-expanded-arithmetic-0','1024');
includes('maths_methods-expanded-discrete-0','0.4100');includes('maths_methods-expanded-discrete-4','0.4900');
includes('maths_specialist-expanded-projection-0','1.6');includes('accounting-expanded-u-straight-0','4,000');includes('accounting-expanded-e-margin-4','12.86');
includes('aerospace_sys-expanded-maintenance-4','below');includes('economics-expanded-e-unemployment-0','10.00');
includes('maths_general-expanded-ea-coverage-6-0','12,000');includes('maths_general-expanded-ea-coverage-6-1','2,723.25');
includes('maths_methods-expanded-ea-coverage-6-1','1 square unit');includes('maths_specialist-expanded-ea-coverage-8-0','8π/3');
// Recompute every new means/percentage investigation from table values.
let datasets=0;
for(const q of bank.questions.filter(q=>q.id.includes('-expanded-')&&q.id.endsWith('-means'))){
 const r=q.table.rows,a=r.reduce((n,row)=>n+row[1],0)/r.length,b=r.reduce((n,row)=>n+row[2],0)/r.length;
 assert(q.answer.join(' ').includes(String(a)));assert(q.answer.join(' ').includes(String(b)));datasets++;
 const id=q.id.replace(/-means$/,'-percentage'),p=byId.get(id);assert(p);
 if(p.question.startsWith('Calculate the percentage'))assert(p.answer.join(' ').includes(((b-a)/a*100).toFixed(1)),id);
 else assert(p.question.includes('difference'),id);
}
console.log(`PASS: ${bank.questions.length} unique records; ${routes} routes have >=25 (minimum ${minimum}); all ${topics} mapped topics have >=3; no duplicate question/stimulus within routes; ${fixtures} fixed-answer fixtures and ${datasets} recomputed datasets.`);
