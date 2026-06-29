#!/usr/bin/env node
/**
 * Mini-Circuits FULL-SITE Catalog Scraper  (v2 — schema-agnostic)
 * ----------------------------------------------------------------
 * Goal: mirror www.minicircuits.com as closely as possible so the
 * chatbot ("Minny") can answer about every orderable part AND the
 * non-catalog / custom product lines.
 *
 * Design:
 *  - PHASE 1  (fast, minutes): visit every top-level WebStore category
 *    page, read the parametric <th> headers DYNAMICALLY, and parse the
 *    <output class="Nth_col"> cells for every data row. No hard-coded
 *    per-category column maps — works for all categories, new or old.
 *  - PHASE 2  (slow, hours): visit each product's dashboard page to add
 *    price tiers, stock, datasheet / s-param / PCB / eval-board URLs.
 *    Checkpointed + resumable so it can run in batches / on a schedule.
 *  - NON-CATALOG: capability / landing pages (Custom Assemblies, Hi-Rel,
 *    Space Upscreening, Custom Test Systems, Designer Kits, Reference
 *    Designs, Research & Educational Kits) are captured as `info`
 *    records flagged `needs_quote` so Minny lists them and routes the
 *    user to the team for a custom quote.
 *
 * Output: scraper/catalog_raw.json   (everything, as scraped)
 *         ../db/products_full.json    (used by the server)
 *         scraper/.phase2_checkpoint.json (resume state)
 *
 * Usage:
 *   node scrape.js --phase 1        # category tables only (fast)
 *   node scrape.js --phase 2        # dashboard enrichment (slow, resumable)
 *   node scrape.js --phase 2 --limit 300   # only enrich next 300 parts
 *   node scrape.js --phase noncat   # refresh non-catalog info pages only
 *   node scrape.js --phase all      # phase 1 + non-catalog (default)
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE   = 'https://www.minicircuits.com';
const DELAY  = 250;                       // ms between requests (be polite)
const OUT_DIR   = __dirname;
const RAW_FILE  = path.join(OUT_DIR, 'catalog_raw.json');
const FULL_FILE = path.join(__dirname, '../db/products_full.json');
const CKPT_FILE = path.join(OUT_DIR, '.phase2_checkpoint.json');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ─── Category pages (parametric tables) ──────────────────────────────────────
// `cat` is a short code kept for backward compatibility with the chatbot.
// Top-level pages aggregate all sub-types, so we list ONE page per family.
const CATEGORIES = [
  // ---- Core RF components ----
  { page: '/WebStore/adapters.html',                 cat: 'adapter', group: 'Adapters' },
  { page: '/WebStore/Amplifiers.html',               cat: 'amp',     group: 'Amplifiers' },
  { page: '/WebStore/Attenuators.html',              cat: 'att',     group: 'Attenuators (Fixed)' },
  { page: '/WebStore/RF-Programmable-Attenuators.html', cat: 'att',  group: 'Attenuators (Programmable)' },
  { page: '/WebStore/BiasTees.html',                 cat: 'bias',    group: 'Bias Tees' },
  { page: '/WebStore/Cables.html',                   cat: 'cable',   group: 'Cables' },
  { page: '/WebStore/Couplers.html',                 cat: 'cpl',     group: 'Couplers' },
  { page: '/WebStore/dc_blocks.html',                cat: 'dcb',     group: 'DC Blocks' },
  { page: '/WebStore/equalizers.html',               cat: 'eq',      group: 'Equalizers' },
  { page: '/WebStore/RF-Filters.html',               cat: 'flt',     group: 'Filters' },
  { page: '/WebStore/Mixers.html',                   cat: 'mix',     group: 'Frequency Mixers' },
  { page: '/WebStore/Multipliers.html',              cat: 'mult',    group: 'Frequency Multipliers' },
  { page: '/WebStore/MatchingPads.html',             cat: 'match',   group: 'Impedance Matching Pads' },
  { page: '/WebStore/Limiters.html',                 cat: 'lim',     group: 'Limiters' },
  { page: '/WebStore/ModulatorsDemodulators.html',   cat: 'mod',     group: 'Modulators / Demodulators' },
  { page: '/WebStore/Oscillators.html',              cat: 'osc',     group: 'Oscillators' },
  { page: '/WebStore/PhaseDetectors.html',           cat: 'pd',      group: 'Phase Detectors' },
  { page: '/WebStore/PhaseShifters.html',            cat: 'ps',      group: 'Phase Shifters' },
  { page: '/WebStore/pd_coax.html',                  cat: 'pdet',    group: 'Power Detectors' },
  { page: '/WebStore/RF-Smart-Power-Sensors.html',   cat: 'psen',    group: 'Power Sensors' },
  { page: '/WebStore/Splitters.html',                cat: 'spl',     group: 'Power Splitters / Combiners' },
  { page: '/WebStore/90_180_degree_hybrid.html',     cat: 'spl',     group: '90/180 Degree Hybrids' },
  { page: '/WebStore/rf_chokes.html',                cat: 'chk',     group: 'RF Chokes' },
  { page: '/WebStore/Switches.html',                 cat: 'sw',      group: 'Switches' },
  { page: '/WebStore/Synthesizers.html',             cat: 'syn',     group: 'Synthesizers' },
  { page: '/WebStore/terminations.html',             cat: 'term',    group: 'Terminations' },
  { page: '/WebStore/Transformers.html',             cat: 'xfmr',    group: 'Transformers / Baluns' },
  { page: '/WebStore/Waveguides.html',               cat: 'wg',      group: 'Waveguides' },
  { page: '/WebStore/Die.html',                      cat: 'die',     group: 'MMIC Die Parts' },
  // ---- Test solutions / systems / instrumentation ----
  { page: '/WebStore/RF-High-Power-Test-Systems.html',     cat: 'test', group: 'High Power Test Systems' },
  { page: '/WebStore/RF-Instrumentation-Amplifiers.html',  cat: 'test', group: 'Instrumentation Amplifiers' },
  { page: '/WebStore/RF-Modular-Test-Systems.html',        cat: 'test', group: 'Modular Test Systems' },
  { page: '/WebStore/RF-Mechanical-Switch-Systems.html',   cat: 'test', group: 'Mechanical Switch Matrix' },
  { page: '/WebStore/RF-Mesh-Network-Systems.html',        cat: 'test', group: 'Mesh Network Test Systems' },
  { page: '/WebStore/RF-NxM-Switch.html',                  cat: 'test', group: 'NxM Switch Matrices' },
  { page: '/WebStore/RF-Panel-Mounted-Structures.html',    cat: 'test', group: 'Panel Mounted Structures' },
  { page: '/WebStore/RF-Signal-Distribution-Systems.html', cat: 'test', group: 'Signal Distribution Systems' },
  { page: '/WebStore/RF-Signal-Generation-Measurement.html', cat: 'test', group: 'Signal Generation & Measurement' },
  { page: '/WebStore/RF-Solid-State-Switch-Systems.html',  cat: 'test', group: 'Solid State Switch Systems' },
  { page: '/WebStore/PortableTestAccessories.html',        cat: 'test', group: 'Precision Connector Gauges / Accessories' },
  { page: '/WebStore/Wrenches.html',                       cat: 'acc',  group: 'Wrenches' },
  { page: '/WebStore/uvna_63.html',                        cat: 'test', group: 'UVNA-63' },
  { page: '/WebStore/imagevk_74.html',                     cat: 'test', group: 'IMAGEVK-74' },
];

// ─── Non-catalog / capability pages (no parametric table) ────────────────────
// `kind`: 'custom' = quote-only custom line; 'family' = a real product family
// rendered as a landing page (configurable/quote products, or per-model pages).
const NONCATALOG = [
  // Custom / non-catalog lines (no public price/specs → escalate)
  { page: '/products/CustomAssemblies.html',            group: 'Custom Assemblies',          cat: 'noncat', kind: 'custom' },
  { page: '/WebStore/RF-Custom-Designs.html',           group: 'Custom Test Systems',        cat: 'noncat', kind: 'custom' },
  { page: '/products/designer-kits.html',               group: 'Designer Kits',              cat: 'noncat', kind: 'custom' },
  { page: '/WebStore/support/reference_designs.html',   group: 'Reference Designs',          cat: 'noncat', kind: 'custom' },
  { page: '/products/researcheducation.html',           group: 'Research & Educational Kits',cat: 'noncat', kind: 'custom' },
  { page: '/ads/Hi-Rel_screening.html',                 group: 'Hi-Rel Screening',           cat: 'noncat', kind: 'custom' },
  { page: '/ads/space-upscreening.html',                group: 'Space Upscreening',          cat: 'noncat', kind: 'custom' },
  { page: '/WebStore/products/rf-microwave-quantum-computing-solutions', group: 'Quantum Hardware', cat: 'noncat', kind: 'custom' },
  { page: '/WebStore/products/Automotive-Applications', group: 'Automotive Applications',    cat: 'noncat', kind: 'custom' },
  // Product families rendered as landing pages (configurable / per-model)
  { page: '/WebStore/Cables.html',                          group: 'Cables',                  cat: 'cable', kind: 'family' },
  { page: '/WebStore/Waveguides.html',                      group: 'Waveguides',              cat: 'wg',    kind: 'family' },
  { page: '/WebStore/RF-Programmable-Attenuators.html',     group: 'Programmable Attenuators',cat: 'att',   kind: 'family' },
  { page: '/WebStore/RF-High-Power-Test-Systems.html',      group: 'High Power Test Systems', cat: 'test',  kind: 'family' },
  { page: '/WebStore/RF-Instrumentation-Amplifiers.html',   group: 'Instrumentation Amplifiers', cat: 'test', kind: 'family' },
  { page: '/WebStore/RF-Modular-Test-Systems.html',         group: 'Modular Test Systems',    cat: 'test',  kind: 'family' },
  { page: '/WebStore/RF-Mechanical-Switch-Systems.html',    group: 'Mechanical Switch Matrix',cat: 'test',  kind: 'family' },
  { page: '/WebStore/RF-Mesh-Network-Systems.html',         group: 'Mesh Network Test Systems', cat: 'test', kind: 'family' },
  { page: '/WebStore/RF-NxM-Switch.html',                   group: 'NxM Switch Matrices',     cat: 'test',  kind: 'family' },
  { page: '/WebStore/RF-Panel-Mounted-Structures.html',     group: 'Panel Mounted Structures',cat: 'test',  kind: 'family' },
  { page: '/WebStore/RF-Signal-Distribution-Systems.html',  group: 'Signal Distribution Systems', cat: 'test', kind: 'family' },
  { page: '/WebStore/RF-Signal-Generation-Measurement.html',group: 'Signal Generation & Measurement', cat: 'test', kind: 'family' },
  { page: '/WebStore/RF-Solid-State-Switch-Systems.html',   group: 'Solid State Switch Systems', cat: 'test', kind: 'family' },
  { page: '/WebStore/PortableTestAccessories.html',         group: 'Precision Connector Gauges / Accessories', cat: 'test', kind: 'family' },
  { page: '/WebStore/uvna_63.html',                         group: 'UVNA-63',                 cat: 'test',  kind: 'family' },
  { page: '/WebStore/imagevk_74.html',                      group: 'IMAGEVK-74',              cat: 'test',  kind: 'family' },
];

// ─── HTTP helper ─────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(reqUrl, opts = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(reqUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: opts.method || 'GET',
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        ...(opts.headers || {})
      }
    };
    const req = lib.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

// ─── HTML utilities ──────────────────────────────────────────────────────────
function stripTags(s) {
  return s.replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&le;/g, '<=').replace(/&ge;/g, '>=')
          .replace(/&amp;/g, '&').replace(/&deg;/g, '°')
          .replace(/&[a-z]+;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
}

// Turn a column header label into a stable, readable field key.
function slugHeader(label) {
  let s = stripTags(label).toLowerCase();
  s = s.replace(/typ\.?|max\.?|min\.?/g, '')
       .replace(/\(.*?\)/g, ' ')        // drop units in parens
       .replace(/[^a-z0-9]+/g, '_')
       .replace(/^_+|_+$/g, '');
  return s || null;
}

// Map common header keys → the legacy field names the chatbot/server expect,
// so existing logic keeps working while we also store everything generically.
const LEGACY_MAP = {
  f_low: 'flo', f_high: 'fhi', freq_low: 'flo', freq_high: 'fhi',
  frequency_low: 'flo', frequency_high: 'fhi', freq_low_mhz: 'flo', freq_high_mhz: 'fhi',
  gain: 'gain', nf: 'nf', p1db: 'p1db', psat: 'psat', oip3: 'oip3', iip3: 'iip3',
  input_vswr: 'vswr_in', output_vswr: 'vswr_out', vswr: 'vswr',
  voltage: 'vcc', current: 'icc_ma', case_style: 'case_style',
  insertion_loss: 'il_db', isolation: 'iso_db', impedance: 'impedance',
  coupling: 'coup_db', power: 'pwr', attenuation: 'atten',
};

// ─── Parse a parametric category page ────────────────────────────────────────
function parseCategory(html, meta) {
  // 1) Extract ordered column headers from the data table's <th> cells.
  //    The first <th> is a giant filter blob; "Model Number" is the model col.
  const ths = [];
  const thRe = /<th\b[^>]*>([\s\S]*?)<\/th>/g;
  let m;
  while ((m = thRe.exec(html)) !== null) ths.push(stripTags(m[1]));

  // Columns after "Model Number" align with output classes 2nd_col, 3rd_col...
  const modelIdx = ths.findIndex(t => /^model\s*number$/i.test(t));
  const headerByCol = {};
  if (modelIdx !== -1) {
    let col = 2;
    for (let i = modelIdx + 1; i < ths.length; i++) {
      headerByCol[col] = ths[i];
      col++;
    }
  }

  // Build a part record from model identity + a {col->value} map.
  const makeProduct = (pnEncoded, colVals) => {
    const pn = decodeURIComponent(pnEncoded).trim();
    if (!pn) return null;
    const product = { pn, cat: meta.cat, group: meta.group, specs: {} };
    for (const [idxStr, rawVal] of Object.entries(colVals)) {
      const idx = parseInt(idxStr, 10);
      let val = stripTags(rawVal);
      if (val === '-' || val === '') val = null;
      const label = headerByCol[idx];
      if (!label) continue;
      const key = slugHeader(label);
      if (!key) continue;
      if (val !== null) product.specs[key] = val;
      const legacy = LEGACY_MAP[key];
      if (legacy && val !== null && product[legacy] === undefined) {
        const num = parseFloat(String(val).replace(/[^0-9.\-]/g, ''));
        product[legacy] = isNaN(num) ? val : num;
      }
    }
    if (product.specs.case_style) product.case_style = product.specs.case_style;
    if (product.specs.description) product.desc = product.specs.description;
    product.url           = `${BASE}/WebStore/dashboard.html?model=${pnEncoded}`;
    product.datasheet_url = `${BASE}/pdfs/${pn}.pdf`;
    product.sparams_url   = `${BASE}/pages/s-params/${pn}_S2P.zip`;
    return product;
  };

  const products = [];

  // 2a) Modern layout: <tr name="data_row"> with <output class="Nth_col">
  const rowRe = /<tr[^>]*name="data_row"[^>]*>([\s\S]*?)<\/tr>/g;
  let rowMatch;
  while ((rowMatch = rowRe.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    const pnMatch = rowHtml.match(/href="modelSearch\.html\?model=([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!pnMatch) continue;
    const colVals = {};
    const colRe = /<output class="(\d+)[a-z]{0,2}_col">([\s\S]*?)<\/output>/g;
    let cm;
    while ((cm = colRe.exec(rowHtml)) !== null) colVals[parseInt(cm[1], 10)] = cm[2];
    const product = makeProduct(pnMatch[1], colVals);
    if (!product) continue;
    if (!product.case_style) {
      const caseMatch = rowHtml.match(/thumbnail[^>]*>[\s\S]*?<output>([A-Z0-9\-\/]+)<\/output>/);
      if (caseMatch) product.case_style = caseMatch[1];
    }
    product.ez_sample = /ez-icon-prod\.png/.test(rowHtml);
    products.push(product);
  }

  // 2b) Legacy layout: <tr> with <a class="first_col" ...> then sequential
  //     plain <output> cells (used by Multipliers, Equalizers, Waveguides,
  //     Programmable Attenuators, etc.). Cols map to headers 2,3,4,... in order.
  if (products.length === 0) {
    const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/g;
    let tr;
    while ((tr = trRe.exec(html)) !== null) {
      const rowHtml = tr[1];
      const pnMatch = rowHtml.match(/class="first_col"[^>]*href="modelSearch\.html\?model=([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
      if (!pnMatch) continue;
      const colVals = {};
      const outRe = /<output[^>]*>([\s\S]*?)<\/output>/g;
      let om, col = 2;
      while ((om = outRe.exec(rowHtml)) !== null) { colVals[col] = om[1]; col++; }
      const product = makeProduct(pnMatch[1], colVals);
      if (product) products.push(product);
    }
  }

  return { products, headerByCol };
}

// ─── Parse a non-catalog capability page → info record ───────────────────────
function parseNonCatalog(html, meta) {
  const titleM = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleM ? stripTags(titleM[1]) : meta.group;

  const descM = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
  let summary = descM ? descM[1].trim() : '';
  if (!summary || summary.length < 40) {
    const body = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                     .replace(/<style[\s\S]*?<\/style>/gi, '');
    summary = stripTags(body).slice(0, 600);
  }

  const models = [];
  const linkRe = /modelSearch\.html\?model=([^"&]+)/g;
  let lm; const seen = new Set();
  while ((lm = linkRe.exec(html)) !== null) {
    const pn = decodeURIComponent(lm[1]).trim();
    if (pn && !seen.has(pn)) { seen.add(pn); models.push(pn); }
  }

  return {
    pn: meta.group, cat: meta.cat || 'noncat', group: meta.group, type: 'info',
    kind: meta.kind || 'custom',
    needs_quote: (meta.kind || 'custom') === 'custom',
    desc: `${title} — ${summary}`.slice(0, 800),
    url: BASE + meta.page,
    related_models: models.slice(0, 60),
  };
}

// The category pages truncate to a default view on a plain GET. The site's own
// "show all" uses an AJAX POST (action:X.onPageLoad.ajax=) that returns EVERY
// row — essential for full catalog parity (e.g. Filters: 642 GET vs 1741 POST).
function postCategory(page) {
  return fetch(BASE + page, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': BASE + page,
    },
    body: 'action%3AX.onPageLoad.ajax=',
  });
}

// ─── Phase 1: all category tables ────────────────────────────────────────────
async function phase1(from = 0, to = CATEGORIES.length) {
  let all = [];
  const report = [];
  for (const cat of CATEGORIES.slice(from, to)) {
    try {
      // POST first (full set); fall back to GET if POST yields nothing.
      let res = await postCategory(cat.page);
      let parsed = res.status === 200 ? parseCategory(res.body, cat) : { products: [] };
      if (parsed.products.length === 0) {
        res = await fetch(BASE + cat.page);
        parsed = res.status === 200 ? parseCategory(res.body, cat) : parsed;
      }
      if (res.status !== 200 && parsed.products.length === 0) {
        report.push(`  x ${cat.group.padEnd(40)} HTTP ${res.status}`);
        await sleep(DELAY); continue;
      }
      all = all.concat(parsed.products);
      report.push(`  ok ${cat.group.padEnd(40)} ${String(parsed.products.length).padStart(5)} parts`);
    } catch (e) {
      report.push(`  x ${cat.group.padEnd(40)} ERROR ${e.message}`);
    }
    await sleep(DELAY);
  }

  const byPn = new Map();
  for (const p of all) if (!byPn.has(p.pn)) byPn.set(p.pn, p);
  const deduped = [...byPn.values()];

  console.log('\n-- Phase 1 results --------------------------');
  console.log(report.join('\n'));
  console.log(`\n  TOTAL (raw): ${all.length}   (deduped): ${deduped.length}`);
  return deduped;
}

// ─── Non-catalog phase ───────────────────────────────────────────────────────
async function phaseNonCatalog() {
  const out = [];
  for (const nc of NONCATALOG) {
    try {
      const res = await fetch(BASE + nc.page);
      if (res.status === 200) {
        out.push(parseNonCatalog(res.body, nc));
        console.log(`  ok non-catalog: ${nc.group}`);
      } else {
        console.log(`  x  non-catalog: ${nc.group} HTTP ${res.status}`);
        out.push({ pn: nc.group, cat: 'noncat', group: nc.group, type: 'info',
                   needs_quote: true,
                   desc: `${nc.group} — custom / non-catalog line. Contact the team for details.`,
                   url: BASE + nc.page });
      }
    } catch (e) {
      console.log(`  x  non-catalog: ${nc.group} ${e.message}`);
    }
    await sleep(DELAY);
  }
  return out;
}

// ─── Sitemap seeding: guarantee EVERY model on the site is present ───────────
// The parametric category pages only expose the main families (~3.9k models).
// The site's sitemap.xml lists every dashboard URL (~10.7k models) — including
// connector / mechanical variants. We seed a base record for any model not
// already captured so the catalog is 100% complete; Phase 2 enriches them.
async function phaseSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (res.status !== 200) { console.log('sitemap fetch failed', res.status); return; }
  const pns = [];
  const re = /dashboard\.html\?model=([^<"&]+)/g;
  let m; const seen = new Set();
  while ((m = re.exec(res.body)) !== null) {
    const enc = m[1];
    const pn = decodeURIComponent(enc).trim();
    if (pn && !seen.has(pn)) { seen.add(pn); pns.push({ pn, enc }); }
  }
  console.log(`Sitemap lists ${pns.length} models.`);

  const existing = fs.existsSync(FULL_FILE)
    ? JSON.parse(fs.readFileSync(FULL_FILE, 'utf8')) : [];
  const have = new Set(existing.filter(p => p.cat !== 'noncat').map(p => p.pn));

  let added = 0;
  for (const { pn, enc } of pns) {
    if (have.has(pn)) continue;
    existing.push({
      pn,
      cat: 'uncategorized',          // Phase 2 / variant-linking can refine this
      group: 'Catalog (variant or specialty)',
      from_sitemap: true,
      url:           `${BASE}/WebStore/dashboard.html?model=${enc}`,
      datasheet_url: `${BASE}/pdfs/${pn}.pdf`,
      sparams_url:   `${BASE}/pages/s-params/${pn}_S2P.zip`,
    });
    added++;
  }
  fs.writeFileSync(FULL_FILE, JSON.stringify(existing, null, 1));
  fs.writeFileSync(RAW_FILE, JSON.stringify(existing, null, 1));
  console.log(`Seeded ${added} new models from sitemap. Catalog now ${existing.length} records.`);
}

// ─── Phase 2: dashboard enrichment (price/stock/files), resumable ────────────
function parseDashboard(html) {
  const out = {};
  const tiers = [];
  const tierRe = /<td[^>]*>\s*(\d[\d,]*)\s*<\/td>\s*<td[^>]*>\s*\$?\s*([\d.]+)\s*<\/td>/g;
  let t;
  while ((t = tierRe.exec(html)) !== null) {
    tiers.push({ qty: parseInt(t[1].replace(/,/g, ''), 10), price: parseFloat(t[2]) });
  }
  if (tiers.length) { out.price_tiers = tiers; out.price = tiers[0].price; }

  const stockM = html.match(/(\d[\d,]*)\s*(?:in stock|units? in stock|available)/i);
  if (stockM) out.stock = parseInt(stockM[1].replace(/,/g, ''), 10);

  const grab = (re) => { const x = html.match(re); return x ? x[0] : null; };
  const pdf = grab(/https?:\/\/[^"']*\/pdfs\/[^"']+\.pdf/i);
  if (pdf) out.datasheet_url = pdf;
  const pcb = grab(/https?:\/\/[^"']*\/pcb\/[^"']+\.pdf/i);
  if (pcb) out.pcb_url = pcb;
  const sview = grab(/https?:\/\/[^"']*s-params\/[^"']+_VIEW\.pdf/i);
  if (sview) out.sparams_view_url = sview;
  const eccn = html.match(/ECCN[^A-Z0-9]{0,6}([A-Z0-9]{3,8})/i);
  if (eccn) out.eccn = eccn[1];
  return out;
}

async function phase2(limit) {
  const products = JSON.parse(fs.readFileSync(FULL_FILE, 'utf8'));
  let ckpt = {};
  if (fs.existsSync(CKPT_FILE)) ckpt = JSON.parse(fs.readFileSync(CKPT_FILE, 'utf8'));

  const pending = products.filter(p => p.cat !== 'noncat' && !ckpt[p.pn]);
  const batch = limit ? pending.slice(0, limit) : pending;
  console.log(`Phase 2: ${pending.length} parts pending, processing ${batch.length} now.`);

  let done = 0;
  for (const p of batch) {
    try {
      // Dashboards are a Wicket SPA: the real content comes back on the
      // onPageLoad AJAX POST, not a plain GET.
      const res = await postCategory(p.url.replace(BASE, ''));
      if (res.status === 200) Object.assign(p, parseDashboard(res.body));
      ckpt[p.pn] = Date.now();
    } catch (e) { /* leave for next run */ }
    if (++done % 50 === 0) {
      fs.writeFileSync(FULL_FILE, JSON.stringify(products, null, 1));
      fs.writeFileSync(CKPT_FILE, JSON.stringify(ckpt));
      console.log(`  ...${done}/${batch.length} enriched`);
    }
    await sleep(DELAY);
  }
  fs.writeFileSync(FULL_FILE, JSON.stringify(products, null, 1));
  fs.writeFileSync(CKPT_FILE, JSON.stringify(ckpt));
  const enriched = products.filter(p => p.price != null).length;
  console.log(`Phase 2 batch done. Total with price now: ${enriched}/${products.length}`);
}

