import {nycFloodHour} from './data/nyc311-flood-hour.js';

export const archive=nycFloodHour;
export const selectedAreas=['BROOKLYN','QUEENS','STATEN ISLAND'];
export const areaNames=['Brooklyn','Queens','Staten Island'];
export const mapNames=['Riverside','Market Ward','Civic Quarter'];
export const nycProfile={
  id:'nyc311',key:'nyc311-'+archive.sha256,label:'NYC311 flood requests',startLocal:'2023-09-29T08:00',timeZone:'America/New_York',
  desks:selectedAreas.map((name,i)=>({name:areaNames[i],opening:0,openingAssisted:0,arrivals:archive.boroughs[name]}))
};
export const shiftColumns=['desk','minute','arrivals','assisted_arrivals','handled','teams','opening_queue','opening_assisted'];
export const studyColumns=['desk','routine_cases','routine_busy_team_minutes','assisted_cases','assisted_busy_team_minutes'];
const requireValue=(ok,msg)=>{if(!ok)throw Error(msg)};
function parseCsv(input,columns,file){
  const text=String(input).replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trim();
  requireValue(text.length>0&&text.length<300000,file+' must contain a CSV smaller than 300 KB.');
  const rows=[];let row=[],cell='',quoted=false,endQuote=false;
  for(let i=0;i<=text.length;i++){
    const ch=i===text.length?'\n':text[i];
    if(quoted){
      if(ch==='"'&&text[i+1]==='"'){cell+='"';i++}
      else if(ch==='"'){quoted=false;endQuote=true}
      else cell+=ch;
    }else if(ch===','||ch==='\n'){
      row.push(cell.trim());cell='';endQuote=false;
      if(ch==='\n'){if(row.some(Boolean))rows.push(row);row=[]}
    }else if(ch==='"'&&!cell&&!endQuote)quoted=true;
    else {requireValue(!endQuote&&ch!=='"',file+' has an invalid quoted field.');cell+=ch}
  }
  requireValue(!quoted,file+' has an unclosed quoted field.');
  const header=rows.shift()||[];
  requireValue(header.length===columns.length&&columns.every(k=>header.includes(k)),file+' requires exactly these columns: '+columns.join(', ')+'.');
  return rows.map((r,i)=>{
    requireValue(r.length===header.length,file+' row '+(i+2)+' has the wrong number of columns.');
    return Object.fromEntries(header.map((k,j)=>[k,r[j]]));
  });
}
function numberField(row,key,loc,{min=0,max=1000000,integer=true}={}){
  const value=row[key],n=Number(value);
  requireValue(/^\d+(\.\d+)?$/.test(value)&&Number.isFinite(n)&&n>=min&&n<=max&&(!integer||Number.isInteger(n)),loc+' has an invalid '+key+'.');
  return n;
}
function localMinute(value){
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))return false;
  const d=new Date(value+':00Z');return !Number.isNaN(d.valueOf())&&d.toISOString().slice(0,16)===value;
}

