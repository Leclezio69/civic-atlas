import {boardTabs,exampleProfile} from './calibration.js';
import {nycProfile,sourceDescription,archive} from './agency-data.js';
import {createCityModel} from './city-model.js';
import {state,persist,downloadFile} from './state.js';
import {icon,esc,line} from './ui.js';
import {districts,districtBy,weathers,gates,alternatives,freshFloodRun,formatTime,nextGate,nextBoundary,replayFlood,compareRun,
  canTransfer,transferTeam,travelMinutes,issueOrder,advanceFlood,decisionLog,debrief,orderDetail} from './flood-engine.js';

const colours=['#27766d','#b47532','#526c99'];
const zones=['Promenade','Service centre','Civic boulevard'];
const phases=[['Promenade open','Rain intensifying','Water at the walkway','Riverside access closed'],['Entrance open','Residents arriving','Sheltered entrance','Staffed accessible queue'],['Field post opening','Canopy in place','Officers checking maps','Field report received']];
const percent=n=>n===null?'—':n+'%';
const signed=n=>(n>0?'+':'')+n;
const queueMinutes=frames=>frames.slice(0,-1).reduce((sum,frame)=>sum+frame.queue,0);
const deltaCell=(a,b)=>'<td>'+a+'</td><td>'+b+'</td><td>'+signed(a-b)+'</td>';
const sourceLink=p=>'<a class="cite" href="/playbooks/ai-government-emergency-services-playbook.pdf#page='+p+'" target="_blank" rel="noopener">Emergency services · p. '+p+' '+icon('upRight',12)+'</a>';
const noteHtml='<details class="storm-notes"><summary>Operating assumptions and source pages '+icon('down',16)+'</summary><div><p>This fictional exercise begins with eight open reports and two mobile reporting teams at each of three district desks. The same weather profile always generates the same sequence of reports. Each minute follows arrivals, handling, completed journeys, then any new transfer orders. A team arriving at 08:05 can first work the 08:05–08:06 interval.</p><p>Each active team supplies two work units per minute. A standard report costs three units and an assisted report costs five before the briefings change the workflow. Partial work can carry forward on a waiting queue. An empty desk cannot bank spare capacity. Transfers take three to five minutes, plus two for a high-water Riverside crossing. At 08:41 the map feed returns. Every third minute from 08:41, Riverside can use two work units to reconcile one provisional record.</p><p>Handled reports have passed the initial desk handoff. The verification count tracks records still requiring location confirmation. “Within 10 minutes” measures handled reports from arrival to handoff. A shared interpreter desk requires an active team at Market. A signed public bulletin takes effect after Civic supplies its preparation units. The oldest open report and assisted-contact queue remain visible alongside the handoff measure. Camera frames illustrate storm stages. Counts and rates are teaching assumptions.</p><p>Related practice covers surge handling '+sourceLink(14)+', language access '+sourceLink(10)+', public alerts '+sourceLink(18)+' and outage fallback '+sourceLink(25)+'.</p></div></details>';

