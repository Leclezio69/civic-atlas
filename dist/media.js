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

function observeSections(root){
  if(typeof IntersectionObserver==='undefined')return;
  const obs=new IntersectionObserver(list=>{
    for(const e of list)if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target)}
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  root.querySelectorAll('.media-section, .media-hero-inner').forEach(el=>obs.observe(el));
}

// ── Podcast player ──
function mountPodcast(el){
  const audio=new Audio(podcastSrc);
  audio.preload='metadata';
  let playing=false,duration=0,raf=0;
  const fmt=s=>{const m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+String(sec).padStart(2,'0')};
  el.innerHTML=
    '<div class="pod-card">'+
    '<div class="pod-top"><img class="pod-art" src="assets/milo.webp" alt=""><div class="pod-meta"><h3>'+esc(podcastTitle)+'</h3><small>The Civic Atlas Podcast</small></div></div>'+
    '<div class="pod-controls"><button class="pod-skip-back iconbtn" aria-label="Back 15 seconds">'+icon('reset',16)+'<span>15</span></button>'+
    '<button class="pod-play" aria-label="Play">'+icon('play',22)+'</button>'+
    '<button class="pod-skip-fwd iconbtn" aria-label="Forward 15 seconds">'+icon('reset',16)+'<span>15</span></button></div>'+
    '<div class="pod-progress"><span class="pod-time">0:00</span>'+
    '<div class="pod-track"><div class="pod-fill"></div><input type="range" class="pod-seek" min="0" max="100" step="0.1" value="0" aria-label="Seek"></div>'+
    '<span class="pod-duration">\u2014:\u2014\u2014</span></div>'+
    '<div class="pod-wave" aria-hidden="true">'+Array.from({length:48},(_,i)=>'<span style="--i:'+i+'"></span>').join('')+'</div>'+
    '<p class="media-caption">Does AI curation dictate government decisions? A deep dive into the governance principles, operational boundaries, and assurance standards that keep human officers in control.</p>'+
    '</div>';
  const playBtn=el.querySelector('.pod-play'),fill=el.querySelector('.pod-fill'),seek=el.querySelector('.pod-seek'),timeEl=el.querySelector('.pod-time'),durEl=el.querySelector('.pod-duration'),wave=el.querySelector('.pod-wave');
  function tick(){if(!playing)return;const pct=duration?audio.currentTime/duration*100:0;fill.style.width=pct+'%';seek.value=pct;timeEl.textContent=fmt(audio.currentTime);raf=requestAnimationFrame(tick)}
  function toggle(){
    if(playing){audio.pause();playing=false;cancelAnimationFrame(raf)}
    else{audio.play().catch(()=>{});playing=true;tick()}
    playBtn.innerHTML=icon(playing?'pause':'play',22);playBtn.setAttribute('aria-label',playing?'Pause':'Play');wave.classList.toggle('active',playing);
  }
  audio.addEventListener('loadedmetadata',()=>{duration=audio.duration;durEl.textContent=fmt(duration)});
  audio.addEventListener('ended',()=>{playing=false;playBtn.innerHTML=icon('play',22);wave.classList.remove('active');cancelAnimationFrame(raf);fill.style.width='100%'});
  playBtn.onclick=toggle;
  el.querySelector('.pod-skip-back').onclick=()=>{audio.currentTime=Math.max(0,audio.currentTime-15)};
  el.querySelector('.pod-skip-fwd').onclick=()=>{audio.currentTime=Math.min(duration,audio.currentTime+15)};
  seek.oninput=()=>{audio.currentTime=seek.value/100*duration;fill.style.width=seek.value+'%';timeEl.textContent=fmt(audio.currentTime)};
  return ()=>{audio.pause();cancelAnimationFrame(raf)};
}

