import {icon,esc,line} from './ui.js';

const infographics=[
  {file:'Civic_Atlas_AI_Government_Framework.jpg',
   title:'AI Government & Public Services Framework',
   body:'The complete Civic Atlas framework mapped across all ten volumes. Each playbook volume is positioned around the core governance principle: AI systems only prepare, check, extract, and summarise data — human officers retain absolute statutory authority. The outer ring connects strategy mandates and portfolio risk tiers to the six-gate assurance standard, while the centre shows how operational tools like the flood simulator, Milo AI agent, and applied field cases bring the framework to life.'},
  {file:'AI_Public_Service_Governance_Framework.jpg',
   title:'Governance & Operational Framework',
   body:'This infographic divides the framework into two hemispheres. On the left, core governance and mandatory boundaries: AI prepares while humans decide, officers retain override rights, and mandatory stop lists prevent automation of eligibility grants, benefit cuts, and legal enforcement. On the right, operational focus and portfolio assurance: target back-office preparation tasks like document extraction and mapping, test resident journeys end to end, and rehearse vendor exit strategies to maintain data portability.'},
  {file:'AI_Public_Services_Assurance_Framework.jpg',
   title:'Operational Assurance Framework',
   body:'The master reference for the entire series. Strategic operating principles run down the left column — human decisions only, design for failure, end-to-end journey testing, and transparent residual risk. The ten playbook volumes are mapped with their core mandates. Below, the prohibited automations stop list names what must never be automated, and the six-gate portfolio assurance standard traces the full path from CP0 Inventory Count through CP5 Sign and Publish.'},
  {file:'Architecture_of_Responsible_AI_Diagram.jpg',
   title:'Architecture of Responsible AI in Public Services',
   body:'A unified architecture showing how governance principles, operational boundaries, and assurance gates connect across government service lines. The left wing establishes four core principles: AI prepares while humans decide, lock fail-safe stop controls, trace claims to sources, and protect staff override rights. The centre maps domain service execution from front-door answers through document verification and identity matching. The right wing details the capstone assurance framework from inventory count through journey testing to signed publication.'},
  {file:'Civic_AI_Governance_Framework_Overview.jpg',
   title:'AI Strategy & Public Service Governance',
   body:'A panoramic view of the ten-volume series arranged around a central governance hub. Each volume is represented as an illuminated panel showing its key metric — 38% service enquiry reduction, 19-to-4-day planning acceleration, 94-to-61-second dispatch improvement. The lower section lists all ten volumes with their core operational domains, from strategy mandates through to capstone assurance. The foundation principle: AI systems only prepare, check, extract, and summarise — human officers retain absolute statutory authority.'},
  {file:'Civic_Atlas_Government_AI_Infographic.jpg',
   title:'The Journey to Responsible Government AI',
   body:'Six operational domains mapped across the public service landscape. Digital front-door intake shows grounded source answers with mandatory visible citations and seamless human handoff. Benefits and casework assessment traces layered document extraction through mandated human signature. Emergency command and triage displays uncertainty radius alongside human dispatch authority. Interoperable data governance queues proposed linkages for human-stewarded review. The municipal AI portfolio scorecard at the base tracks governance metrics: registered AI uses, inventory accuracy, source-cited and signed decisions, zero lost context, and full downstream propagation.'},
  {file:'Civic_Atlas_Public_AI_Framework.jpg',
   title:'The Master Framework for AI in Public Services',
   body:'The most comprehensive single view of the Civic Atlas methodology. The ten sector playbook pillars rise from the centre — from planning time-to-valid through standardised voter engine validation, bid independence scoring, dispatch-ready time measurement, to appeals overture cause analysis. Below, core operating doctrine establishes non-negotiable boundaries: qualified human officers retain sole authority, enforce mandatory stop lists, protect one-action overrides, and trace every claim to evidence. Every sponsor sentence is a dated, verifiable administrative record.'}
];

const deckPdf='assets/The_Civic_AI_Blueprint.pdf';
const deckTitle='The Civic AI Blueprint';
const deckPages=21;
const podcastSrc='assets/Does_AI_Curation_Dictate_Government_Decisions.m4a';
const podcastTitle='Does AI Curation Dictate Government Decisions?';
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Scroll reveal observer ──
function observeSections(root){
  if(typeof IntersectionObserver==='undefined')return;
  const entries=root.querySelectorAll('.media-section, .media-hero-inner');
  const obs=new IntersectionObserver(list=>{
    for(const e of list)if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target)}
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  entries.forEach(el=>obs.observe(el));
}

