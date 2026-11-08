import {esc} from './ui.js';
export function exhibitReader(records,active){
  const selected=records.find(r=>r.id===active)||records[0];
  return '<section class="case-files" id="case-files"><div class="case-section-title"><span class="minor-label">CASE FILE</span><h2>Evidence register</h2></div>'+
    '<div class="exhibit-choices" role="group" aria-label="Read exhibit">'+records.map(r=>
      '<button type="button" data-record="'+r.id+'" aria-pressed="'+(r===selected)+'"><span>'+r.id+'</span>'+esc(r.title)+'</button>').join('')+'</div>'+
    '<article class="exhibit-sheet" aria-live="polite"><div class="exhibit-meta"><b>'+selected.id+'</b><span>'+esc(selected.time)+'</span></div>'+
    '<h3>'+esc(selected.title)+'</h3><small>'+(selected.team?esc(selected.team)+' · ':'')+esc(selected.owner)+'</small><p>'+esc(selected.text??selected.body)+'</p>'+
    '<div class="file-limit"><strong>Scope of this record</strong>'+esc(selected.limit)+'</div></article></section>';
}
