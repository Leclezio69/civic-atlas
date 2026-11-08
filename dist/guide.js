import {icon,esc,pageTitles,pad} from './ui.js';
import {state} from './state.js';
import {findPassages} from './milo-context.js';
import {assess} from './resident-case.js';
import {fieldCaseFor} from './field-cases.js';
import {practiceGuide} from './field-practice.js';
let info={},catalog=[],open=false,mode='walk',step=0,guide,scenes=[],speech=null,marked=null,query='',found='',guideAudio=null;
const guideSection=()=>info.calibration?'calibration':info.kind||'home';
function guideAudioFile(){
  const section=guideSection();
  return 'assets/voice-guide-'+section+'-'+step+'.mp3';
}
const pref=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function steps({kind,tab,m,notebook,classic,calibration}){
  if(calibration)return [
    ['#event-source','Inspect the observed hour','Use the minute control to see when requests were registered. Open the source notes to check the population and borough mapping.'],
    ['#agency-import','Match the workforce and workload','The shift log supplies opening queues, new reports, staffed teams and actual handoffs. Use an earlier handling study to estimate separate rates for routine and assisted work.'],
    [document.querySelector('#cal-validation:not([hidden])')?'#cal-validation':'#cal-example','Check the fit','Try the synthetic example or validate your own aggregate files. Read each desk’s queue error before using the profile for an exercise.']
  ];
  if(kind==='simulator'&&!classic)return [
    ['#sim-controls','Set up your shift','Choose Steady rain or Cloudburst. Run the clock, advance one minute, or jump to the next briefing. The exercise pauses when an officer decision is due.'],
    ['#city-view','Inspect the three district desks','Select a map marker or a district tab. Compare the operational map with the illustrated field camera. Queue counts and available teams come from your run.'],
    ['#district-desk','Move a team with a purpose','Choose the receiving desk, then select an origin. Check the travel time before moving one team. It leaves the origin immediately and starts work at the destination after arrival.'],
    ['#decision-desk','Read the source before signing','Briefings arrive at 08:12, 08:28 and 08:44. Your orders change handling costs, verification work or message preparation. Use Resume or Advance after each decision.'],
    ['#timeline','Replay and compare','Scrub through elapsed time to inspect actual queues, teams and orders. At 09:00 the handover can replay one change against the same incoming reports.']
  ];
  if(kind==='capstone'&&!notebook){
    const c=state.residentConference;
    if(c?.stage===3&&c.submitted){
      const r=assess(c.submitted.answers,c.submitted.note);
      const row=r.rows.slice().sort((a,b)=>a.points/a.max-b.points/b.max)[0];
      return [['#case-result','Read the panel decision','Your structured decision earned '+r.score+' out of 100. Read any blocking findings before you revise.'],
        ['#case-work','Defend your reasoning',r.score===100?'If tomorrow’s queue exceeds the five-day staffing plan, who must take action?':row.prompt],
        ['#case-files','Trace feedback to a standard','Each scoring dimension explains what the panel could verify and links to a playbook page. Revise your submission or export the scored brief.']];
    }
    if(c?.stage===2)return [['#case-files','Bring evidence to the conference','Compare the records you chose with your provisional position. Reopen the evidence file if either claim is still uncertain.'],['#case-work','Give an executable instruction','If the director approves your recommendation, what will the connector actually be allowed to do? What happens to Mara before 12:15?'],['#decision-form','Defend the instruction','Name the officers, choose the review route and state what evidence could justify a future live release. The panel scores the structured record and preserves your signed minute for human review.']];
    if(c?.stage===1)return [['#case-update','Read the late return','Your requested enquiry has returned. Compare it with the other teams’ evidence before deciding whether to maintain your first call.'],['#case-files','Reconcile the records','Follow one event from the resident’s receipt through to the benefits adapter. Which record actually measures downstream success?'],['#case-work','Test the scope of your claim','Before generalising from a replay, ask how the cases were selected and which version was tested.']];
    return [['#case-brief','Meet the resident','Mara filed her correction before the deadline. One system accepted it, yet another has put her renewal on hold. Your release decision is due at noon.'],['#case-files','Read the opening file','Inspect each exhibit and its scope. What could look successful at the gateway while still failing for Mara?'],['#case-work','Record a provisional judgement','Make a first call and choose which team to question first. You can change your decision once the late records arrive.']];
  }
  if(kind==='module'){
    if(tab==='fieldcase')return practiceGuide(fieldCaseFor(m.id));
    if(tab==='workshop')return [
      ['#decision','Take the officer’s seat',m.decision.scenario],
      ['.choices','Make a decision','Choose the action you would authorise. Read the feedback and open its source page to test your reasoning.'],
      ['#assignment',m.assignment.title,m.assignment.deliverable+' Record your response in the field note.'],
      [
        '#checklist',
        'Close the volume',
        'When your decision is supported and your note is recorded, select Complete volume. Your work carries into the fieldbook.'
      ]
    ];
    if(tab==='sources')return [
      ['#source-index','Work from the source','This is the page index for '+m.sourceTitle+'. Select a title to open that precise page in the original PDF.'],
      ['#source-search','Find the passage','Search a topic or page number. For example, enter '+m.lessons[0].page+' to revisit “'+m.lessons[0].title+
        '.”'],
      ['.module-bar','Return to practice','Use Decision workshop above the index to apply the source material and keep your reasoning.']
    ];
    return [
      ['#brief','Your brief for volume '+pad(m.volume),m.brief],
      ['#lessons',m.lessons[0].title,m.lessons[0].action],
      ['#worked-example','Study the Northbridge example',m.example.title+'. Open the linked page to inspect the evidence.'],
      ['.module-bar','Apply the lesson','Select Decision workshop. You will make an officer decision, get feedback and record a field note.']
    ];
  }
  const pages={
    home:[
      [
        '#intro',
        'Welcome to Northbridge',
        'I’m Milo, your field guide. You’ll work through decisions facing one fictional city, from its first AI proposal to portfolio sign-off.'
      ],
      [
        '#start',
        'Choose your starting point',
        'Start learning opens the first playbook, or the volume you last visited. City simulator takes you straight to the river district.'
      ],
      [
        '#collection',
        'Meet the first three services',
        'Begin with strategy, move to the resident front door, then see what changes when a case affects benefits. View all 10 playbooks to choose another route.'
      ],
      ['#practice','Bring the learning together','Run the flood exercise and take your decision record into the six-gate assurance capstone.']
    ],
    library:[
      ['.page-lead','Choose a public service','Follow volumes 01 through 10 for the complete series. You can also go directly to a service you know.'],
      ['#library-tools','Narrow the collection','Choose a category or search the source-page titles for a topic such as appeals, outage or retention.'],
      ['#results','Open a volume','Each playbook has a briefing, an applied decision and a searchable index to all 32 original pages.']
    ],
    simulator:[
      [
        '#city-view',
        'Survey the district',
        'Drag the 3D model to orbit the district. Switch to Field camera to see changing conditions from the same riverside viewpoint.'
      ],
      [
        '#sim-controls',
        'Set the operating conditions',
        'Select a weather profile, then Run exercise. Watch the open queue, verified coverage and completeness of the record.'
      ],
      [
        '#decision-desk',
        'Exercise officer judgement',
        'At 08:12, 08:28 and 08:44 the clock pauses. Choose an operating response. Each choice changes the measures and is recorded in your log.'
      ],
      ['#timeline','Reconstruct the hour','Pause and scrub through elapsed time. At 09:00 your debrief goes to the fieldbook. Reset starts a fresh run.']
    ],
    capstone:[
      ['#cap-brief','Read the portfolio mandate','Bring forward the use cases, tests and open issues from your playbooks and simulator run.'],
      ['#gates','Build the evidence file','Work from CP0 Count to CP5 Sign and publish. Name an accountable person and a record at each gate.'],
      [
        '#recommendation',
        'Write the review position',
        'State what should proceed, pause or retire. Identify an owner and closure date for each open finding, then export the brief.'
      ]
    ],
    fieldbook:[
      ['#progress','Check your progress','Your completed volumes and documented assurance gates are counted here. Work stays in this browser.'],
      [
        '#fieldnotes',
        'Review or export your notes',
        'Open a volume record to read your decision and evidence. Export fieldbook downloads your work as a Markdown file.'
      ],
      [
        '#field-debrief',
        'Review your latest exercise',
        'The simulator saves the outcome of the most recent completed run and the reasoning behind each response.'
      ]
    ],
    missing:[['main','Choose an atlas page','Use the navigation to return to the overview, playbooks or simulator.']]
  };
  return pages[kind]||pages.home
}
function stopSpeech(){
  if(guideAudio){guideAudio.pause();guideAudio.currentTime=0;guideAudio=null}
  if(speech&&'speechSynthesis' in window)window.speechSynthesis.cancel();
  speech=null
}
function clearMark(){
  marked?.classList.remove('tour-focus');
  marked=null
}
function focusStep(){
  clearMark();
  const el=document.querySelector(scenes[step]?.[0]);
  if(el){
    marked=el;
    el.classList.add('tour-focus');
    el.scrollIntoView({behavior:pref()?'instant':'smooth',block:'center'})
  }
}
function render(){
  if(!open){
    guide.innerHTML='<button class="guide-launch" aria-label="Open Milo, your field guide" aria-expanded="false"><span class="avatar"><img src="assets/milo.webp" alt=""></span><span><b>Page guide</b><small>With Milo</small></span>'+icon('msg',15)+
      '</button>';
    guide.querySelector('button').onclick=()=>{
      open=true;
      render();
      guide.querySelector('.guide-close').focus({preventScroll:true})
    };
    return
  }
  const s=scenes[step]||scenes[0];
  guide.innerHTML='<div class="guide-panel" role="region" aria-label="Milo field guide"><div class="guide-head"><div class="guide-avatar"><img src="assets/milo.webp" alt="Milo, a small ceramic survey robot"></div><div><h2>Milo</h2><small>Your field guide</small></div><button class="guide-close iconbtn" aria-label="Close guide">'+icon('close',16)+
    '</button></div><div class="guide-tabs"><button data-mode="walk" aria-pressed="'+(mode==='walk')+
    '">Walkthrough</button><button data-mode="find" aria-pressed="'+(mode==='find')+
    '">Find a passage</button></div>'+(mode==='walk'?'<div class="guide-body" aria-live="polite"><small class="minor-label">STEP '+(step+1)+
    ' OF '+scenes.length+
    '</small><h3>'+esc(s[1])+
    '</h3><p>'+esc(s[2])+
    '</p></div><div class="guide-controls"><button class="iconbtn speak" aria-label="Read this step aloud" title="Read this step aloud">'+icon('volume',17)+
    '</button><button class="walk-prev iconbtn" aria-label="Previous step" '+(step===0?'disabled':'')+
    '>'+icon('left',16)+
    '</button><button class="walk-next">'+(step===scenes.length-1?'Finish walkthrough':'Next step')+icon('arrow',14)+
    '</button></div>':'<div class="guide-body find-body"><form class="passage-form"><label for="passage-query">Search the ten original playbooks</label><div><input id="passage-query" type="search" value="'+esc(query)+
    '" placeholder="e.g. supplier exit"><button class="iconbtn" aria-label="Search source passages">'+icon('search',16)+
    '</button></div></form><div class="passage-results" role="status">'+(found||'<p>Enter a topic or question to find a matching source passage.</p>')+
    '</div></div>')+
    '</div>';
  guide.querySelector('.guide-close').onclick=close;
  guide.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{
    stopSpeech();
    clearMark();
    mode=b.dataset.mode;
    render();
    if(mode==='find')guide.querySelector('input').focus()
  });
  if(mode==='walk'){
    guide.querySelector('.walk-prev').onclick=()=>move(-1);
    guide.querySelector('.walk-next').onclick=()=>{
      if(step===scenes.length-1){
        step=0;
        close()
      }else move(1)
    };
    const speak=guide.querySelector('.speak');
    speak.hidden=false;
    speak.onclick=()=>{
      if(guideAudio||speech){
        stopSpeech();
        speak.setAttribute('aria-label','Read this step aloud');
        return
      }
      speak.setAttribute('aria-label','Stop reading');
      const file=guideAudioFile();
      const audio=new Audio(file);
      guideAudio=audio;
      audio.addEventListener('ended',()=>{guideAudio=null;speak.setAttribute('aria-label','Read this step aloud')});
      audio.addEventListener('error',()=>{
        guideAudio=null;
        if(!('speechSynthesis' in window))return;
        speech=new SpeechSynthesisUtterance(s[1]+'. '+s[2]);
        speech.lang='en-US';speech.rate=.95;
        speech.onend=()=>{speech=null;speak.setAttribute('aria-label','Read this step aloud')};
        window.speechSynthesis.speak(speech);
      });
      audio.play().catch(()=>{});
    }
  }else{
    guide.querySelector('form').onsubmit=async e=>{
      e.preventDefault();
      query=guide.querySelector('input').value.trim();
      await search(query)
    }
  }
}
function move(n){
  stopSpeech();
  step=Math.max(0,Math.min(scenes.length-1,step+n));
  render();
  focusStep();
  guide.querySelector('.walk-next')?.focus({preventScroll:true})
}
function close(){
  open=false;
  stopSpeech();
  clearMark();
  render();
  guide.querySelector('.guide-launch')?.focus({preventScroll:true})
}
async function search(q){
  const r=guide.querySelector('.passage-results');
  if(!r)return;
  if(!q.trim()){r.textContent='Enter a specific term, such as triage, drift or appeals.';return}
  r.textContent='Searching the playbooks…';
  try{
    const top=await findPassages(q,catalog,{activeId:info.m?.id});
    if(!r.isConnected||q!==query)return;
    found=top.length?top.map(x=>'<article><a target="_blank" rel="noopener" href="'+esc(x.url)+'">Vol. '+pad(x.volume)+' · p. '+x.page+' '+icon('upRight',11)+
      '</a><b>'+esc(x.heading)+'</b><p>'+esc(x.body.length>270?x.body.slice(0,265).replace(/\s+\S*$/,'')+'…':x.body)+'</p></article>').join(''):'<p>No matching passage. Try a specific term used in the playbooks.</p>';
    r.innerHTML=found
  }catch{
    r.innerHTML='<p>The passage index could not be loaded. Open a volume’s Sourcebook to browse its original pages.</p>'
  }
}
export function mountGuide(){
  guide=document.querySelector('#guide');
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&open)close()
  })
}
export function refreshGuide(i,books){
  info=i;
  catalog=books;
  stopSpeech();
  clearMark();
  guide.hidden=i.kind==='agent';
  if(guide.hidden){open=false;guide.replaceChildren();return}
  scenes=steps(i);
  step=0;
  mode='walk';
  query='';
  found='';
  render()
}
