(function(){
'use strict';
const bank=window.STUDY_BANK,E=window.StudyEngine,by=id=>document.getElementById(id),KEY='mrs-knox-ea-study-2026-v1';
let state={selected:[],options:{},active:[],queue:[],history:[],completed:0,current:null,session:null,duration:30,mode:'medium'},tick=null,endAt=null,remaining=0,setupStep=0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{by('storage-note').hidden=false;}}
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&Array.isArray(saved.selected)){state={...state,...saved};state.selected=[...new Set(state.selected.filter(id=>bank.subjects.some(s=>s.id===id)))];state.options=state.options&&typeof state.options==='object'?state.options:{};state.queue=Array.isArray(state.queue)?state.queue:[];state.history=Array.isArray(state.history)?state.history.filter(x=>x&&typeof x.subject==='string'):[];state.completed=Number.isFinite(state.completed)?state.completed:0;}}
catch{by('storage-note').hidden=false;}
state.active=Array.isArray(state.active)?E.activeSubjects(state):state.selected.slice(0,3);
state.duration=Number.isInteger(state.duration)&&state.duration>=5&&state.duration<=180?state.duration:30;
state.mode=E.MODES[state.mode]?state.mode:'medium';
function validSetup(){return state.selected.length&&state.selected.every(id=>{const s=bank.subjects.find(s=>s.id===id);if(!s.option)return true;if(s.option.text)return Boolean(String(state.options[id]||'').trim());return s.option.values.includes(state.options[id]);});}
if(state.session){
 const x=state.session;
 try{const plan=E.sessionPlan(x.duration,state.active);if(!E.MODES[x.mode]||JSON.stringify(plan)!==JSON.stringify(x.blocks)||!Number.isInteger(x.index)||x.index<0||x.index>plan.length)throw Error();
 if(x.index<plan.length){const c=state.current,s=c&&bank.subjects.find(s=>s.id===c.subject),t=s&&E.eligible(s,state.options).find(t=>t.id===c.topic);if(!t||c.subject!==plan[x.index].subject||!E.METHODS[t.kind].includes(c.method))throw Error();state.current=E.sessionTask(s,t,c.method,state.options,plan[x.index].minutes,c.mode||x.mode);}
 else state.current=null;
 }catch{state.session=null;state.current=null;}
}else state.current=null;
const groupOf=s=>s.area==='English'?'English':s.area==='Mathematics'?'Maths':'Electives';
const groups=['English','Maths','Electives'];
function setup(){
 by('setup').hidden=false;by('study').hidden=true;by('cancel-setup').hidden=!validSetup();by('subject-search').value='';by('setup-error').textContent='';setupStep=0;
 by('subject-list').replaceChildren();
 groups.forEach((area,index)=>{const field=document.createElement('fieldset'),legend=document.createElement('legend');field.dataset.step=index;legend.textContent='Select your '+(area==='Electives'?'electives':area);field.append(legend);
 const hint=document.createElement('p');hint.className='selection-hint';hint.textContent=area==='English'?'Choose your English course and any extension you study.':area==='Maths'?'Choose your maths course. You can select Specialist as well as Methods.':'Choose your remaining subjects. You can save all your courses and select up to three for a session.';field.append(hint);
 bank.subjects.filter(s=>groupOf(s)===area).forEach(s=>{const wrap=document.createElement('div');wrap.dataset.subject=s.name.toLowerCase();const label=document.createElement('label');label.className='subject-label';const box=document.createElement('input');box.type='checkbox';box.name='subject';box.value=s.id;box.checked=state.selected.includes(s.id);const title=document.createElement('span');title.textContent=s.name;label.append(box,title);wrap.append(label);
 if(area==='Electives'){const category=document.createElement('small');category.className='subject-area';category.textContent=s.area;title.append(category);}
 if(s.option){const opt=document.createElement('div');opt.className='subject-options';opt.hidden=!box.checked;const l=document.createElement('label');l.htmlFor='option-'+s.id;l.textContent=s.option.label;const input=document.createElement(s.option.text?'input':'select');input.id=l.htmlFor;input.dataset.option=s.id;
 if(s.option.text){input.type='text';input.maxLength=150;input.placeholder='e.g. renewable energy in Germany';input.value=state.options[s.id]||'';}
 else{input.append(new Option('Select the option your school chose',''));s.option.values.forEach(v=>input.append(new Option(v,v)));input.value=state.options[s.id]||'';}
 opt.append(l,input);wrap.append(opt);box.addEventListener('change',()=>opt.hidden=!box.checked);}
 field.append(wrap);});by('subject-list').append(field);});
 showSetupStep();
}
function filterSetup(){const q=by('subject-search').value.toLowerCase();by('subject-list').querySelectorAll('[data-subject]').forEach(el=>el.hidden=!el.dataset.subject.includes(q));}
function showSetupStep(){by('subject-search-controls').hidden=setupStep!==2;by('subject-list').querySelectorAll('fieldset').forEach((el,i)=>el.hidden=i!==setupStep);by('setup-progress').textContent='Step '+(setupStep+1)+' of 3 · '+groups[setupStep];by('setup-back').hidden=setupStep===0;by('setup-next').hidden=setupStep===2;by('setup-save').hidden=setupStep!==2;by('subject-search').value='';filterSetup();by('setup-error').textContent='';}
function validateStep(index){const field=by('subject-list').querySelector('[data-step="'+index+'"]');for(const box of field.querySelectorAll('input[name=subject]:checked')){const s=bank.subjects.find(s=>s.id===box.value);if(s.option){const input=by('option-'+s.id),v=input.value.trim();if(!v||(!s.option.text&&!s.option.values.includes(v))){setupStep=index;showSetupStep();by('setup-error').textContent='Add '+s.option.label.toLowerCase()+' for '+s.name+'.';input.focus();return false;}}}return true;}
by('subject-search').addEventListener('input',filterSetup);
by('setup-next').addEventListener('click',()=>{if(validateStep(setupStep)){setupStep++;showSetupStep();by('setup-progress').focus();}});
by('setup-back').addEventListener('click',()=>{setupStep--;showSetupStep();by('setup-progress').focus();});
by('setup-form').addEventListener('submit',event=>{event.preventDefault();if(setupStep<2){by('setup-next').click();return;}for(let i=0;i<3;i++)if(!validateStep(i))return;
 const ids=[...by('subject-list').querySelectorAll('input[name=subject]:checked')].map(x=>x.value),options={};if(!ids.length){by('setup-error').textContent='Choose at least one subject across the three pages.';return;}
 for(const id of ids){const s=bank.subjects.find(s=>s.id===id);if(s.option)options[id]=by('option-'+id).value.trim();}
 state.selected=ids;state.options=options;state.active=state.active.filter(id=>ids.includes(id));if(!state.active.length)state.active=ids.slice(0,3);state.queue=[];state.current=null;state.session=null;save();showStudy();});
