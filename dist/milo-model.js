import {systemInstruction} from './milo-context.js';

export const modelFile={
  name:'Qwen2.5-0.5B-Instruct',size:491400032,
  url:'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/9217f5db79a29953eb74d5343926648285ec7e67/qwen2.5-0.5b-instruct-q4_k_m.gguf'
};
const languageOptions={expectedInputs:[{type:'text',languages:['en']}],expectedOutputs:[{type:'text',languages:['en']}]};
let runner=null;
export function compactReady(){return !!runner}
export async function nativeAvailability(){
  try{
    const api=globalThis.LanguageModel;
    if(!api?.create||!api.availability)return 'unavailable';
    return await api.availability(languageOptions);
  }catch{return 'unavailable'}
}
// Start native creation on the send click. Await retrieval after the browser sees user activation.
export function startNative(history,signal,progress){
  return globalThis.LanguageModel.create({...languageOptions,signal,
    initialPrompts:[{role:'system',content:systemInstruction},...history],
    monitor(m){m.addEventListener('downloadprogress',e=>progress('Preparing browser model',Math.round(e.loaded*100)))}
  });
}
export async function generateNative(session,message,signal,update){
  try{
    signal.throwIfAborted();
    let answer='';
    const stream=session.promptStreaming(message,{signal});
    for await(const text of stream){
      signal.throwIfAborted();
      answer+=text;
      update(answer);
    }
    return answer;
  }finally{session.destroy()}
}
export async function openCompact(signal,progress,localFile){
  if(runner)return runner;
  if(typeof Worker==='undefined'||typeof WebAssembly==='undefined')throw Error('This browser needs WebAssembly and Web Workers to run the model.');
  if(localFile){
    if(localFile.size!==modelFile.size||await localFile.slice(0,4).text()!=='GGUF')throw Error('Choose the Qwen2.5-0.5B-Instruct Q4_K_M GGUF linked under Model settings (491,400,032 bytes).');
  }
  const {Wllama}=await import('./vendor/wllama/index.js');
  signal.throwIfAborted();
  const base=new URL('./vendor/wllama/',import.meta.url);
  const makeRuntime=()=>{
    const runtime=new Wllama({default:new URL('wllama.wasm',base).href},{allowOffline:true,suppressNativeLog:true,parallelDownloads:1});
    runtime.setCompat({worker:new URL('compat/wllama.js',base).href,wasm:new URL('compat/wllama.wasm',base).href},'firefox_safari');
    return runtime;
  };
  let runtime=makeRuntime();
  // Avoid software WebGPU adapters. The WASM path also works on machines without a GPU.
  const adapter=await navigator.gpu?.requestAdapter({powerPreference:'high-performance'}).catch(()=>null);
  const hardware=adapter&&!adapter.info?.isFallbackAdapter&&!/swiftshader|llvmpipe|software/i.test(adapter.info?.description||'')&&adapter.features.has('shader-f16');
  const config={n_ctx:4096,n_batch:128,n_threads:globalThis.crossOriginIsolated?Math.max(1,Math.min(4,(navigator.hardwareConcurrency||2)-1)):1,n_gpu_layers:hardware?24:0,signal,
    progressCallback:({loaded,total})=>{
      if(signal.aborted)return;
      const pct=Math.min(100,Math.floor(100*loaded/(total||modelFile.size)));
      progress(pct===100?'Starting the model':'Downloading model',pct);
    }};
  async function load(){
    signal.throwIfAborted();
    if(localFile){progress('Opening selected model',null);await runtime.loadModel([localFile],config)}
    else{progress('Checking model download',null);await runtime.loadModelFromUrl(modelFile.url,config)}
  }
  try{
    try{await load()}catch(error){
      if(!config.n_gpu_layers||signal.aborted||!runtime.proxy)throw error;
      await runtime.exit().catch(()=>{});runtime=makeRuntime();config.n_gpu_layers=0;
      progress('Starting the CPU model',null);await load();
    }
    signal.throwIfAborted();
    runner=runtime;
    return runtime;
  }catch(e){await runtime.exit().catch(()=>{});throw e}
}
export async function generateCompact(runtime,messages,signal,onText,onProgress){
  let text='',reason='';
  signal.throwIfAborted();
  await runtime.createChatCompletion({
    messages,stream:true,return_progress:true,cache_prompt:true,max_tokens:320,temperature:.28,top_p:.89,top_k:35,repeat_penalty:1.10,abortSignal:signal,
    onData:chunk=>{
      if(signal.aborted)return;
      const p=chunk?.prompt_progress;
      if(p&&p.total>0)onProgress?.('Reading context',Math.min(100,Math.round(100*(p.processed+p.cache)/p.total)));
      const c=chunk?.choices?.[0];if(!c)return;
      if(c.delta?.content){text+=c.delta.content;onText(text)}
      if(c.finish_reason)reason=c.finish_reason;
    }
  });
  signal.throwIfAborted();
  return {text,limited:reason==='length'};
}
export async function releaseModel(){
  if(!runner)return;
  const previous=runner;runner=null;await previous.exit().catch(()=>{});
}
