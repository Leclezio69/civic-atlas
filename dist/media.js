import {icon,esc,line} from './ui.js';

const infographics=[
  {file:'media-strategy-p9.jpg',title:'The Proposal Ranking Framework',volume:'Volume 1 — Government Strategy',
   body:'How should a city compare competing AI proposals? This framework scores candidates across six dimensions: resident pain (25%), volume (15%), evidence readiness (20%), risk and reversibility (20%), equity (10%) and deliverability (10%). Frontline staff participate in scoring, and dissent is preserved with the result. A proposal that fails authority, fairness or reversibility is withdrawn before supplier engagement — no matter how strong the benefit case.'},
  {file:'media-citizen-services-p10.jpg',title:'Designing the Digital Front Door',volume:'Volume 2 — Citizen Services',
   body:'When a resident starts a housing enquiry online, switches to the phone, and is asked to explain everything again, the front door has failed. This page maps the source-grounded answer model: what follows a resident across channels, what the system can and cannot claim to know, and how a completed journey is measured. The goal is not automation — it is a door the resident can actually finish using.'},
  {file:'media-benefits-casework-p8.jpg',title:'Tracing Extracted Evidence to Its Source',volume:'Volume 3 — Benefits & Casework',
   body:'An extraction tool reads a handwritten income figure that conflicts with the case record. Before the officer can act, they need to see the original document, the extracted value, and the confidence of the match. This infographic shows how each field is traced back to its source page, how conflicts surface in the officer summary, and how a successful appeal becomes a correction that flows back through the system.'},
  {file:'media-emergency-services-p15.jpg',title:'Surge Handling Under Pressure',volume:'Volume 7 — Emergency Services',
   body:'When seconds count, the question is not whether AI can help — it is whether the human commander retains authority. This page from the Emergency Services playbook maps the surge-handling protocol: how incident locations show uncertainty, where the human decision sits in the dispatch chain, and what happens when records must be reconciled after a fallback drill. The Northbridge flood simulator brings this model to life with real NYC 311 data.'},
  {file:'media-procurement-supplier-p20.jpg',title:'Testing a Supplier Before You Sign',volume:'Volume 6 — Procurement & Supplier AI',
   body:'Three suppliers submit strong bids for a document-reading service. The evaluation panel must avoid anchoring on the first demo. This framework sequences bid evaluation to protect independence: technical assessment before commercial terms, the authority\'s own test cases before the supplier\'s chosen examples, and a documented exit plan before contract award. Can the service continue if the supplier leaves tomorrow?'},
  {file:'media-data-records-p11.jpg',title:'Connecting Records Without Losing the Person',volume:'Volume 8 — Data & Records',
   body:'Two people with similar names and a shared address appear as a likely match. One service has already reused a fact from the other\'s record. This infographic distinguishes a proposed link from an authorised match, maps the purpose and provenance of each reused field, and shows how a correction in one system must propagate to every downstream record. The person behind the data has a right to be accurately represented.'},
  {file:'media-capstone-p15.jpg',title:'Portfolio Assurance — The Six Gates',volume:'Volume 10 — Capstone',
   body:'Individual services may pass their own reviews while the cross-department journey fails. The portfolio capstone walks through six assurance gates: Count the actual inventory, Classify each use by risk tier, assemble the Evidence file, Test the resident journey end to end, Remediate weak uses, and Sign the portfolio statement with named owners and open findings. No gate can be skipped. The signed statement publishes what remains unresolved.'}
];

const deckPdf='/playbooks/ai-government-strategy-playbook.pdf';
const deckTitle='The AI Government Strategy Playbook';
const deckPages=32;
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
        '<div class="info-detail"><span class="minor-label">'+esc(info.volume).toUpperCase()+'</span>'+
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
    // Touch / pointer swipe
    const track=container.querySelector('.info-display');
    if(!track)return;
    track.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;startX=e.clientX;dragging=true;track.setPointerCapture(e.pointerId)});
    track.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;const dx=e.clientX-startX;if(Math.abs(dx)>40){dx<0?go(idx+1,1):go(idx-1,-1)}});
    track.addEventListener('pointercancel',()=>{dragging=false});
  }
  // Keyboard
  container.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(idx-1,-1);else if(e.key==='ArrowRight')go(idx+1,1)});
  container.setAttribute('tabindex','0');
  render(0);
}

