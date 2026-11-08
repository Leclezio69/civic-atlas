import {modules} from './modules.js';
import {caseUrl,fieldCaseFor,exportAllFieldCases} from './field-cases.js';
import {practiceList,practiceSummary,mountFieldPractice} from './field-practice.js';
import {icon,esc,pad,ann,brand,line,cover,category,pageTitles,pageSub,source,casePhotos} from './ui.js';
import {state,persist,hasEvidence,downloadFile} from './state.js';
import {mountGuide,refreshGuide} from './guide.js';
import {mountMiloChat,detachMiloChat} from './milo-chat.js';
import {renderSimulation} from './simulation.js';
import {renderCommandRoom} from './command-room.js';
import {renderCalibration} from './calibration.js';
import {renderCapstone,gateDefs} from './capstone.js';
import {renderConference,conferenceExport} from './case-conference.js';
import {assess} from './resident-case.js';
const main=document.querySelector('#main');
const moduleBy=id=>modules.find(m=>m.id===id);
const volLink=(m,tab='briefing')=>'#/playbook/'+m.id+'/'+tab;
const completed=()=>modules.filter(m=>state.completed[m.id]).length;
let cleanPage=()=>{},currentRoute='',activeInfo={kind:'home'},libraryFilter='All volumes',libraryQuery='';