// ── Infographic carousel with transitions & swipe ──
function mountInfoCarousel(container){
  let idx=0,startX=0,dragging=false;
  function render(dir){
    const info=infographics[idx];
    const slide=container.querySelector('.info-slide');
    if(slide&&!reduced()){
      slide.classList.add(dir>0?'slide-out-left':'slide-out-right');
      slide.addEventListener('animationend',()=>build(),{once:true});
    } else build();
    function build(){
      container.innerHTML=
        '<div class="info-slide '+(reduced()?'':'slide-in-'+(dir>0?'right':'left'))+'">'+
        '<div class="info-display"><div class="info-img-wrap"><img src="assets/'+esc(info.file)+'" alt="'+esc(info.title)+'" draggable="false"></div>'+
        '<div class="info-detail"><span class="minor-label">INFOGRAPHIC '+(idx+1)+' OF '+infographics.length+'</span>'+
        '<h3>'+esc(info.title)+'</h3><p>'+esc(info.body)+'</p>'+
        '<div class="info-nav"><button class="iconbtn info-prev" aria-label="Previous" '+(idx===0?'disabled':'')+'>'+icon('left',18)+'</button>'+
        '<span class="info-counter">'+(idx+1)+' / '+infographics.length+'</span>'+
        '<button class="iconbtn info-next" aria-label="Next" '+(idx===infographics.length-1?'disabled':'')+'>'+icon('chevron',18)+'</button></div>'+
        '<div class="info-dots">'+infographics.map((_,i)=>'<button class="info-dot'+(i===idx?' active':'')+'" data-dot="'+i+'" aria-label="Infographic '+(i+1)+'"></button>').join('')+'</div>'+
        '</div></div></div>';
      wire();
    }
  }
  function go(i,dir){if(i<0||i>=infographics.length||i===idx)return;const d=dir||(i>idx?1:-1);idx=i;render(d)}
  function wire(){
    container.querySelector('.info-prev')?.addEventListener('click',()=>go(idx-1,-1));
    container.querySelector('.info-next')?.addEventListener('click',()=>go(idx+1,1));
    container.querySelectorAll('.info-dot').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.dot))));
    const track=container.querySelector('.info-display');
    if(!track)return;
    track.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;startX=e.clientX;dragging=true;track.setPointerCapture(e.pointerId)});
    track.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;const dx=e.clientX-startX;if(Math.abs(dx)>40){dx<0?go(idx+1,1):go(idx-1,-1)}});
    track.addEventListener('pointercancel',()=>{dragging=false});
  }
  container.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(idx-1,-1);else if(e.key==='ArrowRight')go(idx+1,1)});
  container.setAttribute('tabindex','0');
  render(0);
}

