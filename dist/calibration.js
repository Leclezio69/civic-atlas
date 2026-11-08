import {esc,icon,line} from './ui.js';
import {state,persist,downloadFile} from './state.js';
import {archive,nycProfile,areaNames,mapNames,shiftColumns,studyColumns,readAgencyProfile,sampleFiles,sourceDescription} from './agency-data.js';
import {replayFlood,freshFloodRun,formatTime} from './flood-engine.js';

const sum=xs=>xs.reduce((a,b)=>a+b,0);
const labelExample={label:'Sample training shift',studyReference:'Fictional rate study',startLocal:'2026-06-01T08:00',referenceEnd:'2026-05-31T17:00',timeZone:'America/New_York'};
export function exampleProfile(){
  const files=sampleFiles();
  return {...readAgencyProfile(files.shift,files.study,labelExample),id:'example',key:'calibration-demo-v1'};
}
export function validateShift(profile){
  const baseline=replayFlood({...freshFloodRun(),minute:60,profile});
  const rows=profile.desks.map((d,i)=>{
    let open=d.opening;
    const observed=[open];
    for(let t=0;t<60;t++){open+=d.arrivals[t]-d.handled[t];observed.push(open)}
    const predicted=baseline.map(f=>f.districts[i].queue);
    const mae=sum(observed.slice(1).map((q,t)=>Math.abs(q-predicted[t+1])))/60;
    return {name:d.name,observed,predicted,mae,arrivals:sum(d.arrivals),actualHandled:sum(d.handled),modeledHandled:baseline.at(-1).districts[i].handled,
      teamMinutes:sum(d.teams),routine:d.routineMinutes,assisted:d.assistedMinutes};
  });
  return {rows,mae:sum(rows.map(r=>r.mae))/3,actual:sum(rows.map(r=>r.actualHandled)),modeled:sum(rows.map(r=>r.modeledHandled))};
}
export const boardTabs=active=>'<div class="module-bar calibration-tabs"><div class="wrap"><nav aria-label="Simulator workspaces">'+[
  ['training','Training shift','#/simulator'],['nyc311','NYC311 replay','#/simulator/nyc311'],['calibration','Agency calibration','#/simulator/calibration']
].map(([id,title,url])=>'<a href="'+url+'" '+(id===active?'aria-current="page"':'')+'>'+title+'</a>').join('')+'</nav></div></div>';
function outside(url,title){return '<a class="cite" href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(title)+' '+icon('upRight',12)+'</a>'}
const faq='https://www.nyc.gov/site/311reporting/faq/faq.page';
const cityReport='https://www.nyc.gov/mayors-office/news/2023/09/mayor-adams-new-yorkers-ongoing-flooding-response-recovery-efforts';
const comptroller='https://comptroller.nyc.gov/wp-content/uploads/documents/Is-New-York-City-Ready-for-Rain.pdf';
const staffTestimony='https://legistar.council.nyc.gov/View.ashx?GUID=993FDB31-2E19-42F8-BB0A-9BFE88137CDD&ID=8804200&M=F';
export function requiredStaff(share,minutes,productive){
  if(![share,minutes,productive].every(Number.isFinite)||share<=0||share>100||minutes<=0||productive<=0||productive>100)return null;
  return Math.ceil(45000*(share/100)*minutes/(210*productive/100));
}
function staffingBenchmark(){
  return '<details class="cal-provenance staff-benchmark" id="staff-benchmark"><summary>Agency staffing benchmark · Tropical Storm Isaias, August 4, 2020</summary>'+
    '<h3>What load could a citywide call centre carry?</h3><p>NYC reported about 45,000 incoming 311 calls between noon and 15:30. The city deployed 900 call takers over the day and reported 600 taking calls simultaneously at the height of the storm. '+outside(staffTestimony,'DoITT testimony, pp. 2–3')+'</p>'+
    '<div class="cal-inputgrid"><label>Calls needing a live agent (%)<input type="number" id="bench-share" value="70" min="1" max="100" step="1"></label><label>Active minutes per agent-handled call<input type="number" id="bench-time" value="3" min="0.1" max="120" step="0.1"></label><label>Productive share of staffed time (%)<input type="number" id="bench-use" value="85" min="1" max="100" step="1"></label></div>'+
    '<output id="bench-result" role="status"></output><p class="cal-caption">The three controls are planning assumptions. The calculation spreads the observed approximate volume across 210 minutes and rounds the staffing requirement up. It estimates average concurrent staffing under your assumptions. The published 600 is a peak. The testimony does not establish the average roster, handling minutes or number of requests at a district desk. This event supplies a separate reference from the 2023 flood replay.</p></details>';
}
function nycPlot(selected){
  const data=nycProfile.desks.map(d=>d.arrivals),colours=['#296f61','#b07839','#536b91'];
  const totals=data[0].map((_,t)=>sum(data.map(d=>d[t])));
  const max=Math.max(...totals),base=112,step=10;
  const rects=totals.map((_,t)=>{let y=base;return data.map((d,i)=>{
    const h=d[t]*96/max;y-=h;return '<rect x="'+(t*step+3)+'" y="'+y.toFixed(1)+'" width="8" height="'+h.toFixed(1)+'" fill="'+colours[i]+'"/>';
  }).join('')}).join('');
  return '<svg viewBox="0 0 602 115" role="img" aria-label="Minute-binned recorded NYC311 requests. Peak selected-borough count '+max+' in one minute."><line x1="0" x2="602" y1="112" y2="112" stroke="#bec8b9"/><rect x="'+(selected*step+1)+'" y="2" width="11" height="110" fill="#e8d2ac"/>'+rects+'</svg>';
}
function validationMarkup(profile){
  const v=validateShift(profile),kind=profile.id==='example'?'Synthetic example':'Imported shift';
  return '<div class="validation-head"><div><span class="minor-label">'+kind.toUpperCase()+'</span><h3>'+esc(profile.label)+'</h3><p>'+esc(profile.startLocal.replace('T',' '))+' · '+esc(profile.timeZone)+'</p></div><strong>'+v.mae.toFixed(2)+'<small>mean absolute queue error (reports)</small></strong></div>'+
    '<p>The baseline uses the recorded arrivals and roster with handling times from the earlier study. It makes no desk transfers or briefing decisions. Observed handoffs are held out for the comparison.</p>'+
    '<div class="cal-scroll"><table><thead><tr><th>Source desk → map desk</th><th>Team-minutes</th><th>Routine / assisted min per handoff</th><th>Observed handoffs</th><th>Modeled handoffs</th><th>Queue MAE</th></tr></thead><tbody>'+
    v.rows.map((r,i)=>'<tr><th>'+esc(r.name)+' → '+mapNames[i]+'</th><td>'+r.teamMinutes+'</td><td>'+r.routine.toFixed(2)+' / '+r.assisted.toFixed(2)+'</td><td>'+r.actualHandled+'</td><td>'+r.modeledHandled+'</td><td>'+r.mae.toFixed(2)+'</td></tr>').join('')+
    '</tbody></table></div><p class="cal-caption">MAE is the average absolute difference between modeled and reconstructed observed open queues across 180 desk-minute observations. It can reveal a poor fit even when end-of-hour totals match. One shift supplies no generalisation estimate.</p>'+
    '<div class="actions"><a class="btn primary" href="#/simulator/'+(profile.id==='example'?'example':'agency')+'">Run this profile '+icon('arrow',15)+'</a><button type="button" class="btn outline" id="export-validation">'+icon('download',14)+' Export validation</button></div>';
}
function validationCsv(profile){
  const quote=v=>{
    const text=typeof v==='string'&&/^[=+@-]/.test(v)?"'"+v:String(v);
    return '"'+text.replaceAll('"','""')+'"';
  };
  const v=validateShift(profile);
  const lines=[['profile','source','shift_start','timezone','rate_study','rate_study_end','desk','map_desk','minute_ending','arrivals','rostered_teams','observed_handoffs','observed_open','modeled_handoffs','modeled_open','modeled_minus_observed_open']];
  v.rows.forEach((r,i)=>{const desk=profile.desks[i];for(let t=1;t<=60;t++){const service=r.predicted[t-1]+desk.arrivals[t-1]-r.predicted[t];lines.push([
    profile.id,profile.label,profile.startLocal,profile.timeZone,profile.studyReference,profile.referenceEnd,r.name,mapNames[i],t,desk.arrivals[t-1],desk.teams[t-1],desk.handled[t-1],r.observed[t],service,r.predicted[t],r.predicted[t]-r.observed[t]
  ])}});
  return lines.map(r=>r.map(quote).join(',')).join('\n');
}
function inputFile(id,label){
  return '<div class="cal-file"><label for="'+id+'-file">'+label+'</label><input id="'+id+'-file" type="file" accept=".csv,text/csv"><details><summary>Paste CSV instead</summary><textarea id="'+id+'-text" aria-label="'+label+' CSV text" rows="4" spellcheck="false"></textarea></details><small id="'+id+'-status"></small></div>';
}
export function renderCalibration(main){
  let shown=state.agencyProfile||null;
  const totals=nycProfile.desks.map(d=>sum(d.arrivals));
  main.innerHTML='<section class="storm-hero calibration-hero"><div class="wrap storm-hero-inner"><div>'+line('OPERATIONS SIMULATOR · EVIDENCE')+'<h1>Agency calibration</h1><p>Replay a city’s recorded request volume, or test how closely the desk model reproduces a measured agency shift.</p></div></div></section>'+boardTabs('calibration')+
    '<div class="wrap cal-page"><section class="cal-event" id="event-source"><div><span class="minor-label">RECORDED EVENT · SEPTEMBER 29, 2023</span><h2>New York’s flood hour</h2><p>Between 08:00 and 09:00 EDT, '+archive.selectedDistinct+' distinct flood-related service requests were registered across the three boroughs below. Each minute opens in the simulator in its original order.</p>'+
    '<div class="cal-boroughs">'+areaNames.map((n,i)=>'<div><b>'+totals[i]+'</b><span>'+n+'</span><small>Mapped to '+mapNames[i]+'</small></div>').join('')+'</div>'+
    '<div class="cal-plot" id="cal-plot"></div><label class="cal-minute" for="cal-minute">Inspect a recorded minute <output id="cal-cursor"></output></label><input type="range" id="cal-minute" min="0" max="59" value="41"><div class="scrub-captions"><span>08:00</span><span>08:30</span><span>08:59</span></div><div id="cal-readout" class="minute-values"></div>'+
    '<div class="actions"><a class="btn primary" href="#/simulator/nyc311">Run the NYC311 hour '+icon('arrow',15)+'</a><button class="btn outline" id="download-event">Download minute counts</button></div></div>'+
    '<aside class="paper-card"><span class="minor-label">EVIDENCE BOUNDARY</span><h3>What the records establish</h3><p><b>Observed.</b> Creation minute, borough and request category. The source records cluster in three-minute batches. A timestamp identifies the registration of a request.</p><p><b>Modeled.</b> Desk staffing, processing times, assisted-contact needs, travel and backlog at handover. The map shows Northbridge. The source hour begins with zero assumed carry-in.</p><p>The city reported more than 50 DEP field crews that Friday. It did not identify them as 311 desk teams. NYC311 closure dates also measure elapsed status time, which cannot establish active handling time.</p>'+
    outside(cityReport,'City response report')+' · '+outside(faq,'NYC311 time definitions')+'</aside></section>'+
    '<details class="cal-provenance"><summary>Source, filters and reconciliation</summary><p>Source dataset '+outside(archive.officialUrl,'NYC311 service requests')+'. The input covers DEP Sewer requests in the five specified problem categories. Request IDs are counted once in the half-open local interval 08:00 through 08:59:59. The replay uses '+archive.selectedDistinct+' of '+archive.citywideDistinct+' distinct citywide requests. Manhattan and the Bronx account for the remainder.</p><p>'+archive.descriptors.map(esc).join(' · ')+'</p><p>'+outside(archive.queryUrl,'Reproduce the official aggregate query')+' · '+outside(comptroller,'Event investigation')+'</p><p>The official snapshot dated '+esc(archive.snapshotDate)+' contains '+archive.selectedDistinct+' requests in the replay. A frozen research copy contained '+archive.archiveComparison.selectedDistinct+'. The difference is two Brooklyn requests at 08:23. '+outside(archive.archiveComparison.sourceUrl,'Compare the earlier archive')+'</p><p>Normalized source fingerprint (SHA-256) <code>'+esc(archive.sha256)+'</code>.</p></details>'+
    ''+staffingBenchmark()+'<section class="cal-import" id="agency-import"><div class="section-head"><div>'+line('MATCHED SHIFT RECORDS')+'<h2>Test your agency’s operating rates</h2></div><button type="button" id="cal-example" class="btn outline">Try a synthetic example</button></div>'+
    '<p>Use one hour of aggregate desk activity and a separate, earlier handling-time study. Match the reporting population and handoff definition in both files. Files are processed in this browser.</p>'+
    '<details class="cal-provenance"><summary>File specifications and example CSVs</summary><p><b>Shift log.</b> One row per desk and minute for three desks across 60 minutes. Minute 0 covers the first minute after the source start. Count new arrivals, the assisted subset, completed first handoffs and teams available during that interval. Put the opening backlog and its assisted subset only in the minute-0 rows. Each desk’s staffing count can change during the hour.</p><code>'+shiftColumns.join(',')+'</code>'+
    '<p><b>Handling study.</b> Three rows from an earlier comparable period. Enter completed cases and active team-minutes spent on those cases for routine and assisted service. The rate is busy team-minutes divided by completions. Rows map in order to Riverside, Market Ward and Civic Quarter. The shift log must use exactly the same desk names. Exclude calendar time to case closure.</p><code>'+studyColumns.join(',')+'</code><div class="actions"><button id="template-shift" class="btn outline">Example shift CSV</button><button id="template-study" class="btn outline">Example rate CSV</button></div></details>'+
    '<form id="cal-form"><div class="cal-inputgrid"><label>Shift source or record ID<input name="label" required maxlength="100" placeholder="Agency and shift log reference"></label><label>Handling-study source or record ID<input name="studyReference" required maxlength="100" placeholder="Reference for earlier service-time sample"></label><label>Observed shift start<input name="startLocal" type="datetime-local" required></label><label>Earlier study end<input name="referenceEnd" type="datetime-local" required></label><label>Time zone<input name="timeZone" required value="America/New_York"></label></div><div class="cal-files">'+inputFile('shift','Incident shift log')+inputFile('study','Earlier handling study')+'</div><button id="cal-validate" class="btn primary">Validate matched records '+icon('arrow',15)+'</button><p id="cal-status" role="status"></p></form></section>'+
    '<section id="cal-validation" class="cal-result" '+(shown?'':'hidden')+'></section></div>';
  const $=s=>main.querySelector(s);
  function minute(){
    const t=Number($('#cal-minute').value);
    $('#cal-plot').innerHTML=nycPlot(t);
    $('#cal-cursor').textContent=formatTime(t)+'–'+formatTime(t+1);
    $('#cal-readout').innerHTML=areaNames.map((n,i)=>'<span>'+n+' <b>'+nycProfile.desks[i].arrivals[t]+'</b></span>').join('');
  }
  function show(profile,scroll){
    shown=profile;
    const host=$('#cal-validation');host.hidden=false;host.innerHTML=validationMarkup(profile);
    $('#export-validation').onclick=()=>downloadFile('agency-queue-validation.csv',validationCsv(shown),'text/csv;charset=utf-8');
    if(scroll)host.scrollIntoView({behavior:'instant',block:'start'});
  }
  $('#cal-minute').oninput=minute;minute();if(shown)show(shown,false);
  $('#download-event').onclick=()=>{
    const body=['date,timezone,minute_start,brooklyn,queens,staten_island,manhattan,bronx'];
    for(let i=0;i<60;i++)body.push([archive.date,archive.timeZone,formatTime(i),...['BROOKLYN','QUEENS','STATEN ISLAND','MANHATTAN','BRONX'].map(n=>archive.boroughs[n][i])].join(','));
    downloadFile('nyc311-flood-hour-2023-09-29.csv',body.join('\n'),'text/csv;charset=utf-8');
  };
  function benchmark(){
    const items=['#bench-share','#bench-time','#bench-use'].map(s=>$(s));
    const count=requiredStaff(...items.map(el=>el.valueAsNumber));
    $('#bench-result').textContent=count===null||items.some(el=>!el.validity.valid)?'Enter values within the indicated ranges.':'Planning estimate: '+count+' concurrent call takers on average under these assumptions.';
  }
  ['#bench-share','#bench-time','#bench-use'].forEach(s=>$(s).oninput=benchmark);benchmark();
  const files=sampleFiles(),pendingFiles=new Set();
  for(const key of ['shift','study']){
    $('#template-'+key).onclick=()=>downloadFile('example-'+key+'.csv',files[key],'text/csv;charset=utf-8');
    const input=$('#'+key+'-file'),area=$('#'+key+'-text');
    input.onchange=async()=>{
      const selected=input.files[0];
      if(!selected)return;
      pendingFiles.add(key);area.value='';$('#cal-validate').disabled=true;
      try{
        if(selected.size>300000)throw Error('Choose an aggregate CSV smaller than 300 KB.');
        const content=await selected.text();
        if(input.files[0]!==selected)return;
        area.value=content;$('#'+key+'-status').textContent=selected.name+' ready.';
      }catch(err){if(input.files[0]===selected){area.value='';$('#'+key+'-status').textContent=err.message}}
      finally{if(input.files[0]===selected){pendingFiles.delete(key);$('#cal-validate').disabled=pendingFiles.size>0}}
    };
    area.oninput=()=>{input.value='';pendingFiles.delete(key);$('#cal-validate').disabled=pendingFiles.size>0;$('#'+key+'-status').textContent='Using pasted CSV.'};
  }
  $('#cal-example').onclick=()=>{
    $('#cal-status').textContent='Synthetic example. These records illustrate the validation workflow.';
    show(exampleProfile(),true);
  };
  $('#cal-form').onsubmit=async event=>{
    event.preventDefault();const btn=$('#cal-validate');btn.disabled=true;
    try{
      const profile=readAgencyProfile($('#shift-text').value,$('#study-text').value,Object.fromEntries(new FormData(event.target)));
      if(profile.id==='example'){
        const example=exampleProfile();
        if(JSON.stringify(profile.desks)!==JSON.stringify(example.desks))throw Error('Use agency desk names for your own records. The Example A/B/C names are reserved for the tutorial files.');
        $('#cal-status').textContent='Example files verified. The output is labeled synthetic.';show(example,true);
      }else{
        const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(profile)));
        profile.key=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
        if(!main.contains(btn))return;
        state.agencyProfile=profile;
        const saved=persist();$('#cal-status').textContent=saved?'Profile checked and saved in this browser.':'Profile checked for this session. Browser storage is unavailable.';
        show(profile,true);
      }
    }catch(err){$('#cal-status').textContent='Could not apply these records. '+err.message}
    finally{btn.disabled=false}
  };
}