export function readAgencyProfile(shiftText,studyText,meta){
  const label=String(meta.label||'').trim(), studyReference=String(meta.studyReference||'').trim(), timeZone=String(meta.timeZone||'').trim();
  requireValue(label.length>=3&&label.length<=100,'Give the shift a source or record reference (3–100 characters).');
  requireValue(studyReference.length>=3&&studyReference.length<=100,'Give the earlier handling study a source or record reference (3–100 characters).');
  requireValue(localMinute(meta.startLocal)&&localMinute(meta.referenceEnd),'Enter valid local dates and times for the shift start and earlier rate study.');
  requireValue(meta.referenceEnd<meta.startLocal,'The handling study must end before the observed shift begins.');
  requireValue(timeZone.length>0,'Enter the shift’s IANA time zone.');
  try{new Intl.DateTimeFormat('en',{timeZone})}catch{throw Error('Use an IANA time zone, for example America/New_York.')}
  const study=parseCsv(studyText,studyColumns,'Handling study');
  const shift=parseCsv(shiftText,shiftColumns,'Shift log');
  requireValue(study.length===3,'The handling study needs exactly three desks, one row per desk.');
  requireValue(shift.length===180,'The shift log needs 180 rows: minutes 0–59 for each of the three desks.');
  const desks=study.map((r,i)=>{
    const loc='Study row '+(i+2), name=r.desk;
    requireValue(name&&name.length<=60,loc+' needs a desk name of up to 60 characters.');
    const routineCount=numberField(r,'routine_cases',loc,{min:1}),assistedCount=numberField(r,'assisted_cases',loc,{min:1});
    const routineBusy=numberField(r,'routine_busy_team_minutes',loc,{min:.01,integer:false,max:100000000});
    const assistedBusy=numberField(r,'assisted_busy_team_minutes',loc,{min:.01,integer:false,max:100000000});
    const routineMinutes=routineBusy/routineCount,assistedMinutes=assistedBusy/assistedCount;
    requireValue(routineMinutes>=.05&&assistedMinutes>=.05,loc+' averages under three seconds per handoff. Check the units.');
    return {name,routineCount,assistedCount,routineBusy,assistedBusy,routineMinutes,assistedMinutes,
      arrivals:[],assisted:[],handled:[],teams:[],opening:0,openingAssisted:0};
  });
  const byName=new Map(desks.map(d=>[d.name,d]));
  requireValue(byName.size===3,'Desk names must be distinct.');
  for(const [i,r] of shift.entries()){
    const loc='Shift row '+(i+2),d=byName.get(r.desk);
    requireValue(d,loc+' names a desk missing from the handling study.');
    const minute=numberField(r,'minute',loc,{max:59});
    requireValue(d.arrivals[minute]===undefined,loc+' repeats a desk and minute.');
    d.arrivals[minute]=numberField(r,'arrivals',loc,{max:2000});
    d.assisted[minute]=numberField(r,'assisted_arrivals',loc,{max:d.arrivals[minute]});
    d.handled[minute]=numberField(r,'handled',loc,{max:20000});
    d.teams[minute]=numberField(r,'teams',loc,{max:300});
    if(minute===0){
      d.opening=numberField(r,'opening_queue',loc,{max:10000});
      d.openingAssisted=numberField(r,'opening_assisted',loc,{max:d.opening});
    }else requireValue(!r.opening_queue&&!r.opening_assisted,loc+' should leave opening counts blank after minute 0.');
  }
  let total=0;
  for(const d of desks){
    let open=d.opening;total+=open;
    for(let t=0;t<60;t++){
      requireValue(d.arrivals[t]!==undefined,d.name+' is missing minute '+t+'.');
      open+=d.arrivals[t]-d.handled[t];total+=d.arrivals[t];
      requireValue(open>=0,d.name+' has more handoffs than available reports at minute '+t+'.');
      requireValue(!d.handled[t]||d.teams[t]>0,d.name+' reports a handoff at minute '+t+' with zero staffed teams.');
    }
  }
  requireValue(total<=20000,'This interactive model supports up to 20,000 reports per hour, including the opening queue.');
  const example=desks.every((d,i)=>d.name===['Example A','Example B','Example C'][i]);
  return {id:example?'example':'agency',label,startLocal:meta.startLocal,timeZone,referenceEnd:meta.referenceEnd,studyReference,desks};
}

export function sampleFiles(){
  const study=[studyColumns.join(',')],shift=[shiftColumns.join(',')];
  for(let i=0;i<3;i++){
    const name='Example '+String.fromCharCode(65+i);
    study.push([name,40,60+i*4,20,48+i*2].join(','));
    let available=2;
    for(let minute=0;minute<60;minute++){
      const arrivals=(minute+i)%6===0?3:1;
      const assisted=minute%4===i?1:0;
      const teams=minute>=30&&i===1?3:2;
      const handled=Math.min(available+arrivals,minute%5===1?2:1);
      available+=arrivals-handled;
      shift.push([name,minute,arrivals,assisted,handled,teams,minute===0?2:'',minute===0?1:''].join(','));
    }
  }
  return {shift:shift.join('\n'),study:study.join('\n')};
}
export function sourceDescription(profile){
  if(!profile)return 'Synthetic Northbridge arrivals, roster and handling assumptions.';
  if(profile.id==='nyc311')return 'Observed arrivals: '+archive.selectedDistinct+' NYC311 requests, 29 September 2023, 08:00–09:00 EDT. Brooklyn maps to Riverside, Queens to Market Ward and Staten Island to Civic Quarter. Zero carry-in, six teams, service rates, access needs, travel and officer decisions are exercise assumptions. The weather setting changes the modeled storm and travel, while recorded demand stays fixed. Three Manhattan requests and one Bronx request are outside the replay.';
  const kind=profile.id==='example'?'Synthetic example':'User-supplied aggregate records';
  return kind+' · '+profile.label+' · source hour starting '+profile.startLocal+' ('+profile.timeZone+'). Filing counts, opening queues and roster assignments use the shift log. Handling rates use the separate study ending '+profile.referenceEnd+' ('+profile.studyReference+'). Opening work is aged from zero at the exercise start. The Northbridge clock starts at 08:00 for all exercises. Geography, travel, within-minute ordering, report flags other than assisted contact, and officer interventions are modeled.';
}
