(function(root){
'use strict';
const METHODS={
  concept:['map','recall','explain','short-response','paragraph'],
  compare:['compare','recall','short-response'],
  diagram:['draw','map','explain'],
  math:['worked-example','problem-sprint','explain','recall'],
  'legal-analysis':['legal-plan','legal-paragraph','explain'],
  english:['evidence','essay-plan','english-paragraph','explain'],
  theory:['close-reading','theory-map','essay-plan'],
  history:['source-analysis','history-paragraph','recall','evidence'],
  timeline:['timeline','explain'],
  language:['vocabulary','language-write','language-read','language-listen'],
  'language-ext':['language-argument','language-read','language-write'],
  design:['design-sprint','design-evaluate'],
  algorithm:['algorithm-trace','algorithm-write','explain'],
  dance:['performance-analysis','arts-paragraph','recall'],
  drama:['performance-analysis','arts-paragraph','recall'],
  film:['performance-analysis','arts-paragraph','recall'],
  art:['art-analysis','arts-paragraph','recall'],
  music:['music-analysis','arts-paragraph','recall']
};
const LABELS={'map':'Memory mind map','recall':'Recall and check','explain':'Teach it aloud','short-response':'Short-response practice','paragraph':'Explain and apply','compare':'Comparison table','draw':'Draw and label','worked-example':'Rebuild a worked example','problem-sprint':'Problem sprint','legal-plan':'Legal response plan','legal-paragraph':'Legal evaluation paragraph','evidence':'Evidence bank','essay-plan':'Response plan','english-paragraph':'Analytical paragraph','close-reading':'Theorised close reading','theory-map':'Theory map','source-analysis':'Source analysis','history-paragraph':'Historical argument','timeline':'Timeline','vocabulary':'Vocabulary retrieval','language-write':'Write in the target language','language-read':'Reading analysis','language-listen':'Listening practice','language-argument':'Argument in the target language','design-sprint':'Design sprint','design-evaluate':'Evaluate and refine','algorithm-trace':'Algorithm trace','algorithm-write':'Pseudocode challenge','performance-analysis':'Analyse performance choices','arts-paragraph':'Analytical arts paragraph','art-analysis':'Read an artwork','music-analysis':'Listen and analyse'};
const SAMPLE='Original practice text: At six, Mara unlocked the empty station. The departure board still promised a train that had stopped running years ago. She wiped the dust from the word ARRIVING and set two cups on the counter. Outside, someone knocked. Mara looked at the clock, then quietly put one cup away.';
function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(a,rng=Math.random){return a[Math.floor(rng()*a.length)];}
function activeSubjects(state){const selected=[...new Set(state.selected||[])],active=Array.isArray(state.active)?state.active:selected;return [...new Set(active)].filter(id=>selected.includes(id)).slice(0,3);}
function eligible(s,options){return s.topics.filter(t=>!t.option||t.option===options[s.id]);}
function displayTitle(t,s,options){return t.title.replaceAll('{option}',options[s.id]||'your selected course text/topic');}
function makeTask(s,t,method,options,quick=false){
const title=displayTitle(t,s,options),focus=t.focus.join(', '),lang=s.name.replace(' Extension','');
const check=`Open your ${s.name} class notes or textbook for “${title}”. Check ${focus}. Correct errors and add missing points in a second colour. Circle one gap, close the resource, and write that point again from memory.`;
let task={subject:s.id,topic:t.id,method,title,minutes:quick?5:20,label:quick?'Five-minute recall':LABELS[method],materials:`Notebook and your ${s.name} class notes or textbook for “${title}”`,focus:t.focus,steps:[],check,finish:'Keep your corrected work. You are finished when you have checked it and retried one gap.',help:`Start with “${t.focus[0]}”. Read your ${s.name} notes on “${title}” for one minute, close them, and write one sentence explaining it. Then add the next point.`,source:s.syllabus+(s.eaPage?'#page='+s.eaPage:''),coverage:s.coverage};
if(quick){task.intro=`Give your memory a quick workout: close your notes and recall what you know about “${title}”, then check the gaps.`;task.steps=[`Without notes, write three things you remember about ${title}.`,`Include ${t.focus[0]} and one example, step or piece of evidence.`,`Use the final two minutes to check and correct your work.`];return task;}
const patterns={
map:[`Put “${title}” in the centre of a page. Close your notes.`,`Spend 10 minutes building branches for ${focus}. Add examples and label connections between ideas.`,`Spend five minutes checking your map, then redraw your weakest branch from memory.`],
recall:[`Close your notes. Give yourself 8 minutes to write everything you remember about ${title}.`,`Organise it under these headings: ${focus}. Add a specific example or application.`,`Spend the remaining time checking and rebuilding your weakest section.`],
explain:[`Without reading, explain ${title} aloud for two minutes. Cover ${focus}.`,`Check your notes. Write down the terminology or steps you missed.`,`Explain it again, with one clear example and the missing points included. Repeat until you can finish without reading.`],
'short-response':[`Answer these original revision prompts without notes, in full sentences:`,`1. Explain ${t.focus[0]} in relation to ${title}. 2. Explain how ${t.focus[1]} connects to it. 3. Use one studied example to explain ${t.focus[2]}.`,`Spend 12 minutes answering, then check and improve your weakest response.`],
paragraph:[`Write a paragraph explaining ${title} and why it matters in a studied context.`,`Use the relevant terminology and address ${focus}. Support the explanation with one specific example.`,`Check your notes, then improve the explanation that was least clear.`],
compare:[`Make a table comparing “${title}”.`,`Use these comparison headings: ${focus}. Fill it from memory and include an example for each item.`,`Check the table. Explain one significant similarity and one significant difference in two developed sentences.`],
draw:[`Reconstruct a diagram or process model for ${title} without copying.`,`Label ${focus}. Use arrows and short annotations to explain relationships or steps.`,`Compare it with your class diagram or process model for “${title}”. Correct labels and redraw the part you missed.`],
'worked-example':[`Open the first worked example for ${title} in your class notes or textbook. Read the question, then cover the solution.`,`Solve it independently, showing your method. Explain where ${focus} appear in your working.`,`Uncover and compare the solution. Correct your work, then cover it and repeat the step you missed.`],
'problem-sprint':[`Open the exercise section for ${title} in your textbook or class revision sheet.`,`Attempt the first three unanswered questions in order for 12 minutes. Show your working, including ${focus} where relevant.`,`Use the provided answers or worked solutions to check. Reattempt one error. If there are no answers, flag the response for your teacher rather than guessing your mark.`],
'legal-plan':[`Use the first Australian human rights case or scenario about “${title}” in your class revision notes.`,`Plan a response with these headings: legal issue and scope; relevant law; viewpoints and consequences; alternatives; recommendation using legal criteria; implications.`,`Apply “${title}”, with particular attention to ${focus}. Check law, authority and terminology in your course resources.`],
'legal-paragraph':[`Use the first Australian human rights case or scenario about “${title}” in your class revision notes.`,`Write one evaluation paragraph addressing ${title}: compare two alternatives, make a recommendation and justify it using relevant legal criteria.`,`Include consequences and implications. Check your paragraph for ${focus} and accurate law.`],
evidence:[`Retrieve three specific pieces of evidence relevant to ${title} without copying.`,`For each, record its context and explain how it supports an analytical claim about ${focus}.`,`Verify every quotation or detail in your text/source notes. Replace an inaccurate quotation with an accurate paraphrase until checked.`],
'essay-plan':[`Plan a response to this original practice prompt: “How do the choices and relationships examined in ${title} shape meaning?”`,`Write a clear interpretation, three linked claims and supporting evidence. Address ${focus}.`,`Check whether each planned paragraph answers the prompt. Strengthen the weakest connection.`],
'english-paragraph':[`Write an analytical paragraph answering: “How do the textual choices associated with ${title} position readers to respond?”`,`Make a claim, use precise textual evidence, analyse the textual choices and explain the interpretation. Address ${focus}.`,`Check the evidence in ${options[s.id]||title} and revise the sentence that makes the weakest analytical connection.`],
'close-reading':[`Read the original short practice text below. Annotate details relevant to ${title}.`,`Apply one text-centred approach and one world-context-centred approach you have studied. Develop a supported interpretation using ${focus}.`,`Check your theoretical terminology in class notes. Distinguish textual evidence from inference, and revise your reading.`],
'theory-map':[`From memory, map the theoretical ideas relevant to ${title}.`,`Include ${focus} and connect each idea to one detail in the original practice text below.`,`Check your class theory notes, then write a three-sentence reading that combines theory and textual evidence.`],
'source-analysis':[`Open the first historical source in your revision notes for ${title}.`,`Identify origin, context, purpose and perspective. Explain what the source supports and how useful and reliable it is for “${title}”.`,`Use ${focus}. Check against the source context and your class analysis; distinguish source evidence from your own inference.`],
'history-paragraph':[`Use the first two sources in your revision notes relevant to ${title}.`,`Write a paragraph making a historical argument. Use evidence from both sources, explain the relationship between them, and address ${focus}.`,`Check provenance and details. Make your conclusion proportionate to the evidence.`],
timeline:[`From memory, draw a timeline for ${title} with six relevant events from the aspect studied in class.`,`Add dates, a brief significance note and arrows connecting causes and consequences. Address ${focus}.`,`Check against class notes. Correct dates and explain the most important turning point aloud.`],
vocabulary:[`Write 12 ${lang} words or phrases for ${title} from memory.`,`Include language you could use to discuss ${focus}. Use six items in complete sentences in ${lang}.`,`Check meanings, spelling and grammar against your course materials, then retry any missed item.`],
'language-write':[`Write in ${lang} about ${title}, including ${focus}.`,`Give a view, two reasons and a relevant example. Use appropriate audience, register and linking language. Write for 12 minutes without a dictionary.`,`Check vocabulary, grammar and textual conventions in your class materials. Rewrite the least accurate passage.`],
'language-read':[`Open the first class reading text related to ${title}. Read it without a dictionary.`,`Identify the main idea, tone, purpose, audience and two supporting details. Explain the connection to ${focus}.`,`Check the class explanation or translation, then justify one inference with exact textual evidence.`],
'language-listen':[`Play the first class audio recording for ${title}. Listen once without the transcript.`,`Record the main idea and three details, then listen again to check. Connect the message to ${focus}.`,`Use the transcript or class answer key to check details and one inference. If you have no audio, use the first class reading on “${title}” and cover it between recalls.`],
'language-argument':[`Plan and write an analytical response in ${lang} about ${title}.`,`Use the first stimulus about “${title}” in your ${lang} class materials. Link it to your independent investigation and address ${focus}.`,`Check your argument, evidence, register and language accuracy. Refine one weak inference or connection.`],
'design-sprint':[`Original practice brief: design a reusable lunch carrier for a student who walks to school. Criteria: carries lunch securely; is easy to clean; reduces material waste.`,`Spend 10 minutes sketching three different solutions, concentrating on ${title} and ${focus}.`,`Evaluate against the three criteria, refine the strongest idea, and annotate the proposed design concept.`],
'design-evaluate':[`Use your most recent design sketch. Evaluate it for ${title}.`,`Use three criteria: function for the user; material/resource use; durability and repair. Identify strengths, limitations and implications.`,`Sketch one refinement and justify how it improves the concept. Address ${focus}.`],
'algorithm-trace':[`Open the first class algorithm or pseudocode example relevant to ${title}.`,`Trace it by hand using its given input. Record variable changes and output; annotate where ${focus} apply.`,`Compare with the class solution or run it in your usual programming environment. Correct the first point where your trace differs.`],
'algorithm-write':[`Use the first class data-exchange problem relevant to ${title}; cover its solution.`,`Write pseudocode and annotate ${focus}. Include input, processing, output and appropriate validation.`,`Check against the worked solution, then trace your own algorithm using the example input.`],
'performance-analysis':[`Use the first class example relevant to ${title}: ${t.kind==='dance'?'a dance extract':t.kind==='drama'?'a drama extract':'a moving-image clip'}.`,`View it once, then identify three precise choices related to ${focus}. Explain how the choices work together to create meaning.`,`Replay the extract to verify details. Write a short judgment supported by those choices.`],
'art-analysis':[`Open the first artwork image in your class revision materials relevant to ${title}.`,`Annotate three specific visible details connected to ${focus}. Explain how they shape expression or meaning through the studied context.`,`Verify context in your notes. Write a justified interpretation that distinguishes visual evidence from assumptions.`],
'music-analysis':[`Use the first recording and/or score in your class revision materials relevant to ${title}.`,`Identify three precise features related to ${focus}. Explain relationships between them and the musical effect.`,`Listen again or reread the score to verify details. Write a judgment supported by musical evidence.`],
'arts-paragraph':[`Use the first class ${t.kind==='art'?'artwork':t.kind==='music'?'recording or score':t.kind==='film'?'moving-image clip':t.kind==='dance'?'dance extract':'drama extract'} about “${title}”.`,`Write an analytical paragraph explaining how ${focus} work together to create meaning. Use precise arts terminology and evidence.`,`Revisit the example to check details, then justify an evaluation of those choices.`]
};
const openings={
map:`Make a memory mind map of “${title}”. Start with what you know, connect the ideas, then check what needs fixing.`,
recall:`Time for a brain dump: close your notes and get everything you remember about “${title}” onto the page. Then check the gaps.`,
explain:`Teach “${title}” aloud to a partner, friend or an inanimate object — a rubber duck makes a patient audience. Start without reading; check your notes, then teach it again more clearly.`,
'short-response':`Take on three short questions about “${title}”. Answer from memory in full sentences, then improve the response that needs the most work.`,
paragraph:`Turn what you know about “${title}” into one clear explanation paragraph. Use the key terms and a specific example to make your point.`,
compare:`Put “${title}” side by side in a comparison table. Show what is similar, what is different and why the difference matters.`,
draw:`Draw “${title}” from memory. Use labels and arrows to make the process or relationships visible, then check your diagram.`,
'worked-example':`Be the solver, not the spectator: find a worked example of “${title}”, cover the answer and solve it yourself. Then compare and repair your working.`,
'problem-sprint':`Grab your textbook or revision sheet and tackle questions on “${title}”. Show your working, check your answers and have another go at an error.`,
'legal-plan':`Build a legal response plan about “${title}”. Use a case or scenario from your notes to compare alternatives and justify a recommendation.`,
'legal-paragraph':`Make a reasoned legal recommendation about “${title}” in one evaluation paragraph. Compare alternatives and show why your choice stands up to the legal criteria.`,
evidence:`Build an evidence bank for “${title}”. Retrieve specific details from memory, explain what each supports, then check their accuracy.`,
'essay-plan':`Plan your argument about “${title}” before writing an essay. Make your interpretation clear and connect each claim to evidence.`,
'english-paragraph':`Write one analytical paragraph about “${title}”. Show how the text’s choices shape meaning and position readers, using precise evidence.`,
'close-reading':`Read like a detective: use the practice text below to explore “${title}”. Try two theoretical approaches and support your interpretation with its actual words.`,
 'theory-map':`Make a theory map for “${title}”. Connect the ideas to details in the practice text below, then turn those connections into a short reading.`,
'source-analysis':`Put a historical source under the microscope for “${title}”. Work out who made it, what it supports and how useful and reliable it is.`,
'history-paragraph':`Make a historical argument about “${title}” using two sources. Explain how their evidence supports your claim, rather than just describing them.`,
timeline:`Put “${title}” on a timeline. Add the dates, show why the events matter and connect causes with consequences.`,
vocabulary:`Give your ${lang} vocabulary a memory workout on “${title}”. Recall words and phrases, use them in sentences, then check and retry the tricky ones.`,
'language-write':`Write in ${lang} about “${title}”. State a view, give reasons and an example, then polish your language.`,
'language-read':`Read a ${lang} class text about “${title}” without a dictionary first. Find its main message and supporting details, then check your interpretation.`,
'language-listen':`Listen to a ${lang} class recording about “${title}”. Catch the main message and details before checking with the transcript.`,
'language-argument':`Build an argument in ${lang} about “${title}”. Connect a class stimulus to your investigation and support your view with evidence.`,
'design-sprint':`Take the lunch-carrier design brief below and sketch possible solutions. Use “${title}” to choose, refine and justify your strongest idea.`,
'design-evaluate':`Give your latest design sketch a proper test using “${title}”. Judge its strengths and limitations, then sketch a refinement you can justify.`,
'algorithm-trace':`Be the computer: trace an algorithm for “${title}” by hand. Track the changing variables and output, then check where your trace differs.`,
'algorithm-write':`Write pseudocode for a class problem about “${title}”. Make the input, processing and output clear, then test it with the example input.`,
'performance-analysis':`Watch a ${t.kind==='film'?'moving-image clip':t.kind==='dance'?'dance extract':'drama extract'} to explore “${title}”. Spot precise choices and explain how they work together to create meaning.`,
'art-analysis':`Look closely at an artwork to explore “${title}”. Use visible details to explain its meaning, then check the context behind your interpretation.`,
'music-analysis':`Listen closely or read a score to explore “${title}”. Identify musical features and explain the effect they create together.`,
'arts-paragraph':`Turn your observations about “${title}” into an analytical paragraph. Connect precise artistic choices to their effects and justify your judgement.`
};
task.intro=openings[method];
task.steps=patterns[method];
if(['english','history','timeline','theory','art','dance','drama','film','music','language','language-ext'].includes(t.kind))task.materials=t.kind==='english'?`${options[s.id]||title}; your class notes on “${title}”; notebook`:`Your ${s.name} class source, extract, score or recording for “${title}”; notebook`;
if(['history','timeline','language','language-ext','art','dance','drama','film','music'].includes(t.kind)){const source={history:'historical source pack',timeline:'history notes',language:'reading or audio recording', 'language-ext':'investigation stimulus',art:'artwork image',dance:'dance extract',drama:'drama extract',film:'moving-image clip',music:'recording or score'}[t.kind];task.materials=`Your ${s.name} ${source} for “${title}”; class notes; notebook`;}
if(t.kind==='math'||t.kind==='algorithm')task.materials=`Textbook or ${s.name} class exercises on “${title}”, with worked examples/answers; notebook`;
if(t.kind==='theory'){task.practiceText=SAMPLE;task.materials=`Original practice text below and your class theory notes on “${title}”`;}
if(t.kind==='design'&&method==='design-sprint')task.materials='Paper and pencils; original practice brief included below';
if(method==='legal-plan'||method==='legal-paragraph')task.check='Check your course case notes and the current law resources supplied by your teacher. Check issue, law, viewpoints, criteria and implications. This is an original revision scaffold, not a QCAA marking guide.';
if(t.kind==='english')task.check=`Verify evidence in ${options[s.id]||title}. Check that your claim addresses “${title}” and your analysis explains ${focus} and how textual choices shape meaning. Address cultural assumptions or values where relevant. Revise one weak connection.`;
if(t.kind==='history'||t.kind==='timeline')task.check='Check dates and claims in your class notes/source pack. Verify source details and distinguish evidence from inference. Use a class model or feedback to revise one weak point.';
if(t.kind==='math'||t.kind==='algorithm')task.check='Compare with the worked solution or answer key. Check method, working, notation, units and reasonableness where relevant. If no solution is supplied, flag it for your teacher. Reattempt one corrected step.';
if(['art','dance','drama','film','music'].includes(t.kind))task.check='Revisit the artwork, recording, score or performance to check precise evidence. Check terminology against class notes. Your interpretation needs evidence and reasoning; another supported reading may also be defensible.';
if(t.kind.startsWith('language'))task.check='Use your course vocabulary, transcript, translation or class model to check meaning and language. Check register, grammar and evidence for inferences. Rewrite one weak passage.';
if(t.kind==='theory')task.check='Check the theoretical definitions in your class notes and the precise words of the practice text. Keep the interpretation supported by evidence. No single model reading is supplied.';
if(t.kind==='design')task.check='Check each criterion against your sketches and annotations. Confirm you evaluated limitations and made a visible refinement. Use your class develop-phase model to check process.';
return task;
}
function next(bank,state,{quick=false,rng=Math.random,subjectId=null}={}){
const active=activeSubjects(state),selected=bank.subjects.filter(s=>active.includes(s.id));
if(!selected.length)throw new Error('Choose at least one subject.');
let id=subjectId;
if(!id){
 state.queue=(state.queue||[]).filter(id=>active.includes(id));
 if(!state.queue.length){state.queue=shuffle(selected.map(s=>s.id),rng);if(state.queue.length>1&&state.queue[0]===state.lastSubject)[state.queue[0],state.queue[1]]=[state.queue[1],state.queue[0]];}
 id=state.queue.shift();state.lastSubject=id;
}
const s=selected.find(s=>s.id===id);if(!s)throw new Error('Subject is not selected.');
const options=state.options||{},topics=eligible(s,options);if(!topics.length)throw new Error('No matching topics. Check your setup.');
const history=(state.history||[]).filter(x=>x.subject===id);
const recentTopics=history.slice(-3).map(x=>x.topic);let available=topics.filter(t=>!recentTopics.includes(t.id));if(!available.length)available=topics;
const t=pick(available,rng),methods=METHODS[t.kind];if(!methods)throw new Error('No methods for '+t.kind);
const prior=(state.history||[]).at(-1);let choices=methods.filter(x=>!prior||x!==prior.method);if(!choices.length)choices=methods;
const task=makeTask(s,t,pick(choices,rng),options,quick);
task.created=Date.now();state.history=[...(state.history||[]),{subject:id,topic:t.id,method:task.method}].slice(-300);return task;
}
const MODES={easy:'Easy',medium:'Medium',hard:'Hard'};
function sessionPlan(minutes,subjects){
 const ids=[...new Set(subjects)];
 if(!Number.isInteger(minutes)||minutes<5||minutes>180)throw new Error('Choose a whole number of minutes from 5 to 180.');
 if(!ids.length||ids.length>3)throw new Error('Choose one to three subjects.');
 if(minutes<ids.length*5)throw new Error('Allow at least five minutes for each selected subject.');
 const count=Math.max(ids.length,Math.ceil(minutes/20)),base=Math.floor(minutes/count),extra=minutes%count;
 return Array.from({length:count},(_,i)=>({subject:ids[i%ids.length],minutes:base+(i<extra?1:0)}));
}
function splitInstructions(text){
 return String(text).replace(/(?:^|\s)\d+\.\s+(?=[A-Z])/g,'\n').split(/\n|(?<=[.!?])\s+(?=[A-Z“"0-9])|;\s+|, then\s+/).map(x=>x.trim()).filter(Boolean).map(x=>x[0].toUpperCase()+x.slice(1));
}
function sessionTask(s,t,method,options,minutes=20,mode='medium'){
 if(!MODES[mode])mode='medium';
 const task=makeTask(s,t,method,options,false),title=task.title,focus=t.focus.join(', '),lang=s.name.replace(' Extension','');
 task.minutes=minutes;task.mode=mode;
 const checkMinutes=Math.max(1,Math.round(minutes*.25)),workMinutes=minutes-checkMinutes;
 const timed=text=>text
 .replace(/Spend 10 minutes building/g,'Build')
 .replace(/Spend five minutes checking/g,'Check')
 .replace(/Give yourself 8 minutes to write/g,'Write')
 .replace(/Spend the remaining time checking and rebuilding/g,'Check and rebuild')
 .replace(/Spend 12 minutes answering/g,'Answer the prompts')
 .replace(/Spend 10 minutes sketching/g,'Sketch')
 .replace(/Write for 12 minutes without a dictionary/g,'Write without a dictionary')
 .replace(/for 12 minutes/g,'during your working time')
 .replace(/for two minutes/g,'briefly');
 // A short block keeps the subject-specific strategy, with a smaller response.
 const smaller=text=>text.replace(/three (specific pieces|linked claims|different solutions|precise choices|specific visible details|precise features)/g,'one $1').replace(/first three unanswered questions/g,'first unanswered question').replace(/with six relevant events/g,'with three relevant events').replace(/Write 12 /g,'Write six ').replace(/Use six items/g,'Use three items').replace(/one specific pieces/g,'one specific piece').replace(/one linked claims/g,'one linked claim').replace(/one different solutions/g,'one solution').replace(/one precise choices/g,'one precise choice').replace(/one specific visible details/g,'one specific visible detail').replace(/one precise features/g,'one precise feature');
 let steps=task.steps.flatMap(text=>splitInstructions(timed(text)));
 if(method==='explain')steps.splice(0,2,`Explain “${title}” aloud without reading.`,...t.focus.map(point=>`Explain ${point}, using an example connected to “${title}”.`));
 if(mode==='easy'||minutes<=10){steps=steps.map(smaller);if(method==='short-response')task.intro=task.intro.replace('three short questions','the short questions');}
 if(minutes<=10)steps.unshift('Keep the response brief: complete one example, a short plan or a few sentences.');
 if(mode==='easy'){
  steps.unshift(`Use your ${s.name} notes to find a definition or model for “${title}”.`,`Write three key words about ${focus} to guide your response.`,`Keep your source or question for “${title}” available; cover its answer while you try the task.`);
  task.help=`Use “${t.focus[0]}” as your starting heading for “${title}”. Add one accurate point or example about ${t.focus[0]}, then connect it to ${t.focus[1]||title}.`;
 }
 if(mode==='hard'){
  steps.unshift('Keep solutions and explanatory notes closed until the checking stage. Keep the task’s text, question or stimulus available.');
  const challenge=t.kind==='math'||t.kind==='algorithm'?`Apply your method for “${title}” to a different input or question, and justify why your approach works.`:t.kind==='legal-analysis'?'Test your recommendation against a competing viewpoint or changed fact. Justify whether it should still stand.':t.kind==='design'?'Test your solution against one additional user constraint and justify the refinement.':t.kind.startsWith('language')?`Add a counterargument or alternative viewpoint about “${title}” in ${lang}, supported by a detail from the stimulus. Justify your own position.`:t.kind==='english'||t.kind==='theory'?`Consider a different interpretation of your evidence for “${title}” and justify which reading is stronger.`:t.kind==='history'||t.kind==='timeline'?'Test your claim against a conflicting source or alternative explanation. Explain a limit of your evidence and justify your judgement.':`Apply “${title}” to a different example, or consider another interpretation of ${t.focus[0]}. Justify your conclusion with specific evidence.`;
  const checkingIndex=steps.findIndex(x=>/^(?:Check|Compare|Uncover|Verify|Revisit|Replay|Listen again|Use the provided answers)/.test(x));
  steps.splice(checkingIndex>=0?checkingIndex:steps.length,0,challenge);
 }
 task.steps=steps;
 if(!task.check.includes(title))task.check=`For “${title}”, check ${focus}. `+task.check;
 task.checkSteps=splitInstructions(task.check);
 task.helpSteps=splitInstructions(task.help);
 task.pacing=`Use about ${workMinutes} minutes for the task and ${checkMinutes} minute${checkMinutes===1?'':'s'} to check and retry a gap.`;
 task.label=MODES[mode]+' · '+LABELS[method];
 return task;
}
function nextSessionTask(bank,state,block,mode='medium'){
 const s=bank.subjects.find(s=>s.id===block.subject);if(!s)throw new Error('Unknown session subject.');
 const original=next(bank,state,{subjectId:block.subject});
 const t=s.topics.find(t=>t.id===original.topic);
 const task=sessionTask(s,t,original.method,state.options||{},block.minutes,mode);task.created=original.created;return task;
}

root.StudyEngine={MODES,sessionPlan,splitInstructions,sessionTask,nextSessionTask,METHODS,LABELS,makeTask,next,eligible,displayTitle,shuffle,activeSubjects};
if(typeof module!=='undefined')module.exports=root.StudyEngine;
})(typeof window!=='undefined'?window:globalThis);
