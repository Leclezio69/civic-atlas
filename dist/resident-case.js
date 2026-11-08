// The exhibits and results below are fictional. The linked pages teach the assurance methods.
export const exhibits = [
  {
    id: 'R01', title: 'Stamped counter receipt', team: 'Resident services', time: 'Thursday · 09:04',
    owner: 'Inez Cole, counter supervisor',
    text: 'Mara Ellis reported her move in person before her renewal deadline. Receipt NB-184 confirms that staff checked her proof of address and accepted the correction. Mara asked for a telephone callback because she had lost access to her online account.',
    limit: 'The receipt records acceptance at the counter. It contains no confirmation from the benefits system.'
  },
  {
    id: 'R02', title: 'Renewal exception', team: 'Benefits', time: 'Thursday · 09:12',
    owner: 'Grace Okafor, benefits duty officer',
    text: 'Case B-441 still shows the previous address. The AI-assisted renewal workflow drafted a missing-evidence notice and put the case in a hold queue. An officer has yet to review it. A weekend batch will issue outstanding notices at 12:15 on Friday.',
    limit: 'A queue entry records the workflow state. It does not establish that the resident failed to provide evidence.'
  },
  {
    id: 'R03', title: 'Supplier readiness dashboard', team: 'Procurement', time: 'Thursday · 17:00',
    owner: 'Theo Lin, supplier manager',
    text: 'The vendor reports 99.2% successful intake requests over 30 days. Procurement recommends expanding the connector at noon. Its definition of success is a gateway acknowledgement. The report groups all versions and address types together.',
    limit: 'The dashboard measures receipt at the gateway. It does not measure whether the corrected record appeared downstream.'
  },
  {
    id: 'R04', title: 'Correlated delivery trace', team: 'Data and records', time: 'Friday · 11:32',
    owner: 'Luis Vega, records steward',
    text: 'Luis ties NB-184 to B-441 using correlation ID X17. The intake gateway accepted version 3.2 of the change event. The benefits adapter rejected its new address field. The gateway marked delivery complete and scheduled no retry.',
    limit: 'The trace establishes what happened to Mara’s record. It cannot establish the frequency of the failure across the city.'
  },
  {
    id: 'R05', title: 'Independent journey replay', team: 'Service assurance', time: 'Friday · 11:36',
    owner: 'Noor Bell, assurance lead',
    text: 'Noor replayed 12 synthetic moved-address renewals on version 3.2. Four failed to update the benefits record and generated a hold. All four had a gateway acknowledgement. The adapter fix has yet to be tested. The 12 cases were deliberately selected for this failure mode.',
    limit: 'The replay reproduces the defect. Four failures in a targeted sample do not provide a citywide failure rate.'
  },
  {
    id: 'R06', title: 'Signed continuity and exit plan', team: 'Service operations', time: 'Friday · 11:40',
    owner: 'Amina Shah, director of resident services',
    text: 'Amina can restrict, pause or retire the connector. A roster covers 20 manual cases per day for five working days. Isolated shadow testing cannot write cases or send notices. The contract permits an exit with the audit log preserved. Grace owns individual renewals and staffed reviews. Luis owns correction of the shared record.',
    limit: 'Manual capacity expires after five working days and needs a daily queue review. No officer has signed off live version 3.2.'
  }
];
export const dispositionOptions = [
  ['proceed','Proceed'], ['pause','Pause'], ['retire','Retire']
];
const recordOptions = exhibits.map(r => [r.id, r.id + ' · ' + r.title]);
export const evidenceFields = [
  {key:'receipt', label:'Which exhibit establishes that Mara met the deadline?', options:recordOptions},
  {key:'trace', label:'Which exhibit locates the failed handoff in Mara’s case?', options:recordOptions},
  {key:'finding', label:'What explains the conflicting records?', options:[
    ['resident','Mara submitted the correction after the renewal cut-off.'],
    ['adapter','The gateway accepted the change, but the benefits adapter rejected it.'],
    ['unknown','The records disagree and the cause is still untraced.']]},
  {key:'testRecord', label:'Which exhibit independently tests whether the defect repeats?', options:recordOptions},
  {key:'scope', label:'How far does that evidence reach?', options:[
    ['population','One third of all city renewals are likely affected.'],
    ['one','The issue is confined to Mara’s renewal.'],
    ['targeted','The defect recurs in the tested cohort. Citywide prevalence is unknown.']]}
];
export const decisionFields = [
  {key:'outcome',label:'What is your noon decision on the connector?',options:dispositionOptions},
  {key:'boundary',label:'What exactly do you authorise?',options:[
    ['live','Enable live citywide transfers and monitor exceptions.'],
    ['bridge','Suspend live transfers, use the staffed bridge and retest.'],
    ['shadow','Run isolated shadow tests while officers process live cases.'],
    ['exit','Exit the connector, preserve the logs and commission a replacement.']]},
  {key:'authority',label:'Who signs the connector decision?',options:[
    ['supplier','Theo Lin · supplier manager'],['director','Amina Shah · service director'],['steward','Luis Vega · records steward']]},
  {key:'caseOwner',label:'Who owns Mara’s renewal and its written outcome?',options:[
    ['officer','Grace Okafor · benefits duty officer'],['vendor','Vendor incident lead'],['steward','Luis Vega · records steward']]},
  {key:'protection',label:'What happens before the 12:15 notice batch?',options:[
    ['new','Invite a new application using today’s date.'],['note','Flag B-441 for review after the batch runs.'],
    ['hold','Suppress the draft notice, retain Thursday’s receipt date and assign a manual review.']]},
  {key:'remedy',label:'How can Mara correct or challenge the outcome?',options:[
    ['portal','Send a status update to her online account.'],
    ['callback','Call her on the agreed route, offer staffed review and confirm the outcome in writing.'],
    ['desk','Direct her to the general help desk without a named reviewer.']]},
  {key:'retest',label:'What evidence permits a future live release or replacement?',options:[
    ['vendor','A supplier declaration that the address mapping was fixed.'],
    ['gateway','A sample of successful gateway acknowledgements.'],
    ['journey','Replay the four failures plus control cases through correction, notice and review.']]},
  {key:'oversight',label:'How will you control the manual bridge?',options:[
    ['monthly','Review the queue at the next monthly portfolio meeting.'],
    ['daily','Review capacity daily. Escalate before the five-day roster ends and require officer sign-off before live release.'],
    ['open','Use manual processing until the supplier advises that it is safe to switch back.']]}
];
export const caseFields = [...evidenceFields,...decisionFields];
export function labelFor(key,value){
  const spec=caseFields.find(f=>f.key===key);
  return spec?.options.find(([id])=>id===value)?.[1] || 'Not recorded';
}
export function isComplete(answers,fields){
  return fields.every(f=>f.options.some(([id])=>answers[f.key]===id));
}
const boundaries={proceed:'shadow',pause:'bridge',retire:'exit'};