// A scratch accumulator lets Phase 1 run in slices across separate processes
// (handy in sandboxes with short per-command time limits).
const PARTS_FILE = path.join(OUT_DIR, '.phase1_parts.json');

function mergeAndWrite() {
  // combine sliced phase-1 parts (+ any non-catalog) into the final catalog
  let parts = [];
  if (fs.existsSync(PARTS_FILE)) parts = JSON.parse(fs.readFileSync(PARTS_FILE, 'utf8'));
  const byPn = new Map();
  for (const p of parts) if (!byPn.has(p.pn)) byPn.set(p.pn, p);
  const catalog = [...byPn.values()];
  fs.writeFileSync(RAW_FILE, JSON.stringify(catalog, null, 1));
  fs.writeFileSync(FULL_FILE, JSON.stringify(catalog, null, 1));
  console.log(`Merged ${catalog.length} records -> ${FULL_FILE}`);
  return catalog.length;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const arg = (k) => args.indexOf(k) !== -1 ? args[args.indexOf(k) + 1] : null;
  const phaseArg = arg('--phase') || 'all';
  const limitArg = arg('--limit') ? parseInt(arg('--limit'), 10) : null;
  const fromArg  = arg('--from')  ? parseInt(arg('--from'), 10)  : null;
  const toArg    = arg('--to')    ? parseInt(arg('--to'), 10)    : null;

  if (phaseArg === '2') { await phase2(limitArg); return; }
  if (phaseArg === 'sitemap') { await phaseSitemap(); return; }

  // Sliced phase-1: append into PARTS_FILE without overwriting prior slices.
  if (phaseArg === 'slice') {
    const got = await phase1(fromArg || 0, toArg || CATEGORIES.length);
    let parts = fs.existsSync(PARTS_FILE) ? JSON.parse(fs.readFileSync(PARTS_FILE, 'utf8')) : [];
    parts = parts.concat(got);
    fs.writeFileSync(PARTS_FILE, JSON.stringify(parts));
    console.log(`Slice [${fromArg}..${toArg}] added ${got.length}; parts total now ${parts.length}`);
    return;
  }
  if (phaseArg === 'noncat-slice') {
    const nc = await phaseNonCatalog();
    let parts = fs.existsSync(PARTS_FILE) ? JSON.parse(fs.readFileSync(PARTS_FILE, 'utf8')) : [];
    parts = parts.concat(nc);
    fs.writeFileSync(PARTS_FILE, JSON.stringify(parts));
    console.log(`Non-catalog added ${nc.length}; parts total now ${parts.length}`);
    return;
  }
  if (phaseArg === 'merge') { mergeAndWrite(); return; }

  // Default single-shot run (small environments may time out — use slices).
  let catalog = [];
  if (phaseArg === '1' || phaseArg === 'all') catalog = catalog.concat(await phase1());
  if (phaseArg === 'noncat' || phaseArg === 'all') catalog = catalog.concat(await phaseNonCatalog());
  if (phaseArg === 'noncat' && fs.existsSync(FULL_FILE)) {
    const existing = JSON.parse(fs.readFileSync(FULL_FILE, 'utf8')).filter(p => p.cat !== 'noncat');
    catalog = existing.concat(catalog);
  }
  fs.writeFileSync(RAW_FILE, JSON.stringify(catalog, null, 1));
  fs.writeFileSync(FULL_FILE, JSON.stringify(catalog, null, 1));
  console.log(`\nWrote ${catalog.length} records to ${FULL_FILE}`);
  console.log(`Next: node scrape.js --phase 2   (adds price/stock/files, resumable)`);
}

if (require.main === module) {
  main().catch(e => { console.error('FATAL', e); process.exit(1); });
}

module.exports = { parseCategory, parseDashboard, parseNonCatalog, phase1, phase2, CATEGORIES, NONCATALOG };