// ── PDF deck via pdf.js canvas renderer ──
async function mountDeck(container){
  let page=1,pdfDoc=null,rendering=false,canvas=null,ctx=null;
  container.innerHTML=
    '<div class="deck-canvas-wrap"><canvas class="deck-canvas"></canvas><div class="deck-loading">Loading slide deck…</div></div>'+
    '<div class="deck-controls"><button class="btn outline deck-prev">'+icon('left',15)+' Previous</button>'+
    '<span class="deck-counter"></span>'+
    '<button class="btn outline deck-next">Next '+icon('chevron',15)+'</button></div>'+
    '<a class="text-link deck-download" href="'+deckPdf+'" target="_blank" rel="noopener">'+icon('download',15)+' Open full PDF '+icon('upRight',13)+'</a>';
  canvas=container.querySelector('.deck-canvas');
  ctx=canvas.getContext('2d');
  const prev=container.querySelector('.deck-prev');
  const next=container.querySelector('.deck-next');
  const counter=container.querySelector('.deck-counter');
  const loading=container.querySelector('.deck-loading');
  function updateControls(){
    prev.disabled=page<=1;next.disabled=page>=deckPages;
    counter.textContent='Slide '+page+' of '+deckPages;
  }
  async function renderPage(){
    if(!pdfDoc||rendering)return;
    rendering=true;
    canvas.classList.add('deck-fade');
    try{
      const pg=await pdfDoc.getPage(page);
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const wrapW=container.querySelector('.deck-canvas-wrap').clientWidth-2;
      const vp=pg.getViewport({scale:1});
      const scale=(wrapW/vp.width)*dpr;
      const sv=pg.getViewport({scale});
      canvas.width=sv.width;canvas.height=sv.height;
      canvas.style.width=Math.round(sv.width/dpr)+'px';
      canvas.style.height=Math.round(sv.height/dpr)+'px';
      await pg.render({canvasContext:ctx,viewport:sv}).promise;
      canvas.classList.remove('deck-fade');
    }catch{}
    rendering=false;
    updateControls();
  }
  prev.onclick=()=>{if(page>1){page--;renderPage()}};
  next.onclick=()=>{if(page<deckPages){page++;renderPage()}};
  container.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&page>1){page--;renderPage()}else if(e.key==='ArrowRight'&&page<deckPages){page++;renderPage()}});
  container.setAttribute('tabindex','0');
  updateControls();
  try{
    await import('./vendor/pdfjs/pdf.min.mjs');
    const pdfjsLib=globalThis.pdfjsLib;
    if(!pdfjsLib?.getDocument)throw new Error('pdf.js not available');
    pdfjsLib.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',import.meta.url).href;
    pdfDoc=await pdfjsLib.getDocument(deckPdf).promise;
    loading.hidden=true;
    renderPage();
  }catch(e){
    console.warn('pdf.js failed, using iframe fallback:',e?.message);
    loading.hidden=true;
    const wrap=container.querySelector('.deck-canvas-wrap');
    wrap.innerHTML='<iframe src="'+deckPdf+'#page=1&view=FitH&toolbar=0" class="deck-iframe" title="'+esc(deckTitle)+'"></iframe>';
    prev.onclick=()=>{if(page>1){page--;wrap.querySelector('iframe').src=deckPdf+'#page='+page+'&view=FitH&toolbar=0';updateControls()}};
    next.onclick=()=>{if(page<deckPages){page++;wrap.querySelector('iframe').src=deckPdf+'#page='+page+'&view=FitH&toolbar=0';updateControls()}};
  }
}

// ── Custom podcast player ──
function mountPodcast(container){
  const audio=new Audio(podcastSrc);
  audio.preload='metadata';
  let playing=false,duration=0,raf=0;
  const fmt=s=>{const m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+String(sec).padStart(2,'0')};
  container.innerHTML=
    '<div class="pod-card">'+
    '<div class="pod-top"><img class="pod-art" src="assets/milo.webp" alt=""><div class="pod-meta"><h3>'+esc(podcastTitle)+'</h3><small>The Civic Atlas Podcast</small></div></div>'+
    '<div class="pod-controls"><button class="pod-skip-back iconbtn" aria-label="Back 15 seconds">'+icon('reset',16)+'<span>15</span></button>'+
    '<button class="pod-play" aria-label="Play">'+icon('play',22)+'</button>'+
    '<button class="pod-skip-fwd iconbtn" aria-label="Forward 15 seconds">'+icon('reset',16)+'<span>15</span></button></div>'+
    '<div class="pod-progress"><span class="pod-time">0:00</span>'+
    '<div class="pod-track"><div class="pod-fill"></div><input type="range" class="pod-seek" min="0" max="100" step="0.1" value="0" aria-label="Seek"></div>'+
    '<span class="pod-duration">—:——</span></div>'+
    '<div class="pod-wave" aria-hidden="true">'+Array.from({length:48},(_,i)=>'<span style="--i:'+i+'"></span>').join('')+'</div>'+
    '<p class="media-caption">Does AI curation dictate government decisions? A deep dive into the governance principles, operational boundaries, and assurance standards that keep human officers in control.</p>'+
    '</div>';
  const playBtn=container.querySelector('.pod-play');
  const fill=container.querySelector('.pod-fill');
  const seek=container.querySelector('.pod-seek');
  const timeEl=container.querySelector('.pod-time');
  const durEl=container.querySelector('.pod-duration');
  const wave=container.querySelector('.pod-wave');
  function tick(){
    if(!playing)return;
    const pct=duration?audio.currentTime/duration*100:0;
    fill.style.width=pct+'%';seek.value=pct;
    timeEl.textContent=fmt(audio.currentTime);
    raf=requestAnimationFrame(tick);
  }
  function toggle(){
    if(playing){audio.pause();playing=false;cancelAnimationFrame(raf)}
    else{audio.play().catch(()=>{});playing=true;tick()}
    playBtn.innerHTML=icon(playing?'pause':'play',22);
    playBtn.setAttribute('aria-label',playing?'Pause':'Play');
    wave.classList.toggle('active',playing);
  }
  audio.addEventListener('loadedmetadata',()=>{duration=audio.duration;durEl.textContent=fmt(duration)});
  audio.addEventListener('ended',()=>{playing=false;playBtn.innerHTML=icon('play',22);wave.classList.remove('active');cancelAnimationFrame(raf);fill.style.width='100%'});
  playBtn.onclick=toggle;
  container.querySelector('.pod-skip-back').onclick=()=>{audio.currentTime=Math.max(0,audio.currentTime-15)};
  container.querySelector('.pod-skip-fwd').onclick=()=>{audio.currentTime=Math.min(duration,audio.currentTime+15)};
  seek.oninput=()=>{audio.currentTime=seek.value/100*duration;fill.style.width=seek.value+'%';timeEl.textContent=fmt(audio.currentTime)};
  return ()=>{audio.pause();cancelAnimationFrame(raf)};
}

