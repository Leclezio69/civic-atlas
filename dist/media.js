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

export function renderMedia(main){
  let slide=0,infoIdx=0;
  const totalSlides=deckPages;

  main.innerHTML='<div class="media-hero"><div class="wrap media-hero-inner">'+line('MEDIA & RESOURCES')+
    '<h1>Explore the Series</h1><p>Video overview, original infographics from the ten playbooks, the strategy slide deck, and the Civic Atlas podcast.</p></div></div>'+

    '<div class="wrap media-page">'+

    // Video section
    '<section class="media-section" id="media-video"><div class="media-section-head">'+line('VIDEO')+'<h2>Series Overview</h2></div>'+
    '<div class="media-video-wrap"><div class="media-video"><iframe src="https://www.youtube.com/embed/PwJBp9-U8dY" title="Civic Atlas — AI Government &amp; Public Services" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>'+
    '<p class="media-caption">A walkthrough of the complete Civic Atlas series — ten playbooks, the Northbridge flood simulator, and the portfolio capstone.</p></section>'+

    // Infographics section
    '<section class="media-section" id="media-infographics"><div class="media-section-head">'+line('INFOGRAPHICS')+'<h2>Inside the Playbooks</h2></div>'+
    '<div class="info-viewer" id="info-viewer"></div></section>'+

    // Slide deck section
    '<section class="media-section" id="media-deck"><div class="media-section-head">'+line('SLIDE DECK')+'<h2>'+esc(deckTitle)+'</h2></div>'+
    '<div class="deck-viewer" id="deck-viewer"></div></section>'+

    // Podcast section
    '<section class="media-section" id="media-podcast"><div class="media-section-head">'+line('PODCAST')+'<h2>The Civic Atlas Podcast</h2></div>'+
    '<div class="podcast-player">'+
    '<div class="podcast-art"><img src="assets/milo.webp" alt=""><div><h3>Series Deep Dive</h3><small>With George · 2 min listen</small></div></div>'+
    '<audio controls preload="metadata" class="podcast-audio"><source src="assets/podcast-civic-atlas.m4a" type="audio/mpeg">Your browser does not support the audio element.</audio>'+
    '<p class="media-caption">From the investment panel to the portfolio capstone — a guided walk through all ten volumes, the flood simulator, and the assurance framework.</p>'+
    '</div></section>'+

    '</div>';

  function renderInfo(){
    const info=infographics[infoIdx];
    const counter=(infoIdx+1)+' / '+infographics.length;
    document.querySelector('#info-viewer').innerHTML=
      '<div class="info-display"><div class="info-img-wrap"><img src="assets/'+esc(info.file)+'" alt="'+esc(info.title)+'"></div>'+
      '<div class="info-detail"><span class="minor-label">'+esc(info.volume).toUpperCase()+'</span>'+
      '<h3>'+esc(info.title)+'</h3><p>'+esc(info.body)+'</p>'+
      '<div class="info-nav"><button class="iconbtn info-prev" aria-label="Previous infographic" '+(infoIdx===0?'disabled':'')+'>'+icon('left',18)+'</button>'+
      '<span class="info-counter">'+counter+'</span>'+
      '<button class="iconbtn info-next" aria-label="Next infographic" '+(infoIdx===infographics.length-1?'disabled':'')+'>'+icon('chevron',18)+'</button></div>'+
      '<div class="info-dots">'+infographics.map((_,i)=>'<button class="info-dot'+(i===infoIdx?' active':'')+'" data-dot="'+i+'" aria-label="View infographic '+(i+1)+'"></button>').join('')+'</div>'+
      '</div></div>';
    document.querySelectorAll('.info-prev').forEach(b=>b.onclick=()=>{if(infoIdx>0){infoIdx--;renderInfo()}});
    document.querySelectorAll('.info-next').forEach(b=>b.onclick=()=>{if(infoIdx<infographics.length-1){infoIdx++;renderInfo()}});
    document.querySelectorAll('.info-dot').forEach(b=>b.onclick=()=>{infoIdx=Number(b.dataset.dot);renderInfo()});
  }

  function renderDeck(){
    const page=slide+1;
    document.querySelector('#deck-viewer').innerHTML=
      '<div class="deck-frame"><iframe src="'+deckPdf+'#page='+page+'&view=FitH&toolbar=0&navpanes=0" title="'+esc(deckTitle)+' — Page '+page+'"></iframe></div>'+
      '<div class="deck-controls"><button class="btn outline deck-prev" '+(slide===0?'disabled':'')+'>'+icon('left',15)+' Previous</button>'+
      '<span class="deck-counter">Page '+page+' of '+totalSlides+'</span>'+
      '<button class="btn outline deck-next" '+(slide>=totalSlides-1?'disabled':'')+'>Next '+icon('chevron',15)+'</button></div>'+
      '<a class="text-link deck-download" href="'+deckPdf+'" target="_blank" rel="noopener">'+icon('download',15)+' Open full PDF '+icon('upRight',13)+'</a>';
    document.querySelector('.deck-prev').onclick=()=>{if(slide>0){slide--;renderDeck()}};
    document.querySelector('.deck-next').onclick=()=>{if(slide<totalSlides-1){slide++;renderDeck()}};
  }

  renderInfo();
  renderDeck();
}
