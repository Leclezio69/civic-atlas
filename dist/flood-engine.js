// A deterministic training model. The unit of demand is one resident report.
// Store operator instructions rather than snapshots so earlier minutes can be replayed exactly.
export const districts=[
  {id:'riverside',name:'Riverside',station:'West Bridge desk',brief:'Low-lying approaches generate the earliest surge. This desk loses its mapping feed during the exercise.',base:.58,peak:1.75,start:18,spread:10,assisted:.23,initial:3},
  {id:'market',name:'Market Ward',station:'Municipal service centre',brief:'The service centre handles the largest share of assisted-contact reports. Demand peaks during the middle of the hour.',base:.65,peak:1.5,start:32,spread:12,assisted:.52,initial:3},
  {id:'civic',name:'Civic Quarter',station:'City Hall public desk',brief:'Council enquiries and calls about public updates increase late in the exercise. This desk prepares the signed public message.',base:.47,peak:1.28,start:47,spread:9,assisted:.20,initial:2}
];
export const weathers=['Steady rain','Cloudburst'];
export const gates=[
  {id:'intake',minute:12,title:'Language and intake capacity',source:'Contact-centre duty supervisor',evidence:'The contact centre confirms rising demand for assisted contact. The opening weather bulletin offers no evidence about who can use the standard queue.',page:10,
    options:[
      {id:'desk',title:'Open a shared interpreter desk',body:'A staffed Market desk spends one work unit per minute on coordination. While staffed, assisted reports cost three units citywide.'},
      {id:'local',title:'Prioritise local callbacks',body:'Keep all units at their desks. Each district serves assisted reports waiting six minutes first. Their handling cost stays at five units.'}]},
  {id:'outage',minute:28,title:'The Riverside map feed is stale',source:'Mapping desk and field liaison',evidence:'A heartbeat still appears on the dashboard. The field liaison confirms that no new Riverside positions arrived after 08:28. Market and Civic feeds are current.',page:25,
    options:[
      {id:'verify',title:'Cross-check before filing',body:'Add two work units to each location-sensitive Riverside report during the outage. The file includes its verification at handoff.'},
      {id:'provisional',title:'File provisional locations',body:'Keep the normal handling cost and flag each affected record for a later check. After restoration, reconciliation consumes staff capacity.'}]},
  {id:'message',minute:44,title:'Approve the public update',source:'Public information duty officer',evidence:'Reports still arrive about access and closures. The duty officer can authorise one message package and must retain the approval record.',page:18,
    options:[
      {id:'accessible',title:'Issue a localised accessible briefing',body:'Commit four Civic work units, up to two per minute. After preparation, each assisted report takes one fewer unit.'},
      {id:'holding',title:'Issue a verified holding bulletin',body:'Commit one Civic work unit. After preparation, routine information enquiries take one fewer unit. Assisted reports still need individual support.'}]}
];
export const districtBy=id=>districts.find(d=>d.id===id);
export const formatTime=m=>String(8+Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
export const freshFloodRun=()=>({version:2,minute:0,weather:'Steady rain',moves:[],orders:{},finished:false});
export const nextGate=run=>gates.find(g=>run.minute>=g.minute&&!run.orders[g.id]);
export const nextBoundary=run=>gates.find(g=>g.minute>run.minute)?.minute??60;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const sum=(items,key)=>items.reduce((n,o)=>n+o[key],0);
const percent=(num,den)=>den?Math.round(100*num/den):null;
function seeded(serial,salt){
  let value=Math.imul(serial+salt,2654435761)>>>0;
  value=Math.imul(value^(value>>>15),2246822519)>>>0;
  return ((value^(value>>>13))>>>0)/4294967296;
}
function intensity(spec,t,heavy){
  const peak=Math.exp(-.5*((t-spec.start)/spec.spread)**2);
  return spec.base+(heavy?1.48:.88)*spec.peak*peak;
}
function floodAt(i,t,heavy){
  const rise=clamp((t-i*3)/42,0,1);
  const crest=rise*rise*(3-2*rise);
  return clamp(.08+crest*(heavy?.92:.70)*[1,.82,.65][i]-.08*clamp((t-49)/11,0,1),0,1);
}
function transferDuration(from,to,minute,weather){
  const ids=[from,to];
  const base=ids.includes('riverside')?(ids.includes('civic')?5:4):3;
  const high=floodAt(0,minute,weather==='Cloudburst')>.6;
  return base+(ids.includes('riverside')&&high?2:0);
}
export function travelMinutes(run,from,to){return transferDuration(from,to,run.minute,run.weather)}
function newDesk(spec,index,profile){
  const input=profile?.desks[index];
  const desk={spec,index,input,teams:input?.teams?.[0]??2,carry:0,fraction:.15+index*.23,queue:[],received:0,handled:0,onTime:0,
    waitTotal:0,provisional:0,reconciled:0,assistedHandled:0,peak:0};
  const opening=input?.opening??spec.initial;
  for(let k=0;k<opening;k++)addReport(desk,0,input?spreadFlag(k,input.openingAssisted,opening):null);
  return desk;
}
// With aggregate counts only, distribute assisted reports deterministically within the bin.
function spreadFlag(index,count,total){
  if(!total||count==null)return null;
  return Math.floor((index+1)*count/total)>Math.floor(index*count/total);
}
function addReport(d,t,assisted=null){
  const serial=d.received++;
  const salt=710*(d.index+1);
  d.queue.push({at:t,assisted:assisted??(seeded(serial,salt)<d.spec.assisted),location:seeded(serial,salt+3)<.68,info:seeded(serial,salt+7)<.61});
}
function operate(d,t,orders,sharedDeskStaffed,bulletin,prepUnits){
  if(!d.teams){d.carry=0;return}
  let intake=t>12?orders.intake:null;
  if(intake==='desk'&&!sharedDeskStaffed)intake=null;
  const outage=t>28?orders.outage:null;
  let work=d.teams*2+d.carry;
  if(intake==='desk'&&d.spec.id==='market')work--;
  if(d.spec.id==='civic')work-=prepUnits;
  work=Math.max(0,work);
  // One audit slot every third minute after telemetry returns, before new filing work.
  if(t>=41&&t%3===2&&d.provisional>d.reconciled&&work>=2){work-=2;d.reconciled++}
  while(d.queue.length&&work>0){
    let i=0;
    if(intake==='local'){
      const urgent=d.queue.findIndex(r=>r.assisted&&t-r.at>=6);
      if(urgent>=0)i=urgent;
    }
    const r=d.queue[i];
    const routineCost=2*(d.input?.routineMinutes??1.5),assistedCost=2*(d.input?.assistedMinutes??2.5);
    let cost=r.assisted?assistedCost*(intake==='desk'?.6:1):routineCost;
    const stale=d.spec.id==='riverside'&&t>28&&t<41&&r.location;
    if(stale&&outage==='verify')cost+=2;
    if(bulletin==='accessible'&&r.assisted)cost--;
    if(bulletin==='holding'&&!r.assisted&&r.info)cost--;
    cost=Math.max(.1,cost);
    if(work+1e-9<cost)break;
    work-=cost;d.queue.splice(i,1);d.handled++;
    const wait=t-r.at;d.waitTotal+=wait;
    if(wait<=10)d.onTime++;
    if(r.assisted)d.assistedHandled++;
    if(stale&&outage==='provisional')d.provisional++;
  }
  // Partial handling work can continue next minute. Idle capacity cannot be banked.
  d.carry=d.queue.length?work:0;
}
function districtFrame(d,transit,t,heavy){
  const open=d.queue.length, pending=d.provisional-d.reconciled;
  return {id:d.spec.id,name:d.spec.name,teams:d.teams,transit:transit.filter(x=>x.to===d.spec.id).length,
    queue:open,received:d.received,handled:d.handled,oldest:open?t-Math.min(...d.queue.map(q=>q.at)):0,
    assisted:d.queue.filter(q=>q.assisted).length,assistedHandled:d.assistedHandled,onTime:d.onTime,
    waitTotal:d.waitTotal,verified:d.handled-pending,unverified:pending,reconciled:d.reconciled,peak:d.peak,
    flood:floodAt(d.index,t,heavy)};
}
export function replayFlood(run,until=run.minute){
  const heavy=run.weather==='Cloudburst';
  const desks=districts.map((d,i)=>newDesk(d,i,run.profile));
  const frames=[],staff=new Map();
  let prepared=0,readyAt=null;
  // A physical team has a home roster slot during the shift, including while travelling.
  // Withdraw the highest-numbered home slots first when recorded staffing falls.
  function syncRoster(t){
    for(const d of desks){
      const count=d.input?.teams?.[Math.min(t,59)]??2;
      for(const [key,unit] of staff){
        if(unit.home===d.spec.id&&unit.slot>=count)staff.delete(key);
      }
      for(let slot=0;slot<count;slot++){
        const key=d.spec.id+'/'+slot;
        if(!staff.has(key))staff.set(key,{home:d.spec.id,slot,atDesk:d.spec.id,trip:null});
      }
    }
  }
  for(let t=0;t<=clamp(until,0,60);t++){
    if(t){
      const signed=t>44?run.orders.message:null;
      const required=signed==='accessible'?4:signed==='holding'?1:0;
      const bulletin=required&&prepared===required?signed:null;
      const prep=Math.max(0,Math.min(2,required-prepared,desks[2].teams*2));
      for(const desk of desks){
        if(desk.input){
          const count=desk.input.arrivals[t-1], assisted=desk.input.assisted?.[t-1];
          for(let k=0;k<count;k++)addReport(desk,t-1,spreadFlag(k,assisted,count));
        }else{
          desk.fraction+=intensity(desk.spec,t,heavy);
          while(desk.fraction>=1){addReport(desk,t);desk.fraction--}
        }
        operate(desk,t,run.orders,desks[1].teams>0,bulletin,prep);
      }
      prepared+=prep;
      if(required&&prepared===required&&readyAt===null)readyAt=t;
      for(const unit of staff.values()){
        if(unit.trip?.eta===t){unit.atDesk=unit.trip.to;unit.trip=null}
      }
    }
    syncRoster(t);
    for(const move of run.moves.filter(x=>x.at===t)){
      const unit=[...staff.values()].find(u=>u.atDesk===move.from);
      if(!unit||move.from===move.to||!districtBy(move.to))continue;
      unit.atDesk=null;
      unit.trip={...move,eta:t+transferDuration(move.from,move.to,t,run.weather)};
    }
    const units=[...staff.values()],moving=units.filter(u=>u.trip).map(u=>({...u.trip}));
    for(const d of desks){
      d.teams=units.filter(u=>u.atDesk===d.spec.id).length;
      d.peak=Math.max(d.peak,d.queue.length);
    }
    const areas=desks.map(d=>districtFrame(d,moving,t,heavy));
    const handled=sum(areas,'handled'),verified=sum(areas,'verified'),onTime=sum(areas,'onTime');
    frames.push({minute:t,districts:areas,bulletin:{ordered:t>=44?run.orders.message||null:null,prepared,readyAt},transit:moving,queue:sum(areas,'queue'),received:sum(areas,'received'),
      handled,verified,onTime,within:percent(onTime,handled),verifiedPct:percent(verified,handled),unverified:sum(areas,'unverified'),
      assisted:sum(areas,'assisted'),assistedHandled:sum(areas,'assistedHandled'),oldest:Math.max(...areas.map(d=>d.oldest))});
  }
  return frames;
}
export function canTransfer(run,frame,from,to){
  return !run.finished&&run.minute<60&&from!==to&&!!districtBy(to)&&!!frame.districts.find(d=>d.id===from&&d.teams>0);
}
export function transferTeam(run,from,to){
  const frame=replayFlood(run).at(-1);
  if(!canTransfer(run,frame,from,to))return false;
  run.moves.push({at:run.minute,from,to});return true;
}
export function issueOrder(run,id,option){
  const gate=nextGate(run);
  if(!gate||gate.id!==id||!gate.options.some(o=>o.id===option))return false;
  run.orders[id]=option;return true;
}
export function advanceFlood(run,minutes=1){
  if(run.finished||nextGate(run)||!Number.isFinite(minutes)||minutes<=0)return false;
  run.minute=Math.min(nextBoundary(run),60,run.minute+Math.floor(minutes));
  run.finished=run.minute===60;return true;
}
export const alternatives=[
  {id:'staff',label:'Keep two teams at each desk'},
  {id:'intake',label:'Change only the intake decision'},
  {id:'outage',label:'Change only the outage decision'},
  {id:'message',label:'Change only the public update'}
];
export function compareRun(run,alternative){
  const alt={...run,orders:{...run.orders},moves:alternative==='staff'?[]:run.moves};
  const gate=gates.find(g=>g.id===alternative);
  if(gate&&run.orders[gate.id])alt.orders[gate.id]=gate.options.find(o=>o.id!==run.orders[gate.id]).id;
  return replayFlood(alt,run.minute);
}
export function orderDetail(run,gate,option){
  if(run.profile?.desks[0]?.routineMinutes&&gate.id==='intake'){
    if(option.id==='desk')return 'A staffed Market desk spends one work unit per minute on coordination. While staffed, assisted reports use 60% of each desk’s imported assisted handling time.';
    return 'Keep all units at their desks. Prioritise assisted reports waiting six minutes. Each desk retains its imported assisted handling time.';
  }
  return option.body;
}
export function decisionLog(run){
  const opening=run.profile?run.profile.desks.map((d,i)=>districts[i].name+' '+(d.teams?.[0]??2)).join(', '):'two teams at each of the three desks';
  const entries=[{at:0,text:'Opened '+(run.profile?.label||run.weather)+' with '+opening+'.'}];
  for(const g of gates){
    const chosen=g.options.find(o=>o.id===run.orders[g.id]);
    if(chosen&&run.minute>=g.minute){
      const detail=orderDetail(run,g,chosen);
      entries.push({at:g.minute,text:chosen.title+'. '+detail});
    }
  }
  for(const m of run.moves){
    if(m.at>run.minute)continue;
    entries.push({at:m.at,text:'Moved one team from '+districtBy(m.from).name+' to '+districtBy(m.to).name+'; due '+formatTime(m.at+transferDuration(m.from,m.to,m.at,run.weather))+'.'});
  }
  return entries.sort((a,b)=>a.at-b.at);
}
export function debrief(run,frames=replayFlood(run)){
  const end=frames.at(-1),peak=frames.reduce((a,b)=>b.queue>a.queue?b:a),area=end.districts.reduce((a,b)=>b.queue>a.queue?b:a);
  const summary=(run.profile?.label||run.weather)+' · exercise 08:00–09:00. '+end.received+' reports received, '+end.handled+' handled and '+end.queue+' open at handover. '+end.unverified+' handled records still need location verification.';
  return {summary,log:[...decisionLog(run).map(e=>formatTime(e.at)+' · '+e.text),'09:00 · Peak city backlog was '+peak.queue+' at '+formatTime(peak.minute)+'. '+area.name+' closed with '+area.queue+' open.'],
    modelVersion:2,final:end,scenario:run.weather};
}
