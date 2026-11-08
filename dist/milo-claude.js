const STORAGE_KEY='civic-atlas-claude-key';
export function loadApiKey(){try{return localStorage.getItem(STORAGE_KEY)||''}catch{return ''}}
export function saveApiKey(key){try{if(key)localStorage.setItem(STORAGE_KEY,key);else localStorage.removeItem(STORAGE_KEY)}catch{}}

export async function generateClaude(apiKey,messages,signal,onText){
  if(!apiKey)throw new Error('Enter your Claude API key in Model settings.');
  const system=messages.find(m=>m.role==='system')?.content||'';
  const chat=messages.filter(m=>m.role!=='system');
  const res=await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',signal,
    headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:'claude-sonnet-4-6-latest',max_tokens:4096,temperature:0.3,system,messages:chat,stream:true})
  });
  if(!res.ok){
    const body=await res.json().catch(()=>null);
    const msg=body?.error?.message||'Claude API returned '+res.status;
    throw new Error(res.status===401?'Invalid API key. Check Model settings.':msg);
  }
  const reader=res.body.getReader();
  const decoder=new TextDecoder();
  let text='',buffer='',limited=false;
  while(true){
    const {done,value}=await reader.read();
    if(done)break;
    signal.throwIfAborted();
    buffer+=decoder.decode(value,{stream:true});
    const lines=buffer.split('\n');
    buffer=lines.pop()||'';
    for(const line of lines){
      if(!line.startsWith('data: '))continue;
      const raw=line.slice(6).trim();
      if(!raw)continue;
      try{
        const ev=JSON.parse(raw);
        if(ev.type==='content_block_delta'&&ev.delta?.type==='text_delta'){text+=ev.delta.text;onText(text)}
        if(ev.type==='message_delta'&&ev.delta?.stop_reason==='max_tokens')limited=true;
        if(ev.type==='error')throw new Error(ev.error?.message||'Stream error');
      }catch(e){if(e.message==='Stream error')throw e}
    }
  }
  return {text,limited};
}
