import {createCityModel} from './city-model.js';
import {state,persist} from './state.js';
import {icon,esc,line,pad} from './ui.js';
const events=[
  {
    minute:12,
    title:'The resident line is filling',
    body:'Reports of flooded approaches arrive in several languages. Which operating arrangement will you introduce?',
    options:[
    {
      name:'Staff a multilingual callback desk',
      detail:'Assign interpreters and a named callback owner.',
      effect:[-1,5,4],
      reason:'The callback team resolves duplicate reports and keeps translated contact records.'
    },
    {
      name:'Consolidate intake records',
      detail:'Have staff review suggested duplicates in one queue.',
      effect:[-3,2,1],
      reason:'Duplicate reports clear faster, while translated follow-ups receive less capacity.'
    }
    ],
    ref:10
  },
  {
    minute:28,
    title:'The live map feed drops out',
    body:'The river sensor feed is stale. Operators still have telephone reports and the last verified map.',
    options:[
    {
      name:'Activate the paper fallback',
      detail:'Pair a dispatcher with a scribe and timestamp each verified report.',
      effect:[3,7,5],
      reason:'Manual checks add handling time while preserving a reconstructable picture.'
    },
    {
      name:'Open a verification cell',
      detail:'Move two officers to cross-check reports and restore the shared log.',
      effect:[1,4,3],
      reason:'Cross-checks protect the record while call handlers retain more capacity.'
    }
    ],
    ref:25
  },
  {
    minute:44,
    title:'Prepare a public update',
    body:'The duty officer must approve a resident update while neighbourhood conditions are changing.',
    options:[
    {
      name:'Verify a targeted update',
      detail:'Review locality, language and accessible versions before officer approval.',
      effect:[-1,6,5],
      reason:'A reviewed neighbourhood message reaches affected groups and preserves the approval trail.'
    },
    {
      name:'Publish a verified holding update',
      detail:'Give the known facts and next update time, then complete local checks.',
      effect:[-3,3,2],
      reason:'A narrow, reviewed update reduces repeat calls. Localised follow-up remains outstanding.'
    }
    ],
    ref:18
  }
];
const fresh=()=>({minute:0,weather:'Steady rain',picks:{},finished:false});
const clock=n=>'08:'+pad(n===60?0:n);
const displayTime=n=>n===60?'09:00':clock(n);
function metrics(r){
  const t=r.minute,heavy=r.weather==='Cloudburst';
  const choices=events.map((e,i)=>t>=e.minute?e.options[r.picks[i]]:null);
  const effect=choices.reduce((v,c)=>v.map((x,i)=>x+(c?.effect[i]||0)),[0,0,0]);
  const demand=Math.round(7+(heavy?25:17)*Math.min(t,38)/38-Math.max(0,t-38)*.24+effect[0]);
  const coverage=Math.round(54+t*.28+effect[1]);
  const records=Math.min(100,Math.round(72-t*.1+effect[2]));
  const flood=Math.min(.96,.10+t/60*(heavy?.86:.64));
  return {queue:Math.max(0,demand),coverage,records,flood}
}
function comparison(r){
  const alt={...r,picks:Object.fromEntries(events.map((e,i)=>[i,1-r.picks[i]]))},a=metrics(r),b=metrics(alt);
  return '<details class="compare"><summary>Compare an alternative response</summary><p>Same weather and timeline, with the other choice at each decision. These are illustrative model outputs.</p><table><thead><tr><th>At 09:00</th><th>Your run</th><th>Alternative</th></tr></thead><tbody>'+[['Open reports',a.queue,b.queue],['Verified coverage',a.coverage+'%',b.coverage+'%'],['Record completeness',a.records+'%',b.records+'%']].map(row=>'<tr>'+row.map((v,i)=>i===0?'<th>'+v+'</th>':'<td>'+v+'</td>').join('')+'</tr>').join('')+
    '</tbody></table><ol>'+events.map((e,i)=>'<li>'+esc(e.options[alt.picks[i]].name)+'</li>').join('')+
    '</ol></details>';
}
function summary(r){
  const s=metrics(r);
  return r.weather+' exercise, 08:00–09:00. '+s.queue+' open reports, '+s.coverage+'% verified coverage and '+s.records+
    '% record completeness at close.'
}
export function renderSimulation(main){
  let model=null,timer=null,run=state.run||fresh(),playing=false,previewMinute=null,activeView='model';
  state.run=run;
  main.innerHTML='<div class="wrap sim-page"><div class="page-lead">'+line('OPERATIONS TABLETOP')+'<h1>Northbridge city simulator</h1><p>Manage a one-hour river flood exercise. Watch demand build, make three operating decisions and review the record you leave behind.</p></div><section class="sim-layout"><div class="sim-view" id="city-view"><div class="sim-top"><span><i></i> NORTHBRIDGE RIVER DISTRICT</span><span id="sim-clock">08:00</span></div><canvas id="city-canvas" role="img" aria-label="Rotatable three-dimensional Northbridge river district. The river level, call queue and response units change with the exercise."></canvas><div class="field-camera" hidden><img id="river-frame" src="assets/river-camera-0.webp" alt="Illustrated river conditions at the civic promenade"><span id="camera-caption"></span></div><div class="view-switch" aria-label="District view"><button data-view="model" aria-pressed="true">3D model</button><button data-view="camera" aria-pressed="false">Field camera</button></div><div class="map-tools"><span>Drag to orbit</span><button data-cam="left" aria-label="Rotate left">'+icon('left',15)+
    '</button><button data-cam="right" aria-label="Rotate right">'+icon('chevron',15)+
    '</button><button data-cam="in" aria-label="Zoom in">'+icon('plus',15)+
    '</button><button data-cam="out" aria-label="Zoom out">'+icon('minus',15)+
    '</button><button data-cam="reset" aria-label="Reset camera">'+icon('target',15)+
    '</button></div></div><div class="sim-panel" id="sim-controls"><span class="minor-label">EXERCISE CONTROL</span><h2>River flood response</h2><label for="weather">Weather profile</label><select id="weather"><option>Steady rain</option><option>Cloudburst</option></select><div class="metrics"><div><span>'+icon('headset',16)+
    ' Open reports</span><b id="met-q"></b></div><div><span>'+icon('target',16)+
    ' Verified coverage</span><b id="met-c"></b></div><div><span>'+icon('file',16)+
    ' Record completeness</span><b id="met-r"></b></div></div><div class="sim-action"><button id="sim-play" class="btn primary"></button><button id="sim-reset" class="btn outline" aria-label="Reset exercise">'+icon('reset',16)+
    ' Reset</button></div></div></section><section class="timeline" id="timeline"><div><b>Exercise timeline</b><small id="time-status" role="status"></small></div><label class="sr" for="time-range">Review elapsed exercise minutes</label><input type="range" id="time-range" min="0" max="60" step="1" value="0"><div class="tick-labels"><span>08:00</span><span>08:15</span><span>08:30</span><span>08:45</span><span>09:00</span></div></section><section class="sim-lower"><div class="paper-card" id="decision-desk" aria-live="polite"></div><div class="paper-card"><span class="minor-label">OPERATIONS LOG</span><h3>Decision record</h3><div id="run-log"></div></div></section><details class="model-notes"><summary>Model assumptions and playbook references '+icon('down',16)+
    '</summary><p>This fictional training model uses one-minute steps. Weather changes the incoming report load and river level. Staffing choices change the open queue, share of coverage verified and completeness of the incident record. The percentage measures are teaching assumptions. The exercise pauses for an officer decision at minutes 12, 28 and 44. The timeline lets you inspect elapsed time. The field camera uses four illustrative views of the promenade, selected by the simulated flood level.</p><p>Volume 07 covers language access (p. 10), surge handling (p. 14), public alerts (p. 18) and outage fallback (p. 25). <a class="text-link" href="#/playbook/emergency-services/sources">Explore the sourcebook '+icon('arrow',14)+
    '</a></p></details></div>';
  const $=s=>main.querySelector(s);
  const city=$('#city-canvas');
  model=createCityModel(city,{progress:0,playing:false});
  const pending=()=>events.findIndex((e,i)=>run.minute>=e.minute&&run.picks[i]===undefined);
  function pause(){
    playing=false;
    clearInterval(timer);
    timer=null
  }
  function start(){
    if(run.finished||pending()!==-1)return;
    previewMinute=null;
    playing=true;
    timer=setInterval(()=>{
      run.minute=Math.min(60,run.minute+1);
      if(pending()!==-1||run.minute===60)pause();
      if(run.minute===60){
        run.finished=true;
        state.lastRun={summary:summary(run),log:events.map((e,i)=>displayTime(e.minute)+' · '+e.options[run.picks[i]].name+' — '+e.options[run.picks[i]].reason)}
      }
      persist();
      refresh()
    },520);
    refresh()
  }
  function refresh(){
    const t=previewMinute??run.minute;
    const hist={...run,minute:t},s=metrics(hist),p=pending();
    const review=t!==run.minute;
    const descriptions=['Promenade open','Rain intensifies','Water reaches the walkway','Riverside access closed'];
    const frame=s.flood<.22?0:s.flood<.39?1:s.flood<.61?2:3;
    const framePath='assets/river-camera-'+frame+'.webp';
    if($('#river-frame').getAttribute('src')!==framePath)$('#river-frame').src=framePath;
    $('#camera-caption').textContent='Civic promenade · '+descriptions[frame];
    $('#river-frame').alt='Illustrated field camera at '+displayTime(t)+'. '+descriptions[frame]+'.';
    $('.field-camera').hidden=activeView!=='camera';
    $('.map-tools').hidden=activeView!=='model';
    main.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===activeView)));
    $('#sim-clock').textContent=displayTime(t);
    $('#met-q').textContent=s.queue;
    $('#met-c').textContent=s.coverage+'%';
    $('#met-r').textContent=s.records+'%';
    model.update({progress:t/60,flood:s.flood,queue:s.queue/38,response:Object.keys(run.picks).filter(i=>events[i].minute<=t).length/3,playing});
    $('#weather').value=run.weather;
    $('#weather').disabled=run.minute>0||playing;
    $('#time-range').value=t;
    $('#time-range').style.setProperty('--elapsed',run.minute/60*100+'%');
    $('#time-status').textContent=review?'Reviewing '+displayTime(t)+' · reached '+displayTime(run.minute):playing?'Running':run.finished?'Completed':p!==-1?'Paused for decision':run.minute?'Paused':'Ready to begin';
    const act=$('#sim-play');
    act.disabled=!review&&run.finished;
    act.innerHTML=icon(review?'arrow':playing?'pause':run.finished?'check':'play',15)+(review?'Return to present':playing?'Pause':run.finished?'Completed':p!==-1?'Review decision':run.minute?'Resume exercise':'Run exercise');
    let desk;
    if(review){
      desk='<span class="minor-label">TIMELINE REVIEW</span><h2>At '+displayTime(t)+'</h2><p>Inspect the city and service measures at this point in your run. Return to the present to continue.</p><button class="text-link" id="present">Return to '+displayTime(run.minute)+
        ' '+icon('arrow',15)+
        '</button>'
    }
    else if(p!==-1){
      const e=events[p];
      desk='<span class="minor-label">DECISION '+pad(p+1)+' / '+displayTime(e.minute)+'</span><h2>'+e.title+
        '</h2><p>'+e.body+
        '</p><div class="sim-options">'+e.options.map((o,i)=>'<button class="sim-choice" data-pick="'+i+'"><strong>'+o.name+'</strong><span>'+o.detail+
        '</span></button>').join('')+
        '</div><a class="cite" target="_blank" rel="noopener" href="/playbooks/ai-government-emergency-services-playbook.pdf#page='+e.ref+
        '">Emergency services · p. '+e.ref+
        ' '+icon('upRight',12)+
        '</a>'
    }
    else if(run.finished){
      desk='<span class="minor-label">AFTER-ACTION REVIEW</span><h2>Exercise complete</h2><p>'+esc(summary(run))+
        '</p><p>Your three decisions and their consequences are in your fieldbook. Use Reset to try a different response.</p>'+comparison(run)+
        '<a class="text-link" href="#/fieldbook">Read your debrief '+icon('arrow',15)+
        '</a>'
    }
    else{
      const next=events.find((e,i)=>run.picks[i]===undefined);
      desk='<span class="minor-label">DUTY OFFICER BRIEF</span><h2>'+(run.minute?'Operating picture':'A river district under pressure')+
        '</h2><p>'+(run.minute?'Rain continues across Northbridge. Monitor open reports, the verification team’s coverage and the completeness of the incident record.':'Rain is lifting the river against the lower embankment. The service centre expects a surge in resident reports. Choose a weather profile and begin the exercise.')+
        '</p><div class="next-decision">'+icon('time',16)+(next?'Next decision at '+displayTime(next.minute):'Exercise closes at 09:00')+
        '</div>'
    }
    const deskKey=review?'review'+t:p!==-1?'gate'+p:run.finished?'end':run.minute?'active'+Object.keys(run.picks).length:'start';
    if($('#decision-desk').dataset.view!==deskKey){
      $('#decision-desk').dataset.view=deskKey;
      $('#decision-desk').innerHTML=desk;
      $('#present')?.addEventListener('click',()=>{
        previewMinute=null;
        refresh()
      });
      main.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{
        run.picks[p]=Number(b.dataset.pick);
        persist();
        start()
      })
    }
    const logs=events.map((e,i)=>run.picks[i]!==undefined&&e.minute<=t?'<li><b>'+displayTime(e.minute)+'</b><span>'+esc(e.options[run.picks[i]].name)+'</span></li>':'').join('');
    $('#run-log').innerHTML='<ol class="log-list"><li><b>08:00</b><span>Exercise opened · '+esc(run.weather)+'</span></li>'+logs+(run.finished&&t===60?'<li><b>09:00</b><span>Debrief saved to fieldbook</span></li>':'')+
      '</ol>'
  }
  $('#sim-play').onclick=()=>{
    if(previewMinute!==null){
      previewMinute=null;
      refresh()
    }else if(pending()!==-1){
      $('#decision-desk').scrollIntoView({block:'center'});
      $('#decision-desk button')?.focus({preventScroll:true})
    }else if(playing){
      pause();
      refresh()
    }else start()
  };
  $('#sim-reset').onclick=()=>{
    pause();
    run=fresh();
    state.run=run;
    previewMinute=null;
    persist();
    model.resetView();
    refresh()
  };
  $('#weather').onchange=e=>{
    run.weather=e.target.value;
    persist();
    refresh()
  };
  $('#time-range').oninput=e=>{
    pause();
    const n=Math.min(Number(e.target.value),run.minute);
    previewMinute=n===run.minute?null:n;
    refresh()
  };
  main.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{
    activeView=b.dataset.view;
    refresh()
  });
  main.querySelectorAll('[data-cam]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.cam;
    if(k==='reset')model.resetView();else if(k==='left'||k==='right')model.rotate(k==='left'?-20:20);else model.zoomBy(k==='in'?1.15:1/1.15)
  });
  refresh();
  return ()=>{
    pause();
    model.destroy();
    persist()
  }
}
