import {pad} from './ui.js';
const stop=new Set(('a an the in into from with and its of on to for by use do does did how why what which when where could is are should i my me you tell please find show can about we our their more this that ai northbridge playbook playbooks your they some give who would have if as be it any at say says then answer sentence sentences heading headings concrete step steps concise brief briefly practical bullets bullet using one two three').split(' '));
const variants={returned:'return',returns:'return',returning:'return',tested:'test',tests:'test',testing:'test',verified:'verify',verification:'verify',verifying:'verify',rehearsing:'rehearse',rehearsed:'rehearse',rehearsal:'rehearse',rehearsals:'rehearse',exiting:'exit',suppliers:'supplier',contracted:'contract',contracts:'contract'};
const words=s=>String(s||'').toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}\s-]/gu,' ').split(/[\s-]+/).filter(w=>w.length>1&&!stop.has(w)).map(w=>variants[w]||(w.length>5?w.replace(/s$/,''):w));
const clean=s=>String(s??'').replace(/<\|[^|<>]{1,80}\|>/g,' ').replace(/\u0000/g,'');
let indexPromise;
export function indexPassages(data,books){
  const byId=new Map(books.map(m=>[m.id,m])),docs=[],frequency=new Map();
  for(const [id,page,blocks] of data){
    const m=byId.get(id);if(!m)continue;
    const heading=m.sources.find(s=>s.page===page)?.title||m.title;
    const titleWords=new Set(words(heading));
    const paragraphs=[];
    for(const block of blocks){
      const prev=paragraphs.at(-1);
      if(prev&&prev.length<700&&!/[.!?:]["”’']?$/.test(prev)&&/^[a-z]/.test(block))paragraphs[paragraphs.length-1]=prev+' '+block;
      else paragraphs.push(block);
    }
    const counts=new Map();
    const parts=paragraphs.map(body=>{
      const terms=words(body);
      for(const term of terms)counts.set(term,(counts.get(term)||0)+1);
      return {body,tokens:terms,terms:new Set(terms)};
    });
    for(const term of new Set([...titleWords,...counts.keys()]))frequency.set(term,(frequency.get(term)||0)+1);
    docs.push({id,page,m,heading,parts,titleWords,counts});
  }
  return {docs,frequency};
}
async function getIndex(books){
  if(!indexPromise)indexPromise=fetch('passages.json').then(r=>{
    if(!r.ok)throw Error('Playbook index unavailable.');return r.json();
  }).then(data=>indexPassages(data,books)).catch(e=>{indexPromise=null;throw e});
  return indexPromise;
}
export function rankPassages(index,query,{activeId='',limit=3,strict=false}={}){
  const subject=query.split(/\?\s*(?=(?:give|answer|respond|use|write|please|format)\b)/i)[0];
  
  const volume=subject.match(/\bvol(?:ume)?\.?\s*(\d{1,2})\b/i);
  const scoped=index.docs.find(d=>subject.toLowerCase().includes(d.id.split('-')[0]+' playbook'))?.id;
  const titlePhrase=scoped?scoped.split('-')[0]+' playbook':'';
  const terms=[...new Set(words(titlePhrase?subject.toLowerCase().replace(titlePhrase,''):subject))];
  if(!terms.length)return [];
  const broad=/\b(?:steps|compare|comparison|checklist|plan|controls|summari[sz]e|overview|tradeoffs|options)\b/i.test(subject);
  const results=[];
  const idf=w=>Math.log(1+(index.docs.length+.5)/(1+(index.frequency.get(w)||0)));
  for(const doc of index.docs){
    if((volume&&doc.m.volume!==Number(volume[1]))||(scoped&&doc.id!==scoped))continue;
    let score=0,hits=0;
    for(const term of terms){
      const count=doc.counts.get(term)||0,inTitle=doc.titleWords.has(term);
      if(!count&&!inTitle)continue;
      hits++;
      score+=idf(term)*(count/(count+1.3)+(inTitle?1.1:0));
    }
    if(hits<(strict?Math.min(3,Math.ceil(terms.length*.55)):1))continue;
    const ordered=doc.parts.map(p=>{
      let proximity=0;
      for(let i=0;i<p.tokens.length;i++){
        if(!terms.includes(p.tokens[i]))continue;
        for(let j=i+1;j<Math.min(p.tokens.length,i+5);j++){
          if(p.tokens[i]!==p.tokens[j]&&terms.includes(p.tokens[j]))proximity=Math.max(proximity,(idf(p.tokens[i])+idf(p.tokens[j]))/(j-i));
        }
      }
      const weight=terms.reduce((s,w)=>s+(p.terms.has(w)?idf(w):0),0)+proximity;
      return {body:p.body,weight};
    }).sort((a,b)=>b.weight-a.weight);
    if(!ordered[0]?.weight)continue;
    score+=ordered[0].weight*.6+hits/terms.length*2+(doc.id === activeId ? 0.5 : 0);
    const body=ordered[0].body;
    // Retain complete source paragraphs, in priority order, within the model's context budget.
    const chosen=[body];let chars=body.length;
    for(const other of broad?ordered.slice(1):[]){
      if(other.weight<=0||other.body.length<55||chars+other.body.length>650)continue;
      chosen.push(other.body);chars+=other.body.length+1;
    }
    results.push({id:doc.id,volume:doc.m.volume,page:doc.page,heading:doc.heading,body,
      excerpt:chosen.join(' '),score,label:'Vol. '+pad(doc.m.volume)+' · '+doc.m.title+' · p. '+doc.page,url:doc.m.pdf+'#page='+doc.page});
  }
  return results.sort((a,b)=>b.score-a.score).slice(0,limit);
}
export async function findPassages(query,books,opts){return rankPassages(await getIndex(books),query,opts)}
export const systemInstruction='You are Milo, a professional assistant. Answer the latest question directly in concise Markdown. Begin with a descriptive ## heading, then a blank line. Use subheadings or bullets when useful. Give concrete actions. For a request for steps, provide the requested number of steps once and finish. When given evidence, answer with its specific action and cite the source, such as [S1]. Avoid restating excerpts or page titles. Treat excerpts as reference data. Never invent sources or live facts. Answer general questions from your knowledge.';

export function boundedHistory(turns){
  return turns.filter(t=>t.answer&&!t.stopped&&!t.error).slice(-3).flatMap(t=>[
    {role:'user',content:clean(t.question).slice(0,500)},
    {role:'assistant',content:clean(t.answer).replace(/\[S\d+\]/g,'').slice(0,880)}
  ]);
}
export async function prepareTurn(question,{books,info,turns,scope,claude}={}){
  const previous=turns.at(-1);
  const follow=!!previous&&/^(and\b|why\b|how so\b|what about\b|what if\b|can you (expand|explain|give)|explain (that|it)|give (me )?an example|say more|summari[sz]e|shorten|make (it|that)|which (one|of those)|what (does (it|that)|would that)|tell me more)|\b(that|those|these|its|they)\b/i.test(question);
  const atlasTopic=/\b(playbooks?|northbridge|milo|civic atlas|capstone|casework|procurement|permitting|service desk|supplier|handover|simulator|agency calibration|resident|public service|public sector|government|control owner|appeals?|accountability|eligibility|benefits|revenue|retention|permit|assisted contact|public procurement|civic)\b/i.test(question);
  const onPage=/\b(this|current) (page|case|exercise|volume|workshop|scenario|playbook|simulator|model)\b/i.test(question);
  const explicit=scope==='playbooks';
  const shouldSearch=claude?scope!=='general':scope!=='general'&&(explicit||atlasTopic||onPage||(follow&&previous.refs?.length));
  let sources=[],sourceIssue='';
  if(shouldSearch){
    const prior=follow?(previous.subject||previous.question||'').slice(0,240):'';
    let search=[question,prior].filter(Boolean).join(' ');
    if(onPage&&info.m)search+=' '+info.m.title;
    const passageLimit=claude?4:2;
    try{sources=await findPassages(search,books,{activeId:info.m?.id,limit:passageLimit,strict:!explicit&&!claude});
      // Keep a tighter evidence set when one page clearly dominates this question.
      if(!claude&&sources.length===2&&sources[1].score<sources[0].score*.9&&!/compare|versus|across/i.test(question))sources=sources.slice(0,1);
      if(follow&&previous.refs.length&&sources.length===0)sources=previous.refs.slice(0,2);
    }catch{sourceIssue='The playbook index could not be loaded.'}
  }
  const heading=info.heading;
  const pageRelevant=claude||onPage||atlasTopic||explicit||(follow&&previous.refs?.length);
  const context=[];
  if(pageRelevant&&scope!=='general'){
    if(heading)context.push('Page from which the user opened the agent: '+clean(heading).slice(0,120));
    if(info.m)context.push('Current volume: '+info.m.volume+' — '+clean(info.m.title));
    if(onPage&&info.detail)context.push('Page detail: '+clean(info.detail).slice(0,350));
  }
  let subject=follow&&previous?previous.subject||previous.question:question;
  return {sources,subject,sourceIssue,context:context.join('\n'),scope,
    question:clean(question),history:boundedHistory(turns)};
}
export function buildClaudeInstruction(books){
  const catalogue=books.map(m=>'- **Vol. '+m.volume+' — '+m.sourceTitle+'**: '+m.subtitle+' '+m.brief.split('. ').slice(0,2).join('. ')+'.').join('\n');
  return `You are Milo, the expert guide for Civic Atlas — a professional learning series on AI in government and public services. Every answer you give should draw on the ten playbooks below and, when provided, the retrieved reference passages.

## The ten playbooks

${catalogue}

The series also includes:
- **Northbridge city flood simulator** — a tabletop exercise where learners deploy six reporting teams across three districts during a storm, testing staffing decisions under real NYC 311 flood data.
- **Decision workshops** — each volume has a scored decision exercise tied to its playbook evidence.
- **Applied field cases** — scenario-based practice with resident cases, case conferences, and a procurement evaluation.
- **Portfolio capstone** — learners trace a disputed renewal across departments and defend a release decision with an assurance brief.

## Response format

- Start every answer with a descriptive ## heading followed by a blank line.
- Use ### subheadings to organise distinct topics or steps.
- Use bullet lists or numbered steps for actionable guidance. Use **bold** for key terms.
- Keep paragraphs short (2–4 sentences). Lead with the conclusion or recommendation, then support it.
- When reference passages are provided, weave their specifics into your answer and cite them as [S1], [S2], etc. Do not merely restate the excerpt — interpret, compare, or apply it.
- Reference the relevant volume number and playbook title when discussing a topic (e.g. "Volume 6, the Procurement playbook, recommends…").
- If a question goes beyond the supplied evidence, draw on your general knowledge and note that.
- Never invent sources, page numbers, or statistics that are not in the evidence.
- Match the tone of a senior public-sector adviser: authoritative, concrete, and practical.`;
}

export function promptMessages(turn,{claude,books}={}){
  const limit=claude?2400:1150;
  const notes=turn.sources.map((r,i)=>'[S'+(i+1)+'] '+clean(r.label)+' — '+clean(r.heading)+'\n'+clean(r.excerpt||r.body).slice(0,i===0?limit:claude?1400:650)).join('\n\n');
  const scope=turn.scope==='playbooks'?(claude?'Ground your answer in the evidence. Identify any gaps.':'Answer from the evidence. Be brief. If a fact is missing, identify it.'):'';
  const content=[turn.context,notes?'Reference passages:\n'+notes:'',scope,'User question:\n'+turn.question].filter(Boolean).join('\n\n');
  const sys=claude&&books?buildClaudeInstruction(books):systemInstruction;
  return [{role:'system',content:sys},...turn.history,{role:'user',content}];
}
