import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {formatAnswer,renderAnswer,copyableAnswer} from '../dist/milo-markdown.js';
import {indexPassages,rankPassages,boundedHistory,promptMessages} from '../dist/milo-context.js';
import {modules} from '../dist/modules.js';

const refs=[{label:'Vol. 06 · Procurement and suppliers · p. 23',url:'/playbooks/ai-government-procurement-supplier-playbook.pdf#page=23'}];
test('answers have a heading and preserve structured Markdown',()=>{
  assert.equal(formatAnswer('Tokyo is in Japan.'),'## Answer\n\nTokyo is in Japan.');
  const md='## Recommendation\n\n**Rehearse** the exit. [S1]\n\n### Test\n\n1. Export records.\n2. Import them.\n\n| Check | Owner |\n|---|---|\n| Import | Officer |';
  const html=renderAnswer(md,refs);
  for(const element of ['h3','h4','ol','table','strong'])assert(html.includes('<'+element+'>'));
  assert(html.includes('href="'+refs[0].url+'"'));
  assert.equal(formatAnswer('```markdown\n'+md+'\n```'),md);
  assert(copyableAnswer(md,refs,'https://example.org').includes('https://example.org/playbooks/'));
});
test('model text cannot inject HTML, execute link schemes or load remote pictures',()=>{
  const html=renderAnswer('## Test\n\n<img src=x onerror=alert(1)> [bad](javascript:alert(1)) ![picture](https://example.org/t.png) [S8]\n\n```html\n<script>hi</script>\n```',refs);
  assert(!/<(?:script|img|iframe)\b/i.test(html));assert(!/href="javascript:/i.test(html));
  assert(!/class="milo-ref"/.test(html));assert(html.includes('&lt;script&gt;'));
});
test('the ten-book index retrieves page-specific supplier exit evidence',()=>{
  const data=JSON.parse(readFileSync(new URL('../dist/passages.json',import.meta.url),'utf8'));
  const index=indexPassages(data,modules);
  const ranked=rankPassages(index,'How should a city test a supplier exit plan?',{strict:true,limit:2});
  assert.equal(ranked[0].id,'procurement-supplier');assert.equal(ranked[0].page,23);
  const [returned]=rankPassages(index,'What does the procurement playbook say to do with returned supplier data? Give one concrete test in one sentence.');
  assert.equal(returned.page,23);
  assert.match(returned.body,/Sample the returned data/);
  assert.equal(returned.excerpt,returned.body);
  assert(ranked.every(r=>r.body&&r.url.endsWith('#page='+r.page)));
});
test('model context keeps only recent completed turns and distinguishes sources from the question',()=>{
  const turns=Array.from({length:6},(_,i)=>({question:'Question '+i,answer:'Answer '+i+' [S1]'}));
  turns[5].stopped=true;const h=boundedHistory(turns);assert.equal(h.length,6);assert.equal(h[0].content,'Question 2');assert(!h.at(-1).content.includes('[S1]'));
  const messages=promptMessages({scope:'playbooks',history:h,sources:[{...refs[0],heading:'Exit',body:'Verify the returned data.'}],context:'Current volume 6',question:'How should we test exit?'});
  assert.equal(messages[0].role,'system');assert.equal(messages.at(-1).role,'user');assert(messages.at(-1).content.includes('[S1]'));assert(messages.at(-1).content.endsWith('How should we test exit?'));
});