function shell(profile){
  const oldRun=state.run&&state.run.minute>0&&!state.run.finished;
  const replay=profile?.id==='nyc311', title=replay?'NYC311 flood replay':profile?'Agency shift replay':'Flood response command room';
  const intro=replay?'Run the recorded NYC311 request sequence through Northbridge’s three reporting desks. Staffing and outcomes are simulated.':profile?'Test service decisions against '+esc(profile.id==='example'?'a synthetic example shift':profile.label)+'. The street model represents Northbridge.':'Move six teams between three district desks. Keep resident reports moving while the river rises and the evidence changes.';
  const profileNote=profile?'<section class="replay-basis"><div><span class="minor-label">'+(replay?'RECORDED DEMAND':profile.id==='example'?'SYNTHETIC EXAMPLE':'IMPORTED SHIFT')+'</span><p>'+esc(sourceDescription(profile))+'</p></div><a class="text-link" href="#/simulator/calibration">Source and validation '+icon('arrow',14)+'</a></section>':'';
  return '<section class="storm-hero"><div class="wrap storm-hero-inner"><div>'+line('NORTHBRIDGE · OPERATIONS TABLETOP')+
    '<h1>'+title+'</h1><p>'+intro+'</p></div>'+
    '<div class="shift-clock"><span>EXERCISE CLOCK</span><b id="storm-clock">08:00</b><small id="storm-clock-note">Ready · handover 09:00</small></div></div></section>'+
    boardTabs(profile?(replay?'nyc311':'calibration'):'training')+'<div class="wrap storm-body">'+profileNote+'<section class="storm-controls" id="sim-controls" aria-label="Exercise controls">'+
    '<label>'+(profile?'Exercise weather':'Weather profile')+'<select id="storm-weather">'+weathers.map(w=>'<option>'+w+'</option>').join('')+'</select></label>'+
    '<label>Clock speed<select id="storm-speed"><option value="900">1×</option><option value="450">2×</option><option value="225">4×</option></select></label>'+
    '<div class="storm-buttons"><button class="btn primary" id="storm-play"></button><button class="btn outline" id="storm-forward"></button><button class="storm-quiet" id="storm-step">+1 min</button><button class="storm-quiet" id="storm-reset">'+icon('reset',14)+' Reset</button></div></section>'+
    '<div class="storm-kpis" aria-label="Citywide operating measures">'+[
      ['received','Reports received','Includes opening queue'],['handled','Reports handled','Initial desk handoffs'],['queue','Open reports','Awaiting handoff'],['oldest','Oldest open report','Time since arrival']
    ].map(([id,title,detail])=>'<div><span>'+title+'</span><strong id="kpi-'+id+'"></strong><small>'+detail+'</small></div>').join('')+'</div>'+
    '<section class="storm-board"><div class="ops-map" id="city-view"><div class="ops-map-head"><span><i></i> NORTHBRIDGE DISTRICT DESKS</span><b id="map-stamp">08:00</b></div>'+
    '<canvas id="storm-canvas" role="img" aria-label="Interactive 3D model of the Riverside, Market and Civic reporting desks. Use the district buttons for keyboard access."></canvas>'+
    '<figure id="storm-camera" hidden><img alt="Illustrative district field camera" id="storm-frame"><figcaption id="storm-caption"></figcaption></figure>'+
    '<div class="ops-map-toolbar"><div class="ops-view"><button data-lens="map" aria-pressed="true">3D map</button><button data-lens="camera" aria-pressed="false">Field camera</button></div>'+
    '<div class="ops-camera-controls">'+[['left','Rotate left','left'],['right','Rotate right','chevron'],['in','Zoom in','plus'],['out','Zoom out','minus'],['reset','Reset camera','target']].map(([k,l,i])=>'<button data-camera="'+k+'" aria-label="'+l+'" title="'+l+'">'+icon(i,15)+'</button>').join('')+'</div></div></div>'+
    '<aside class="desk-panel" id="district-desk"><span class="minor-label">DISTRICT DESK</span><div class="zone-tabs" role="group" aria-label="Inspect district">'+
    districts.map(d=>'<button data-zone="'+d.id+'">'+esc(d.name)+'</button>').join('')+'</div>'+
    '<h2 id="zone-name"></h2><p id="zone-brief"></p><dl class="zone-readings">'+[['queue','Open reports'],['assisted','Assisted contact'],['teams','Teams at desk'],['eta','Inbound teams']].map(([k,t])=>'<div><dt>'+t+'</dt><dd id="zone-'+k+'"></dd></div>').join('')+'</dl>'+
    '<form id="transfer-form"><label for="from-desk">Move one team here from</label><div><select id="from-desk"></select><button class="btn primary" id="move-team" type="submit">Move team '+icon('arrow',14)+'</button></div><small id="travel-note"></small></form><div id="move-status" role="status"></div></aside></section>'+
    '<section id="decision-desk" class="incident-card" aria-live="polite"></section>'+
    '<section class="storm-chartbox" id="timeline"><div class="storm-section-head"><div><span class="minor-label">QUEUE HISTORY</span><h2>Demand across the city</h2></div><div class="chart-key">'+districts.map((d,i)=>'<span><i style="background:'+colours[i]+'"></i>'+esc(d.name)+'</span>').join('')+'</div></div>'+
    '<div id="history-plot"></div><div class="scrub-head"><label for="storm-range">Inspect elapsed time</label><span id="inspect-stamp"></span></div><input type="range" id="storm-range" min="0" max="60" step="1" value="0"><div class="scrub-captions"><span>08:00</span><span>08:15</span><span>08:30</span><span>08:45</span><span>09:00</span></div></section>'+
    '<section class="handover" id="after-action" hidden></section><div class="storm-log-grid"><section class="paper-card"><span class="minor-label">INCIDENT RECORD</span><h3>Duty log</h3><ol id="storm-log" class="log-list"></ol></section>'+
    '<section class="paper-card"><span class="minor-label">SERVICE QUALITY</span><h3>At this minute</h3><dl class="quality-readings"><div><dt>Handled within 10 minutes</dt><dd id="quality-target"></dd></div><div><dt>Records awaiting location check</dt><dd id="quality-pending"></dd></div><div><dt>Handoffs clear of location checks</dt><dd id="quality-verified"></dd></div><div><dt>Riverside map feed</dt><dd id="quality-feed"></dd></div><div><dt>Public bulletin</dt><dd id="quality-bulletin"></dd></div></dl>'+
    '<div class="duty-guide"><img src="assets/milo.webp" alt="Milo"><p id="milo-duty"></p></div></section></div>'+(profile?'<details class="storm-notes"><summary>Replay methods</summary><div><p>'+esc(sourceDescription(profile))+'</p><p>Source minute 0 supplies the interval 08:00–08:01 on the exercise clock. The model spreads an observed assisted count within its minute where supplied. A scheduled roster reduction withdraws the highest-numbered home team positions, including teams on loan. A public-message or interpreter order changes service workload using exercise assumptions.</p></div></details>':noteHtml)+
    (oldRun?'<p class="legacy-link"><a href="#/simulator/classic">Resume your earlier tabletop at '+formatTime(state.run.minute)+' '+icon('arrow',14)+'</a></p>':'')+'</div>';
}

