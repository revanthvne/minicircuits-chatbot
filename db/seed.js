/**
 * db/seed.js — Seeds the Mini-Circuits product database
 * Run with: node db/seed.js
 */
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'products.db'));

db.exec(`
  DROP TABLE IF EXISTS products;
  CREATE TABLE products (
    pn        TEXT PRIMARY KEY,
    cat       TEXT,
    type      TEXT,
    flo       REAL, fhi  REAL,
    gain      REAL, nf   REAL,  p1o    REAL, oip3  REAL,
    vcc       REAL, icc  REAL,
    il        REAL, rej  REAL,  rl     REAL,
    atten     REAL, pwr  REAL,  vswr_v REAL,
    cvloss    REAL, lopwr REAL, iip3   REAL,
    rflo      REAL, rfhi  REAL, ifhi   REAL,
    iso       REAL, ways  INTEGER,
    topo      TEXT, p1db  REAL,  spd   REAL, ctlv REAL,
    pkg       TEXT, price REAL,  stock INTEGER,
    desc      TEXT
  )
`);

const ins = db.prepare(`
  INSERT INTO products VALUES (
    @pn, @cat, @type,
    @flo, @fhi, @gain, @nf, @p1o, @oip3, @vcc, @icc,
    @il, @rej, @rl,
    @atten, @pwr, @vswr_v,
    @cvloss, @lopwr, @iip3, @rflo, @rfhi, @ifhi,
    @iso, @ways, @topo, @p1db, @spd, @ctlv,
    @pkg, @price, @stock, @desc
  )
`);

const N = null; // null shorthand

