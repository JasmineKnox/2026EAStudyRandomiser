// Run after installing jsdom in a test environment. This does not launch a browser.
const {JSDOM,VirtualConsole}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
for(const mode of ['unit3','ea']){
 const key=mode==='unit3'?'mrs-knox-unit3-study-v1':'mrs-knox-ea-study-2026-v1';const errors=[];
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const html=fs.readFileSync(path.join(root,mode==='unit3'?'unit3/index.html':'EA_Study_Randomiser.html'),'utf8');
 const dom=new JSDOM(html,{url:'https://study.example/',runScripts:'outside-only',virtualConsole:vc}),w=dom.window,d=w.document;
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 const saved=mode==='unit3'?{selected:['legal'],active:['legal'],config:{},completed:7}:{selected:['legal'],active:['legal'],options:{},completed:7};
 w.localStorage.setItem(key,JSON.stringify(saved));for(const script of d.querySelectorAll('script'))w.eval(script.textContent);
 const before=w.localStorage.getItem(key);const open=d.querySelector('.qp-open');assert(open);open.focus();open.click();const dialog=d.querySelector('.qp-dialog');assert(dialog.open);
 const selects=dialog.querySelectorAll('select');assert.equal(selects[0].value,'legal');
 let answer=d.getElementById('qp-answer'),reveal=dialog.querySelector('[aria-controls=qp-answer]');assert(answer.hidden);reveal.click();assert(!answer.hidden);
 const points=answer.querySelectorAll('input[type=checkbox]');assert(points.length);points[0].click();assert(/Self-check: [1-9]/.test(answer.querySelector('.qp-score').textContent));
 assert.equal(w.localStorage.getItem(key),before,'Question work must not change planner progress');
 const original=dialog.querySelector('h3').textContent;dialog.querySelector('.qp-actions button').click();assert.notEqual(dialog.querySelector('h3').textContent,original);assert(d.getElementById('qp-answer').hidden);
 selects[1].add(new w.Option('Unmatched topic','unmatched-topic'));selects[1].value='unmatched-topic';selects[1].dispatchEvent(new w.Event('change'));assert(dialog.querySelector('.qp-actions button').disabled);assert(dialog.textContent.includes('No question is available'));
 selects[1].value='';selects[1].dispatchEvent(new w.Event('change'));assert(!dialog.querySelector('.qp-actions button').disabled);
 dialog.querySelector('.qp-top button').click();assert(!dialog.open);assert.equal(d.activeElement,open);assert.deepEqual(errors,[]);w.close();
}
console.log('PASS: both full game exports initialise, use saved courses, open/reveal/self-check/swap/filter/close and preserve planner progress in jsdom.');
