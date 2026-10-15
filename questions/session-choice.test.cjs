const {JSDOM,VirtualConsole}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
for(const mode of ['unit3','ea']){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,mode==='unit3'?'unit3/index.html':'EA_Study_Randomiser.html'),'utf8'),{url:'https://study.example/',runScripts:'outside-only',virtualConsole:vc}),w=dom.window,d=w.document;
 w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 const key=mode==='unit3'?'mrs-knox-unit3-study-v1':'mrs-knox-ea-study-2026-v1';
 const saved={selected:['legal','economics','biology'],active:['legal'],completed:7,...(mode==='unit3'?{config:{}}:{options:{}})};
 w.localStorage.setItem(key,JSON.stringify(saved));for(const script of d.querySelectorAll('script'))w.eval(script.textContent);
 const choice=d.getElementById('session-start-options'),buttons=choice.querySelectorAll('button');assert.equal(buttons.length,2);assert.equal(buttons[0].textContent,'Give me a task');assert.equal(buttons[1].textContent,'Give me a practice question');
 const snapshot=w.localStorage.getItem(key);buttons[1].click();let dialog=d.querySelector('.qp-dialog');assert(dialog.open);assert.equal(dialog.querySelector('select').options.length,1);assert.equal(dialog.querySelector('select').value,'legal');assert(d.getElementById('qp-answer').hidden);assert.equal(w.localStorage.getItem(key),snapshot);dialog.querySelector('.qp-top button').click();assert(!dialog.open);assert(!d.getElementById('session-config').hidden);
 function toggle(id){const q=mode==='unit3'?`[data-active="${id}"]`:`#session-subjects input[value="${id}"]`;const checkbox=d.querySelector(q);assert(checkbox);checkbox.checked=!checkbox.checked;checkbox.dispatchEvent(new w.Event('change'));}
 toggle('legal');assert(buttons[0].disabled);assert(buttons[1].disabled);toggle('economics');assert(!buttons[0].disabled);assert(!buttons[1].disabled);buttons[1].click();assert.equal(dialog.querySelector('select').options.length,1);assert.equal(dialog.querySelector('select').value,'economics');assert(dialog.querySelector('.qp-banner').textContent.includes('Economics'));dialog.querySelector('.qp-top button').click();
 buttons[0].click();assert(d.getElementById('session-config').hidden);assert(d.getElementById('task-subject').textContent.includes('Economics'));const task=d.getElementById(mode==='unit3'?'task-card':'task');assert(!task.hidden);assert.equal(JSON.parse(w.localStorage.getItem(key)).completed,7);
 task.querySelector('.qp-open').click();assert.equal(dialog.querySelector('select').value,'economics');dialog.querySelector('.qp-top button').click();assert(!task.hidden);assert.equal(JSON.parse(w.localStorage.getItem(key)).completed,7);assert.deepEqual(errors,[]);w.close();
}
console.log('PASS: both session screens offer task/question choices; active subjects, disabled empty selection, answer reveal, return navigation, task generation and saved progress work.');