// Points reward verifiable claim–record links and explicit operating commitments.
function citesRecord(note,id){
  const exhibit=exhibits.find(record=>record.id===id);
  const number=String(Number(id.slice(1)));
  const pattern=new RegExp('\\bR[ -]?0?'+number+'\\b','i');
  return pattern.test(note)||note.toLowerCase().includes(exhibit.title.toLowerCase());
}
export function assess(answers,note=''){
  const a=answers;
  const rows=[];
  function dimension(title, checks, prompt, reference){
    const points=checks.reduce((sum,c)=>sum+(c.ok?c.weight:0),0);
    rows.push({title,points,max:checks.reduce((sum,c)=>sum+c.weight,0),
      feedback:checks.map(c=>c.ok?c.met:c.gap),prompt,reference});
  }
  dimension('Trace the handoff',[
    {ok:a.receipt==='R01',weight:8,met:'R01 verifies the original submission time.',gap:'The resident’s dated counter receipt is the record of timely submission.'},
    {ok:a.trace==='R04',weight:10,met:'R04 connects the two case identifiers to the adapter rejection.',gap:'Look for a record that follows one event from intake to the receiving adapter.'},
    {ok:a.finding==='adapter',weight:7,met:'Your finding accounts for both the acknowledgement and the hold.',gap:'The 11:32 trace identifies the field rejection after acknowledgement.'}
  ],'Which record proves receipt, and which one proves the result at the receiving system?',['data-records',11]);
  dimension('Interpret the test',[
    {ok:a.testRecord==='R05',weight:8,met:'R05 supplies independent replay evidence.',gap:'The assurance team replayed the failure against version 3.2 in R05.'},
    {ok:a.scope==='targeted',weight:7,met:'You limited the inference to the deliberately selected test cohort.',gap:'The sample can establish recurrence. Its selection prevents a citywide prevalence estimate.'}
  ],'Would the same four failures support a citywide estimate if the cases were deliberately selected?',['capstone',15]);
  dimension('Assign authority',[
    {ok:a.authority==='director',weight:8,met:'The service director has delegated release authority.',gap:'R06 delegates the connector decision to Amina Shah.'},
    {ok:a.caseOwner==='officer',weight:7,met:'Grace owns the resident’s renewal decision.',gap:'R06 assigns renewal decisions and staffed reviews to the benefits duty officer.'}
  ],'Who can stop the service, and who must answer Mara about her individual case?',['capstone',7]);
  dimension('Protect the resident',[
    {ok:a.protection==='hold',weight:10,met:'You preserved the filing date and intercepted the unsupported notice.',gap:'A later review leaves the 12:15 notice or the original filing date exposed.'},
    {ok:a.remedy==='callback',weight:10,met:'Mara has an accessible callback, a staffed review and a written outcome.',gap:'Mara cannot use her account. A reachable officer and written outcome make the review usable.'}
  ],'If Mara cannot log in today, how will she reach the officer before the notice affects her renewal?',['data-records',21]);
  dimension('Prove readiness',[
    {ok:a.retest==='journey',weight:10,met:'You require a downstream journey test for failed and control cases.',gap:'A supplier statement or gateway success cannot prove the downstream outcome.'},
    {ok:a.oversight==='daily',weight:5,met:'The manual bridge has a capacity review, escalation point and sign-off condition.',gap:'The roster expires in five working days. Someone must review the queue before then.'}
  ],'What observable result would persuade you that the resident’s entire journey now works?',['procurement-supplier',22]);
  const consistent=Boolean(boundaries[a.outcome])&&boundaries[a.outcome]===a.boundary;
  const citesTrace=citesRecord(note,'R04'),citesReplay=citesRecord(note,'R05');
  dimension('Defend the disposition',[
    {ok:consistent,weight:6,met:'Your disposition and operating boundary agree with the available continuity plan.',gap:'Align the decision with its operating boundary. R06 supports shadow-only operation, a staffed pause or a controlled exit.'},
    {ok:citesTrace,weight:2,met:'The signed minute identifies the correlated delivery trace.',gap:'Identify the delivery trace in your signed minute by exhibit ID or full title.'},
    {ok:citesReplay,weight:2,met:'The signed minute identifies the independent replay.',gap:'Identify the independent replay in your signed minute by exhibit ID or full title.'}
  ],'What can the connector still do after your instruction, and who could be affected?',['capstone',22]);
  const blocks=[];
  if(!citesTrace||!citesReplay)blocks.push('A reviewer must be able to locate the case trace and independent test from the signed minute. Cite each exhibit by ID or full title.');
  if(a.trace!=='R04'||a.testRecord!=='R05')blocks.push('The decision needs the case-specific delivery trace and the independent replay as supporting exhibits.');
  if(a.authority!=='director')blocks.push('The connector instruction needs the officer with delegated release authority.');
  if(a.boundary==='live')blocks.push('Live rollout would expose more residents to a reproduced, uncorrected defect.');
  if(a.protection!=='hold')blocks.push('The decision leaves Mara’s filing date or the 12:15 notice unprotected.');
  if(a.caseOwner!=='officer'||a.remedy!=='callback')blocks.push('Mara lacks an accountable, accessible route to have the outcome reviewed.');
  if(!consistent)blocks.push('The selected disposition conflicts with the operating instruction.');
  const score=rows.reduce((sum,r)=>sum+r.points,0);
  return {score,rows,blocks,ready:score>=80&&!blocks.length};
}
export function consequences(a){
  const release={live:'The live connector continues to write renewal records while the version 3.2 defect is open.',shadow:'The city gains shadow-test evidence while live renewals stay with officers.',bridge:'The manual team takes the live queue for a time-limited pause.',exit:'The connector is withdrawn. Audit records are preserved and replacement work needs an owner.'};
  const resident = a.protection==='hold'?'The 12:15 batch skips B-441 and Thursday’s filing date is retained.':a.protection==='new'?'A new application would lose the benefit of the original filing date.':'B-441 can enter the 12:15 batch before an officer reviews the error.';
  const remedy=a.remedy==='callback'?'Mara can request a staffed review by phone and receive the outcome in writing.':a.remedy==='portal'?'The response goes to an account Mara cannot access.':'Mara must explain the disputed record again to the general help desk.';
  return [resident+' '+remedy,release[a.boundary]||'An operating boundary is still required.'];
}