// ── PDF deck via pdf.js canvas renderer ──
async function mountDeck(container){
  let page=1,pdfDoc=null,rendering=false,canvas=null,ctx=null;
  container.innerHTML=
    '<div class="deck-canvas-wrap"><canvas class="deck-canvas"></canvas><div class="deck-loading">Loading deck…</div></div>'+
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
    counter.textContent='Page '+page+' of '+deckPages;
  }
  async function renderPage(){
    if(!pdfDoc||rendering)return;
    rendering=true;
    canvas.classList.add('deck-fade');
    try{
      const pg=await pdfDoc.getPage(page);
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const vp=pg.getViewport({scale:1});
      const wrapW=container.querySelector('.deck-canvas-wrap').clientWidth-2;
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
  // Keyboard nav
  container.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&page>1){page--;renderPage()}else if(e.key==='ArrowRight'&&page<deckPages){page++;renderPage()}});
  container.setAttribute('tabindex','0');
  updateControls();
  try{
    const {getDocument,GlobalWorkerOptions}=await import('./vendor/pdfjs/pdf.min.mjs');
    GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',import.meta.url).href;
    pdfDoc=await getDocument(deckPdf).promise;
    loading.hidden=true;
    renderPage();
  }catch(e){
    loading.textContent='Could not load the PDF viewer.';
    // Fallback to iframe
    container.querySelector('.deck-canvas-wrap').innerHTML='<iframe src="'+deckPdf+'#page=1&view=FitH&toolbar=0" style="width:100%;height:100%;border:0" title="'+esc(deckTitle)+'"></iframe>';
    prev.onclick=()=>{if(page>1){page--;container.querySelector('iframe').src=deckPdf+'#page='+page;updateControls()}};
    next.onclick=()=>{if(page<deckPages){page++;container.querySelector('iframe').src=deckPdf+'#page='+page;updateControls()}};
  }
}

// ── Custom podcast player ──
function mountPodcast(container){
  const audio=new Audio('assets/podcast-civic-atlas.m4a');
  audio.preload='metadata';
  let playing=false,duration=0,raf=0;
  const fmt=s=>{const m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+String(sec).padStart(2,'0')};
  container.innerHTML=
    '<div class="pod-card">'+
    '<div class="pod-top"><img class="pod-art" src="assets/milo.webp" alt=""><div class="pod-meta"><h3>Series Deep Dive</h3><small>The Civic Atlas Podcast · George</small></div></div>'+
    '<div class="pod-controls"><button class="pod-skip-back iconbtn" aria-label="Back 15 seconds">'+icon('reset',16)+'<span>15</span></button>'+
    '<button class="pod-play" aria-label="Play">'+icon('play',22)+'</button>'+
    '<button class="pod-skip-fwd iconbtn" aria-label="Forward 15 seconds">'+icon('reset',16)+'<span>15</span></button></div>'+
    '<div class="pod-progress"><span class="pod-time">0:00</span>'+
    '<div class="pod-track"><div class="pod-fill"></div><input type="range" class="pod-seek" min="0" max="100" step="0.1" value="0" aria-label="Seek"></div>'+
    '<span class="pod-duration">—:——</span></div>'+
    '<div class="pod-wave" aria-hidden="true">'+Array.from({length:48},(_,i)=>'<span style="--i:'+i+'"></span>').join('')+'</div>'+
    '<p class="media-caption">From the investment panel to the portfolio capstone — a guided walk through all ten volumes, the flood simulator, and the assurance framework.</p>'+
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
    '<h1>Explore the<br><em>Series</em></h1><p>Video overview, original infographics from the ten playbooks, the strategy slide deck, and the Civic Atlas podcast.</p>'+
    '<div class="media-hero-nav"><a href="#media-video">'+icon('play',15)+' Video</a><a href="#media-infographics">'+icon('layers',15)+' Infographics</a><a href="#media-deck">'+icon('file',15)+' Slide deck</a><a href="#media-podcast">'+icon('headset',15)+' Podcast</a></div>'+
    '</div></div>'+

    '<div class="wrap media-page">'+

    '<section class="media-section reveal-up" id="media-video"><div class="media-section-head">'+line('VIDEO')+'<h2>Series Overview</h2></div>'+
    '<div class="media-video-wrap"><div class="media-video"><iframe src="https://www.youtube.com/embed/PwJBp9-U8dY?rel=0&modestbranding=1" title="Civic Atlas — AI Government &amp; Public Services" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div></div>'+
    '<p class="media-caption">A walkthrough of the complete Civic Atlas series — ten playbooks, the Northbridge flood simulator, and the portfolio capstone.</p></section>'+

    '<section class="media-section reveal-up" id="media-infographics"><div class="media-section-head">'+line('INFOGRAPHICS · 7 PAGES')+'<h2>Inside the Playbooks</h2><p class="media-caption" style="margin-top:4px">Swipe or use the arrows to browse original pages from across the series.</p></div>'+
    '<div class="info-viewer" id="info-viewer" role="region" aria-label="Infographic carousel"></div></section>'+

    '<section class="media-section reveal-up" id="media-deck"><div class="media-section-head">'+line('SLIDE DECK · 32 PAGES')+'<h2>'+esc(deckTitle)+'</h2></div>'+
    '<div class="deck-viewer" id="deck-viewer" role="region" aria-label="Slide deck viewer"></div></section>'+

    '<section class="media-section reveal-up" id="media-podcast"><div class="media-section-head">'+line('PODCAST')+'<h2>The Civic Atlas Podcast</h2></div>'+
    '<div id="podcast-mount"></div></section>'+

    '</div>';

  // Smooth scroll for hero nav
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