// ── Main render ──
export function renderMedia(main){
  main.innerHTML=
    '<div class="media-hero"><div class="wrap media-hero-inner reveal-up">'+line('MEDIA & RESOURCES')+
    '<h1>Explore the<br><em>Series</em></h1><p>Video overview, seven original infographics, the Civic AI Blueprint slide deck, and a podcast on whether AI curation dictates government decisions.</p>'+
    '<div class="media-hero-nav"><a href="#media-video">'+icon('play',15)+' Video</a><a href="#media-infographics">'+icon('layers',15)+' Infographics</a><a href="#media-deck">'+icon('file',15)+' Slide deck</a><a href="#media-podcast">'+icon('headset',15)+' Podcast</a></div>'+
    '</div></div>'+

    '<div class="wrap media-page">'+

    '<section class="media-section reveal-up" id="media-video"><div class="media-section-head">'+line('VIDEO')+'<h2>Series Overview</h2></div>'+
    '<div class="media-video-wrap"><div class="media-video"><iframe src="https://www.youtube.com/embed/PwJBp9-U8dY?rel=0&modestbranding=1" title="Civic Atlas — AI Government &amp; Public Services" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div></div>'+
    '<p class="media-caption">A walkthrough of the complete Civic Atlas series — ten playbooks, the Northbridge flood simulator, and the portfolio capstone.</p></section>'+

    '<section class="media-section reveal-up" id="media-infographics"><div class="media-section-head">'+line('INFOGRAPHICS · 7 ORIGINALS')+'<h2>Inside the Playbooks</h2><p class="media-caption" style="margin-top:4px">Swipe or use the arrows to browse the original Civic Atlas infographics.</p></div>'+
    '<div class="info-viewer" id="info-viewer" role="region" aria-label="Infographic carousel"></div></section>'+

    '<section class="media-section reveal-up" id="media-deck"><div class="media-section-head">'+line('SLIDE DECK · '+deckPages+' SLIDES')+'<h2>'+esc(deckTitle)+'</h2><p class="media-caption" style="margin-top:4px">Use the left and right controls or arrow keys to navigate one slide at a time.</p></div>'+
    '<div class="deck-viewer" id="deck-viewer" role="region" aria-label="Slide deck viewer"></div></section>'+

    '<section class="media-section reveal-up" id="media-podcast"><div class="media-section-head">'+line('PODCAST')+'<h2>'+esc(podcastTitle)+'</h2></div>'+
    '<div id="podcast-mount"></div></section>'+

    '</div>';

  main.querySelectorAll('.media-hero-nav a').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();const el=document.querySelector(a.getAttribute('href'));
    el?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});
  }));

  mountInfoCarousel(main.querySelector('#info-viewer'));
  mountDeck(main.querySelector('#deck-viewer'));
  const cleanPodcast=mountPodcast(main.querySelector('#podcast-mount'));
  observeSections(main);

  return cleanPodcast;
}
