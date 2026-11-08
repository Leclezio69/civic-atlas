import {esc, icon, source, pageTitles} from './ui.js';
import {state, persist, downloadFile} from './state.js';
import {caseUrl, fieldCases, caseRecords, assessFieldCase, validFieldSubmission, exportFieldCase, savedCaseReturns} from './field-cases.js';
import {exhibitReader} from './exhibit-reader.js';

const stages=['Opening brief','New evidence','Decision minute','Debrief'];
const emptyRun=()=>({stage:0,initial:'',enquiry:'',answers:{},minute:''});

function workspace(id){
  state.fieldCases??={};
  return state.fieldCases[id]??={run:emptyRun(),returns:{},counter:0};
}

export function practiceList(){
  return '<section class="wrap practice-shelf" id="field-cases"><div class="section-head"><div><div class="eyebrow"><i></i>APPLIED CASES</div><h2>Decisions under review</h2></div></div><div class="practice-links">'+fieldCases.map(c=>
    '<a href="'+caseUrl(c.id)+'"><img src="assets/'+esc(c.id)+'-p'+c.imagePage+'.webp" alt="" loading="lazy"><div><span class="minor-label">'+esc(pageTitles[c.id])+'</span><h3>'+esc(c.title)+'</h3></div>'+icon('arrow',18)+'</a>').join('')+'</div></section>';
}

export function practiceSummary(){
  const started=fieldCases.filter(c=>state.fieldCases?.[c.id]);
  if(!started.length)return '';
  return '<section class="field-reports"><div class="section-head"><h2>Applied case records</h2></div>'+started.map(c=>{
    const entries=savedCaseReturns(c,state);
    return '<details class="record"><summary><strong>'+esc(c.title)+'</strong><small>'+entries.length+' / 2 investigations filed</small>'+icon('down',15)+'</summary><div>'+
      (entries.length?entries.map(entry=>{
        const result=assessFieldCase(c,entry);
        const branch=c.enquiries.find(e=>e.id===entry.enquiry);
        const action=c.actions.find(a=>a.id===entry.answers.action);
        return '<section><b>'+esc(branch.label)+'</b><p>'+result.points+'/100 · '+(result.ready?'Ready for review':'Revision required')+'</p><p>'+esc(action.label)+'</p><p class="user-text">'+esc(entry.minute)+'</p></section>';
      }).join(''):'<p>Case in progress. Your draft is saved in this browser.</p>')+
      '<a class="text-link" href="'+caseUrl(c.id)+'">Open case '+icon('arrow',14)+'</a></div></details>';
  }).join('')+'</section>';
}

function radioList(name,items,selected,legend){
  return '<fieldset class="practice-options"><legend>'+esc(legend)+'</legend>'+items.map((o,i)=>
    '<label><input type="radio" required name="'+name+'" value="'+esc(o.id)+'" '+(o.id===selected?'checked':'')+'><b>'+String.fromCharCode(65+i)+'</b><span>'+esc(o.label)+'</span></label>').join('')+'</fieldset>';
}
function selectList(name,items,selected,label){
  return '<label class="case-select"><span>'+esc(label)+'</span><select required name="'+name+'"><option value="">Choose a response</option>'+
    items.map(o=>'<option value="'+esc(o.id)+'" '+(o.id===selected?'selected':'')+'>'+esc(o.label)+'</option>').join('')+'</select></label>';
}
function mandate(c){
  return '<div class="practice-mandate"><span>'+icon('field',16)+' '+esc(c.role)+'</span><span>'+icon('time',16)+' '+esc(c.deadline)+'</span></div>';
}
function focusPoint(){
  const h=document.querySelector('#practice-heading');
  if(!h)return;
  h.focus({preventScroll:true});
  document.querySelector('#practice-stage').scrollIntoView({block:'start',behavior:'instant'});
}
function resultPanel(c,entry,m){
  const result=assessFieldCase(c,entry), branch=c.enquiries.find(e=>e.id===entry.enquiry), first=c.initial.find(x=>x.id===entry.initial), action=c.actions.find(x=>x.id===entry.answers.action);
  const other=savedCaseReturns(c,state).find(e=>e.enquiry!==entry.enquiry);
  const compare=other?'<div class="run-compare"><h3>Your other investigation</h3><p><b>'+esc(c.enquiries.find(x=>x.id===other.enquiry).label)+'</b> · '+assessFieldCase(c,other).points+'/100</p><p>'+esc(c.actions.find(x=>x.id===other.answers.action).label)+'</p></div>':'';
  return '<section id="case-result"><div class="case-scorehead"><div><span class="minor-label">FILED DECISION · '+esc(branch.record.id)+'</span><h2 tabindex="-1" id="practice-heading">'+(result.ready?'Ready for review':'Revise the instruction')+'</h2><p>'+esc(action.label)+'</p></div><div class="case-score">'+result.points+'<small> / 100</small></div></div>'+
    (result.blocks.length?'<div class="panel-blockers"><b>Blocking findings</b><ul>'+result.blocks.map(b=>'<li>'+esc(b)+'</li>').join('')+'</ul></div>':'')+
    '<div class="practice-trace"><div><span class="minor-label">OPENING INSTRUCTION</span><p>'+esc(first.label)+'</p><small>'+esc(first.effect)+'</small></div><div><span class="minor-label">INVESTIGATION</span><p>'+esc(branch.record.title)+'</p><small>'+esc(branch.record.body)+'</small></div><div><span class="minor-label">PROJECTED OUTCOME</span><p>'+esc(result.effect)+'</p></div></div>'+
    '<div class="milo-coach" id="practice-coach"><img src="assets/milo.webp" alt="Milo"><div><span class="minor-label">MILO’S REVIEW QUESTION</span><p>'+esc(result.coach)+'</p></div></div>'+
    '<div class="rubric-grid" id="practice-rubric">'+result.dimensions.map(d=>'<article><div><h3>'+esc(d.title)+'</h3><b>'+d.points+' / '+d.max+'</b></div><p>'+esc(d.detail)+'</p>'+source(m,d.page,'Playbook')+'</article>').join('')+'</div>'+
    '<details class="record"><summary><strong>Review the exhibits from this investigation</strong>'+icon('down',16)+'</summary><div>'+exhibitReader(caseRecords(c,entry.enquiry),branch.record.id)+'</div></details>'+
    '<details class="record"><summary><strong>Filed decision minute</strong>'+icon('down',16)+'</summary><div><p class="user-text">'+esc(entry.minute)+'</p></div></details>'+compare+
    '<div class="actions"><button id="practice-export" class="btn primary">'+icon('download',16)+' Export case brief</button><button id="practice-revise" class="btn outline">Revise decision</button><button id="practice-replay" class="btn outline">Replay from opening</button><a class="text-link" href="#/fieldbook">Open fieldbook '+icon('arrow',15)+'</a></div><p class="practice-meta">Your fieldbook keeps the latest filed brief for each investigation.</p></section>';
}

