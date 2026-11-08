import {esc,icon} from './ui.js';
import {boundedHistory,prepareTurn,promptMessages,findPassages} from './milo-context.js';
import {renderAnswer,formatAnswer,copyableAnswer} from './milo-markdown.js';
import {modelFile,compactReady,nativeAvailability,startNative,generateNative,openCompact,generateCompact,releaseModel} from './milo-model.js';
import {loadApiKey,saveApiKey,generateClaude} from './milo-claude.js';

const chat={turns:[],draft:'',scope:'auto',model:'claude',native:'unavailable',checked:false,checking:false,manual:false,file:null,apiKey:loadApiKey(),
  task:null,stage:'',percent:null,feedback:'',settings:false};
let mount=null, context=null, scheduled=0, sequence=0;
const modelName=()=>chat.model==='claude'?'Claude Sonnet':chat.model==='native'?'Browser language model':modelFile.name;
function turnMarkup(t){
  const refs=t.refs||[];
  const body=t.answer?'<div class="milo-markdown">'+renderAnswer(t.answer,refs)+'</div>':'';
  const error=t.error?'<div class="milo-error" role="alert"><b>Answer unavailable</b><p>'+esc(t.error)+'</p></div>':'';
  const hint=t.stopped?'<small class="milo-hint">Response stopped.</small>':t.limited?'<small class="milo-hint">Output limit reached. Ask Milo to continue.</small>':'';
  const pages=refs.length&&t.answer?'<details class="milo-sources"><summary>Playbook context · '+refs.length+' '+(refs.length===1?'page':'pages')+'</summary>'+refs.map((r,i)=>'<a href="'+esc(r.url)+'" target="_blank" rel="noopener">[S'+(i+1)+'] '+esc(r.label)+' '+icon('upRight',12)+'</a><blockquote>'+esc(r.body)+'</blockquote>').join('')+'</details>':'';
  const copy=t.answer&&t.done?'<button type="button" class="milo-copy" data-copy="'+t.id+'">Copy Markdown</button>':'';
  const retry=(t.error||t.stopped)&&t===chat.turns.at(-1)&&!chat.task?'<button type="button" class="milo-retry" data-retry="'+t.id+'">Retry question</button>':'';
  return '<article class="milo-turn"><div class="milo-user"><span>You</span><p>'+esc(t.question)+'</p></div><div class="milo-reply"><span class="milo-byline">MILO · '+esc(t.model)+'</span>'+body+error+hint+pages+copy+retry+'</div></article>';
}
function transcript(){
  if(!mount?.isConnected)return;
  const log=mount.querySelector('.milo-transcript');if(!log)return;
  const follow=log.scrollHeight-log.scrollTop-log.clientHeight<70;
  const openSources=new Set([...log.querySelectorAll('article')].flatMap((el,i)=>el.querySelector('details[open]')?[i]:[]));
  const prompts=['How should a city test a supplier’s exit plan?','What is the difference between AI and automation?'];
  log.innerHTML=chat.turns.length?chat.turns.map(turnMarkup).join(''):
    '<div class="milo-welcome"><h2>Start a conversation</h2><p>Write your question below or choose a starting point.</p><div class="milo-prompts">'+
    prompts.map(q=>'<button type="button" data-example="'+esc(q)+'">'+esc(q)+icon('arrow',16)+'</button>').join('')+'</div></div>';

  openSources.forEach(i=>{const el=log.querySelectorAll('article')[i]?.querySelector('details');if(el)el.open=true});
  if(follow)log.scrollTop=log.scrollHeight;
  log.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{
    const t=chat.turns.find(x=>x.id===Number(b.dataset.copy));if(!t)return;
    const md=copyableAnswer(t.answer,t.refs,location.origin);
    try{await navigator.clipboard.writeText(md);b.textContent='Copied'}
    catch{
      const area=document.createElement('textarea');area.value=md;area.setAttribute('aria-label','Markdown to copy');b.replaceWith(area);area.focus();area.select();
      chat.feedback='Markdown selected. Use your copy shortcut.';status();
    }
  });
  log.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',e=>{
    chat.draft=e.currentTarget.dataset.example;const box=mount.querySelector('#milo-question');box.value=chat.draft;box.focus();status();
  }));
  log.querySelector('[data-retry]')?.addEventListener('click',()=>{
    if(chat.task)return;
    const last=chat.turns.pop();chat.draft=last.question;paint();submit();
  });
}
function queueTranscript(){
  if(scheduled)return;
  scheduled=setTimeout(()=>{scheduled=0;transcript()},120);
}
function status(){
  if(!mount?.isConnected)return;
  const statusLine=mount.querySelector('.milo-status'),p=mount.querySelector('.milo-progress'),send=mount.querySelector('.milo-send'),stop=mount.querySelector('.milo-stop');
  if(!statusLine||!send)return;
  const running=!!chat.task;
  const status=running?(chat.stage+(chat.percent===null?'':' · '+chat.percent+'%')):chat.feedback;
  if(statusLine.textContent!==status)statusLine.textContent=status;
  p.hidden=!running||chat.percent===null;
  if(!p.hidden)p.value=chat.percent;
  send.hidden=running;stop.hidden=!running;
  send.disabled=!chat.draft.trim()||running||(chat.model==='claude'&&!chat.apiKey);
  send.textContent=chat.model==='compact'&&!compactReady()&&!chat.file?'Load model & ask':'Ask Milo';
  mount.querySelector('.milo-startover').disabled=running||(!chat.turns.length&&!chat.draft);
  mount.querySelectorAll('.milo-settings select,.milo-settings input,.milo-scope').forEach(el=>el.disabled=running);
  const note=mount.querySelector('.milo-engine-note');
  note.textContent=chat.model==='claude'?(chat.apiKey?'Claude Sonnet via Anthropic API.':'Enter your API key in Model settings.')
    :chat.model==='native'?(chat.native==='downloadable'?'Your browser will request its model download on first use.':'Uses the language model in this browser.')
    :compactReady()?'Qwen model ready on this device.':chat.file?'The selected Qwen model will run on this device.':'First use downloads a 491 MB model. Questions stay on this device.';
}
function paint(){
  if(!mount?.isConnected)return;
  mount.innerHTML='<section class="milo-chat" aria-label="AI agent conversation"><div class="milo-tools"><label>Answer scope <select class="milo-scope" aria-label="Answer scope">'+
    [['auto','Automatic'],['playbooks','Playbooks'],['general','General knowledge']].map(([v,n])=>'<option value="'+v+'" '+(chat.scope===v?'selected':'')+'>'+n+'</option>').join('')+'</select></label>'+
    '<button type="button" class="milo-startover">New chat</button></div><div class="milo-transcript" aria-label="Conversation" tabindex="0"></div>'+
    '<div class="milo-compose"><form class="milo-form"><label class="sr" for="milo-question">Your question for Milo</label><textarea id="milo-question" rows="2" maxlength="1800" placeholder="Ask a question or follow up…">'+esc(chat.draft)+'</textarea>'+
    '<div class="milo-compose-bar"><button type="button" class="milo-options" aria-expanded="'+chat.settings+'">Model settings '+icon('down',12)+'</button><button type="submit" class="milo-send">Ask Milo</button><button type="button" class="milo-stop" hidden>Stop</button></div></form>'+
    '<p class="milo-engine-note"></p><div class="milo-status" role="status"></div><progress class="milo-progress" max="100" hidden aria-label="Model progress"></progress>'+
    '<div class="milo-settings" '+(chat.settings?'':'hidden')+'><label>Answer model<select class="milo-engine">'+
    '<option value="claude" '+(chat.model==='claude'?'selected':'')+'>Claude Sonnet · Anthropic API</option>'+
    '<option value="compact" '+(chat.model==='compact'?'selected':'')+'>Qwen2.5 · on this device</option>'+
    (chat.native!=='unavailable'?'<option value="native" '+(chat.model==='native'?'selected':'')+'>Browser language model</option>':'')+
    '</select></label>'+
    '<div class="milo-claude-key" '+(chat.model==='claude'?'':'hidden')+'><label>API key<input type="password" class="milo-apikey" placeholder="sk-ant-…" value="'+esc(chat.apiKey)+'" autocomplete="off"></label>'+
    '<small>Your key is stored in this browser only and sent directly to the Anthropic API.</small></div>'+
    '<div class="milo-local" '+(chat.model==='compact'?'':'hidden')+'><label>Use a downloaded model file<input type="file" accept=".gguf" class="milo-file"></label>'+
    '<a href="'+modelFile.url+'" target="_blank" rel="noopener">Get the compatible GGUF file '+icon('upRight',11)+'</a></div>'+
    '<small>Conversation clears on reload or when you start a new chat. Model answers use learned knowledge and the supplied passages.</small></div></div></section>';
  transcript();status();
  const q=mount.querySelector('#milo-question');
  q.oninput=()=>{chat.draft=q.value;status()};
  q.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();if(!chat.task&&chat.draft.trim())submit()}};
  mount.querySelector('.milo-form').onsubmit=e=>{e.preventDefault();submit()};
  mount.querySelector('.milo-stop').onclick=()=>{if(chat.task){chat.stage='Stopping';chat.percent=null;chat.task.controller.abort();status()}};
  mount.querySelector('.milo-startover').onclick=()=>{if(!chat.task){chat.turns=[];chat.draft='';chat.feedback='';paint();mount.querySelector('textarea').focus()}};
  mount.querySelector('.milo-scope').onchange=e=>{chat.scope=e.target.value};
  mount.querySelector('.milo-options').onclick=e=>{
    chat.settings=!chat.settings;e.currentTarget.setAttribute('aria-expanded',String(chat.settings));mount.querySelector('.milo-settings').hidden=!chat.settings;
  };
  mount.querySelector('.milo-engine').onchange=e=>{chat.model=e.target.value;chat.manual=true;chat.feedback='';
    mount.querySelector('.milo-claude-key').hidden=chat.model!=='claude';
    mount.querySelector('.milo-local').hidden=chat.model!=='compact';
    status()};
  mount.querySelector('.milo-apikey').oninput=e=>{chat.apiKey=e.target.value.trim();saveApiKey(chat.apiKey);status()};
  mount.querySelector('.milo-file').onchange=async e=>{
    const f=e.target.files?.[0];if(!f)return;
    if(f.size!==modelFile.size||await f.slice(0,4).text()!=='GGUF'){
      chat.feedback='Choose the linked 491 MB Qwen GGUF file.';e.target.value='';status();return;
    }
    chat.file=f;chat.model='compact';chat.manual=true;chat.feedback='Local model selected.';status();
  };
}
function messageForError(e){
  if(e instanceof Error&&e.message.startsWith('Choose the'))return e.message;
  if(chat.model==='claude'){
    if(e instanceof Error&&(e.message.includes('API key')||e.message.includes('401')))return e.message;
    return 'Claude could not complete this response. '+String(e?.message||'Check your API key and connection in Model settings.').slice(0,200);
  }
  if(chat.model==='native')return 'The browser model could not finish this request. Open Model settings to use Qwen, or retry with a shorter question.';
  if(!compactReady())return 'The on-device model could not load. Check your connection and browser storage, or select the compatible GGUF file in Model settings.';
  return 'The model could not complete this response. Try a shorter question or start a new chat.';
}
async function submit(){
  const question=chat.draft.trim();
  if(chat.task||!question||!context)return;
  const prior=chat.turns.filter(t=>t.done&&!t.error&&!t.stopped);
  const task={id:++sequence,controller:new AbortController()};
  const {signal}=task.controller;
  const t={id:task.id,question,subject:question,answer:'',refs:[],model:modelName(),done:false};
  const clickedContext={...context,scope:chat.scope,turns:prior};
  const engine=chat.model;
  chat.task=task;chat.stage='Preparing question';chat.percent=null;chat.turns.push(t);
  chat.draft='';chat.feedback='';if(mount?.isConnected)mount.querySelector('#milo-question').value='';
  // A reply can finish while the user is on another page.
  const progress=(title,pct)=>{if(chat.task!==task||signal.aborted)return;chat.stage=title;chat.percent=pct;status()};
  const update=answer=>{
    if(chat.task!==task||signal.aborted)return;
    if(chat.stage!=='Writing answer')progress('Writing answer',null);
    t.answer=answer;queueTranscript();
  };
  let session=null;
  try{
    if(engine==='claude'){
      transcript();status();
      progress('Searching playbooks',null);
      const turn=await prepareTurn(question,{...clickedContext,claude:true});
      signal.throwIfAborted();
      t.refs=turn.sources;t.subject=turn.subject;
      if(turn.sourceIssue)chat.feedback='The passage index was unavailable for this answer.';
      progress('Sending to Claude',null);
      const messages=promptMessages(turn,{claude:true,books:context.books});
      const result=await generateClaude(chat.apiKey,messages,signal,update);
      t.answer=result.text;t.limited=result.limited;
      if(!t.answer.trim())throw Error('Empty model response');
      t.answer=formatAnswer(t.answer);t.done=true;if(!chat.feedback)chat.feedback='Answer ready.';
      return;
    }
    const modelPromise=engine==='native'?startNative(boundedHistory(prior),signal,progress):openCompact(signal,progress,chat.file);
    transcript();status();
    const [runtime,turn]=await Promise.all([modelPromise,prepareTurn(question,clickedContext)]);
    if(engine==='native')session=runtime;
    signal.throwIfAborted();
    t.refs=turn.sources;t.subject=turn.subject;
    if(turn.scope==='playbooks'&&(turn.sourceIssue||!turn.sources.length)){
      t.error=turn.sourceIssue||'No source passage matched this question. Try a specific playbook term or switch the scope to General knowledge.';return;
    }
    if(turn.sourceIssue)chat.feedback='The passage index was unavailable for this answer.';
    progress('Reading context',null);
    const messages=promptMessages(turn);
    if(engine==='native'){
      const owned=session;session=null;t.answer=await generateNative(owned,messages.at(-1).content,signal,update);
    }else{
      const result=await generateCompact(runtime,messages,signal,update,progress);t.answer=result.text;t.limited=result.limited;
    }
    if(!t.answer.trim())throw Error('Empty model response');
    t.answer=formatAnswer(t.answer);t.done=true;if(!chat.feedback)chat.feedback='Answer ready.';
  }catch(e){
    if(signal.aborted||e?.name==='AbortError'){t.stopped=true;t.done=true;chat.feedback='Stopped.'}
    else{t.error=messageForError(e);t.done=true;console.warn('Milo inference failed:',e?.name||'Error',String(e?.message||e).slice(0,350))}
  }finally{
    session?.destroy();
    t.done=true;
    if(chat.task===task){chat.task=null;chat.stage='';chat.percent=null;transcript();status()}
  }
}
export function mountMiloChat(el,info,books){
  mount=el;context={info,books};
  // Pre-load the passage index so the first question doesn't wait for it.
  findPassages('',books,{limit:0}).catch(()=>{});
  paint();
  if(!chat.checked&&!chat.checking){
    chat.checking=true;
    nativeAvailability().then(availability=>{
      chat.native=availability;chat.checked=true;chat.checking=false;
      if(!chat.manual&&!chat.task&&!chat.turns.length&&!chat.apiKey&&availability==='available')chat.model='native';
      if(mount?.isConnected&&!chat.task&&document.activeElement!==mount.querySelector('#milo-question'))paint();
    });
  }
}
export function detachMiloChat(){mount=null}
window.addEventListener('pagehide',e=>{if(!e.persisted){chat.task?.controller.abort();void releaseModel()}});
