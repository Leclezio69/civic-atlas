const key='civic-atlas-fieldbook-v1';
let saved={};
try {
  saved=JSON.parse(localStorage.getItem(key))||{}
} catch{}
export const state={answers:{},notes:{},completed:{},gates:{},capNote:'',run:null,lastRun:null,lastVolume:'strategy',...saved};
export function persist(){
  try {
    localStorage.setItem(key,JSON.stringify(state));
    return true
  } catch{
    return false
  }
}
export const hasEvidence=id=>!!state.notes[id]?.trim();
export function downloadFile(name,body,mime='text/markdown;charset=utf-8'){
  const url=URL.createObjectURL(new Blob([body],{type:mime}));
  const a=document.createElement('a');
  a.href=url;
  a.download=name;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1500)
}
