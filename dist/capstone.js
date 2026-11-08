import {line,icon,esc,source} from './ui.js';
import {state,persist,downloadFile} from './state.js';
import {conferenceExport} from './case-conference.js';
import {fieldCases,savedCaseReturns,exportAllFieldCases} from './field-cases.js';
export const gateDefs=[
  {
    title:'Count',
    task:'Reconcile the register with procurement spend, embedded supplier tools and actual staff use.',
    prompt:'Name the service, its owner, its model or supplier, and the source used to verify the inventory.',
    page:21
  },
  {
    title:'Classify',
    task:'Assign the portfolio assurance tier, check the stop list and name an accountable officer.',
    prompt:'Identify the decision boundary, tier, officer and stop condition.',
    page:21
  },
  {
    title:'Evidence',
    task:'Assemble the assurance file for each Tier 2 and Tier 3 use. Trace each claim to a dated record.',
    prompt:'Give an evidence reference, what it proves, its owner and the date it was reviewed.',
    page:21
  },
  {
    title:'Test',
    task:'Walk a resident journey and test distribution, drift, consistency, security and outage handling.',
    prompt:'Describe a test, the expected result, what happened and the remaining gap.',
    page:21
  },
  {
    title:'Remediate',
    task:'Fix, pause or retire weak uses. Record each open finding, its owner and deadline, then retest.',
    prompt:'Record a finding, the response, a retest result and the accountable owner.',
    page:22
  },
  {
    title:'Sign and publish',
    task:'Document the officers’ decisions and material open findings for the portfolio assurance statement.',
    prompt:'Set out what can be signed, which risks remain open, and what will be published.',
    page:22
  }
];
export function renderCapstone(main,modules){
  const m=modules.at(-1);
  let active=0;
  main.innerHTML='<div class="cap-banner"><div class="wrap">'+line('PORTFOLIO NOTEBOOK')+'<h1>The assurance brief</h1><p>Build an evidence file for Northbridge’s AI portfolio, one gate at a time.</p><a class="btn glass" href="#/playbook/capstone/briefing">'+icon('book',17)+
    ' Read volume 10</a></div></div><div class="module-bar"><div class="wrap"><nav aria-label="Capstone workspaces"><a href="#/capstone">Scored resident case</a><a href="#/capstone/notebook" aria-current="page">Portfolio notebook</a></nav></div></div><div class="wrap cap-body"><section class="cap-intro" id="cap-brief"><div><span class="minor-label">YOUR MANDATE</span><h2>Bring the portfolio to review.</h2><p>Northbridge’s initial inventory found 23 AI uses against the 14 it expected. Two summarisation tools had arrived inside existing contracts. Prepare the evidence a review panel would need before signing the portfolio statement. '+source(m,5,'Case')+
    '</p></div><aside><b>Evidence available in your fieldbook</b><p>'+Object.keys(state.completed).length+
    ' completed volumes · '+fieldCases.reduce((n,c)=>n+savedCaseReturns(c,state).length,0)+' applied case briefs · '+(state.lastRun?'1 simulator debrief':'0 simulator debriefs')+
    '</p><a class="text-link" href="#/fieldbook">Review fieldbook '+icon('arrow',15)+
    '</a></aside></section><div class="section-head"><div>'+line('CP0 — CP5')+
    '<h2>The six assurance gates</h2></div><span class="gate-count"></span></div><div class="gate-grid" id="gates"><nav class="gate-nav" aria-label="Assurance gates"></nav><section class="paper-card gate-editor" aria-label="Current gate"></section></div><section class="paper-card recommendation" id="recommendation"><span class="minor-label">PORTFOLIO RECOMMENDATION</span><h2>Record your position</h2><label for="cap-note">What should proceed, pause or retire, and who owns the next decision?</label><textarea id="cap-note" rows="4" maxlength="12000" placeholder="State the recommendation, supporting evidence, material open findings, owners and dates.">'+esc(state.capNote)+
    '</textarea><div class="actions"><button class="btn primary" id="cap-export">'+icon('download',16)+
    ' Export assurance brief</button><span class="save-status">Saved on this device as you type.</span></div></section></div>';
  function nav(){
    const count=gateDefs.filter((g,i)=>state.gates[i]?.trim()).length;
    main.querySelector('.gate-count').textContent=count+' of 6 documented';
    main.querySelector('.gate-nav').innerHTML=gateDefs.map((g,i)=>'<button data-gate="'+i+'" aria-pressed="'+(i===active)+'"><span>CP'+i+'</span><b>'+esc(g.title)+
      '</b>'+icon(state.gates[i]?.trim()?'check':'chevron',15)+
      '</button>').join('');
    main.querySelectorAll('[data-gate]').forEach(b=>b.onclick=()=>{
      active=Number(b.dataset.gate);
      editor();
      nav();
      main.querySelector('#gate-evidence').focus({preventScroll:true})
    })
  }
  function editor(){
    const g=gateDefs[active];
    main.querySelector('.gate-editor').innerHTML='<span class="minor-label">GATE CP'+active+'</span><h2>'+esc(g.title)+'</h2><p>'+esc(g.task)+
      ' '+source(m,g.page,'Gate standard')+
      '</p><label for="gate-evidence">Evidence and owner</label><textarea id="gate-evidence" rows="5" maxlength="12000" placeholder="'+esc(g.prompt)+
      '">'+esc(state.gates[active]||'')+
      '</textarea><div class="gate-bottom"><small class="save-status">Evidence entries are self-recorded.</small><button class="text-link" id="next-gate">'+(active<5?'Next gate':'Recommendation')+
      ' '+icon('arrow',15)+
      '</button></div>';
    main.querySelector('#gate-evidence').oninput=e=>{
      state.gates[active]=e.target.value;
      const saved=persist();
      main.querySelector('.gate-editor .save-status').textContent=saved?'Saved on this device.':'Export the brief to keep this entry.';
      nav()
    };
    main.querySelector('#next-gate').onclick=()=>{
      if(active<5){
        active++;
        nav();
        editor();
        main.querySelector('#gate-evidence').focus({preventScroll:true})
      }else main.querySelector('#cap-note').focus()
    }
  }
  nav();
  editor();
  main.querySelector('#cap-note').oninput=e=>{
    state.capNote=e.target.value;
    const ok=persist();
    main.querySelector('.recommendation .save-status').textContent=ok?'Saved on this device.':'Export the brief to keep this entry.'
  };
  main.querySelector('#cap-export').onclick=()=>{
    const out=[
      '# Northbridge portfolio assurance brief',
      'Civic Atlas learning exercise',
      '',
      ...gateDefs.flatMap((g,i)=>['## CP'+i+' · '+g.title,state.gates[i]?.trim()||'Open — evidence outstanding.','Standard: Volume 10, p. '+g.page,'']),
      '## Portfolio recommendation',
      state.capNote.trim()||'Open — recommendation outstanding.',
      '',
      '## Evidence carried forward',
      ...modules.filter(x=>state.notes[x.id]?.trim()).map(x=>x.title+': '+state.notes[x.id]),
      state.lastRun?.handoverMarkdown||state.lastRun?.summary||'No completed tabletop.'
    ];
    if(state.residentConference?.submitted)out.push('',...conferenceExport(state.residentConference.submitted));
    out.push(...exportAllFieldCases(state));
    downloadFile('northbridge-assurance-brief.md',out.join('\n'))
  }
}
