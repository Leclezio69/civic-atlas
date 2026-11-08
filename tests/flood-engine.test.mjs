import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceFlood, canTransfer, compareRun, decisionLog, debrief, districts, formatTime,
  freshFloodRun, gates, issueOrder, nextGate, replayFlood, transferTeam, travelMinutes
} from '../dist/flood-engine.js';

function closeShift(run,choices=[0,0,0]){
  gates.forEach((gate,i)=>{
    assert(advanceFlood(run,60));
    assert.equal(run.minute,gate.minute);
    assert.equal(nextGate(run).id,gate.id);
    assert.equal(advanceFlood(run,1),false);
    assert.equal(issueOrder(run,gate.id,'unknown'),false);
    assert(issueOrder(run,gate.id,gate.options[choices[i]].id));
    assert.equal(issueOrder(run,gate.id,gate.options[choices[i]].id),false);
  });
  assert(advanceFlood(run,60));
  assert.equal(run.minute,60);
  assert(run.finished);
  assert.equal(advanceFlood(run,1),false);
  return run;
}

test('each weather and operating order conserves reports and six teams at every minute',()=>{
  for(const weather of ['Steady rain','Cloudburst']){
    for(let mask=0;mask<8;mask++){
      const run=freshFloodRun();
      run.weather=weather;
      assert(transferTeam(run,'market','riverside'));
      closeShift(run,[mask&1,(mask>>1)&1,(mask>>2)&1]);
      for(const f of replayFlood(run)){
        assert.equal(f.received,f.queue+f.handled);
        assert.equal(f.handled,f.verified+f.unverified);
        assert.equal(f.transit.length+f.districts.reduce((s,d)=>s+d.teams,0),6);
        assert(f.onTime<=f.handled);
        for(const d of f.districts){
          assert.equal(d.received,d.handled+d.queue);
          assert(d.teams>=0&&d.assisted<=d.queue&&d.unverified<=d.handled);
        }
      }
    }
  }
});
test('transferring staff respects travel time, intervening workload and available capacity',()=>{
  const run=freshFloodRun();
  const eta=travelMinutes(run,'market','riverside');
  assert(transferTeam(run,'market','riverside'));
  assert(transferTeam(run,'market','riverside'));
  assert.equal(transferTeam(run,'market','riverside'),false);
  assert.equal(transferTeam(run,'civic','civic'),false);
  advanceFlood(run,eta+1);
  const fs=replayFlood(run);
  assert.equal(fs[0].districts[1].teams,0);
  assert.equal(fs[eta-1].districts[0].teams,2);
  assert.equal(fs[eta].districts[0].teams,4);
  assert.equal(fs[eta].transit.length,0);
  assert.equal(fs[eta].districts[1].handled,0);
});
test('orders and movements never alter previous snapshots',()=>{
  const run=freshFloodRun();
  advanceFlood(run,12);
  const before=replayFlood(run);
  issueOrder(run,'intake','local');
  transferTeam(run,'civic','market');
  assert.deepEqual(replayFlood(run,11),before.slice(0,12));
  assert.equal(replayFlood(run)[12].received,before[12].received);
});
test('a controlled replay uses identical arrivals and changes a single independent lever',()=>{
  const run=freshFloodRun();
  run.weather='Cloudburst';
  transferTeam(run,'civic','market');
  closeShift(run,[0,1,0]);
  const original=JSON.stringify(run),frames=replayFlood(run);
  for(const id of ['staff','intake','outage','message']){
    const alt=compareRun(run,id);
    for(let t=0;t<=60;t++){
      assert.deepEqual(alt[t].districts.map(d=>d.received),frames[t].districts.map(d=>d.received));
      if(id!=='staff')assert.deepEqual(alt[t].transit,frames[t].transit);
    }
    const gate=gates.find(g=>g.id===id);
    if(gate){
      assert.deepEqual(alt.slice(0,gate.minute),frames.slice(0,gate.minute));
      assert.deepEqual(alt[gate.minute].districts,frames[gate.minute].districts);
    }
  }
  assert.equal(JSON.stringify(run),original);
  assert.deepEqual(replayFlood(JSON.parse(original)),frames);
  assert(frames.at(-1).unverified>0);
  assert.equal(compareRun(run,'outage').at(-1).unverified,0);
});
test('two equal staffing orders at different times produce different service histories',()=>{
  const early=freshFloodRun(),late=freshFloodRun();
  transferTeam(early,'civic','riverside');
  advanceFlood(late,9);transferTeam(late,'civic','riverside');
  closeShift(early);closeShift(late);
  const a=replayFlood(early),b=replayFlood(late);
  assert.notDeepEqual(a.map(f=>f.queue),b.map(f=>f.queue));
  assert.equal(a.at(-1).received,b.at(-1).received);
  assert(!canTransfer(late,b.at(-1),'market','riverside'));
});
test('handover records late arrivals correctly and names each officer order',()=>{
  const run=freshFloodRun();closeShift(run);run.minute=59;run.finished=false;
  transferTeam(run,'riverside','civic');
  const eta=59+travelMinutes(run,'riverside','civic');
  assert(eta>60);assert(formatTime(eta).startsWith('09:'));
  advanceFlood(run,1);
  assert(decisionLog(run).some(e=>e.text.includes('due '+formatTime(eta))));
  const report=debrief(run);
  assert.equal(report.log.length,6);assert(report.summary.includes('open at handover'));
  assert.equal(districts.length,3);
});

test('an unstaffed desk cannot run shared interpretation or publish a public bulletin',()=>{
  const run=freshFloodRun();
  transferTeam(run,'market','riverside');transferTeam(run,'market','riverside');
  transferTeam(run,'civic','riverside');transferTeam(run,'civic','riverside');
  closeShift(run,[0,0,0]);
  const frames=replayFlood(run);
  assert.equal(frames.at(-1).bulletin.prepared,0);
  assert.equal(frames.at(-1).bulletin.readyAt,null);
  const paused={...run,orders:{...run.orders,intake:null}};
  assert.deepEqual(replayFlood(paused).map(f=>f.handled),frames.map(f=>f.handled));
  const balanced=freshFloodRun();closeShift(balanced);
  assert.equal(replayFlood(balanced)[46].bulletin.readyAt,46);
  assert.equal(replayFlood(balanced)[43].bulletin.ordered,null);
});
