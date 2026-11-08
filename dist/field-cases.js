import procurement from './scenarios/procurement.js';
import permitting from './scenarios/permitting.js';
import benefits from './scenarios/benefits.js';

export const fieldCases=[procurement,permitting,benefits];
export const fieldCaseFor=id=>fieldCases.find(item=>item.id===id);
export const caseUrl=id=>'#/playbook/'+id+'/fieldcase';

export function caseRecords(c,enquiry){
  const branch=c.enquiries.find(item=>item.id===enquiry);
  return [...c.opening,c.update,...(branch?[branch.record]:[])];
}

export function assessFieldCase(c,entry){
  const {answers,enquiry}=entry;
  const branch=c.enquiries.find(item=>item.id===enquiry);
  const action=c.actions.find(item=>item.id===answers.action);
  const unavailable=action?.requiresEnquiry&&action.requiresEnquiry!==enquiry;
  const actionPoints=unavailable?0:action?.points??0;
  const blocks=[];
  if(unavailable)blocks.push(action.missingFeedback);
  if(action?.block)blocks.push(action.block);
  const dimensions=[{
    key:'decision',title:'Operating decision',points:actionPoints,max:30,page:c.pages.decision,
    detail:unavailable?action.missingFeedback:action?.feedback||'A final operating decision is required.'
  }];
  const evidence=c.claims.map((claim,i)=>{
    const expected=claim.expected==='return'?branch?.record.id:claim.expected;
    const selected=answers['claim'+i];
    const ok=!!expected&&expected===selected;
    return {label:claim.label,selected,expected,ok};
  });
  const correct=evidence.filter(item=>item.ok).length;
  if(correct===0)blocks.push('Neither finding is supported by the attached exhibit. Reconcile the records before signing.');
  dimensions.push({key:'evidence',title:'Evidence links',points:10*correct,max:20,page:c.pages.evidence,
    detail:evidence.map(item=>item.ok?item.selected+' supports its finding.':'Review '+(item.expected||'the investigation return')+' for “'+item.label+'”').join(' ')});
  for(const control of c.controls){
    const opt=control.options.find(item=>item.id===answers[control.key]);
    if(opt?.block)blocks.push(opt.block);
    dimensions.push({key:control.key,title:({owner:'Accountable owner',safeguard:'Immediate protection',retest:'Next decision gate'})[control.key],
      points:opt?.points??0,max:control.weight,page:control.page,detail:opt?.feedback||'No instruction recorded.'});
  }
  const points=dimensions.reduce((sum,item)=>sum+item.points,0);
  const ready=points>=80&&blocks.length===0;
  const weakest=dimensions.reduce((weak,item)=>item.points/item.max<weak.points/weak.max?item:weak);
  const coach=points===100&&ready?c.coach.passed:c.coach[weakest.key];
  return {points,ready,blocks,dimensions,coach,effect:unavailable?action.missingEffect:action?.effect||''};
}

export function validFieldSubmission(c,entry){
  const a=entry.answers;
  const records=caseRecords(c,entry.enquiry);
  return c.initial.some(x=>x.id===entry.initial) &&
    c.enquiries.some(x=>x.id===entry.enquiry) &&
    c.actions.some(x=>x.id===a.action) &&
    c.claims.every((_,i)=>records.some(x=>x.id===a['claim'+i])) &&
    c.controls.every(control=>control.options.some(x=>x.id===a[control.key])) &&
    !!entry.minute?.trim();
}

export function exportFieldCase(c,entry){
  const branch=c.enquiries.find(x=>x.id===entry.enquiry);
  const first=c.initial.find(x=>x.id===entry.initial);
  const action=c.actions.find(x=>x.id===entry.answers.action);
  const result=assessFieldCase(c,entry);
  return [
    '## '+c.title,'Fictional Northbridge field case · '+c.role,'Decision due: '+c.deadline,'',
    'Opening instruction: '+first.label,'Consequence: '+first.effect,
    'New evidence: '+c.update.id+' · '+c.update.title,
    'Investigation commissioned: '+branch.label,'Return: '+branch.record.id+' · '+branch.record.title,
    'Final instruction: '+action.label,'Projected operational consequence: '+result.effect,'',
    '### Evidence and controls',
    ...c.claims.map((claim,i)=>claim.label+' '+entry.answers['claim'+i]),
    ...c.controls.map(control=>control.label+' '+control.options.find(o=>o.id===entry.answers[control.key]).label),
    '','### Decision minute',entry.minute,'','### Debrief',
    result.points+'/100 · '+(result.ready?'Ready for review':'Revise the instruction'),
    ...result.dimensions.map(dim=>dim.title+' '+dim.points+'/'+dim.max+' · '+dim.detail+' Playbook p. '+dim.page+'.'),
    'Blocking findings: '+(result.blocks.join(' ')||'None.'),'Milo’s question: '+result.coach,
    '','### Records available on this run',
    ...caseRecords(c,entry.enquiry).map(r=>r.id+' · '+r.title+' · '+r.owner+' · '+r.time+'\n'+r.body+'\nRecord scope: '+r.limit)
  ];
}

export function savedCaseReturns(c,state){
  const list=Object.values(state.fieldCases?.[c.id]?.returns||{});
  return list.filter(item=>validFieldSubmission(c,item)).sort((a,b)=>b.number-a.number);
}

export function exportAllFieldCases(state){
  return fieldCases.flatMap(c=>savedCaseReturns(c,state).flatMap(entry=>['',...exportFieldCase(c,entry)]));
}
