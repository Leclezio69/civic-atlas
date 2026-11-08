import {exhibitReader} from './exhibit-reader.js';
import {esc, icon, line, source} from './ui.js';
import {state, persist, downloadFile} from './state.js';
import {exhibits, dispositionOptions, evidenceFields, decisionFields, caseFields, labelFor, isComplete, assess, consequences} from './resident-case.js';

const stages=['Opening file','Evidence review','Decision minute','Panel debrief'];
const enquiries=[
  ['trace','Ask records to trace Mara’s delivery event','Luis returns a correlation trace linking the counter receipt to the rejected adapter event.','R04'],
  ['replay','Ask assurance to replay moved-address renewals','Noor returns the targeted replay and its sampling limits.','R05'],
  ['continuity','Ask operations for a signed fallback plan','Amina returns the manual roster, delegated authorities and exit conditions.','R06']
];
const defaults=()=>({stage:0,revealed:false,first:'',enquiry:'',answers:{},note:'',submitted:null,attempts:0});
const getCase=()=>state.residentConference || (state.residentConference=defaults());
const option=(value,text,selected)=>'<option value="'+esc(value)+'"'+(value===selected?' selected':'')+'>'+esc(text)+'</option>';
function decisionLabel(v){return dispositionOptions.find(([id])=>id===v)?.[1]||'Undecided'}
function evidenceLabel(id){const e=exhibits.find(x=>x.id===id);return e?e.id+' · '+e.title:'Unknown exhibit'}
function choiceGroup(key, options, current, label,locked=false){
  return '<fieldset class="conference-radios"><legend>'+esc(label)+'</legend><div>'+options.map(([value,text])=>
    '<label><input type="radio" name="'+key+'" value="'+value+'" '+(current===value?'checked ':'')+(locked?'disabled':'required')+'><span>'+esc(text)+'</span></label>').join('')+'</div></fieldset>';
}
function selectControl(spec,value){
  return '<label class="case-select"><span>'+esc(spec.label)+'</span><select required name="'+spec.key+'">'+option('','Choose an answer',value)+
    spec.options.map(([id,title])=>option(id,title,value)).join('')+'</select></label>';
}
function hero(){
  return '<div class="cap-banner case-banner"><div class="wrap">'+line('SCORED CAPSTONE · NORTHBRIDGE')+
    '<h1>A renewal on hold</h1><p>Mara Ellis filed her change of address on time. One department accepted it. Another is preparing a missing-evidence notice. You have until noon to decide whether the city should expand the connector.</p>'+
    '<div class="case-hero-meta"><span>'+icon('time',15)+' Friday · 12:00 launch review</span><span>'+icon('folder',15)+' Case B-441</span></div></div></div>'+
    '<div class="module-bar"><div class="wrap"><nav aria-label="Capstone workspaces"><a href="#/capstone" aria-current="page">'+icon('target',16)+' Scored resident case</a><a href="#/capstone/notebook">'+icon('field',16)+' Portfolio notebook</a></nav></div></div>';
}
function phaseNav(c){
  return '<nav class="case-nav" aria-label="Case stages">'+stages.map((label,i)=>{
    const available=i===0 || (i===1&&c.revealed) || (i===2&&c.revealed&&isComplete(c.answers,evidenceFields)) || (i===3&&c.submitted);
    return '<button type="button" data-stage="'+i+'" '+(available?'':'disabled ') +(i===c.stage?'aria-current="step"':'')+'><span>0'+(i+1)+'</span>'+label+'</button>';
  }).join('')+'</nav>';
}
function opening(c){
  return '<div class="case-columns">'+exhibitReader(exhibits.slice(0,3),'R01')+
    '<section class="case-work" id="case-work"><span class="minor-label">FRIDAY · 09:00</span><h2>Your first call</h2>'+
    '<p>Three teams have supplied different accounts. Read the opening file, record a provisional disposition and commission a follow-up. Your first call is retained for the debrief.</p>'+
    '<form id="opening-form">'+choiceGroup('first',dispositionOptions,c.first,'Your provisional disposition',c.revealed)+
    '<label class="case-select"><span>Which enquiry do you commission first?</span><select name="enquiry" '+(c.revealed?'disabled':'required')+'>'+option('','Choose an enquiry',c.enquiry)+enquiries.map(([id,t])=>option(id,t,c.enquiry)).join('')+'</select></label>'+
    '<button class="btn primary" type="submit">'+(c.revealed?'Return to evidence review':'Record first call and open the 11:40 return')+' '+icon('arrow',16)+'</button>'+
    '</form><p class="case-footnote">This opening judgement is unscored. The panel assesses your final position against the complete file.</p></section></div>';
}
function evidence(c,active){
  const enquiry=enquiries.find(([id])=>id===c.enquiry)||enquiries[0];
  return '<div class="case-update" id="case-update"><div><span class="minor-label">FRIDAY · 11:40</span><h2>The returns are in.</h2></div><p>'+esc(enquiry[2])+' The panel also receives the other teams’ returns. The 12:15 notice batch is still scheduled.</p></div>'+
    '<div class="case-columns">'+exhibitReader(exhibits,active||enquiry[3])+
    '<section class="case-work" id="case-work"><span class="minor-label">EVIDENCE REVIEW</span><h2>Reconcile the file</h2><p>Pair your findings with exhibits. Distinguish what happened to Mara from what the sample establishes about other residents.</p>'+
    '<form id="evidence-form">'+evidenceFields.map(f=>selectControl(f,c.answers[f.key])).join('')+
    '<button class="btn primary" type="submit">Prepare the decision minute '+icon('arrow',16)+'</button></form></section></div>';
}
function decision(c){
  const groups=[['Operating instruction',0,2],['Accountability and resident remedy',2,6],['Conditions for a future release',6,8]];
  return '<div class="case-columns decision-columns"><aside id="case-files"><div class="case-section-title"><span class="minor-label">REVIEW CONFERENCE</span><h2>Your evidence brief</h2></div>'+
    '<div class="exhibit-sheet"><p><b>09:00 provisional position</b><br>'+esc(decisionLabel(c.first))+'</p><p><b>Finding at 11:40</b><br>'+esc(labelFor('finding',c.answers.finding))+'</p><p><b>Strength of the test</b><br>'+esc(labelFor('scope',c.answers.scope))+'</p><div class="file-limit"><strong>Selected exhibits</strong>'+['receipt','trace','testRecord'].map(key=>esc(evidenceLabel(c.answers[key]))).join('<br>')+'</div>'+
    '<button type="button" class="text-link" data-stage="1">Reopen evidence '+icon('back',14)+'</button></div><div class="case-method"><b>Panel standard</b><p>Six dimensions total 100 points. A decision is ready at 80 points with all blocking findings closed. The panel checks the trace and independent replay, delegated authority, resident protection, access to review and consistency of the release boundary. The panel checks the exhibit references in your written minute. Its prose is kept for human review.</p></div></aside>'+
    '<section class="case-work" id="case-work"><span class="minor-label">FRIDAY · 12:00</span><h2>Sign the decision minute</h2><p>Give the teams an instruction they can carry out before the notice batch runs.</p><form id="decision-form">'+
    groups.map(([title,start,end])=>'<fieldset class="conference-fields"><legend>'+title+'</legend>'+decisionFields.slice(start,end).map(f=>f.key==='outcome'?choiceGroup('outcome',dispositionOptions,c.answers.outcome,f.label):selectControl(f,c.answers[f.key])).join('')+'</fieldset>').join('')+
    '<label class="case-select"><span>Your signed minute</span><textarea required name="minute" maxlength="6000" rows="3" placeholder="Cite the handoff and replay exhibits by ID or full title. Explain the decision, the remaining uncertainty and who acts next.">'+esc(c.note)+'</textarea></label>'+
    '<button class="btn primary" type="submit">'+icon('shield',16)+' Submit to the review panel</button><span class="case-save" role="status"></span></form></section></div>';
}
function scorecard(sub,modules){
  const result=assess(sub.answers,sub.note);
  const outcome=decisionLabel(sub.answers.outcome);
  const change= sub.first===sub.answers.outcome?'You retained your provisional position.':'Your position changed from '+decisionLabel(sub.first).toLowerCase()+' to '+outcome.toLowerCase()+'.';
  const weak=result.rows.filter(r=>r.points<r.max).sort((a,b)=>a.points/a.max-b.points/b.max);
  const coach=weak[0]?.prompt||'You have a defensible decision. If the manual queue exceeded 20 cases tomorrow, what would you escalate and to whom?';
  return '<section id="case-result" class="case-result"><div class="case-scorehead"><div><span class="minor-label">PANEL DEBRIEF · ATTEMPT '+sub.attempt+'</span><h2>'+ (result.ready?'Ready for panel review':'Return for revision')+'</h2><p>'+esc(change)+'</p></div><div class="case-score">'+result.score+'<small> / 100</small></div></div>'+
    (result.blocks.length?'<div class="panel-blockers"><b>Blocking findings</b><ul>'+result.blocks.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></div>':'')+
    '<div class="case-consequences"><h3>What follows from your instruction</h3>'+consequences(sub.answers).map(p=>'<p>'+esc(p)+'</p>').join('')+'</div>'+
    '<div class="milo-coach" id="case-work"><img src="assets/milo.webp" alt="Milo"><div><span class="minor-label">MILO’S REVIEW QUESTION</span><p>'+esc(coach)+'</p></div></div>'+
    '<div class="rubric-grid" id="case-files">'+result.rows.map(row=>{
      const [id,page]=row.reference,m=modules.find(m=>m.id===id);
      return '<article><div><h3>'+esc(row.title)+'</h3><b>'+row.points+' / '+row.max+'</b></div><ul>'+row.feedback.map(f=>'<li>'+esc(f)+'</li>').join('')+'</ul>'+source(m,page,'Volume '+m.volume)+'</article>';
    }).join('')+'</div><details class="record"><summary><strong>Your submitted minute</strong>'+icon('down',15)+'</summary><div><p class="user-text">'+esc(sub.note)+'</p></div></details>'+
    '<div class="actions"><button class="btn primary" id="export-case">'+icon('download',16)+' Export scored brief</button><button class="btn outline" id="revise-case">Revise your submission</button><a class="text-link" href="#/fieldbook">Open fieldbook '+icon('arrow',15)+'</a></div></section>';
}
export function conferenceExport(sub){
  if(!sub)return [];
  const a=sub.answers, r=assess(a,sub.note);
  return ['## Scored resident case · A renewal on hold','Fictional training case B-441 · Attempt '+sub.attempt,
    'Panel result: '+r.score+'/100 · '+(r.ready?'Ready for panel review':'Return for revision'),
    'Provisional disposition: '+decisionLabel(sub.first),'First enquiry: '+(enquiries.find(e=>e[0]===sub.enquiry)?.[1]||''),
    'Final disposition: '+decisionLabel(a.outcome),'','### Submitted decision record',
    ...caseFields.map(f=>'- '+f.label+' '+labelFor(f.key,a[f.key])),
    '','### Signed minute',sub.note,'','### Panel findings',...r.rows.flatMap(row=>[
      '- '+row.title+' ('+row.points+'/'+row.max+'). '+row.feedback.join(' ')+' Source: '+row.reference[0]+', p. '+row.reference[1]+'.'
    ]),'','Blocking findings: '+(r.blocks.join(' ')||'None.'),'','### Projected consequences',...consequences(a),
    '','### Exhibit register',...exhibits.map(e=>e.id+' · '+e.title+' · '+e.time+' · '+e.owner+'. '+e.text+' '+e.limit)];
}
export function renderConference(main,modules,onStage){
  const c=getCase();
  let activeRecord='';
  function go(stage){
    if(stage===2&&!isComplete(c.answers,evidenceFields))stage=1;
    if(stage===3&&!c.submitted)stage=0;
    c.stage=stage;
    persist();draw(true);onStage?.();
  }
  function storeDraft(form){
    const data=new FormData(form);
    for(const f of caseFields)if(data.has(f.key))c.answers[f.key]=data.get(f.key);
    if(data.has('minute'))c.note=data.get('minute');
    if(!c.revealed){if(data.has('first'))c.first=data.get('first');if(data.has('enquiry'))c.enquiry=data.get('enquiry')}
    const saved=persist();
    const msg=form.querySelector('.case-save');if(msg)msg.textContent=saved?'Draft saved on this device.':'Draft is held in this tab.';
  }
  function draw(focus){
    main.innerHTML=hero()+'<div class="wrap conference" id="case-brief">'+phaseNav(c)+
      (c.stage===0?opening(c):c.stage===1?evidence(c,activeRecord):c.stage===2?decision(c):scorecard(c.submitted,modules))+
      '<div class="conference-bottom"><span>Fictional training case · Civic Atlas</span><a class="text-link" href="#/playbook/capstone/sources">Original capstone playbook '+icon('arrow',14)+'</a></div></div>';
    main.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>go(Number(b.dataset.stage)));
    function wireRecords(){
      const el=main.querySelector('.case-files');
      if(!el)return;
      el.querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>{
        activeRecord=b.dataset.record;
        el.outerHTML=exhibitReader(c.stage===0?exhibits.slice(0,3):exhibits,activeRecord);
        wireRecords();
        main.querySelector('[data-record="'+activeRecord+'"]').focus({preventScroll:true});
      });
    }
    wireRecords();
    const form=main.querySelector('#opening-form, #evidence-form, #decision-form');
    if(form){
      form.addEventListener('input',()=>storeDraft(form));
      form.onsubmit=e=>{
        e.preventDefault();storeDraft(form);
        if(c.stage===0){c.revealed=true;activeRecord=enquiries.find(row=>row[0]===c.enquiry)?.[3]||'R04';go(1);return}
        if(c.stage===1){go(2);return}
        const note=form.elements.namedItem('minute');
        if(!c.note.trim()){note.setCustomValidity('Write your decision minute before submitting.');note.reportValidity();note.addEventListener('input',()=>note.setCustomValidity(''),{once:true});return}
        if(!isComplete(c.answers,caseFields))return;
        const same=c.submitted&&caseFields.every(f=>c.submitted.answers[f.key]===c.answers[f.key])&&c.submitted.note===c.note.trim();
        if(!same){c.attempts++;c.submitted={first:c.first,enquiry:c.enquiry,answers:{...c.answers},note:c.note.trim(),attempt:c.attempts}}
        go(3);
      };
    }
    const exp=main.querySelector('#export-case');
    if(exp)exp.onclick=()=>downloadFile('northbridge-scored-resident-brief.md',['# Civic Atlas decision brief','',...conferenceExport(c.submitted)].join('\n'));
    const rev=main.querySelector('#revise-case');if(rev)rev.onclick=()=>go(1);
    if(focus){const panel=main.querySelector('.case-nav');panel.scrollIntoView({block:'start',behavior:'instant'});panel.querySelector('[aria-current]').focus({preventScroll:true})}
  }
  draw(false);
}
