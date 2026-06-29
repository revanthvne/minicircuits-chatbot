const fs = require('fs');
const DBP = '/sessions/inspiring-peaceful-brown/mnt/mini-circuits_chat_bot/db/products_full.json';
const ENR = '/sessions/inspiring-peaceful-brown/mnt/outputs/enrich2.ndjson';
const db = require(DBP);

const enriched = {};
for (const l of fs.readFileSync(ENR, 'utf8').split('\n')) { const t=l.trim(); if(!t)continue; try{ const o=JSON.parse(t); if(o.ok) enriched[o.pn]=o; }catch(e){} }

let freqFilled = 0, catFilled = 0, specFilled = 0;
for (const p of db) {
  const e = enriched[p.pn]; if (!e) continue;
  // only FILL missing fields — never overwrite existing good data
  if (e.flo != null && p.flo == null) { p.flo = e.flo; p.fhi = e.fhi; freqFilled++; }
  if (e.cat && (!p.cat || p.cat === 'uncategorized')) { p.cat = e.cat; catFilled++; }
  if (e.specs && Object.keys(e.specs).length) {
    const before = Object.keys(p.specs || {}).length;
    p.specs = Object.assign({}, p.specs || {}, e.specs);
    if (e.specs.impedance && p.impedance == null) p.impedance = e.specs.impedance;
    if (Object.keys(p.specs).length > before) specFilled++;
  }
}
fs.writeFileSync(DBP, JSON.stringify(db));
console.log('merged. freqFilled=' + freqFilled, 'catFilled=' + catFilled, 'specFilled=' + specFilled);