function sessionPicker(){
 by('session-subjects').replaceChildren(...state.selected.map(id=>{const s=bank.subjects.find(s=>s.id===id),label=document.createElement('label'),box=document.createElement('input');label.className='subject-label session-choice';box.type='checkbox';box.name='session-subject';box.value=id;box.checked=state.active.includes(id);const name=document.createElement('span');name.textContent=s.name;label.append(box,name);
 box.addEventListener('change',()=>{const chosen=[...by('session-subjects').querySelectorAll('input:checked')].map(x=>x.value);if(chosen.length>3){box.checked=false;return;}state.active=chosen;state.queue=[];save();sessionPicker();});return label;}));
 groups.forEach(group=>{const choices=[...by('session-subjects').children].filter(label=>groupOf(bank.subjects.find(s=>s.id===label.querySelector('input').value))===group);if(!choices.length)return;const section=document.createElement('div');section.className='session-group';const heading=document.createElement('h3');heading.textContent=group;section.append(heading,...choices);by('session-subjects').append(section);});
 const count=state.active.length;by('session-subjects').querySelectorAll('input').forEach(box=>box.disabled=count===3&&!box.checked);by('session-status').textContent=count?count+' of 3 subjects selected'+(count===3?' — untick one to swap.':'.'):'Choose at least one subject.';by('generate').disabled=!count;by('practice-exam').disabled=!count;
}
function showStudy(){
 by('setup').hidden=true;by('study').hidden=false;by('selected-summary').textContent='Saved subjects: '+state.selected.map(id=>bank.subjects.find(s=>s.id===id).name).join(', ');sessionPicker();websitePicker();
 by('session-duration').value=state.duration;by('session-mode').value=state.mode;by('completion').textContent=state.completed?state.completed+' checked tasks completed.':'';
 by('session-config').hidden=Boolean(state.session);by('session-run').hidden=!state.session;by('ready').hidden=!state.session||Boolean(state.current);by('task').hidden=!state.current;
 if(state.session){renderSession();if(state.current)renderTask();else{by('ready-message').textContent='Session complete. You checked '+state.session.blocks.length+' task blocks.';}}
}
function renderSession(){const x=state.session;by('session-summary').textContent=x.duration+' minutes planned · '+E.MODES[x.mode]+' mode · '+state.active.map(id=>bank.subjects.find(s=>s.id===id).name).join(' + ');by('session-progress').textContent=x.index+' of '+x.blocks.length+' blocks checked';by('session-plan').replaceChildren(...x.blocks.map((b,i)=>{const li=document.createElement('li');li.textContent=bank.subjects.find(s=>s.id===b.subject).name+' · '+b.minutes+' min'+(i<x.index?' · checked':i===x.index?' · current':'');return li;}));}
function startSession(){stopTimer();by('session-error').textContent='';try{const duration=Number(by('session-duration').value),mode=by('session-mode').value,blocks=E.sessionPlan(duration,state.active);state.duration=duration;state.mode=mode;state.session={duration,mode,blocks,index:0};generate();showStudy();}catch(e){state.session=null;state.current=null;by('session-error').textContent=e.message;}}
function generate(){stopTimer();const x=state.session;if(!x||x.index>=x.blocks.length)return;state.current=E.nextSessionTask(bank,state,x.blocks[x.index],x.mode);save();renderTask();renderSession();}
function instructionList(target,items){target.replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));}
function renderTask(){const t=state.current,s=bank.subjects.find(s=>s.id===t.subject);by('ready').hidden=true;by('task').hidden=false;by('task-subject').textContent=s.name;by('task-meta').textContent=t.minutes+' minutes · '+E.MODES[t.mode]+' mode';renderResources(s);by('resource-guidance').textContent='Look up “'+t.title+'”, focusing on '+t.focus.join(', ')+'. Supplementary websites may use a different syllabus; use your class notes and QCAA materials to check exam requirements. Links open in a new tab and need internet access.';by('task-title').textContent=t.title;by('task-method').textContent=E.LABELS[t.method];by('task-materials').textContent=t.materials;by('task-pacing').textContent=t.pacing;instructionList(by('task-steps'),t.steps);instructionList(by('task-check'),t.checkSteps);by('task-finish').textContent=t.finish;instructionList(by('task-help'),t.helpSteps);by('practice-text').hidden=!t.practiceText;by('practice-text').textContent=t.practiceText||'';by('task-source').href=t.source;by('help').open=false;by('shorten').disabled=t.mode==='easy';by('timer').textContent='';by('timer-toggle').textContent='Start task timer';by('exam').hidden=true;}
function renderResourceList(s,target){
const links=[...(s.resources||[]),{name:'QCAA '+s.name+' resources',url:s.page,note:'Official syllabus, past papers and marking guides.',access:'Official exam resources'}];
target.replaceChildren(...links.map(link=>{const li=document.createElement('li'),a=document.createElement('a'),note=document.createElement('span'),access=document.createElement('span');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=link.name+' ↗';note.textContent=link.note;access.className='resource-access';access.textContent=link.access;li.append(a,note,access);return li;}));
}
function renderResources(s){by('resources-title').textContent='Help with '+s.name;renderResourceList(s,by('resource-links'));}
function websitePicker(){
 const previous=by('website-subject').value;
 by('website-subject').replaceChildren(...state.selected.map(id=>{const s=bank.subjects.find(s=>s.id===id);return new Option(s.name,id);}));
 by('website-subject').value=state.selected.includes(previous)?previous:state.current?.subject||state.active[0]||state.selected[0];
 browseWebsites();
}
function browseWebsites(){const s=bank.subjects.find(s=>s.id===by('website-subject').value);if(s)renderResourceList(s,by('website-links'));}
by('website-subject').addEventListener('change',browseWebsites);
function stopTimer(){if(tick)clearInterval(tick);tick=null;endAt=null;remaining=0;by('timer').textContent='';by('timer-toggle').textContent='Start timer';}
function updateTimer(){const seconds=Math.max(0,Math.ceil((endAt-Date.now())/1000));by('timer').textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');if(seconds===0){clearInterval(tick);tick=null;endAt=null;remaining=0;by('timer').textContent='Time finished — check your work.';by('timer-toggle').textContent='Restart timer';}}
by('timer-toggle').addEventListener('click',()=>{if(tick){remaining=Math.max(0,endAt-Date.now());clearInterval(tick);tick=null;endAt=null;by('timer-toggle').textContent='Resume timer';}else{endAt=Date.now()+(remaining||state.current.minutes*60000);remaining=0;updateTimer();tick=setInterval(updateTimer,1000);by('timer-toggle').textContent='Pause timer';}});
by('generate').addEventListener('click',startSession);
by('skip').addEventListener('click',()=>generate());
by('done').addEventListener('click',()=>{if(!state.current)return;stopTimer();state.completed++;state.session.index++;state.current=null;if(state.session.index<state.session.blocks.length)generate();save();showStudy();by(state.current?'task-title':'ready-message').focus();});
by('shorten').addEventListener('click',()=>{const old=state.current,s=bank.subjects.find(s=>s.id===old.subject),t=s.topics.find(t=>t.id===old.topic);stopTimer();state.current=E.sessionTask(s,t,old.method,state.options,old.minutes,'easy');save();renderTask();});
function newSession(){stopTimer();state.current=null;state.session=null;save();showStudy();by('session-config-title').focus();}
by('change-session').addEventListener('click',newSession);by('new-session').addEventListener('click',newSession);
by('edit-setup').addEventListener('click',()=>{stopTimer();setup();by('setup-title').scrollIntoView();});
by('cancel-setup').addEventListener('click',showStudy);
by('print').addEventListener('click',()=>window.print());
by('reset-progress').addEventListener('click',()=>{stopTimer();state.queue=[];state.history=[];state.completed=0;state.current=null;state.lastSubject=null;state.session=null;save();showStudy();by('reset-status').textContent='Progress cleared. Your subjects are still saved.';});
by('practice-exam').addEventListener('click',()=>{
 const s=bank.subjects.find(s=>s.id===E.shuffle(state.active)[0]);const exam=by('exam');exam.hidden=false;
 exam.innerHTML='<h3>'+esc(s.name)+' · Practice exam session</h3><p>'+esc(s.coverage)+'</p><p><strong>Use:</strong> the first teacher-approved EA practice paper in your class revision folder. If you do not have one, open the official QCAA archive below.</p><ol><li>Set aside '+s.planning+' minutes for '+(s.planning===5?'perusal':'planning')+' and '+s.working+' minutes of working time'+(s.papers===2?' for one paper. Complete the second paper in another session':'')+'.</li><li>Follow the instructions and equipment requirements for that paper.</li><li>Mark using its matching guide. Record three errors, correct them, and reattempt one without the solution.</li></ol><p><a href="'+esc(s.page)+'" target="_blank" rel="noopener">Official QCAA papers and marking guides</a></p><p class="small">The archive currently contains earlier-cohort papers. Content, selected texts and formats may differ in 2026. Use a teacher-approved paper for a current-format simulation; older papers are supplementary practice.</p><p>'+esc(s.note)+'</p><button id="close-exam">Close practice exam session</button>';
 by('close-exam').addEventListener('click',()=>exam.hidden=true);exam.scrollIntoView({block:'nearest'});
});
by('review-subject').replaceChildren(...bank.subjects.map(s=>new Option(s.name,s.id)));
by('bank-count').textContent=bank.subjects.length+' subjects/specialisations · '+bank.subjects.reduce((n,s)=>n+s.topics.length,0)+' specific content items · '+Object.keys(E.LABELS).length+' study activities';
by('attribution').textContent=bank.attribution;by('timetable').href=bank.timetable;
function review(){const s=bank.subjects.find(s=>s.id===by('review-subject').value),option=state.options[s.id]||(s.option?.values?.[0])||(s.option?.text?'your investigation topic':'');
by('review-content').innerHTML='<h3>'+esc(s.name)+'</h3><p>'+esc(s.coverage)+'</p><p class="small">'+esc(s.version)+' · Checked '+esc(bank.checked)+'</p>'+(s.note?'<p>'+esc(s.note)+'</p>':'')+'<p><a href="'+esc(s.syllabus)+'" target="_blank" rel="noopener">Official syllabus</a> · <a href="'+esc(s.page)+'" target="_blank" rel="noopener">QCAA subject resources</a></p><p>Preview examples below do not change student selections or progress. Text/topic placeholders use an illustrative selection if you have not saved one.</p><div>'+s.topics.map(t=>'<div class="review-topic"><strong>'+esc(t.title.replaceAll('{option}',t.option||option))+'</strong><p class="small">'+esc(t.unit==='EA'?'EA analysis skills':'Unit '+t.unit)+' · Focus: '+esc(t.focus.join(', '))+'</p><button class="sample-button" data-preview="'+esc(t.id)+'">See a sample task</button><div id="preview-'+esc(t.id)+'" hidden></div></div>').join('')+'</div>';
by('review-content').querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{const t=s.topics.find(t=>t.id===button.dataset.preview),options={...state.options,[s.id]:t.option||option},task=E.sessionTask(s,t,E.METHODS[t.kind][0],options,20,'medium'),el=by('preview-'+t.id);el.hidden=!el.hidden;el.innerHTML='<p><strong>'+esc(task.label)+' · '+task.minutes+' minutes</strong></p><ol>'+task.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p><strong>Check:</strong> '+esc(task.check)+'</p>'+(task.practiceText?'<p>'+esc(task.practiceText)+'</p>':'');}));}
by('review-subject').addEventListener('change',review);review();
if(validSetup())showStudy();else setup();
})();
