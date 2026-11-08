const paths = {
  compass:'<circle cx="12" cy="12" r="8.8"/><path d="m15.7 6.3-2.4 7-6.9 4 3.2-7.6zM12 1v3m0 16v3M1 12h3m16 0h3"/>',
  book:'<path d="M3 4c3.1-.7 6.2-.1 9 1.5C15 3.9 18 3.3 21 4v15c-3-.6-6 .1-9 1.7C9 19.1 6 18.4 3 19zM12 5.5v15"/>',
  field:'<path d="M6 3h13a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 0v18m4-14h5m-5 4h4"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back:'<path d="M20 12H5m6 6-6-6 6-6"/>',
  upRight:'<path d="m5 19 13-13M7 6h11v11"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
  cube:'<path d="m12 2 9 5v10l-9 5-9-5V7zm-9 5 9 5 9-5m-9 5v10m-5-17 10 5"/>',
  pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/>',
  play:'<path d="m8 4 12 8-12 8z"/>',
  pause:'<path d="M8 4v16m8-16v16"/>',
  reset:'<path d="M4 11a8 8 0 1 1 2 7M4 4v7h7"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  search:'<circle cx="10" cy="10" r="6.6"/><path d="m15 15 6 6"/>',
  file:'<path d="M5 2h9l5 5v15H5zM14 2v6h5M8 12h8m-8 4h6"/>',
  volume:'<path d="M3 9h4l5-4v14l-5-4H3zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  shield:'<path d="M12 2 3 6v6c0 5 5 8.6 9 10 4-1.4 9-5 9-10V6z"/><path d="m8 11 3 3 6-6"/>',
  save:'<path d="M4 3h13l4 4v14H3V3zM7 3v6h9V3M7 21v-8h10v8"/>',
  download:'<path d="M12 2v13m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  time:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/>',
  plus:'<path d="M12 4v16M4 12h16"/>',
  minus:'<path d="M4 12h16"/>',
  left:'<path d="m15 5-7 7 7 7"/>',
  msg:'<path d="M4 4h16v12H9l-5 5z"/>',
  waves:'<path d="M2 7q3-3 6 0t6 0 6 0M2 12q3-3 6 0t6 0 6 0M2 17q3-3 6 0t6 0 6 0"/>',
  headset:'<path d="M4 14v-3a8 8 0 0 1 16 0v6c0 3-3 4-7 4M3 11h4v7H3zm14 0h4v7h-4z"/>',
  flag:'<path d="M4 22V4c4-5 10 4 15-1v11c-5 5-11-4-15 1"/>',
  folder:'<path d="M2 6h8l2 3h10v11H2z"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1"/>'
}
export const icon=(name,size=18)=>'<svg aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||'')+
  '</svg>';
export const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const pad=n=>String(n).padStart(2,'0');
export const ann=msg=>{
  document.querySelector('#announcement').textContent=msg
};
export const source=(m,p,label)=>'<a class="cite" target="_blank" rel="noopener" href="'+esc(m.pdf)+'#page='+Number(p)+'">'+(label?esc(label)+' · ':'')+
  'p. '+Number(p)+
  ' '+icon('upRight',12)+
  '</a>';
export const brand=()=>'<a class="brand" href="#/" aria-label="Civic Atlas overview">'+icon('compass',33)+'<span>Civic Atlas</span></a>';
export const line=(content)=>'<div class="eyebrow"><i></i>'+content+'</div>';
export const cover=id=>'assets/course-'+id+'.webp';
export const category=id=>id==='strategy'?'Foundations':['data-records','workforce-trust','capstone'].includes(id)?'Assurance':'Service delivery';
export const pageTitles={
  strategy:'Government strategy',
  'citizen-services':'Citizen services',
  'benefits-casework':'Benefits & casework',
  'permitting-planning':'Permitting & planning',
  'tax-revenue':'Tax & revenue',
  'procurement-supplier':'Procurement & suppliers',
  'emergency-services':'Emergency services',
  'data-records':'Data & records',
  'workforce-trust':'Workforce & trust',
  capstone:'Capstone & assurance'
};
export const pageSub={
  strategy:'Set a mandate, choose a portfolio and decide where AI belongs in government.',
  'citizen-services':'Build a reliable front door for residents across channels and languages.',
  'benefits-casework':'Prepare evidence and case notes while keeping eligibility decisions accountable.',
  'permitting-planning':'Trace planning checks to the rules and preserve the officer’s reasoning.',
  'tax-revenue':'Help residents understand assessments, corrections and appeal routes.',
  'procurement-supplier':'Test supplier claims and retain control over change, evidence and exit.',
  'emergency-services':'Support call-takers and commanders when the operating picture changes.',
  'data-records':'Follow a record from its source through access, retention and disposal.',
  'workforce-trust':'Equip staff to challenge a suggestion and explain its use to the public.',
  capstone:'Assemble the evidence behind a portfolio-wide assurance decision.'
};
export const casePhotos={
  strategy:9,
  'citizen-services':8,
  'benefits-casework':12,
  'permitting-planning':8,
  'tax-revenue':8,
  'procurement-supplier':24,
  'emergency-services':15,
  'data-records':7,
  'workforce-trust':9,
  capstone:15
};
