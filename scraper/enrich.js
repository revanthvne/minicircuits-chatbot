// Catalog enrichment: for stub records (no specs), fetch the part's dashboard,
// parse frequency range + category + key specs, append to enrich.ndjson.
// Resumable + time-boxed so it fits the shell cap. Run repeatedly.
const fs = require('fs');
const https = require('https');
const DBP = '/sessions/inspiring-peaceful-brown/mnt/mini-circuits_chat_bot/db/products_full.json';
const OUT = '/sessions/inspiring-peaceful-brown/mnt/outputs/enrich2.ndjson';
const db = require(DBP);

// category breadcrumb word -> our cat code
const CATMAP = { amplifier:'amp', amplifiers:'amp', filter:'flt', filters:'flt', mixer:'mix', mixers:'mix',
  splitter:'spl', splitters:'spl', combiner:'spl', coupler:'cpl', couplers:'cpl', attenuator:'att', attenuators:'att',
  switch:'sw', switches:'sw', transformer:'xfmr', transformers:'xfmr', balun:'xfmr', oscillator:'osc', 'vco':'osc',
  synthesizer:'syn', 'bias tee':'bias', 'bias tees':'bias', 'dc block':'dcb', 'dc blocks':'dcb', terminations:'term',
  termination:'term', limiter:'lim', limiters:'lim', equalizer:'eq', equalizers:'eq', multiplier:'mult', multipliers:'mult',
  'phase shifter':'ps', 'phase shifters':'ps', 'power detector':'pdet', 'power sensor':'psen', adapter:'adapter', adapters:'adapter',
  cable:'cable', cables:'cable', waveguide:'wg', die:'die' };

function getCookie() { return new Promise(r => { https.get({ hostname:'www.minicircuits.com', path:'/', headers:{'User-Agent':'Mozilla/5.0'} }, res => { const c=(res.headers['set-cookie']||[]).map(x=>x.split(';')[0]).join('; '); res.on('data',()=>{}); res.on('end',()=>r(c)); }).on('error',()=>r('')); }); }
function get(path, ck) { return new Promise(r => { const rq=https.get({ hostname:'www.minicircuits.com', path, headers:{'User-Agent':'Mozilla/5.0','Cookie':ck} }, res => { let s=''; res.on('data',c=>s+=c); res.on('end',()=>r(s)); }); rq.on('error',()=>r('')); rq.setTimeout(15000,()=>{rq.destroy();r('');}); }); }

function num(x){ return parseFloat(String(x).replace(/,/g,'')); }
function parse(h) {
  const txt = h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  const out = { specs:{} };
  // frequency: handle "X to Y MHz/GHz", "X-Y MHz/GHz", "DC to Y", single max.
  let m;
  if ((m = txt.match(/\b(dc|0)\s*(?:to|[-–])\s*(\d[\d,.]*)\s*(GHz|MHz)\b/i))) { out.flo = 0; out.fhi = num(m[2]) * (/ghz/i.test(m[3])?1000:1); }
  else if ((m = txt.match(/\b(\d[\d,.]*)\s*(?:to|[-–])\s*(\d[\d,.]*)\s*(GHz|MHz)\b/i))) { const g=/ghz/i.test(m[3])?1000:1; out.flo = num(m[1])*g; out.fhi = num(m[2])*g; }
  // sanity: flo<fhi and plausible
  if (out.flo!=null && out.fhi!=null && !(out.fhi>out.flo && out.fhi<=400000)) { delete out.flo; delete out.fhi; }
  // category from the product header text (title + H1 + overview). Longest keys
  // first so "phase shifter" beats "shifter", "power splitter/combiner" -> spl, etc.
  const head = txt.slice(0, 1800).toLowerCase();
  const keys = Object.keys(CATMAP).sort((a,b)=>b.length-a.length);
  for (const k of keys) { if (head.includes(k)) { out.cat = CATMAP[k]; break; } }
  if (/50\s*(ohm|Ω)/i.test(txt)) out.specs.impedance = 50; else if (/75\s*(ohm|Ω)/i.test(txt)) out.specs.impedance = 75;
  if (/\bSMA\b|\bN-?type\b|\bBNC\b|\b2\.92\b|\b3\.5\s*mm\b|connector/i.test(txt) && !/surface mount|SMT/i.test(txt.slice(0,400))) out.specs.interface = 'Connector';
  else if (/surface mount|SMT|QFN|MCLP/i.test(txt)) out.specs.interface = 'SMT';
  const tt = (h.match(/<title>([^<]+)<\/title>/i)||[])[1] || '';
  if (tt) out.title = tt.replace(/\s*\|\s*Mini-Circuits.*$/i,'').trim().slice(0,140);
  out.ok = !!(out.flo || out.cat);
  return out;
}

const done = new Set();
if (fs.existsSync(OUT)) for (const l of fs.readFileSync(OUT,'utf8').split('\n')) { const t=l.trim(); if(!t)continue; try{ done.add(JSON.parse(t).pn); }catch(e){} }

// stubs = no specs AND no freq; prioritise real catalog parts (have a url)
const stubs = db.filter(p => p.pn && !done.has(p.pn) && (!p.specs || !Object.keys(p.specs).length) && p.flo==null && p.fhi==null && p.cat!=='noncat');
function prio(p){ const pn=(p.pn||'').toUpperCase(); if(/^Z[A-Z]/.test(pn)) return 3; if(/^(PMA|PHA|PGA|ERA|GALI|MAR|VAT|RCDAT|DAT|ZFL|ZFSC|ZFBT|ROS|JCIQ|JSPHS|SYPS|TCBT|BLK|ADE|SIM|MAC|XBF|VLF|VHF|BBP|VBF|SCLF|SHP)/.test(pn)) return 2; if(/^(047|CBL|FW|UFB|086|141|KAA|SF)/.test(pn)) return 0; return 1; }
stubs.sort((a,b)=> prio(b)-prio(a));
console.error('remaining stubs:', stubs.length, '| already enriched:', done.size);

const CONC = 8, BUDGET = 38000, start = Date.now();
let qi = 0, ok = 0;
(async () => {
  const ck = await getCookie();
  async function worker() {
    while (Date.now()-start < BUDGET) {
      const i = qi++; if (i >= stubs.length) return;
      const pn = stubs[i].pn;
      try {
        const h = await get('/WebStore/dashboard.html?model='+encodeURIComponent(pn), ck);
        if (h.length < 3000) { fs.appendFileSync(OUT, JSON.stringify({pn, ok:false})+'\n'); continue; }
        const r = parse(h); r.pn = pn;
        fs.appendFileSync(OUT, JSON.stringify(r)+'\n');
        if (r.ok) ok++;
      } catch(e) { fs.appendFileSync(OUT, JSON.stringify({pn, ok:false})+'\n'); }
    }
  }
  await Promise.all(Array.from({length:CONC}, worker));
  console.error('this run: enriched', ok, '| total done now:', done.size + qi, '| elapsed', ((Date.now()-start)/1000|0)+'s');
  process.exit(0);
})();