export function mountFieldPractice(main,c,m,refreshGuide){
  const ws=workspace(c.id);
  let activeId='';
  const panel=main.querySelector('#practice-workspace');
  const run=()=>ws.run;
  function draw(focus=false){
    const draft=run();
    const phase=draft.stage;
    const branch=c.enquiries.find(q=>q.id===draft.enquiry);
    const first=c.initial.find(o=>o.id===draft.initial);
    const available=phase===0?c.opening:phase===1?[...c.opening,c.update]:caseRecords(c,draft.enquiry);
    const active=available.some(e=>e.id===activeId)?activeId:available.at(phase===0?0:-1).id;
    let body;
    if(phase===3){
      body=resultPanel(c,ws.returns[draft.enquiry],m);
    }else{
      let content='';
      if(phase===0){
        content='<span class="minor-label">'+esc(c.openingTime)+'</span><h2 id="practice-heading" tabindex="-1">Your opening instruction</h2><p>Read the opening exhibits and decide what the team should do before the next update.</p><form id="practice-form">'+
          radioList('initial',c.initial,draft.initial,c.openingQuestion)+'<button class="btn primary">Record and open update '+icon('arrow',16)+'</button></form><p class="case-footnote">Your opening call is retained for the debrief. The scored decision comes after the investigation.</p>';
      }else if(phase===1){
        content='<span class="minor-label">'+esc(c.updateTime)+'</span><h2 id="practice-heading" tabindex="-1">'+esc(c.update.title)+'</h2><p>The late record is open in the evidence register. Decide which uncertainty the team should investigate before the deadline.</p>'+
          '<div class="initial-effect"><b>Effect of your opening instruction</b><p>'+esc(first.effect)+'</p></div><form id="practice-form">'+
          radioList('enquiry',c.enquiries,draft.enquiry,c.enquiryQuestion)+'<button class="btn primary">Commission investigation '+icon('arrow',16)+'</button></form><p class="case-footnote">Time allows one investigation before the decision. Replay the case to examine the other return.</p>';
      }else{
        const a=draft.answers;
        content='<span class="minor-label">DECISION DEADLINE</span><h2 id="practice-heading" tabindex="-1">Issue your instruction</h2><p>'+esc(c.deadline)+'</p><form id="practice-form">'+
          radioList('action',c.actions,a.action,c.decisionQuestion)+
          '<fieldset class="conference-fields"><legend>Attach the evidence</legend>'+c.claims.map((q,i)=>selectList('claim'+i,available.map(e=>({id:e.id,label:e.id+' · '+e.title})),a['claim'+i],q.label)).join('')+'</fieldset>'+
          '<fieldset class="conference-fields"><legend>Set the controls</legend>'+c.controls.map(q=>selectList(q.key,q.options,a[q.key],q.label)).join('')+'</fieldset>'+
          '<label class="case-select"><span>Your decision minute</span><textarea required maxlength="6000" name="minute" rows="3" placeholder="Explain what changed, the limits of the evidence and who acts next.">'+esc(draft.minute)+'</textarea></label>'+
          '<p class="case-footnote">The panel scores the instruction, exhibit links and controls. A review-ready brief needs 80/100 and no blocking findings. The written minute accompanies the score for human review.</p><button class="btn primary">'+icon('shield',16)+' File decision for review</button></form>';
      }
      body='<div class="case-columns"><div class="practice-evidence">'+
        (phase===2?'<div class="branch-receipt"><span class="minor-label">INVESTIGATION RETURN</span><h3>'+esc(branch.record.title)+'</h3><p>'+esc(branch.label)+'</p></div>':'')+
        exhibitReader(available,active)+'</div><section id="practice-work" class="case-work">'+content+'</section></div>';
    }
    panel.innerHTML=mandate(c)+'<div id="practice-stage" class="practice-stages" aria-label="Case progress">'+stages.map((s,i)=>'<span '+(i===phase?'aria-current="step"':'')+'><b>'+String(i+1).padStart(2,'0')+'</b>'+esc(s)+'</span>').join('')+'</div>'+body+
      '<div class="conference-bottom"><span>Fictional training case · Northbridge City and County</span><a class="text-link" href="#/playbook/'+esc(m.id)+'/sources">Open the sourcebook '+icon('arrow',14)+'</a></div>';
    function wireRecords(){
      const elm=panel.querySelector('#case-files');
      if(!elm)return;
      elm.querySelectorAll('[data-record]').forEach(btn=>btn.onclick=()=>{
        activeId=btn.dataset.record;
        elm.outerHTML=exhibitReader(available,activeId);
        wireRecords();
        panel.querySelector('[data-record="'+activeId+'"]').focus({preventScroll:true});
      });
    }
    wireRecords();
    const form=panel.querySelector('#practice-form');
    if(form){
      function update(){
        const values=Object.fromEntries(new FormData(form));
        if(phase===0)draft.initial=values.initial||'';
        if(phase===1)draft.enquiry=values.enquiry||'';
        if(phase===2){
          const {minute,...answers}=values;
          draft.minute=minute||'';
          draft.answers=answers;
        }
        if(!persist())panel.querySelector('.conference-bottom>span').textContent='Storage unavailable. Export your filed decision before leaving this tab.';
      }
      form.addEventListener('input',update);
      form.addEventListener('submit',e=>{
        e.preventDefault();
        update();
        if(phase===2){
          if(!draft.minute.trim()){
            const note=form.elements.namedItem('minute');
            note.setCustomValidity('Add a decision minute before filing.');
            note.reportValidity();
            note.addEventListener('input',()=>note.setCustomValidity(''),{once:true});
            return;
          }
          if(!validFieldSubmission(c,draft))return;
          ws.counter++;
          ws.returns[draft.enquiry]={initial:draft.initial,enquiry:draft.enquiry,answers:{...draft.answers},minute:draft.minute.trim(),number:ws.counter};
        }
        draft.stage=phase+1;
        activeId='';
        persist();draw(true);
      });
    }else{
      panel.querySelector('#practice-export').onclick=()=>{
        const e=ws.returns[draft.enquiry];
        downloadFile(c.id+'-case-brief.md',['# Civic Atlas applied case','',...exportFieldCase(c,e)].join('\n'));
      };
      panel.querySelector('#practice-revise').onclick=()=>{draft.stage=2;persist();draw(true)};
      panel.querySelector('#practice-replay').onclick=()=>{ws.run=emptyRun();activeId='';persist();draw(true)};
    }
    if(focus){focusPoint();refreshGuide()}
  }
  draw();
}

export function practiceGuide(c){
  const ws=state.fieldCases?.[c.id], phase=ws?.run?.stage||0;
  if(phase===3){
    const r=assessFieldCase(c,ws.returns[ws.run.enquiry]);
    return [['#case-result','Read the operating consequence',r.effect],['#practice-coach','Defend your position',r.coach],['#practice-rubric','Review the source standard','Each scoring row links to the playbook. Revise the same decision or replay from the opening to investigate the other path.']];
  }
  if(phase===2)return [['.branch-receipt','Interpret the return',c.coach.evidence],['#practice-work','Set the operating boundary',c.coach.decision],['#practice-form','Make it executable',c.coach.retest]];
  if(phase===1)return [['#practice-work','Read the new evidence',c.update.limit],['.initial-effect','Follow your opening instruction','Which part of the operating picture changed because of your initial choice?'],['#practice-form','Choose your investigation',c.enquiryQuestion]];
  return [['.practice-mandate','Take the assigned role',c.brief],['#case-files','Inspect the opening record','Read each exhibit and its scope. What does the file establish, and what remains unverified?'],['#practice-work','Record your first call',c.openingQuestion]];
}