function chart(frames,t){
  const W=900,H=139,left=38,right=14,top=10,bottom=14,plotHeight=H-top-bottom;
  const max=Math.max(10,Math.ceil(Math.max(...frames.flatMap(f=>f.districts.map(d=>d.queue)))/10)*10);
  const x=m=>left+m*(W-left-right)/60, y=q=>top+(1-q/max)*plotHeight;
  const grid=[0,max/2,max].map(v=>'<line x1="'+left+'" x2="'+(W-right)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="#d9e1d5"/><text x="'+(left-7)+'" y="'+(y(v)+3)+'" text-anchor="end">'+v+'</text>').join('');
  const paths=districts.map((d,i)=>{
    const path=frames.map((f,n)=>(n?'L':'M')+x(f.minute).toFixed(1)+' '+y(f.districts[i].queue).toFixed(1)).join(' ');
    return '<path d="'+path+'" fill="none" stroke="'+colours[i]+'" stroke-width="2.5" vector-effect="non-scaling-stroke"/><circle cx="'+x(t)+'" cy="'+y(frames[t].districts[i].queue)+'" r="3" fill="'+colours[i]+'"/>';
  }).join('');
  const gatesReached=gates.filter(g=>g.minute<=frames.at(-1).minute).map(g=>'<line x1="'+x(g.minute)+'" x2="'+x(g.minute)+'" y1="'+top+'" y2="'+(H-bottom)+'" stroke="#adb9aa" stroke-dasharray="3 4"/>').join('');
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" role="img" aria-label="Open reports by district through '+formatTime(frames.at(-1).minute)+'. At '+formatTime(t)+', '+frames[t].districts.map(d=>d.name+' '+d.queue).join(', ')+'.">'+grid+gatesReached+
    '<line x1="'+x(t)+'" x2="'+x(t)+'" y1="'+top+'" y2="'+(H-bottom)+'" stroke="#65776b" stroke-dasharray="2 4"/>'+paths+'</svg>';
}
function reportText(run,frames,alternative){
  const report=debrief(run,frames),a=frames.at(-1),other=compareRun(run,alternative),b=other.at(-1);
  return ['# Northbridge flood response handover',report.summary,sourceDescription(run.profile),...(run.profile?.id==='nyc311'?['Source: '+archive.officialUrl,'Reproducible request selection: '+archive.queryUrl,'Input SHA-256: '+archive.sha256]:[]),'','## District handover',
    ...a.districts.map(d=>d.name+': '+d.received+' received, '+d.handled+' handled, '+d.queue+' open, '+d.assisted+' open assisted-contact reports, oldest '+d.oldest+' minutes.'),
    '','## Controlled replay',(alternative==='staff'&&run.profile?'Keep the baseline roster assignments':alternatives.find(v=>v.id===alternative).label)+'. Weather and arrivals are identical.',
    'Open reports: your run '+a.queue+', alternative '+b.queue+'.',
    'Handled within 10 minutes: '+percent(a.within)+' versus '+percent(b.within)+'.',
    'Pending location checks: '+a.unverified+' versus '+b.unverified+'.',
    'Accumulated queue time: '+queueMinutes(frames)+' versus '+queueMinutes(other)+' report-minutes.',
    ...a.districts.map((d,i)=>d.name+' open at close: '+d.queue+' versus '+b.districts[i].queue+'.'),
    '','## Timed incident record',...report.log,'','This is a fictional training model. Source: Emergency Services and Public Safety, pp. 10, 14, 18 and 25.'].join('\n');
}

export function renderCommandRoom(main,mode){
  const profile=mode==='nyc311'?nycProfile:mode==='example'?exampleProfile():mode==='agency'?state.agencyProfile:null;
  if(mode==='agency'&&!profile){
    main.innerHTML='<div class="wrap page"><h1>Load a matched shift</h1><p>Use the calibration workspace to validate agency records in this browser.</p><a class="btn primary" href="#/simulator/calibration">Open agency calibration</a></div>';
    return ()=>{};
  }
  const slot=profile?(profile.id==='nyc311'?'nycFloodCommand':profile.id==='example'?'exampleFloodCommand':'agencyFloodCommand'):'floodCommand';
  const stored=state[slot];
  let run=stored?.version===2&&(!profile||stored.profile?.key===profile.key)?stored:{...freshFloodRun(),...(profile?{profile,weather:'Cloudburst'}:{})};
  if(profile)run.profile=profile;
  run.runId??=crypto.randomUUID();
  state[slot]=run;
  let zone='riverside',lens='map',review=null,interval=null,speed=900,alternative='staff',frames=[],comparisonFrames=[],compareKey='',sourceDesk='market';
  let model;
  const $=sel=>main.querySelector(sel);
  main.innerHTML=shell(profile);
  const stop=()=>{clearInterval(interval);interval=null};
  function refreshFrames(){frames=replayFlood(run);compareKey=''}
  function current(){return frames[review??run.minute]}
  function selectZone(id){
    if(!districtBy(id))return;
    zone=id;sourceDesk=districts.find(d=>d.id!==id&&current().districts.find(x=>x.id===d.id).teams>0)?.id||districts.find(d=>d.id!==id).id;
    $('#move-status').textContent='';refresh();
  }
  model=createCityModel($('#storm-canvas'),{onSelectDistrict:selectZone});
  function persistRun(){state[slot]=run;const ok=persist();if(!ok)$('#move-status').textContent='Storage unavailable. Keep this tab open and download the handover when finished.'}
  function finish(){
    const record=debrief(run,frames);
    alternative=run.moves.length?'staff':'outage';run.comparison=alternative;compareKey='';
    state.lastRun={summary:record.summary+(profile?' '+sourceDescription(profile):''),log:record.log,modelVersion:2,runId:run.runId,handoverMarkdown:reportText(run,frames,alternative)};
  }
  function moveClock(n){
    review=null;
    if(!advanceFlood(run,n))return;
    refreshFrames();
    if(nextGate(run)||run.finished)stop();
    if(run.finished)finish();
    persistRun();refresh();
  }
  function start(){
    if(run.finished||nextGate(run)||interval!==null)return;
    review=null;interval=setInterval(()=>moveClock(1),speed);refresh();
  }
  function focusDesk(){const el=$('#decision-desk');el.scrollIntoView({block:'center',behavior:'instant'});el.querySelector('button')?.focus({preventScroll:true})}
  function refreshBoard(f){
    const i=districts.findIndex(d=>d.id===zone),local=f.districts[i];
    const stage=local.flood<.22?0:local.flood<.39?1:local.flood<.61?2:3;
    const maxFlood=Math.max(...f.districts.map(d=>d.flood));
    model?.update({progress:f.minute/60,flood:maxFlood,queue:Math.min(1,f.queue/75),response:1-f.transit.length/Math.max(1,f.transit.length+f.districts.reduce((n,d)=>n+d.teams,0)),playing:interval!==null&&lens==='map',selectedDistrict:zone,districts:f.districts,transfers:f.transit});
    main.querySelectorAll('[data-zone]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.zone===zone)));
    main.querySelectorAll('[data-lens]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lens===lens)));
    $('#storm-camera').hidden=lens!=='camera';$('.ops-camera-controls').hidden=lens!=='map';
    $('#storm-canvas').setAttribute('aria-hidden',String(lens!=='map'));
    if(lens==='camera'){
      const prefix=['river','market','civic'][i],file='assets/'+prefix+'-camera-'+stage+'.webp';
      if($('#storm-frame').getAttribute('src')!==file)$('#storm-frame').src=file;
      $('#storm-frame').alt=local.name+' illustrated field view at '+formatTime(f.minute)+', '+phases[i][stage].toLowerCase();
      $('#storm-caption').textContent=zones[i]+' · '+phases[i][stage];
    }
    $('#map-stamp').textContent=formatTime(f.minute)+(review!==null?' · REPLAY':'');
    $('#zone-name').textContent=profile?profile.desks[i].name+' → '+local.name:districts[i].station;
    $('#zone-brief').textContent=profile?'Source demand feeds this Northbridge desk. Map, travel and scenario events are illustrative.':districts[i].brief;
    for(const k of ['queue','assisted','teams'])$('#zone-'+k).textContent=local[k];
    const arrivals=f.transit.filter(m=>m.to===zone).sort((a,b)=>a.eta-b.eta);
    $('#zone-eta').textContent=arrivals.length?arrivals.length+' · '+formatTime(arrivals[0].eta):'0';
    const from=$('#from-desk');
    if(from.dataset.zone!==zone){
      from.innerHTML=districts.filter(d=>d.id!==zone).map(d=>'<option value="'+d.id+'">'+esc(d.name)+'</option>').join('');
      from.dataset.zone=zone;from.value=sourceDesk;
    }
    sourceDesk=from.value;
    for(const o of from.options){const desk=f.districts.find(x=>x.id===o.value);o.textContent=desk.name+' · '+desk.teams+' at desk'}
    const historic=review!==null;
    from.disabled=historic||run.finished;
    $('#move-team').disabled=historic||!canTransfer(run,f,sourceDesk,zone);
    const eta=run.minute+travelMinutes(run,sourceDesk,zone);
    $('#travel-note').textContent=historic?'Return to the current minute to move a team.':run.finished?'The shift closed at 09:00.':f.districts.find(d=>d.id===sourceDesk).teams===0?'No active team at the selected origin.':'Travel '+travelMinutes(run,sourceDesk,zone)+' min · arrival '+formatTime(eta)+(eta>60?' after handover.':'.');
  }
  function refreshIncident(f){
    const pending=nextGate(run),card=$('#decision-desk');
    const kind=review!==null?'review':run.finished?'done':pending?pending.id:'live';
    const mark=kind+(kind==='live'?(gates.find(g=>g.minute>run.minute)?.id||'handover'):'');
    if(card.dataset.mark===mark)return;
    card.dataset.mark=mark;card.classList.toggle('pending',!!pending&&review===null);
    if(review!==null){
      card.innerHTML='<div>'+line('HISTORICAL VIEW')+'<h2>Inspect an earlier minute</h2><p>The map, staff, queue and log show the recorded position. Move the timeline to explore.</p></div><button id="storm-present" class="btn outline">Return to present '+icon('arrow',15)+'</button>';
      $('#storm-present').onclick=()=>{review=null;refresh()};return;
    }
    if(run.finished){
      card.innerHTML='<div>'+line('09:00 · SHIFT COMPLETE')+'<h2>Handover is ready</h2><p>Your timed decisions and end-of-shift record are in the fieldbook.</p></div><button id="jump-handover" class="btn primary">Review the handover '+icon('arrow',15)+'</button>';
      $('#jump-handover').onclick=()=>$('#after-action').scrollIntoView({block:'start'});return;
    }
    if(!pending){
      const upcoming=gates.find(g=>g.minute>run.minute);
      card.innerHTML='<div>'+line('DUTY OFFICER BRIEF')+'<h2>'+(upcoming?'Next briefing · '+formatTime(upcoming.minute):'Prepare the 09:00 handover')+'</h2><p>'+(upcoming?'Inspect the busiest desk, review its oldest reports and decide whether a transfer can arrive in time.':'Review the remaining queues, assisted-contact workload and unresolved location checks.')+'</p></div><span class="brief-ref">'+sourceLink(14)+'</span>';return;
    }
    card.innerHTML='<div class="gate-intro">'+line(formatTime(pending.minute)+(profile?' · EXERCISE INJECT':' · OFFICER DECISION'))+'<h2>'+esc(pending.title)+'</h2><p>'+esc(pending.evidence)+'</p><small>'+esc(pending.source)+' · '+sourceLink(pending.page)+'</small></div><div class="gate-orders">'+pending.options.map(o=>'<button data-order="'+o.id+'"><strong>'+esc(o.title)+'</strong><span>'+esc(orderDetail(run,pending,o))+'</span></button>').join('')+'</div>';
    main.querySelectorAll('[data-order]').forEach(btn=>btn.onclick=()=>{
      if(!issueOrder(run,pending.id,btn.dataset.order))return;
      refreshFrames();persistRun();refresh();
      $('#move-status').textContent='Order logged at '+formatTime(run.minute)+'. Resume or advance the clock.';
    });
  }
  function refreshHandover(){
    const host=$('#after-action');
    host.hidden=!run.finished||review!==null;
    if(host.hidden)return;
    const a=frames.at(-1),key=alternative+'/'+run.moves.length+'/'+Object.values(run.orders).join('-');
    if(compareKey===key)return;
    compareKey=key;comparisonFrames=compareRun(run,alternative);
    const b=comparisonFrames.at(-1),p=frames.reduce((x,y)=>y.queue>x.queue?y:x);
    const changed=gates.find(g=>g.id===alternative);
    const comparisonNote=changed?'Alternative order: '+changed.options.find(o=>o.id!==run.orders[changed.id]).title+'. Team movements and the other two orders are held constant.':'The alternative follows the baseline roster with no discretionary transfers. All three service orders are held constant.';
    host.innerHTML='<div class="storm-section-head"><div>'+line('AFTER-ACTION REVIEW')+'<h2>09:00 district handover</h2></div><button class="btn outline" id="handover-download">'+icon('download',16)+' Download handover</button></div>'+
      '<p>'+(profile?'<b>Modeled outcome.</b> ':'')+esc(debrief(run,frames).summary)+' The largest city queue was '+p.queue+' at '+formatTime(p.minute)+'.</p>'+
      '<div class="handover-areas">'+a.districts.map(d=>'<div><h3>'+esc(d.name)+'</h3><b>'+d.queue+' open</b><small>'+d.assisted+' assisted · oldest '+d.oldest+' min</small></div>').join('')+'</div>'+
      '<div class="compare-controls"><label for="storm-compare">Replay one change</label><select id="storm-compare">'+alternatives.map(o=>'<option value="'+o.id+'" '+(o.id===alternative?'selected':'')+'>'+esc(o.id==='staff'&&profile?'Keep the baseline roster assignments':o.label)+'</option>').join('')+'</select></div><p>'+esc(comparisonNote)+' Both runs have identical opening demand and new arrivals ('+a.received+' reports in total).</p>'+
      '<div class="storm-table"><table><thead><tr><th>At 09:00</th><th>Your run</th><th>Alternative</th><th>Your difference</th></tr></thead><tbody>'+
      [['Open reports',a.queue,b.queue],['Handled reports',a.handled,b.handled],['Open assisted reports',a.assisted,b.assisted],['Location checks pending',a.unverified,b.unverified],['Oldest open report (min)',a.oldest,b.oldest],['Accumulated queue time (report-min)',queueMinutes(frames),queueMinutes(comparisonFrames)]].map(([k,n,m])=>'<tr><th>'+k+'</th>'+deltaCell(n,m)+'</tr>').join('')+
      '</tbody></table></div><details class="district-comparison"><summary>Compare the three district queues</summary><p>Accumulated queue time adds the open reports at the start of each minute. Reports that wait longer contribute more to this measure.</p><div class="storm-table"><table><thead><tr><th>Open at 09:00</th><th>Your run</th><th>Alternative</th><th>Your difference</th></tr></thead><tbody>'+a.districts.map((d,i)=>'<tr><th>'+esc(d.name)+'</th>'+deltaCell(d.queue,b.districts[i].queue)+'</tr>').join('')+'</tbody></table></div></details><a class="text-link" href="#/fieldbook">Open fieldbook '+icon('arrow',15)+'</a>';
    $('#storm-compare').onchange=e=>{alternative=e.target.value;run.comparison=alternative;if(state.lastRun?.runId===run.runId)state.lastRun.handoverMarkdown=reportText(run,frames,alternative);persistRun();refreshHandover();$('#storm-compare').focus({preventScroll:true})};
    $('#handover-download').onclick=()=>downloadFile('northbridge-flood-handover.md',reportText(run,frames,alternative));
  }
  function refresh(){
    const f=current(),at=f.minute,pending=nextGate(run);
    $('#storm-clock').textContent=formatTime(at);
    $('#storm-clock-note').textContent=review!==null?'Replay · current '+formatTime(run.minute):run.finished?'Shift complete':pending?'Paused for officer decision':interval!==null?'Clock running':run.minute?'Clock paused':'Ready · handover 09:00';
    const play=$('#storm-play');
    play.disabled=run.finished&&review===null;
    play.innerHTML=review!==null?icon('arrow',15)+' Return to present':pending?icon('flag',15)+' Review briefing':interval!==null?icon('pause',15)+' Pause':run.finished?icon('check',15)+' Completed':icon('play',15)+(run.minute?' Resume':' Run exercise');
    $('#storm-forward').disabled=review!==null||!!pending||run.finished;
    $('#storm-forward').textContent=nextBoundary(run)===60?'Advance to handover':'Advance to briefing';
    $('#storm-step').disabled=review!==null||!!pending||run.finished;
    $('#storm-weather').value=run.weather;$('#storm-weather').disabled=run.minute>0||run.moves.length>0||interval!==null;
    for(const k of ['received','handled','queue','oldest'])$('#kpi-'+k).textContent=f[k]+(k==='oldest'?' min':'');
    refreshBoard(f);refreshIncident(f);
    $('#history-plot').innerHTML=chart(frames,at);$('#storm-range').value=at;
    $('#storm-range').style.setProperty('--reached',(run.minute/60*100)+'%');
    $('#inspect-stamp').textContent=formatTime(at)+' · '+(review!==null?'historical view':'current minute');
    $('#quality-target').textContent=percent(f.within);
    $('#quality-pending').textContent=f.unverified;$('#quality-verified').textContent=percent(f.verifiedPct);
    $('#quality-feed').textContent=at>=28&&at<41?'Stale since 08:28':at>=41?'Restored at 08:41':'Current';
    $('#quality-bulletin').textContent=!f.bulletin.ordered?'Awaiting 08:44 review':f.bulletin.readyAt!==null?'Issued '+formatTime(f.bulletin.readyAt):'Signed · '+f.bulletin.prepared+'/'+(f.bulletin.ordered==='accessible'?4:1)+' units prepared';
    const busiest=f.districts.reduce((x,y)=>y.queue>x.queue?y:x),donor=f.districts.filter(d=>d.id!==busiest.id&&d.teams>0).sort((x,y)=>x.queue-y.queue)[0];
    $('#milo-duty').textContent=review!==null?'You are inspecting '+formatTime(at)+'. Compare the next few minutes to see when the team actually became available.':pending?'Before signing, inspect the source of this briefing and the cost of each operating arrangement.':f.unverified>0?'There are '+f.unverified+' handled records awaiting a location check. Consider that work when comparing the open queues.':busiest.queue&&donor?'At '+formatTime(at)+', '+busiest.name+' has '+busiest.queue+' open. What would '+donor.name+' give up by sending a team?':'Use the three desk tabs to inspect the teams and reports at each location.';
    const list=decisionLog(run).filter(e=>e.at<=at).reverse();
    $('#storm-log').innerHTML=list.map(e=>'<li><b>'+formatTime(e.at)+'</b><span>'+esc(e.text)+'</span></li>').join('');
    refreshHandover();
  }
  $('#storm-play').onclick=()=>{
    if(review!==null){review=null;refresh();return}
    if(nextGate(run)){focusDesk();return}
    if(interval!==null){stop();refresh()}else start();
  };
  $('#storm-forward').onclick=()=>{stop();moveClock(nextBoundary(run)-run.minute);if(nextGate(run))focusDesk();else if(run.finished)$('#after-action').scrollIntoView({block:'start',behavior:'instant'})};
  $('#storm-step').onclick=()=>{stop();moveClock(1)};
  $('#storm-reset').onclick=()=>{
    stop();const lastWeather=run.weather;run=freshFloodRun();run.runId=crypto.randomUUID();if(profile)run.profile=profile;run.weather=lastWeather;review=null;sourceDesk='market';zone='riverside';
    $('#from-desk').dataset.zone='';$('#move-status').textContent='New exercise at 08:00.';model.resetView();refreshFrames();persistRun();refresh();
  };
  $('#storm-weather').onchange=e=>{if(run.minute===0&&!run.moves.length)run.weather=e.target.value;refreshFrames();persistRun();refresh()};
  $('#storm-speed').onchange=e=>{speed=Number(e.target.value);if(interval!==null){stop();start()}};
  $('#storm-range').oninput=e=>{stop();const t=Math.min(Number(e.target.value),run.minute);review=t<run.minute?t:null;refresh()};
  main.querySelectorAll('[data-zone]').forEach(b=>b.onclick=()=>selectZone(b.dataset.zone));
  main.querySelectorAll('[data-lens]').forEach(b=>b.onclick=()=>{lens=b.dataset.lens;refresh()});
  main.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>{
    const op=b.dataset.camera;if(op==='reset')model.resetView();else if(op==='left'||op==='right')model.rotate(op==='left'?-20:20);else model.zoomBy(op==='in'?1.17:1/1.17);
  });
  $('#from-desk').onchange=e=>{sourceDesk=e.target.value;refresh()};
  $('#transfer-form').onsubmit=e=>{
    e.preventDefault();if(review!==null)return;
    if(!transferTeam(run,sourceDesk,zone))return;
    stop();const eta=run.minute+travelMinutes(run,sourceDesk,zone);refreshFrames();persistRun();refresh();
    $('#move-status').textContent='Team left '+districtBy(sourceDesk).name+' at '+formatTime(run.minute)+'. Due '+formatTime(eta)+'. Clock paused.';
  };
  refreshFrames();if(run.finished)alternative=run.comparison||(run.moves.length?'staff':'outage');refresh();
  return ()=>{stop();model.destroy();persistRun()};
}