// ── Main render ──
export function renderMedia(main){
  let infoIdx=0,deckPage=1,pdfDoc=null,deckCanvas=null,deckCtx=null,rendering=false;

  main.innerHTML=
    '<div class="media-hero"><div class="wrap media-hero-inner reveal-up">'+line('MEDIA & RESOURCES')+
    '<h1>Explore the<br><em>Series</em></h1><p>Video overview, seven original infographics, the Civic AI Blueprint slide deck, and a podcast on whether AI curation dictates government decisions.</p>'+
    '</div></div>'+
    '<div class="wrap media-page">'+

    '<section class="media-section reveal-up" id="media-video"><div class="media-section-head">'+line('VIDEO')+'<h2>Series Overview</h2></div>'+
    '<div class="media-video-wrap"><div class="media-video"><iframe src="https://www.youtube.com/embed/PwJBp9-U8dY?rel=0&modestbranding=1" title="Civic Atlas" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div></div></section>'+

    '<section class="media-section reveal-up" id="media-infographics"><div class="media-section-head">'+line('INFOGRAPHICS')+'<h2>Inside the Playbooks</h2></div>'+
    '<div class="info-viewer" id="info-viewer"></div></section>'+

    '<section class="media-section reveal-up" id="media-deck"><div class="media-section-head">'+line('SLIDE DECK · '+deckPages+' SLIDES')+'<h2>'+esc(deckTitle)+'</h2></div>'+
    '<div class="deck-viewer" id="deck-viewer"></div></section>'+

    '<section class="media-section reveal-up" id="media-podcast"><div class="media-section-head">'+line('PODCAST')+'<h2>'+esc(podcastTitle)+'</h2></div>'+
    '<div id="podcast-mount"></div></section>'+

    '</div>';

  // ── Infographics ──
  function showInfo(){
    const info=infographics[infoIdx];
    const viewer=main.querySelector('#info-viewer');
    viewer.innerHTML=
      '<div class="info-display">'+
      '<div class="info-img-wrap"><img src="assets/'+esc(info.file)+'" alt="'+esc(info.title)+'"><button class="info-zoom-btn" aria-label="Zoom in">'+icon('plus',18)+'</button></div>'+
      '<div class="info-detail">'+
      '<span class="minor-label">INFOGRAPHIC '+(infoIdx+1)+' OF '+infographics.length+'</span>'+
      '<h3>'+esc(info.title)+'</h3>'+
      '<p>'+esc(info.body)+'</p>'+
      '<div class="info-nav">'+
      '<button class="iconbtn" id="info-prev" '+(infoIdx===0?'disabled':'')+'>'+icon('left',18)+'</button>'+
      '<span class="info-counter">'+(infoIdx+1)+' / '+infographics.length+'</span>'+
      '<button class="iconbtn" id="info-next" '+(infoIdx===infographics.length-1?'disabled':'')+'>'+icon('chevron',18)+'</button>'+
      '</div>'+
      '<div class="info-dots">'+infographics.map((_,i)=>'<button class="info-dot'+(i===infoIdx?' active':'')+'" data-idx="'+i+'"></button>').join('')+'</div>'+
      '</div></div>';
    main.querySelector('#info-prev').onclick=function(){if(infoIdx>0){infoIdx--;showInfo()}};
    main.querySelector('#info-next').onclick=function(){if(infoIdx<infographics.length-1){infoIdx++;showInfo()}};
    viewer.querySelectorAll('[data-idx]').forEach(function(b){
      b.onclick=function(){infoIdx=Number(this.dataset.idx);showInfo()};
    });
    // Zoom: click image or zoom button opens lightbox
    var img=viewer.querySelector('.info-img-wrap img');
    var zoomBtn=viewer.querySelector('.info-zoom-btn');
    function openZoom(){
      var overlay=document.createElement('div');
      overlay.className='info-lightbox';
      overlay.innerHTML='<div class="info-lightbox-inner"><img src="assets/'+esc(info.file)+'" alt="'+esc(info.title)+'"><div class="info-lightbox-bar"><button class="btn outline" id="lb-close">'+icon('close',16)+' Close</button><span>Scroll or pinch to zoom \u00b7 Drag to pan</span></div></div>';
      document.body.appendChild(overlay);
      var lbImg=overlay.querySelector('img');
      var scale=1,tx=0,ty=0,dragging=false,sx=0,sy=0,pinchDist=0;
      function apply(){lbImg.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')'}
      overlay.querySelector('#lb-close').onclick=function(){overlay.remove()};
      overlay.addEventListener('click',function(e){if(e.target===overlay||e.target===overlay.querySelector('.info-lightbox-inner'))overlay.remove()});
      document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){overlay.remove();document.removeEventListener('keydown',esc)}});
      lbImg.addEventListener('wheel',function(e){e.preventDefault();var d=e.deltaY>0?0.9:1.1;scale=Math.max(0.5,Math.min(8,scale*d));apply()},{passive:false});
      lbImg.addEventListener('pointerdown',function(e){if(e.button&&e.button!==0)return;dragging=true;sx=e.clientX-tx;sy=e.clientY-ty;lbImg.setPointerCapture(e.pointerId)});
      lbImg.addEventListener('pointermove',function(e){if(!dragging)return;tx=e.clientX-sx;ty=e.clientY-sy;apply()});
      lbImg.addEventListener('pointerup',function(){dragging=false});
      lbImg.addEventListener('pointercancel',function(){dragging=false});
      // Pinch zoom for touch
      var pointers=new Map();
      overlay.addEventListener('pointerdown',function(e){pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){var pts=[...pointers.values()];pinchDist=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1])}});
      overlay.addEventListener('pointermove',function(e){if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){var pts=[...pointers.values()];var dist=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);if(pinchDist>10){scale=Math.max(0.5,Math.min(8,scale*(dist/pinchDist)));apply()}pinchDist=dist}});
      overlay.addEventListener('pointerup',function(e){pointers.delete(e.pointerId);if(pointers.size<2)pinchDist=0});
      setTimeout(function(){overlay.classList.add('lb-open')},10);
    }
    img.style.cursor='zoom-in';
    img.onclick=openZoom;
    zoomBtn.onclick=openZoom;
  }
  showInfo();

  // ── Slide deck ──
  const deckEl=main.querySelector('#deck-viewer');
  deckEl.innerHTML=
    '<div class="deck-canvas-wrap"><canvas id="deck-canvas"></canvas><div class="deck-loading" id="deck-loading">Loading slide deck\u2026</div></div>'+
    '<div class="deck-controls">'+
    '<button class="btn outline" id="deck-prev">'+icon('left',15)+' Previous</button>'+
    '<span class="deck-counter" id="deck-counter">Slide 1 of '+deckPages+'</span>'+
    '<button class="btn outline" id="deck-next">Next '+icon('chevron',15)+'</button>'+
    '</div>'+
    '<a class="text-link deck-download" href="'+deckPdf+'" target="_blank" rel="noopener">'+icon('download',15)+' Open full PDF '+icon('upRight',13)+'</a>';

  deckCanvas=main.querySelector('#deck-canvas');
  deckCtx=deckCanvas.getContext('2d');

  function updateDeckControls(){
    main.querySelector('#deck-prev').disabled=deckPage<=1;
    main.querySelector('#deck-next').disabled=deckPage>=deckPages;
    main.querySelector('#deck-counter').textContent='Slide '+deckPage+' of '+deckPages;
  }

  async function renderDeckPage(){
    if(!pdfDoc||rendering)return;
    rendering=true;
    try{
      const pg=await pdfDoc.getPage(deckPage);
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const wrapW=main.querySelector('.deck-canvas-wrap').clientWidth-40;
      const vp=pg.getViewport({scale:1});
      const scale=(wrapW/vp.width)*dpr;
      const sv=pg.getViewport({scale});
      deckCanvas.width=sv.width;deckCanvas.height=sv.height;
      deckCanvas.style.width=Math.round(sv.width/dpr)+'px';
      deckCanvas.style.height=Math.round(sv.height/dpr)+'px';
      await pg.render({canvasContext:deckCtx,viewport:sv}).promise;
    }catch(e){console.warn('Render page failed:',e)}
    rendering=false;
    updateDeckControls();
  }

  main.querySelector('#deck-prev').onclick=function(){if(deckPage>1){deckPage--;renderDeckPage()}};
  main.querySelector('#deck-next').onclick=function(){if(deckPage<deckPages){deckPage++;renderDeckPage()}};
  updateDeckControls();

  // Load pdf.js
  (async function(){
    try{
      await import('./vendor/pdfjs/pdf.min.mjs');
      const lib=globalThis.pdfjsLib;
      if(!lib||!lib.getDocument)throw new Error('pdfjsLib not found');
      lib.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',import.meta.url).href;
      pdfDoc=await lib.getDocument(deckPdf).promise;
      main.querySelector('#deck-loading').hidden=true;
      renderDeckPage();
    }catch(e){
      console.warn('pdf.js failed:',e?.message);
      // Fallback: show PDF in iframe
      const wrap=main.querySelector('.deck-canvas-wrap');
      wrap.innerHTML='<iframe src="'+deckPdf+'#page=1&view=FitH&toolbar=0" style="width:100%;height:100%;border:0;min-height:500px" title="'+esc(deckTitle)+'"></iframe>';
      main.querySelector('#deck-prev').onclick=function(){if(deckPage>1){deckPage--;wrap.querySelector('iframe').src=deckPdf+'#page='+deckPage+'&view=FitH&toolbar=0';updateDeckControls()}};
      main.querySelector('#deck-next').onclick=function(){if(deckPage<deckPages){deckPage++;wrap.querySelector('iframe').src=deckPdf+'#page='+deckPage+'&view=FitH&toolbar=0';updateDeckControls()}};
    }
  })();

  // ── Podcast ──
  const cleanPodcast=mountPodcast(main.querySelector('#podcast-mount'));
  observeSections(main);
  return cleanPodcast;
}