const products = [
  // ── AMPLIFIERS ──────────────────────────────────────────────────────────────
  { pn:'ZX60-V82+',   cat:'amp', type:'gain_block', flo:300,  fhi:8000,  gain:17.0, nf:2.7, p1o:20,   oip3:32, vcc:5,   icc:68,  il:N,  rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA',    price:18.95, stock:1, desc:'Wideband Gain Block, 0.3–8 GHz' },
  { pn:'ERA-2+',      cat:'amp', type:'gain_block', flo:0,    fhi:6000,  gain:15.6, nf:3.4, p1o:12.5, oip3:23, vcc:3.5, icc:35,  il:N,  rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SOT-89', price:3.95,  stock:1, desc:'MMIC Cascadable Gain Block, DC–6 GHz' },
  { pn:'ERA-6+',      cat:'amp', type:'gain_block', flo:0,    fhi:4000,  gain:11.5, nf:3.4, p1o:18.5, oip3:29, vcc:5,   icc:90,  il:N,  rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SOT-89', price:4.95,  stock:1, desc:'High-Power MMIC Gain Block, DC–4 GHz' },
  { pn:'PHA-1H+',     cat:'amp', type:'lna',        flo:50,   fhi:6000,  gain:20.0, nf:1.7, p1o:18,   oip3:29, vcc:5,   icc:55,  il:N,  rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'QFN-16', price:8.95,  stock:1, desc:'Low Noise Amplifier, 0.05–6 GHz, NF=1.7 dB' },
  { pn:'ZX60-83LN+',  cat:'amp', type:'lna',        flo:700,  fhi:8300,  gain:20.5, nf:1.4, p1o:14,   oip3:27, vcc:5,   icc:75,  il:N,  rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA',    price:39.95, stock:1, desc:'Low Noise Amplifier, 0.7–8.3 GHz, NF=1.4 dB' },
  { pn:'GVA-81+',     cat:'amp', type:'gain_block', flo:0,    fhi:6000,  gain:12.5, nf:4.0, p1o:20,   oip3:32, vcc:5,   icc:110, il:N,  rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SOT-89', price:5.95,  stock:1, desc:'High-IP3 MMIC Gain Block, DC–6 GHz' },
  { pn:'ZVA-213-S+',  cat:'amp', type:'driver',     flo:20,   fhi:13000, gain:14.0, nf:3.5, p1o:22,   oip3:33, vcc:5,   icc:250, il:N,  rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA',    price:149.95,stock:0, desc:'Wideband Driver Amplifier, 0.02–13 GHz' },

  // ── FILTERS ─────────────────────────────────────────────────────────────────
  { pn:'BFCN-1445+',  cat:'flt', type:'bandpass',   flo:1400, fhi:1490,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:1.2, rej:35, rl:15, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'0805',   price:2.95,  stock:1, desc:'Ceramic BPF, 1400–1490 MHz (GPS L1)' },
  { pn:'ZFBP-2400+',  cat:'flt', type:'bandpass',   flo:2400, fhi:2500,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:1.5, rej:30, rl:14, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA',    price:24.95, stock:1, desc:'Bandpass Filter, 2.4–2.5 GHz (WiFi/ISM)' },
  { pn:'SLP-50+',     cat:'flt', type:'lowpass',    flo:0,    fhi:50,    gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:0.3, rej:40, rl:18, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'0805',   price:1.95,  stock:1, desc:'LTCC Lowpass Filter, fc=50 MHz' },
  { pn:'SHP-100+',    cat:'flt', type:'highpass',   flo:100,  fhi:6000,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:0.4, rej:38, rl:17, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'0805',   price:2.25,  stock:1, desc:'LTCC Highpass Filter, fc=100 MHz' },

  // ── MIXERS ──────────────────────────────────────────────────────────────────
  { pn:'ZX05-C42MH+', cat:'mix', type:'dbl_bal',    flo:N, fhi:N, gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:N, rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:6.5, lopwr:10, iip3:13, rflo:2000, rfhi:4200, ifhi:1500, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA',    price:54.95, stock:1, desc:'Double Balanced Mixer, RF 2–4.2 GHz' },
  { pn:'ADE-1+',      cat:'mix', type:'dbl_bal',    flo:N, fhi:N, gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:N, rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:5.0, lopwr:7,  iip3:15, rflo:500,  rfhi:500,  ifhi:500,  iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SOIC-8', price:7.95,  stock:1, desc:'Double Balanced Mixer, 0.5–500 MHz' },

  // ── ATTENUATORS ─────────────────────────────────────────────────────────────
  { pn:'VAT-3+',      cat:'att', type:'fixed',      flo:N, fhi:6000,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:N, rej:N, rl:N, atten:3,  pwr:1000, vswr_v:1.20, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA', price:12.95, stock:1, desc:'Fixed Attenuator, 3 dB, DC–6 GHz' },
  { pn:'VAT-6+',      cat:'att', type:'fixed',      flo:N, fhi:6000,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:N, rej:N, rl:N, atten:6,  pwr:1000, vswr_v:1.22, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA', price:12.95, stock:1, desc:'Fixed Attenuator, 6 dB, DC–6 GHz' },
  { pn:'VAT-10+',     cat:'att', type:'fixed',      flo:N, fhi:6000,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:N, rej:N, rl:N, atten:10, pwr:1000, vswr_v:1.25, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:N, ways:N, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA', price:12.95, stock:1, desc:'Fixed Attenuator, 10 dB, DC–6 GHz' },

  // ── SPLITTERS ───────────────────────────────────────────────────────────────
  { pn:'ZFSC-2-2500+',cat:'spl', type:'resistive',  flo:2, fhi:2500,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:3.5, rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:22, ways:2, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA', price:18.95, stock:1, desc:'2-Way 0° Splitter/Combiner, 2–2500 MHz' },
  { pn:'ZX10-2-12+',  cat:'spl', type:'wilkinson',  flo:2, fhi:2000,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:3.2, rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:20, ways:2, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA', price:16.95, stock:1, desc:'2-Way Splitter/Combiner, 0.02–2 GHz' },
  { pn:'ZFRSC-183+',  cat:'spl', type:'wilkinson',  flo:2, fhi:18300, gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:4.0, rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:18, ways:2, topo:N, p1db:N, spd:N, ctlv:N, pkg:'SMA', price:89.95, stock:1, desc:'Ultra-Wideband 2-Way Splitter, 0.002–18.3 GHz' },

  // ── SWITCHES ────────────────────────────────────────────────────────────────
  { pn:'ZYSWA-2-50DR+',cat:'sw', type:'reflective', flo:N, fhi:5000,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:N, rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:60, ways:N, topo:'SPDT', p1db:30, spd:1,   ctlv:3.3, pkg:'QFN-16', price:14.95, stock:1, desc:'Ultra-Fast SPDT Switch, DC–5 GHz, 1 ns' },
  { pn:'ZASWA-2-50DR+',cat:'sw', type:'absorptive', flo:N, fhi:6000,  gain:N, nf:N, p1o:N, oip3:N, vcc:N, icc:N, il:N, rej:N, rl:N, atten:N, pwr:N, vswr_v:N, cvloss:N, lopwr:N, iip3:N, rflo:N, rfhi:N, ifhi:N, iso:55, ways:N, topo:'SPDT', p1db:31, spd:1.5, ctlv:3.3, pkg:'QFN-16', price:16.95, stock:1, desc:'SPDT Absorptive Switch, DC–6 GHz' },
];

const seedAll = db.transaction(rows => {
  for (const row of rows) ins.run(row);
});

seedAll(products);
console.log(`\n🧽 SQUEAKY CLEAN!! Seeded ${products.length} products into products.db!`);
db.close();
