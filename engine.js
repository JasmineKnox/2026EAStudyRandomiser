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
const check='Open your class notes or textbook for this exact topic. Correct errors and add missing points in a second colour. Circle one gap, close the resource, and write that point again from memory.';
let task={subject:s.id,topic:t.id,method,title,minutes:quick?5:20,label:quick?'Five-minute recall':LABELS[method],materials:'Notebook and your class notes or textbook',focus:t.focus,steps:[],check,finish:'Keep your corrected work. You are finished when you have checked it and retried one gap.',help:`Start with “${t.focus[0]}”. Read that part of your notes for one minute, close them, and write one sentence explaining it. Then add the next point.`,source:s.syllabus+(s.eaPage?'#page='+s.eaPage:''),coverage:s.coverage};
if(quick){task.steps=[`Without notes, write three things you remember about ${title}.`,`Include ${t.focus[0]} and one example, step or piece of evidence.`,`Use the final two minutes to check and correct your work.`];return task;}
const patterns={
map:[`Put “${title}” in the centre of a page. Close your notes.`,`Spend 10 minutes building branches for ${focus}. Add examples and label connections between ideas.`,`Spend five minutes checking your map, then redraw your weakest branch from memory.`],
recall:[`Close your notes. Give yourself 8 minutes to write everything you remember about ${title}.`,`Organise it under these headings: ${focus}. Add a specific example or application.`,`Spend the remaining time checking and rebuilding your weakest section.`],
explain:[`Explain ${title} aloud for two minutes without reading. Cover ${focus}.`,`Check your notes. Write down the terminology or steps you missed.`,`Explain it again, with one clear example and the missing points included. Repeat until you can finish without reading.`],
'short-response':[`Answer these original revision prompts without notes, in full sentences:`,`1. Explain ${t.focus[0]} in relation to ${title}. 2. Explain how ${t.focus[1]} connects to it. 3. Use one studied example to explain ${t.focus[2]}.`,`Spend 12 minutes answering, then check and improve your weakest response.`],
paragraph:[`Write a paragraph explaining ${title} and why it matters in a studied context.`,`Use the relevant terminology and address ${focus}. Support the explanation with one specific example.`,`Check your notes, then improve the explanation that was least clear.`],
compare:[`Make a table comparing the items named in “${title}”.`,`Use these comparison headings: ${focus}. Fill it from memory and include an example for each item.`,`Check the table. Explain one significant similarity and one significant difference in two developed sentences.`],
draw:[`Reconstruct a diagram or process model for ${title} without copying.`,`Label ${focus}. Use arrows and short annotations to explain relationships or steps.`,`Compare it with the relevant class model. Correct labels and redraw the part you missed.`],
'worked-example':[`Open the first worked example for ${title} in your class notes or textbook. Read the question, then cover the solution.`,`Solve it independently, showing your method. Explain where ${focus} appear in your working.`,`Uncover and compare the solution. Correct your work, then cover it and repeat the step you missed.`],
'problem-sprint':[`Open the exercise section for ${title} in your textbook or class revision sheet.`,`Attempt the first three unanswered questions in order for 12 minutes. Show your working, including ${focus} where relevant.`,`Use the provided answers or worked solutions to check. Reattempt one error. If there are no answers, flag the response for your teacher rather than guessing your mark.`],
'legal-plan':[`Use the first Australian human rights case or scenario in your class revision notes.`,`Plan a response with these headings: legal issue and scope; relevant law; viewpoints and consequences; alternatives; recommendation using legal criteria; implications.`,`Apply “${title}”, with particular attention to ${focus}. Check law, authority and terminology in your course resources.`],
'legal-paragraph':[`Use the first Australian human rights case or scenario in your class revision notes.`,`Write one evaluation paragraph addressing ${title}: compare two alternatives, make a recommendation and justify it using relevant legal criteria.`,`Include consequences and implications. Check your paragraph for ${focus} and accurate law.`],
evidence:[`Retrieve three specific pieces of evidence relevant to ${title} without copying.`,`For each, record its context and explain how it supports an analytical claim about ${focus}.`,`Verify every quotation or detail in your text/source notes. Replace an inaccurate quotation with an accurate paraphrase until checked.`],
'essay-plan':[`Plan a response to this original practice prompt: “How do the choices and relationships examined in ${title} shape meaning?”`,`Write a clear interpretation, three linked claims and supporting evidence. Address ${focus}.`,`Check whether each planned paragraph answers the prompt. Strengthen the weakest connection.`],
'english-paragraph':[`Write an analytical paragraph answering: “How do the textual choices associated with ${title} position readers to respond?”`,`Make a claim, use precise textual evidence, analyse the textual choices and explain the interpretation. Address ${focus}.`,`Check the evidence in your selected text and revise the sentence that makes the weakest analytical connection.`],
'close-reading':[`Read the original short practice text below. Annotate details relevant to ${title}.`,`Apply one text-centred approach and one world-context-centred approach you have studied. Develop a supported interpretation using ${focus}.`,`Check your theoretical terminology in class notes. Distinguish textual evidence from inference, and revise your reading.`],
'theory-map':[`From memory, map the theoretical ideas relevant to ${title}.`,`Include ${focus} and connect each idea to one detail in the original practice text below.`,`Check your class theory notes, then write a three-sentence reading that combines theory and textual evidence.`],
'source-analysis':[`Open the first historical source in your revision notes for ${title}.`,`Identify origin, context, purpose and perspective. Explain what the source supports and how useful and reliable it is for the studied issue.`,`Use ${focus}. Check against the source context and your class analysis; distinguish source evidence from your own inference.`],
'history-paragraph':[`Use the first two sources in your revision notes relevant to ${title}.`,`Write a paragraph making a historical argument. Use evidence from both sources, explain the relationship between them, and address ${focus}.`,`Check provenance and details. Make your conclusion proportionate to the evidence.`],
timeline:[`From memory, draw a timeline for ${title} with six relevant events from the aspect studied in class.`,`Add dates, a brief significance note and arrows connecting causes and consequences. Address ${focus}.`,`Check against class notes. Correct dates and explain the most important turning point aloud.`],
vocabulary:[`Write 12 ${lang} words or phrases for ${title} from memory.`,`Include language you could use to discuss ${focus}. Use six items in complete sentences in ${lang}.`,`Check meanings, spelling and grammar against your course materials, then retry any missed item.`],
'language-write':[`Write in ${lang} about ${title}, including ${focus}.`,`Give a view, two reasons and a relevant example. Use appropriate audience, register and linking language. Write for 12 minutes without a dictionary.`,`Check vocabulary, grammar and textual conventions in your class materials. Rewrite the least accurate passage.`],
'language-read':[`Open the first class reading text related to ${title}. Read it without a dictionary.`,`Identify the main idea, tone, purpose, audience and two supporting details. Explain the connection to ${focus}.`,`Check the class explanation or translation, then justify one inference with exact textual evidence.`],
'language-listen':[`Play the first class audio recording for ${title}. Listen once without the transcript.`,`Record the main idea and three details, then listen again to check. Connect the message to ${focus}.`,`Use the transcript or class answer key to check details and one inference. If you have no audio, use the first class reading on this topic and cover it between recalls.`],
'language-argument':[`Plan and write an analytical response in ${lang} about ${title}.`,`Use the first relevant stimulus in your class materials. Link it to your independent investigation and address ${focus}.`,`Check your argument, evidence, register and language accuracy. Refine one weak inference or connection.`],
'design-sprint':[`Original practice brief: design a reusable lunch carrier for a student who walks to school. Criteria: carries lunch securely; is easy to clean; reduces material waste.`,`Spend 10 minutes sketching three different solutions, concentrating on ${title} and ${focus}.`,`Evaluate against the three criteria, refine the strongest idea, and annotate the proposed design concept.`],
'design-evaluate':[`Use your most recent design sketch. Evaluate it for ${title}.`,`Use three criteria: function for the user; material/resource use; durability and repair. Identify strengths, limitations and implications.`,`Sketch one refinement and justify how it improves the concept. Address ${focus}.`],
'algorithm-trace':[`Open the first class algorithm or pseudocode example relevant to ${title}.`,`Trace it by hand using its given input. Record variable changes and output; annotate where ${focus} apply.`,`Compare with the class solution or run it in your usual programming environment. Correct the first point where your trace differs.`],
'algorithm-write':[`Use the first class data-exchange problem relevant to ${title}; cover its solution.`,`Write pseudocode and annotate ${focus}. Include input, processing, output and appropriate validation.`,`Check against the worked solution, then trace your own algorithm using the example input.`],
'performance-analysis':[`Use the first class example relevant to ${title}: a dance/drama extract or moving-image clip.`,`View it once, then identify three precise choices related to ${focus}. Explain how the choices work together to create meaning.`,`Replay the extract to verify details. Write a short judgment supported by those choices.`],
'art-analysis':[`Open the first artwork image in your class revision materials relevant to ${title}.`,`Annotate three specific visible details connected to ${focus}. Explain how they shape expression or meaning through the studied context.`,`Verify context in your notes. Write a justified interpretation that distinguishes visual evidence from assumptions.`],
'music-analysis':[`Use the first recording and/or score in your class revision materials relevant to ${title}.`,`Identify three precise features related to ${focus}. Explain relationships between them and the musical effect.`,`Listen again or reread the score to verify details. Write a judgment supported by musical evidence.`],
'arts-paragraph':[`Use the first class artwork, performance extract, clip or recording relevant to ${title}.`,`Write an analytical paragraph explaining how ${focus} work together to create meaning. Use precise arts terminology and evidence.`,`Revisit the example to check details, then justify an evaluation of those choices.`]
};
task.steps=patterns[method];
if(['english','history','timeline','theory','art','dance','drama','film','music','language','language-ext'].includes(t.kind))task.materials='Your studied text or first relevant class source, extract, score or recording; notebook';
if(t.kind==='math'||t.kind==='algorithm')task.materials='Textbook or class exercises with worked examples/answers; notebook';
if(t.kind==='theory'){task.practiceText=SAMPLE;task.materials='Original practice text below and your class theory notes';}
if(t.kind==='design'&&method==='design-sprint')task.materials='Paper and pencils; original practice brief included below';
if(method==='legal-plan'||method==='legal-paragraph')task.check='Check your course case notes and the current law resources supplied by your teacher. Check issue, law, viewpoints, criteria and implications. This is an original revision scaffold, not a QCAA marking guide.';
if(t.kind==='english')task.check='Verify evidence in your selected text. Check that the claim answers the prompt, analysis explains how choices shape meaning, and cultural assumptions or values are addressed where relevant. Revise one weak connection.';
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
root.StudyEngine={METHODS,LABELS,makeTask,next,eligible,displayTitle,shuffle,activeSubjects};
if(typeof module!=='undefined')module.exports=root.StudyEngine;
})(typeof window!=='undefined'?window:globalThis);
