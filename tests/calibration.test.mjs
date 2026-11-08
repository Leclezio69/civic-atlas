import test from 'node:test';
import assert from 'node:assert/strict';
import {archive, nycProfile, sampleFiles, readAgencyProfile,sourceDescription} from '../dist/agency-data.js';
import {exampleProfile, validateShift} from '../dist/calibration.js';
import {freshFloodRun, replayFlood,compareRun,transferTeam,issueOrder,advanceFlood,gates} from '../dist/flood-engine.js';
const meta={label:'QA shift extract',studyReference:'QA prior rate sample',startLocal:'2026-06-01T08:00',timeZone:'America/New_York',referenceEnd:'2026-05-31T08:00'};
const sum=xs=>xs.reduce((a,b)=>a+b,0);
const getRun=profile=>({...freshFloodRun(),profile,minute:60,weather:'Cloudburst'});
test('official counts reproduce all 60 observed bins for each borough regardless of weather or decisions',()=>{
  assert.deepEqual(nycProfile.desks.map(d=>sum(d.arrivals)),[183,42,7]);
  assert.equal(archive.citywideDistinct,236);assert.equal(archive.selectedDistinct,232);
  assert.equal(sum(Object.values(archive.boroughs).flat()),236);
  const run=getRun(nycProfile),fs=replayFlood(run),alt=compareRun({...run,weather:'Steady rain',orders:{intake:'desk',outage:'verify',message:'holding'}},'intake');
  assert.equal(fs[0].received,0);
  for(let t=0;t<60;t++)for(let i=0;i<3;i++){
    assert.equal(fs[t+1].districts[i].received-fs[t].districts[i].received,nycProfile.desks[i].arrivals[t]);
    assert.equal(fs[t+1].districts[i].received,alt[t+1].districts[i].received);
  }
  assert.equal(fs[60].received,232);assert.equal(fs[60].handled+fs[60].queue,232);
  assert.match(sourceDescription(nycProfile),/232/);
});
test('prior rate study and observed roster drive baseline predictions independently of held-out handoffs',()=>{
  const p=exampleProfile(),v=validateShift(p);
  assert.equal(p.desks[0].routineMinutes,1.5);
  const changed=structuredClone(p);
  for(const d of changed.desks)d.handled=d.handled.map(()=>0);
  const altered=validateShift(changed);
  assert.equal(v.modeled,altered.modeled);assert.notEqual(v.actual,altered.actual);assert.notEqual(v.mae,altered.mae);
  const slower=structuredClone(p);slower.desks.forEach(d=>{d.routineMinutes*=2;d.assistedMinutes*=2});
  assert(validateShift(slower).modeled<v.modeled);
  assert.equal(replayFlood(getRun(p))[30].districts[1].teams,3);
});
test('a measured roster reduction cannot leave a withdrawn home team working or travelling',()=>{
  const p=exampleProfile();
  p.desks[2].teams.fill(0,2);
  const r={...freshFloodRun(),profile:p};
  transferTeam(r,'civic','riverside');transferTeam(r,'civic','market');advanceFlood(r,6);
  const fs=replayFlood(r);assert.equal(fs[1].transit.length,2);assert.equal(fs[2].transit.length,0);
  for(const f of fs)assert.equal(f.districts.reduce((s,d)=>s+d.teams,0)+f.transit.length,sum(p.desks.map(d=>d.teams[f.minute])));
});
test('malformed, mismatched and overlapping evidence leaves no accepted profile',()=>{
  const {shift,study}=sampleFiles();
  assert.throws(()=>readAgencyProfile(shift,study,{...meta,referenceEnd:meta.startLocal}),/before/);
  assert.throws(()=>readAgencyProfile(shift,study,{...meta,timeZone:'missing/zone'}),/time zone/);
  assert.throws(()=>readAgencyProfile(shift.split('\n').slice(0,-1).join('\n'),study,meta),/180/);
  const duplicate=shift.split('\n');duplicate[2]=duplicate[1];assert.throws(()=>readAgencyProfile(duplicate.join('\n'),study,meta),/repeats/);
  assert.throws(()=>readAgencyProfile(shift.replace('Example A,0,3,1,1,2,2,1','Example A,0,3,1,8,2,2,1'),study,meta),/more handoffs/);
  assert.throws(()=>readAgencyProfile(shift,study.replace('40,60,20','0,60,20'),meta),/routine_cases/);
});
test('an agency hour and a training run persist as separate immutable evidence inputs',()=>{
  const files=sampleFiles(),p=readAgencyProfile(files.shift.replaceAll('Example A','Desk 01'),files.study.replaceAll('Example A','Desk 01'),meta);
  assert.equal(p.id,'agency');
  const run={...freshFloodRun(),profile:p};
  for(const g of gates){advanceFlood(run,60);issueOrder(run,g.id,g.options[0].id)}
  advanceFlood(run,60);const f=replayFlood(run).at(-1);
  assert.equal(f.received,sum(p.desks.map(d=>d.opening+sum(d.arrivals))));
  assert.deepEqual(replayFlood(JSON.parse(JSON.stringify(run))).at(-1),f);
  assert.equal(replayFlood(freshFloodRun())[0].received,8);
});
test('citywide Isaias staffing sensitivity uses the published 210-minute window',async()=>{
  const {requiredStaff}=await import('../dist/calibration.js');
  assert.equal(requiredStaff(70,3,85),530);
  assert.equal(requiredStaff(70,4,85),706);
  assert.equal(requiredStaff(0,3,85),null);
  assert.equal(requiredStaff(70,3,0),null);
});