// Context-aware voice guide player
const voiceGuide=(()=>{
  const files={home:'voice-home',library:'voice-playbooks',module:'voice-module',simulator:'voice-simulator',capstone:'voice-capstone',agent:'voice-agent',fieldbook:'voice-fieldbook'};
  let audio=null,playing=false,currentFile='';
  function toggle(btn,section){
    const file='assets/'+(files[section]||files.home)+'.mp3';
    if(audio&&currentFile!==file){audio.pause();audio=null;playing=false}
    if(!audio){currentFile=file;audio=new Audio(file);audio.addEventListener('ended',()=>{playing=false;update(btn)})}
    if(playing){audio.pause();audio.currentTime=0;playing=false}
    else{audio.play().catch(()=>{});playing=true}
    update(btn);
  }
  function stop(){if(audio&&playing){audio.pause();audio.currentTime=0;playing=false;audio=null}}
  function update(btn){
    if(!btn)return;
    btn.innerHTML=icon(playing?'pause':'headset',17);
    btn.setAttribute('aria-label',playing?'Pause guide':'Listen to section guide');
    btn.classList.toggle('voice-playing',playing);
  }
  return {toggle,stop};
})();
const navItems=[['Overview','#/','home'],['Playbooks','#/playbooks','library'],['City simulator','#/simulator','simulator'],['Capstone','#/capstone','capstone'],['AI agent','#/agent','agent']];
function header(section){
  const current=section==='module'?'library':section;
  const links=navItems.map(([name,href,key])=>'<a href="'+href+'" '+(current===key?'aria-current="page"':'')+'>'+name+'</a>').join('');
  document.querySelector('#header').innerHTML='<div class="wrap mast">'+brand()+'<nav class="desktop-nav" aria-label="Primary">'+links+
    '</nav><div class="header-end"><button class="voice-btn iconbtn" aria-label="Listen to intro">'+icon('headset',17)+
    '</button><a class="field-link '+(current==='fieldbook'?'active':'')+
    '" href="#/fieldbook">'+icon('field',17)+
    '<span>My fieldbook</span></a><button class="menu-toggle iconbtn" aria-label="Open menu" aria-expanded="false">'+icon('menu')+
    '</button></div></div><nav class="mobile-nav" aria-label="Mobile navigation" hidden>'+links+
    '</nav>';
  const menu=document.querySelector('.menu-toggle');
  menu.onclick=()=>{
    const mob=document.querySelector('.mobile-nav');
    mob.hidden=!mob.hidden;
    menu.setAttribute('aria-expanded',String(!mob.hidden));
    menu.setAttribute('aria-label',mob.hidden?'Open menu':'Close menu');
    menu.innerHTML=icon(mob.hidden?'menu':'close')
  };
  document.querySelector('.voice-btn').onclick=e=>voiceGuide.toggle(e.currentTarget,section);
  document.querySelector('#footer').innerHTML='<div class="wrap footer-inner">'+brand()+'<span>AI Government &amp; Public Services Series</span><a href="#/fieldbook">My fieldbook '+icon('arrow',15)+
    '</a></div>'
}
function card(m){
  return '<a class="volume-card" href="'+volLink(m)+'"><div class="card-photo"><img src="'+cover(m.id)+
    '" alt="" loading="lazy"><span class="vol-tag">VOL. '+pad(m.volume)+
    '</span>'+(state.completed[m.id]?'<span class="done-badge">'+icon('check',15)+' Completed</span>':'')+
    '</div><div class="card-body"><span class="card-category">'+esc(category(m.id))+
    '</span><h3>'+esc(pageTitles[m.id])+
    '</h3><p>'+esc(pageSub[m.id])+
    '</p><div class="card-foot"><span>'+icon('file',14)+
    ' 32 pages</span><span class="card-go" aria-hidden="true">'+icon('arrow',18)+
    '</span></div></div></a>'
}
const featured=[modules[0],modules[1],modules[2]];
function home(){
  const resume=moduleBy(state.lastVolume)||modules[0];
  const started=!!state.visited;
  main.innerHTML='<section class="hero"><div class="hero-shade"></div><div class="wrap hero-inner"><div class="hero-copy" id="intro">'+line('PROFESSIONAL LEARNING SERIES')+
    '<h1>AI Government <span class="hero-amp">&amp;</span><br><em>Public Services</em></h1><p>Choose which AI projects a city should fund, test them against residents’ needs and defend your decisions with evidence from ten playbooks.</p><div class="actions" id="start"><a class="btn gold" href="'+volLink(resume)+
    '">'+icon('book',18)+(started?'Continue learning':'Start learning')+icon('arrow',16)+
    '</a><a class="btn glass" href="#/simulator">'+icon('cube',18)+
    ' City simulator</a></div></div><div class="geo-caption"><span class="crosshair"></span><div><b>Northbridge City &amp; County</b><small>FICTIONAL TRAINING DISTRICT</small></div></div></div></section><div class="series-strip"><div class="wrap strip-inner"><span>'+icon('book',19)+
    ' <b>10</b> playbooks</span><i></i><span>'+icon('layers',19)+
    ' <b>320</b> source pages</span><i></i><span>'+icon('target',19)+
    ' <b>10</b> decision exercises</span><i></i><span>'+icon('cube',19)+
    ' <b>4D</b> city simulation</span></div></div><section class="wrap home-collection" id="collection"><div class="section-head"><div>'+line('THE CURRICULUM')+
    '<h2>The playbook collection</h2></div><a class="text-link" href="#/playbooks">View all 10 playbooks '+icon('arrow',17)+
    '</a></div><div class="cards">'+featured.map(card).join('')+
    '</div></section>'+practiceList()+'<section class="wrap lower-features" id="practice"><a class="feature simulator-feature" href="#/simulator"><div>'+line('CITY SIMULATOR')+
    '<h2>Northbridge under pressure</h2><p>Move six reporting teams across three districts and test your decisions under the same storm.</p><span class="feature-link">Enter the exercise '+icon('arrow',16)+
    '</span></div></a><a class="feature cap-feature" href="#/capstone"><div>'+line('PORTFOLIO CAPSTONE')+
    '<h2>Make the assurance case</h2><p>Follow a disputed renewal across three departments and defend your release decision.</p><span class="feature-link">Open the capstone '+icon('arrow',16)+
    '</span></div></a></section>'
}
function agentPage(origin){
  const back=origin?'<a class="agent-back" href="'+esc(origin.href)+'">'+icon('back',15)+'<span>'+esc(origin.heading)+'</span></a>':'';
  main.innerHTML='<div class="wrap agent-page"><section class="agent-intro">'+line('AI AGENT')+
    '<img class="agent-portrait" src="assets/milo.webp" alt="Milo, the Civic Atlas robot"><h1>Ask Milo</h1>'+
    '<p>Work through a public-service decision, check a passage from the ten playbooks, or ask a general question.</p>'+
    back+'</section><div id="agent-chat"></div></div>';
  mountMiloChat(main.querySelector('#agent-chat'),origin||{},modules);
  cleanPage=detachMiloChat;
}
function pageLead(kicker,title,body){
  return '<div class="page-lead">'+line(kicker)+'<h1>'+title+'</h1><p>'+body+'</p></div>'
}
function library(){
  main.innerHTML='<section class="wrap page library">'+pageLead('VOLUMES 01 — 10','The playbook library','Explore the series in order, or select the service you work with. Every volume includes a briefing, a decision workshop and the original sourcebook.')+
    '<div class="library-tools" id="library-tools"><div class="filters" aria-label="Filter playbooks">'+['All volumes','Foundations','Service delivery','Assurance'].map(c=>'<button data-filter="'+c+'" aria-pressed="'+(libraryFilter===c)+'">'+c+'</button>').join('')+
    '</div><label class="searchbox">'+icon('search',17)+
    '<input type="search" value="'+esc(libraryQuery)+
    '" placeholder="Search playbooks" aria-label="Search playbooks"></label></div><div class="result-line" role="status"></div><div class="cards" id="results"></div></section>';
  function filter(){
    const query=libraryQuery.trim().toLowerCase();
    const match=modules.filter(m=>(libraryFilter==='All volumes'||category(m.id)===libraryFilter)&&[m.sourceTitle,pageTitles[m.id],pageSub[m.id],m.brief,...m.sources.map(s=>s.title)].join(' ').toLowerCase().includes(query));
    document.querySelector('.result-line').textContent=match.length+' of 10 playbooks';
    document.querySelector('#results').innerHTML=match.length?match.map(card).join(''):'<div class="empty"><h3>No matching playbooks</h3><p>Try a different term or choose All volumes.</p><button class="btn outline" id="clear-search">Clear filters</button></div>';
    document.querySelector('#clear-search')?.addEventListener('click',()=>{
      libraryFilter='All volumes';
      libraryQuery='';
      library()
    })
  }
  main.querySelector('input').oninput=e=>{
    libraryQuery=e.target.value;
    filter()
  };
  main.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{
    libraryFilter=b.dataset.filter;
    main.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    filter()
  });
  filter()
}
function moduleHeader(m,tab){
  const c=fieldCaseFor(m.id), practice=tab==='fieldcase'&&c;
  const tabs=[['briefing','Briefing','book'],['workshop','Decision workshop','target']];
  if(c)tabs.push(['fieldcase','Applied case','shield']);
  tabs.push(['sources','Sourcebook','file']);
  const photo=practice?'assets/'+m.id+'-p'+c.imagePage+'.webp':cover(m.id);
  return '<div class="module-hero" style="--cover:url('+photo+')"><div class="wrap"><a class="back-link" href="#/playbooks">'+icon('back',15)+
    ' Playbook library</a>'+line('VOLUME '+pad(m.volume)+' / '+(practice?pageTitles[m.id]:category(m.id)).toUpperCase())+
    '<h1>'+esc(practice?c.title:pageTitles[m.id])+'</h1><p>'+esc(practice?c.brief:m.subtitle)+'</p></div></div>'+
    '<div class="module-bar '+(c?'extended-tabs':'')+'"><div class="wrap"><nav aria-label="Volume sections">'+
    tabs.map(([k,t,i])=>'<a href="'+volLink(m,k)+'" '+(tab===k?'aria-current="page"':'')+'>'+icon(i,17)+t+'</a>').join('')+
    '</nav><span class="muted module-meta">Volume '+pad(m.volume)+' of 10</span></div></div>';
}
function caseInvitation(m){
  const c=fieldCaseFor(m.id);
  return c?'<a class="practice-invite" href="'+caseUrl(m.id)+'"><b>Applied case</b><span>'+esc(c.title)+'</span>'+icon('arrow',16)+'</a>':'';
}
function briefing(m){
  return '<div class="wrap article-grid"><article id="brief"><div class="minor-label">NORTHBRIDGE BRIEFING</div><h2>'+esc(m.subtitle)+
    '</h2><p class="intro-text">'+esc(m.brief)+
    '</p><div class="rule"></div><h2 class="sm-head" id="lessons">In the field</h2><div class="lesson-stack">'+m.lessons.map((l,i)=>'<details class="lesson" '+(i===0?'open':'')+'><summary><span class="number">'+pad(i+1)+
    '</span><strong>'+esc(l.title)+
    '</strong>'+icon('down',16)+
    '</summary><div class="lesson-body"><p>'+esc(l.body)+
    '</p><p class="action-note"><b>Put it into practice</b> '+esc(l.action)+
    '</p>'+source(m,l.page,'Source')+
    '</div></details>').join('')+
    '</div><section class="example" id="worked-example"><span class="minor-label">WORKED EXAMPLE</span><h3>'+esc(m.example.title)+
    '</h3><p>'+esc(m.example.body)+
    '</p>'+source(m,m.example.page,'Read the example')+
    '</section><h2 class="sm-head">Controls to carry forward</h2>'+m.controls.map(c=>'<div class="control"><i>'+icon('shield',19)+'</i><div><h3>'+esc(c.title)+'</h3><p>'+esc(c.body)+
    '</p>'+source(m,c.page)+
    '</div></div>').join('')+
    '<div class="actions"><a class="btn primary" href="'+volLink(m,'workshop')+
    '">Enter the decision workshop '+icon('arrow')+
    '</a></div>'+caseInvitation(m)+'</article><aside class="article-aside"><div class="paper-card"><span class="minor-label">YOUR LEARNING OBJECTIVES</span><h3>By the end of this volume</h3><ul class="outcomes">'+m.outcomes.map(x=>'<li>'+icon('target',16)+esc(x)+'</li>').join('')+
    '</ul><a class="text-link" href="'+m.pdf+
    '" target="_blank" rel="noopener">Open original playbook '+icon('upRight',15)+
    '</a></div><figure class="source-figure"><img src="assets/'+m.id+
    '-p'+casePhotos[m.id]+
    '.webp" alt="Illustration from the '+esc(pageTitles[m.id])+
    ' playbook"><figcaption>From volume '+pad(m.volume)+
    ' '+source(m,casePhotos[m.id])+
    '</figcaption></figure><div class="related"><span class="minor-label">RELATED PLAYBOOKS</span>'+m.connects.map(id=>moduleBy(id)).filter(Boolean).map(q=>'<a href="'+volLink(q)+'">'+esc(pageTitles[q.id])+' '+icon('arrow',15)+'</a>').join('')+
    '</div></aside></div>'
}
function evidenceBox(m){
  return '<section class="paper-card assignment" id="assignment"><span class="minor-label">FIELD ASSIGNMENT</span><h2>'+esc(m.assignment.title)+
    '</h2><ol>'+m.assignment.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+
    '</ol><div class="deliver"><b>Deliverable</b> '+esc(m.assignment.deliverable)+
    ' '+source(m,m.assignment.page)+
    '</div><label for="field-note">Your field note</label><textarea id="field-note" rows="5" maxlength="12000" placeholder="Capture your reasoning, the accountable officer and the evidence you would keep.">'+esc(state.notes[m.id]||'')+
    '</textarea><span class="save-status" role="status">Notes save on this device.</span></section>'
}
function workshop(m){
  return '<div class="wrap workshop-grid"><div><section class="exercise" id="decision"><span class="minor-label">DECISION EXERCISE / VOL. '+pad(m.volume)+
    '</span><p class="scenario">'+esc(m.decision.scenario)+
    '</p><h2>'+esc(m.decision.question)+
    '</h2><div class="choices">'+m.decision.choices.map((c,i)=>'<button class="choice" data-choice="'+i+'"><span>'+String.fromCharCode(65+i)+'</span>'+esc(c.text)+
    '</button>').join('')+
    '</div><div id="feedback" aria-live="polite"></div></section>'+evidenceBox(m)+
    '</div><aside class="article-aside"><div class="paper-card"><span class="minor-label">VOLUME PROGRESS</span><h3>Close the loop</h3><p>Choose a supported decision and record your field note to complete this volume.</p><div id="checklist"></div><button id="finish" class="btn primary"></button><div id="next-volume"></div></div>'+caseInvitation(m)+'</aside></div>'
}
function wireWorkshop(m){
  const correct=()=>m.decision.choices[state.answers[m.id]]?.correct;
  function refresh(){
    const index=state.answers[m.id],choice=m.decision.choices[index];
    main.querySelectorAll('.choice').forEach((b,i)=>{
      b.classList.toggle('selected',index===i);
      b.setAttribute('aria-pressed',String(i===index))
    });
    main.querySelector('#feedback').innerHTML=choice?'<div class="feedback '+(choice.correct?'good':'revise')+'"><strong>'+icon(choice.correct?'check':'reset',17)+(choice.correct?'Supported decision':'Reconsider this choice')+
      '</strong><p>'+esc(choice.feedback)+
      '</p>'+source(m,m.decision.page,'Decision evidence')+
      '</div>':'';
    main.querySelector('#checklist').innerHTML=[[correct(),'Decision supported'],[hasEvidence(m.id),'Field note recorded']].map(([v,t])=>'<div class="check-row"><span class="checkmark '+(v?'on':'')+'">'+(v?icon('check',13):'')+
      '</span>'+t+
      '</div>').join('');
    const finish=main.querySelector('#finish');
    finish.disabled=(!correct()||!hasEvidence(m.id)||state.completed[m.id]);
    finish.innerHTML=state.completed[m.id]?icon('check',16)+' Volume complete':'Complete volume '+icon('arrow',16);
    const next=modules[m.volume];
    main.querySelector('#next-volume').innerHTML=state.completed[m.id]?'<a class="text-link" href="'+(next?volLink(next):'#/capstone')+'">'+(next?'Next volume':'Open portfolio capstone')+
      ' '+icon('arrow',15)+
      '</a>':''
  }
  main.querySelectorAll('[data-choice]').forEach((b,i)=>b.onclick=()=>{
    state.answers[m.id]=i;
    if(!correct())delete state.completed[m.id];
    persist();
    refresh()
  });
  main.querySelector('#field-note').oninput=e=>{
    state.notes[m.id]=e.target.value;
    if(!hasEvidence(m.id))delete state.completed[m.id];
    main.querySelector('.save-status').textContent=persist()?'Saved on this device.':'Storage unavailable. Export your fieldbook to keep these notes.';
    refresh()
  };
  main.querySelector('#finish').onclick=()=>{
    if(correct()&&hasEvidence(m.id)){
      state.completed[m.id]=true;
      persist();
      refresh();
      ann('Volume completed.')
    }
  };
  refresh()
}
const platePages={
  strategy:[9,14,17],
  'citizen-services':[8,10,20],
  'benefits-casework':[8,12,22],
  'permitting-planning':[8,12,19],
  'tax-revenue':[8,16,22],
  'procurement-supplier':[8,20,24],
  'emergency-services':[9,15,18],
  'data-records':[7,11,19],
  'workforce-trust':[9,15,21],
  capstone:[8,15,18]
};
function plates(m){
  return '<div class="plates">'+platePages[m.id].map(page=>{
    const item=m.sources.find(s=>s.page===page);
    return '<a href="'+m.pdf+'#page='+page+'" target="_blank" rel="noopener"><img loading="lazy" alt="" src="assets/'+m.id+
      '-p'+page+
      '.webp"><div><span class="minor-label">PAGE '+pad(page)+
      '</span><b>'+esc(item.title)+
      '</b></div></a>'
  }).join('')+
    '</div>'
}
function sources(m){
  return '<section class="wrap source-index" id="source-index"><div class="section-head"><div>'+line('SOURCE READER')+
    '<h2>'+esc(m.sourceTitle)+
    '</h2></div><a class="btn outline" href="'+m.pdf+
    '" rel="noopener" target="_blank">'+icon('file',16)+
    ' Open full PDF '+icon('upRight',15)+
    '</a></div><p>Open any of the 32 pages in the original volume.</p>'+plates(m)+
    '<label class="searchbox">'+icon('search',17)+
    '<input type="search" id="source-search" aria-label="Find a source page" placeholder="Find a page or topic"></label><div class="source-list" id="pages"></div></section>'
}
function volume(m,tab){
  state.lastVolume=m.id;
  state.visited=true;
  persist();
  if(tab==='fieldcase'){
    main.innerHTML=moduleHeader(m,tab)+'<section id="practice-workspace" class="wrap conference"></section>';
    mountFieldPractice(main,fieldCaseFor(m.id),m,()=>refreshGuide(activeInfo,modules));
    return;
  }
  main.innerHTML=moduleHeader(m,tab)+(tab==='briefing'?briefing(m):tab==='workshop'?workshop(m):sources(m));
  if(tab==='workshop')wireWorkshop(m);
  if(tab==='sources'){
    const input=main.querySelector('#source-search');
    const update=()=>{
      const q=input.value.trim().toLowerCase();
      const pages=m.sources.filter(s=>s.title.toLowerCase().includes(q)||String(s.page)===q);
      main.querySelector('#pages').innerHTML=pages.length?pages.map(s=>'<a href="'+m.pdf+'#page='+s.page+'" target="_blank" rel="noopener"><span>'+pad(s.page)+
        '</span>'+esc(s.title)+icon('upRight',14)+
        '</a>').join(''):'<p>No pages match this search.</p>'
    };
    input.oninput=update;
    update()
  }
}
function fieldbook(){
  const selected=modules.filter(m=>m.id in state.answers||hasEvidence(m.id)||state.completed[m.id]);
  const n=completed();
  const submitted=state.residentConference?.submitted;
  const result=submitted?assess(submitted.answers,submitted.note):null;
  const capCount=gateDefs.filter((g,i)=>state.gates[i]?.trim()).length;
  main.innerHTML='<div class="wrap page">'+pageLead('PERSONAL WORKSPACE','My fieldbook','Your decisions, field notes, simulation debrief and capstone evidence are saved in this browser.')+
    '<div class="field-overview" id="progress"><div class="paper-card"><span class="minor-label">SERIES PROGRESS</span><h2>'+n+
    ' <small>/ 10 volumes</small></h2><progress max="10" value="'+n+
    '" aria-label="Completed volumes"></progress></div><div class="paper-card"><span class="minor-label">CAPSTONE EVIDENCE</span><h2>'+capCount+
    ' <small>/ 6 gates documented</small></h2><a class="text-link" href="#/capstone/notebook">Open portfolio notebook '+icon('arrow',14)+
    '</a></div></div><section class="field-case paper-card"><div><span class="minor-label">SCORED RESIDENT CASE</span><h3>A renewal on hold</h3><p>'+ (result?'Latest submission · '+result.score+'/100 · '+(result.ready?'Ready for panel review':'Return for revision'):'Submit the resident case to add a scored brief to your fieldbook.')+'</p></div><a class="text-link" href="#/capstone">'+(result?'Open case and debrief':'Open resident case')+' '+icon('arrow',15)+'</a></section>'+practiceSummary()+'<div class="section-head" id="fieldnotes"><h2>Volume notes</h2><button class="btn outline" id="export">'+icon('download',16)+
    ' Export fieldbook</button><button class="btn outline danger" id="reset-all">'+icon('reset',16)+' Reset all progress</button></div>'+(selected.length?selected.map(m=>'<details class="record"><summary><span class="number">'+pad(m.volume)+'</span><strong>'+esc(pageTitles[m.id])+
    '</strong><small>'+(state.completed[m.id]?'Completed':'In progress')+
    '</small>'+icon('down',16)+
    '</summary><div><b>Decision</b><p>'+esc(m.decision.choices[state.answers[m.id]]?.text||'No decision recorded.')+
    '</p><b>Field note</b><p class="user-text">'+esc(state.notes[m.id]||'No field note yet.')+
    '</p><a class="text-link" href="'+volLink(m,'workshop')+
    '">Open workshop '+icon('arrow',16)+
    '</a></div></details>').join(''):'<div class="empty"><h3>Your first note starts in a workshop.</h3><p>Open a playbook, make a decision and capture your reasoning.</p><a class="btn primary" href="'+volLink(modules[0])+
    '">Start volume 01 '+icon('arrow',16)+
    '</a></div>')+
    '<div class="paper-card debrief-box" id="field-debrief"><span class="minor-label">LATEST SIMULATOR DEBRIEF</span><h3>'+(state.lastRun?'Northbridge flood response':'No completed exercise yet')+
    '</h3><p>'+esc(state.lastRun?.summary||'Finish the flood-response tabletop to add the outcome and your decisions here.')+
    '</p>'+(state.lastRun?'<ol>'+state.lastRun.log.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'')+
    '<a class="text-link" href="#/simulator">Open city simulator '+icon('arrow',16)+
    '</a></div></div>';
  main.querySelector('#export').onclick=exportFieldbook;
  main.querySelector('#reset-all').onclick=()=>{
    if(!confirm('This will permanently clear all decisions, field notes, simulator results, and capstone evidence. Export your fieldbook first if you want to keep a copy.\n\nReset everything?'))return;
    try{localStorage.removeItem('civic-atlas-fieldbook-v1');localStorage.removeItem('civic-atlas-claude-key')}catch{}
    Object.assign(state,{answers:{},notes:{},completed:{},gates:{},capNote:'',run:null,lastRun:null,lastVolume:'strategy',visited:undefined,residentConference:undefined});
    persist();
    ann('All progress has been reset.');
    fieldbook();
  };
}
function exportFieldbook(){
  const lines=['# Civic Atlas fieldbook','AI Government & Public Services Series','',completed()+' of 10 volumes completed.',''];
  for(const m of modules){
    if(!state.completed[m.id]&&!hasEvidence(m.id)&&!(m.id in state.answers))continue;
    const c=m.decision.choices[state.answers[m.id]];
    lines.push('## Volume '+pad(m.volume)+' · '+pageTitles[m.id],state.completed[m.id]?'Completed':'In progress','','Decision: '+(c?.text||'Pending'),c?'Feedback: '+c.feedback:'','Source: '+m.sourceTitle+', p. '+m.decision.page,'','Field note:',state.notes[m.id]||'Pending','')
  }
  if(state.lastRun?.handoverMarkdown)lines.push('## Simulation debrief',state.lastRun.handoverMarkdown);
  else lines.push('## Simulation debrief',state.lastRun?.summary||'Pending',...(state.lastRun?.log||[]));
  lines.push('','## Capstone assurance brief',...gateDefs.map((g,i)=>'CP'+i+' '+g.title+' — '+(state.gates[i]||'Pending')),'','Portfolio recommendation: '+(state.capNote||'Pending'));
  if(state.residentConference?.submitted)lines.push('',...conferenceExport(state.residentConference.submitted));
  lines.push(...exportAllFieldCases(state));
  downloadFile('civic-atlas-fieldbook.md',lines.join('\n'));
  ann('Fieldbook exported.')
}
function route(){
  const hash=location.hash||'#/';
  if(hash==='#main'){
    main.focus();
    return
  }
  const path=hash.replace(/^#\/?/,'').split('/').filter(Boolean);
  const [first,id,section]=path;
  const m=moduleBy(id);
  const kind=!first?'home':first==='playbooks'?'library':first==='playbook'&&m?'module':['simulator','capstone','fieldbook','agent'].includes(first)?first:'missing';
  const tab=section==='fieldcase'&&fieldCaseFor(id)?'fieldcase':['workshop','sources'].includes(section)?section:'briefing';
  let origin;
  if(kind==='agent'&&['module','simulator','capstone'].includes(activeInfo.kind)){
    const detail=main.querySelector('#practice-heading,#decision-desk h2,#case-work h2,.page-lead p,#brief .intro-text');
    origin={...activeInfo,href:currentRoute,heading:main.querySelector('h1')?.textContent.trim()||'Previous page',detail:detail?.textContent.trim()||''};
  }
  voiceGuide.stop();
  cleanPage();
  cleanPage=()=>{};
  const notebook=kind==='capstone'&&id==='notebook';
  const classic=kind==='simulator'&&id==='classic';
  const calibration=kind==='simulator'&&id==='calibration';
  activeInfo={kind,tab,m,notebook,classic,calibration};
  header(kind);
  if(kind==='home')home();else if(kind==='library')library();else if(kind==='module')volume(m,tab);else if(kind==='simulator'){if(calibration)renderCalibration(main);else cleanPage=classic?renderSimulation(main):renderCommandRoom(main,id)}else if(kind==='capstone'){if(notebook)renderCapstone(main,modules);else renderConference(main,modules,()=>refreshGuide(activeInfo,modules))}else if(kind==='fieldbook')fieldbook();else if(kind==='agent')agentPage(origin);else main.innerHTML='<div class="wrap page"><h1>Page unavailable</h1><a class="btn primary" href="#/">Return to the overview</a></div>';
  document.title=(kind==='module'?(tab==='fieldcase'?fieldCaseFor(m.id).title:pageTitles[m.id]):({home:'AI Government & Public Services',library:'Playbook library',simulator:'City simulator',capstone:'Portfolio capstone',fieldbook:'My fieldbook',agent:'AI agent — Ask Milo'}[kind]||'Page unavailable'))+
    ' | Civic Atlas';
  if(currentRoute){
    main.focus({preventScroll:true})
  }
  window.scrollTo({top:0,behavior:'instant'});
  currentRoute=hash;
  refreshGuide(activeInfo,modules)
}
document.querySelector('.skip').onclick=e=>{
  e.preventDefault();
  main.focus()
};
// Preserve links shared before the chat moved out of the page guide.
const entry=new URL(location.href);
if(entry.searchParams.get('guide')==='ai'){
  entry.searchParams.delete('guide');
  entry.hash='/agent';
  history.replaceState(history.state,'',entry);
}
mountGuide();
window.addEventListener('hashchange',route);
route();
