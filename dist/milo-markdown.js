import {marked} from './vendor/marked/marked.js';
import {esc} from './ui.js';

// Render a fixed set of Markdown tokens. HTML and image requests from model text
// stay inert, and only the app's verified playbook handles become citation links.
const safeExternal=href=>{
  try {const url=new URL(href);return ['https:','http:'].includes(url.protocol)?url.href:null}
  catch{return null}
};
function textWithCitations(text,refs){
  return String(text||'').split(/(\[S\d+\])/g).map(part=>{
    const matched=/^\[S(\d+)\]$/.exec(part);
    const source=matched&&refs[Number(matched[1])-1];
    return source?'<a class="milo-ref" href="'+esc(source.url)+'" target="_blank" rel="noopener" aria-label="'+esc(source.label)+'">'+esc(part)+'</a>':esc(part);
  }).join('');
}
function tokens(list,refs){
  return (list||[]).map(t=>{
    const children=()=>tokens(t.tokens,refs);
    switch(t.type){
      case 'space':case 'def':return '';
      case 'heading':{
        const level=Math.min(6,Math.max(3,t.depth+1));
        return '<h'+level+'>'+children()+'</h'+level+'>';
      }
      case 'paragraph':return '<p>'+children()+'</p>';
      case 'strong':return '<strong>'+children()+'</strong>';
      case 'em':return '<em>'+children()+'</em>';
      case 'del':return '<del>'+children()+'</del>';
      case 'br':return '<br>';
      case 'hr':return '<hr>';
      case 'blockquote':return '<blockquote>'+children()+'</blockquote>';
      case 'code':return '<pre><code>'+esc(t.text)+'</code></pre>';
      case 'codespan':return '<code>'+esc(t.text)+'</code>';
      case 'link':{
        const url=safeExternal(t.href);
        return url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+children()+'</a>':children();
      }
      case 'image':case 'html':return esc(t.text);
      case 'list':{
        const tag=t.ordered?'ol':'ul',start=t.ordered&&Number.isSafeInteger(t.start)&&t.start>1?' start="'+t.start+'"':'';
        return '<'+tag+start+'>'+t.items.map(item=>'<li>'+tokens(item.tokens,refs)+'</li>').join('')+'</'+tag+'>';
      }
      case 'table':{
        const cells=(row,tag)=>row.map(c=>'<'+tag+'>'+tokens(c.tokens,refs)+'</'+tag+'>').join('');
        return '<div class="milo-table"><table><thead><tr>'+cells(t.header,'th')+'</tr></thead><tbody>'+t.rows.map(r=>'<tr>'+cells(r,'td')+'</tr>').join('')+'</tbody></table></div>';
      }
      case 'escape':return esc(t.text);
      default:return t.tokens?children():textWithCitations(t.text||t.raw,refs);
    }
  }).join('');
}
export function formatAnswer(raw){
  const text=String(raw||'').trim();
  if(!text)return '';
  const unwrapped=/^```(?:markdown|md)\s*\n([\s\S]+)\n```\s*$/i.exec(text)?.[1]??text;
  const first=marked.lexer(unwrapped,{gfm:true}).find(t=>t.type!=='space');
  return first?.type==='heading'?unwrapped:'## Answer\n\n'+unwrapped;
}
export function renderAnswer(raw,refs=[]){
  const md=formatAnswer(raw);
  return tokens(marked.lexer(md,{gfm:true}),refs);
}
export function copyableAnswer(raw,refs=[],base){
  const md=formatAnswer(raw);
  if(!refs.length)return md;
  return md+'\n\n### Playbook context\n\n'+refs.map((r,i)=>'- [S'+(i+1)+' · '+r.label+']('+new URL(r.url,base).href+')').join('\n');
}
