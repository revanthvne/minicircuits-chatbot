/**
 * server.js — Mini-Circuits Chatbot Backend (v2)
 * Node.js + Express + full-site JSON catalog + Anthropic Claude (tool use)
 *
 * The catalog is now ~16k records (full-site parity), far too large to embed
 * in the system prompt. Instead Minny is given a `search_catalog` TOOL that it
 * calls on demand with structured filters (category, frequency, specs, price,
 * keywords). This scales to the entire site and keeps answers grounded.
 *
 * Start: node server.js
 */
require('dotenv').config();
const https      = require('https');
const express    = require('express');
const path       = require('path');
const Anthropic  = require('@anthropic-ai/sdk');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3000;
const MODEL = 'claude-sonnet-4-6';

// Optional shared passcode to protect the public deployment (set ACCESS_PASSCODE
// in the environment). When unset (e.g. local dev), the gate is disabled.
const ACCESS_PASSCODE = (process.env.ACCESS_PASSCODE || '').trim();

app.use(express.json());
// Serve the SPA but don't let browsers cache the HTML across deploys (otherwise
// users keep seeing an old index.html / old card renderer after we ship a fix).
app.use(express.static(path.join(__dirname, 'public'), {
  index: false, // "/" is served by the live homepage mirror route, not index.html
  setHeaders: (res, fp) => { if (fp.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache, must-revalidate'); },
}));

// Tells the frontend whether to show the passcode gate.
app.get('/api/config', (req, res) => res.json({ gated: !!ACCESS_PASSCODE }));

// Gate the API endpoints that cost money / send mail.
function requirePasscode(req, res, next) {
  if (!ACCESS_PASSCODE) return next();
  const supplied = (req.headers['x-access-code'] || '').toString().trim();
  if (supplied && supplied === ACCESS_PASSCODE) return next();
  return res.status(401).json({ error: 'unauthorized', message: 'Access passcode required.' });
}

// ── Catalog ───────────────────────────────────────────────────────────────────
const ALL_PRODUCTS = require('./db/products_full.json');
const NONCATALOG   = ALL_PRODUCTS.filter(p => p.cat === 'noncat');
const RICH         = ALL_PRODUCTS.filter(p => p.specs && Object.keys(p.specs).length);
console.log(`✅ Loaded ${ALL_PRODUCTS.length} records (${RICH.length} with full specs, ${NONCATALOG.length} non-catalog lines)`);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Friendly category aliases → internal cat codes
const CAT_ALIASES = {
  amplifier:'amp', amp:'amp', lna:'amp', 'gain block':'amp',
  filter:'flt', bandpass:'flt', lowpass:'flt', highpass:'flt',
  mixer:'mix', multiplier:'mult',
  attenuator:'att', splitter:'spl', combiner:'spl', divider:'spl', hybrid:'spl',
  switch:'sw', coupler:'cpl', transformer:'xfmr', balun:'xfmr',
  'bias tee':'bias', oscillator:'osc', synthesizer:'syn', terminations:'term', termination:'term',
  'dc block':'dcb', choke:'chk', limiter:'lim', 'phase shifter':'ps', 'phase detector':'pd',
  'power detector':'pdet', 'power sensor':'psen', adapter:'adapter', cable:'cable',
  equalizer:'eq', waveguide:'wg', 'matching pad':'match', die:'die', modulator:'mod', demodulator:'mod',
  'test system':'test', test:'test', instrument:'test',
};

const toNum = (v) => { if (v == null) return undefined; const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? undefined : n; };

// Robustly derive a frequency low/high (MHz) from whatever the category table
// called its frequency columns. Different tables use different labels:
//   amplifiers -> f_low / f_high ; transformers -> frequency_low / frequency_high ;
//   some -> a single "frequency" column with a "lo - hi" range.
// This is the fix for the bug where transformer flo/fhi were always null, which
// silently disabled frequency filtering and let the model invent a range.
function deriveFreq(p) {
  if (p.flo != null && p.fhi != null) return { flo: p.flo, fhi: p.fhi };
  const s = p.specs || {};
  let flo, fhi;
  for (const [k, v] of Object.entries(s)) {
    const key = k.toLowerCase();
    if (!/freq|f_?lo|f_?hi|^f[0-9]?_?(low|high|mhz)|band/.test(key)) continue;
    const n = toNum(v);
    if (/low|min|_lo\b|start|^f_low|frequency_low|^flo/.test(key) && flo == null) flo = n;
    else if (/high|max|_hi\b|stop|^f_high|frequency_high|^fhi/.test(key) && fhi == null) fhi = n;
    else if (/range|freq(uency)?$/.test(key) && /[-–]/.test(String(v))) {
      const parts = String(v).split(/[-–]/).map(toNum);
      if (parts[0] != null && flo == null) flo = parts[0];
      if (parts[1] != null && fhi == null) fhi = parts[1];
    }
  }
  // explicit common keys as a safety net
  if (flo == null) flo = toNum(s.f_low ?? s.frequency_low ?? s.freq_low);
  if (fhi == null) fhi = toNum(s.f_high ?? s.frequency_high ?? s.freq_high);
  return { flo: p.flo ?? flo, fhi: p.fhi ?? fhi };
}

// Normalize a record into the flat fields the frontend's card() renderer expects.
function normalize(p) {
  const s = p.specs || {};
  const num = toNum;
  const { flo, fhi } = deriveFreq(p);
  return {
    pn: p.pn, cat: p.cat, group: p.group, desc: p.desc || s.description || '',
    flo, fhi,
    gain: p.gain ?? num(s.gain), nf: p.nf ?? num(s.nf),
    p1o: p.p1db ?? num(s.p1db), oip3: p.oip3 ?? num(s.oip3),
    vcc: p.vcc ?? num(s.voltage), icc: p.icc_ma ?? num(s.current),
    il: p.il_db ?? num(s.insertion_loss ?? s.il_db), iso: p.iso_db ?? num(s.isolation ?? s.iso_db),
    rej: num(s.rej_f3_db) ?? num(s.rejection), atten: p.atten ?? num(s.attenuation),
    impedance: p.impedance ?? num(s.impedance), impedance_ratio: s.impedance_ratio,
    technology: s.technology, interface: s.interface || p.case_style,
    price: p.price, stock: p.stock,
    case_style: p.case_style, url: p.url,
    datasheet_url: p.datasheet_url, sparams_url: p.sparams_url,
    needs_quote: !!p.needs_quote,
  };
}

// ── The search engine behind the tool ───────────────────────────────────────
function searchCatalog(args = {}) {
  const { category, freq_mhz, freq_min, freq_max, keywords, max_nf, min_gain, max_price, in_stock, impedance, impedance_ratio, limit = 12 } = args;
  const catCode = category ? (CAT_ALIASES[String(category).toLowerCase()] || String(category).toLowerCase()) : null;
  const kw = (keywords ? String(keywords).toLowerCase().split(/[\s,]+/) : []).filter(Boolean);
  const ratioNorm = (v) => { if (v == null) return null; const m = String(v).match(/(\d+(?:\.\d+)?)/); return m ? m[1] : null; };
  const wantRatio = ratioNorm(impedance_ratio);

  const scored = [];
  for (const p of ALL_PRODUCTS) {
    if (p.cat === 'noncat') continue;
    const n = normalize(p);

    if (catCode && p.cat !== catCode) {
      // allow group-name match too (e.g. "hybrid" within splitters group)
      if (!(p.group && p.group.toLowerCase().includes(String(category).toLowerCase()))) continue;
    }
    // STRICT frequency match. The part MUST have a known range; parts with an
    // unknown range are excluded (never silently passed) so we never recommend a
    // part we can't confirm covers the band. 2% tolerance at the band edges.
    if (freq_min != null || freq_max != null) {
      // Band request: the part must COVER the whole [freq_min, freq_max] span.
      if (n.flo == null || n.fhi == null) continue;
      const need_lo = freq_min != null ? freq_min : freq_max;
      const need_hi = freq_max != null ? freq_max : freq_min;
      if (!(n.flo <= need_lo * 1.02 && n.fhi >= need_hi * 0.98)) continue;
    } else if (freq_mhz != null) {
      if (n.flo == null || n.fhi == null) continue;
      if (!(n.flo * 0.98 <= freq_mhz && freq_mhz <= n.fhi * 1.02)) continue;
    }
    if (max_nf  != null && !(n.nf  != null && n.nf  <= max_nf))  continue;
    if (min_gain!= null && !(n.gain!= null && n.gain>= min_gain)) continue;
    if (max_price!=null && !(n.price!= null && n.price<= max_price)) continue;
    if (in_stock && !(p.stock && p.stock !== 0)) continue;
    if (impedance != null && !(n.impedance != null && Math.abs(n.impedance - impedance) < 1)) continue;
    if (wantRatio != null && ratioNorm(n.impedance_ratio) !== wantRatio) continue;

    // keyword scoring across pn/desc/group/specs
    let score = 0;
    const hay = `${p.pn} ${p.desc || ''} ${p.group || ''} ${JSON.stringify(p.specs || {})}`.toLowerCase();
    for (const k of kw) if (hay.includes(k)) score += 3;
    if (n.desc) score += 1;                       // prefer described parts
    if (p.specs && Object.keys(p.specs).length) score += 2; // prefer rich records
    if (kw.length === 0) score += 1;

    scored.push({ p: n, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const total = scored.length;
  const results = scored.slice(0, Math.min(limit, 25)).map(x => x.p);
  return { total, returned: results.length, results };
}

// ── Tool definition given to Claude ──────────────────────────────────────────
const TOOLS = [{
  name: 'search_catalog',
  description: 'Search the full Mini-Circuits catalog (~16,000 models, full site parity). '
    + 'Call this whenever the user asks about parts, specs, alternatives, or a category. '
    + 'Returns matching parts with specs, datasheet links, price/stock when known. '
    + 'Combine filters for best results.',
  input_schema: {
    type: 'object',
    properties: {
      category:  { type: 'string', description: 'Product type, e.g. amplifier, LNA, filter, mixer, switch, splitter, attenuator, coupler, transformer, balun, oscillator, power sensor, test system.' },
      keywords:  { type: 'string', description: 'Free-text keywords: part number fragment, application (5G, GPS, WiFi, DOCSIS), technology (LTCC, MMIC), connector (SMA), etc.' },
      freq_mhz:  { type: 'number', description: 'A SINGLE operating frequency in MHz the part must cover. Use this for a point spec (e.g. "works at 2.4 GHz").' },
      freq_min:  { type: 'number', description: 'Low end (MHz) of a required band. Use together with freq_max when the user wants a part covering a RANGE (e.g. "5 to 1800 MHz" -> freq_min=5, freq_max=1800). Only parts whose range fully covers [freq_min, freq_max] are returned.' },
      freq_max:  { type: 'number', description: 'High end (MHz) of a required band. See freq_min.' },
      impedance: { type: 'number', description: 'System impedance in ohms (e.g. 50 or 75). Useful for transformers/baluns, terminations, matching pads.' },
      impedance_ratio: { type: 'string', description: 'Transformer/balun IMPEDANCE RATIO from the catalog, e.g. "1", "2", "4" (you may pass "4:1"). Mini-Circuits uses impedance ratio, not turns ratio.' },
      max_nf:    { type: 'number', description: 'Maximum noise figure in dB (amplifiers/LNAs).' },
      min_gain:  { type: 'number', description: 'Minimum gain in dB.' },
      max_price: { type: 'number', description: 'Maximum unit price in USD.' },
      in_stock:  { type: 'boolean', description: 'Only return parts currently marked in stock.' },
      limit:     { type: 'number', description: 'Max results to return (default 12, max 25).' },
    },
  },
}, {
  name: 'get_product_details',
  description: 'Get LIVE pricing tiers, current stock, and the full downloadable file list (datasheet, View Data, View Graphs, S-parameters, case-style drawing, PCB layout, eval board, etc.) for ONE specific part number, straight from minicircuits.com. Call this whenever the user asks about a specific part — its price, availability/stock, datasheet, or files — or says "tell me about <PN>". Returns real data; if found is false, the part page could not be loaded.',
  input_schema: {
    type: 'object',
    properties: { pn: { type: 'string', description: 'Exact Mini-Circuits part number, e.g. HFTC-16+, WVA-71863HP+.' } },
    required: ['pn'],
  },
}];

// Compact, non-catalog summary (small enough to keep in the prompt)
const NONCAT_SUMMARY = NONCATALOG.map(p => `• ${p.group}: ${(p.desc || '').slice(0, 160)} (${p.url})`).join('\n');

function buildSystemPrompt() {
  return `You are Minny, the Mini-Circuits RF assistant — a knowledgeable, approachable RF & microwave applications engineer who helps customers select the right parts and answer technical questions on www.minicircuits.com.

TONE & VOICE
Professional, warm, and concise — like a real Mini-Circuits applications engineer talking with a design engineer. Use plain, confident, human language. Do NOT use a cartoon/robot persona, "ZAP", "*antennae*" stage directions, or exclamation-heavy hype. Emoji: essentially none (at most a single, rare one). Match Mini-Circuits' clean, precise, technical B2B voice. Be helpful and direct; respect the customer's time.

HOW YOU FIND PARTS
You have a tool, search_catalog, backed by the FULL Mini-Circuits catalog (~${ALL_PRODUCTS.length.toLocaleString()} models — every model on the website, including connector/mechanical variants).
• ALWAYS use search_catalog to find or recommend parts. Every part number you name MUST come from a tool result.
• For a frequency RANGE ("5 to 1800 MHz") pass freq_min + freq_max so only parts that cover the whole band come back. For a single frequency use freq_mhz.
• You may call it multiple times to refine (e.g. widen frequency, drop a constraint) if the first search is too narrow or empty.

LIVE PRODUCT DETAILS — pricing, stock & files
When the user asks about a SPECIFIC part (its price, stock/availability, datasheet, S-parameters, or "tell me about <PN>"), call get_product_details with that part number. It returns LIVE data from minicircuits.com. Then present:
• Pricing & Availability: render the quantity/unit-price tiers as a small HTML <table> (NOT a markdown table — markdown tables don't render here). Show the current stock exactly as returned (e.g. "more than 1,000"). If price_tiers/stock are absent, say pricing isn't published online and offer escalation — never invent numbers.
• Data, Drawings & Downloads: list the returned files as HTML links — Datasheet, View Data, View Graphs, S-Parameters, Case Style drawing, PCB Layout, Eval Board, etc. Use the exact href values from the tool (e.g. <a href="URL" target="_blank">Datasheet (PDF)</a>).
Only state pricing/stock/files that the tool actually returned.

ACCURACY — HARD RULES (do not break these)
• State ONLY spec values that appear in the tool result for that exact part. Frequency range, gain, NF, P1dB, impedance, package/case, turns ratio, temperature, price, stock — if a value is NOT in the result, you may NOT state a number. Say "see datasheet" or leave it out. NEVER invent, estimate, or back-fill a spec to match what the user asked for.
• The frequency range you show for a part MUST be the flo–fhi from the tool result. If the result has no flo/fhi, do not state a range.
• If search_catalog returns 0 results, say so plainly and either ask to relax a constraint or offer to escalate — do NOT invent a part or its specs.
• Don't claim a part covers a band unless its returned flo–fhi actually spans it.

NARROWING DOWN — PRESENT A FILL-IN TEMPLATE, NOT A Q-BY-Q INTERROGATION
HARD GATE: until the user has supplied the category's DECISIVE parameters (or explicitly says "just show me" / "show all"), your reply MUST contain ZERO part numbers and ZERO recommendations — output ONLY the fill-in template. Having search matches is NOT a reason to list them. A reply that shows even one part while a decisive parameter is still unknown is WRONG. Never show options for two different values of a decisive parameter (e.g. a 50Ω pick AND a 75Ω pick) — that is the exact mistake to avoid.

When a request is under-specified, do NOT drip one question per turn either. Instead, in ONE message present a short, category-specific TEMPLATE of the decisive parameters and ask the user to fill in what they know. Pre-fill anything they already gave (mark it ✓) and tell them explicitly they can leave any line blank or write "any"/"don't care" — unknown fields are left unconstrained in the search.

Template format (keep it compact, one line per field):
  To find the right <category>, fill in what you know (leave blank / "any" if unsure):
  • Frequency: <known value ✓, else blank>
  • <decisive param 1>: <options>
  • <decisive param 2>: <options>
  • <secondary param>: <options>
  Reply with whatever you've got and I'll find the best matches.

Then, when the user replies (even partially), search with the provided constraints, treat blanks/"any" as unconstrained, and return a focused top 3 — briefly noting which constraints you left open (e.g. "(any package)"). Do NOT keep asking for the blanks they left; respect that they don't know or don't care.

DECISIVE PARAMETERS BY CATEGORY (use these as the template fields; most-decisive first; always include a Frequency line):
• Amplifier / LNA / gain block / driver / PA: application (receive = low NF / transmit = high P1dB·Psat·OIP3), Vcc/bias, package (SMT vs connectorized).
• Transformer / Balun: system impedance (50Ω or 75Ω), IMPEDANCE RATIO (1:1, 2:1, 4:1 …), DC pass vs DC isolation, power level, package.
• Filter: type (low-pass / high-pass / band-pass / band-stop / diplexer), cutoff or passband edges, required rejection, power, technology (LTCC / cavity / reflectionless).
• Mixer: passive vs active, LO drive level (e.g. level 7/10/13/17), RF / LO / IF bands.
• Frequency multiplier: multiplication factor (×2, ×3 …), input & output frequency, input drive level.
• Attenuator — fixed: attenuation value (dB), power handling, package. Programmable/DSA: attenuation range & step size, control interface (parallel/serial/USB), speed.
• Splitter / Combiner: number of ways (2,3,4…), phase type (0° / 90° / 180°), impedance, power, isolation.
• Coupler: coupling value (dB), directivity, power, single vs dual/bi-directional.
• Switch: configuration/throws (SPST, SPDT, SP4T…), reflective vs absorptive (terminated), speed, control logic/voltage, power.
• Bias Tee: frequency, max DC current & voltage, insertion loss.
• DC Block: which line (inner / outer / both), frequency, power.
• RF Choke: frequency, DC current rating, inductance.
• Limiter: frequency, limiting/threshold level, max input power, recovery time.
• Termination / Load: power handling, frequency, connector, impedance (50/75Ω).
• Adapter: connector types & genders (e.g. SMA-M → N-F), frequency.
• Cable: connector types, length, frequency, flexibility / phase stability.
• Equalizer: fixed or voltage-variable, slope (dB), frequency.
• Waveguide: waveguide band (WR-xx) / component type, frequency.
• Impedance Matching Pad: impedance conversion (e.g. 50→75Ω), frequency.
• MMIC die: function (amp/mixer/switch…), frequency (bare die for assembly).
• Modulator / Demodulator: IQ / vector type, frequency, baseband bandwidth.
• Phase shifter: analog or digital (bits), phase range, frequency, control.
• Phase / Power detector: frequency; for power detectors, detection range (dBm) and type (log / RMS / peak).
• Power sensor: frequency, power range, interface (USB).
• Oscillator / VCO: output frequency or tuning range, phase-noise requirement, tuning voltage.
• Synthesizer: frequency range, step/resolution, phase noise, reference/control interface.
• Test systems / instruments: configurable systems — ask application/channel-count, then route to the team with [NEEDS_HUMAN].
For any category not listed, build a template from its 2–4 most decisive parameters.

TRANSFORMER / BALUN TERMINOLOGY (important): Mini-Circuits specs use "IMPEDANCE RATIO" — there is NO "turns ratio" field. Always call it "impedance ratio" and use the impedance_ratio value from the tool result (e.g. 1:1, 2:1, 4:1). Never say "turns ratio" and never compute/invent a secondary impedance (e.g. "50→200Ω") unless that value is in the tool result.

CONVERSATION RULES (STRICT)
RULE 1 — On an under-specified request, your ENTIRE reply is the fill-in TEMPLATE — no part numbers, no cards, no "here are a few to start". Not a single drip question, and not a parts list. (Frequency given but impedance/ratio/type still unknown = under-specified.)
RULE 2 — When the user replies, search with what they gave, treat blanks/"any" as unconstrained, and recommend a focused top 3. Don't re-ask for fields they left blank.
RULE 3 — If the user gives enough upfront (e.g. "2.4 GHz 50Ω 1:1 SMT balun" or "2.4 GHz LNA, NF<2dB, 5V"), skip the template, search, recommend.
RULE 4 — If the user says "just show me options" / "list them" / "I don't care, show all", list a top 3–5 immediately with no template.
RULE 5 — Never present a parts list that spans more than one value of a decisive parameter and then ask at the end. Pin it via the template first, or note plainly that you left it open.

RESPONSE FORMAT — SHORT, FITS A NARROW CHAT PANEL
Questions: one line, no preamble. "What's your frequency range?"
Recommendations: keep it tight. Lead with ONE best pick (part number in <strong>) and a one-line reason. The frontend auto-renders a product card (with specs) for every part number you mention, so DO NOT also paste a big multi-column markdown table — it just duplicates the cards and overflows the panel. At most a 2–4 row mini spec list for the lead pick, using only real values from the tool.
Mention up to 3 parts total unless asked for more. For each, only state specs the tool returned.
Price/stock: if unknown, write "see live pricing on the product page" with the datasheet link — never guess a number or show "$undefined".
Calculations: formula → substituted values → result.
Troubleshooting: numbered steps.
HTML allowed: <strong>, <em>, <br>, <ul><li>, <table>, <a>. Keep minimal.

LINKS: the chat renders HTML. Write links as HTML anchors: <a href="URL" target="_blank">text</a>. (Markdown links also render, but prefer HTML.) Always link the Datasheet and Product Page when you mention them. You don't need to manually link part numbers — every part number you bold (<strong>PN</strong>) is auto-linked to its product page by the system.

TAPPABLE CHIPS — whenever your message ASKS something (a question or the fill-in template), end the message with one line, exactly:
CHIPS:: option one :: option two :: option three
These render as buttons the user can tap to answer. Rules: 2–5 chips, each under ~24 characters, plain text (no HTML/emoji), separated by " :: ". Always include a helpful catch-all like "Not sure" or "Just show all" when relevant. Do NOT add a CHIPS line to a pure recommendation/answer that asks nothing. Example for a balun impedance question:
CHIPS:: 50Ω :: 75Ω :: Not sure

RF EXPERTISE (calculations — show work)
• VSWR↔RL: RL(dB) = −20·log₁₀((VSWR−1)/(VSWR+1))
• |Γ| = (VSWR−1)/(VSWR+1); Reflected power = |Γ|²×100%
• Friis: NF_total = NF₁ + (NF₂−1)/G₁ + (NF₃−1)/(G₁·G₂) + …
• Input P1dB = Output P1dB − Gain; IIP3 ≈ Input P1dB + 10 dBm
• dBm↔mW: P(mW)=10^(dBm/10); Noise temp T_e=290×(NF_lin−1) K
• Golden rule: best LNA goes FIRST — it dominates system NF.

NON-CATALOG / CUSTOM LINES
These have no public price/specs. If the user needs them, briefly describe the line, link the page, and route to the team with [NEEDS_HUMAN].
${NONCAT_SUMMARY}

HONESTY — NO HALLUCINATION (most important rule)
Never guess, estimate, approximate, or fabricate. If you do not have something — a specific spec value, a temperature/voltage derating, a compatibility or drop-in answer, a behavior you're not certain of, or anything you cannot confirm from the tool results or solid RF fundamentals — SAY SO PLAINLY: "I don't have that information" or "I can't confirm that." Do NOT fill the gap with a plausible-sounding number or claim. A clear "I don't know" is always better than a confident guess, and guessing is the worst thing you can do here.

Whenever you don't know, can't confirm, or the request needs a person (exact datasheet specs you don't have, bulk/custom pricing, account management, lead times, or anything outside RF/Mini-Circuits), tell the user they can reach the Mini-Circuits applications engineering team by email and write it as a clickable link: <a href="mailto:apps@minicircuits.com">apps@minicircuits.com</a>. Then add [NEEDS_HUMAN]. Keep it brief, e.g.: I don't have that exact spec in front of me and I won't guess — the apps team can confirm it: <a href="mailto:apps@minicircuits.com">apps@minicircuits.com</a>. [NEEDS_HUMAN]

Frequency units are MHz unless stated. Gain/NF/IL/rejection in dB; power in dBm; Vcc in V; Icc in mA.`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractMentionedProducts(text) {
  const upper = text.toUpperCase();
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const hits = [];
  const seen = new Set();
  for (const p of ALL_PRODUCTS) {
    if (p.cat === 'noncat') continue;
    const pnU = p.pn.toUpperCase();
    // Whole-token match only: the part number must be bounded by a non
    // [A-Z0-9-+] character (or string edge). This prevents short part numbers
    // (e.g. TC1-1+) from falsely matching inside longer ones (TC1-1-13M+).
    const re = new RegExp(`(^|[^A-Z0-9+-])${esc(pnU)}(?![A-Z0-9+-])`);
    if (re.test(upper) && !seen.has(p.pn)) { seen.add(p.pn); hits.push(normalize(p)); }
    if (hits.length >= 6) break;
  }
  // Order cards to match the order parts appear in the reply.
  hits.sort((a, b) => upper.indexOf(a.pn.toUpperCase()) - upper.indexOf(b.pn.toUpperCase()));
  return hits;
}

// ── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'SQUEAKY CLEAN 🧽',
    products: ALL_PRODUCTS.length,
    with_specs: RICH.length,
    noncatalog_lines: NONCATALOG.length,
    model: MODEL,
    apiKeySet: !!process.env.ANTHROPIC_API_KEY,
  });
});

// Catalog browser API — returns RICH records by default (clean cards),
// filterable by q / cat / freq / limit. Pass ?all=1 to include every model.
app.get('/api/products', (req, res) => {
  const { cat, pn, q, freq, all, limit } = req.query;
  let pool = all ? ALL_PRODUCTS.filter(p => p.cat !== 'noncat') : RICH;
  let results = pool.map(normalize);
  if (cat)  results = results.filter(p => p.cat === cat);
  if (pn)   results = results.filter(p => p.pn === pn);
  if (q) {
    const needle = String(q).toLowerCase();
    results = results.filter(p => (`${p.pn} ${p.desc} ${p.group}`).toLowerCase().includes(needle));
  }
  if (freq) {
    const f = parseFloat(freq);
    results = results.filter(p => p.flo != null && p.fhi != null && p.flo <= f && f <= p.fhi);
  }
  results.sort((a, b) => (a.cat + a.pn).localeCompare(b.cat + b.pn));
  if (limit) results = results.slice(0, parseInt(limit, 10));
  res.json(results);
});

// Direct search API (handy for the frontend / debugging)
app.get('/api/search', (req, res) => {
  const args = { ...req.query };
  ['freq_mhz', 'max_nf', 'min_gain', 'max_price', 'limit'].forEach(k => { if (args[k] != null) args[k] = parseFloat(args[k]); });
  if (args.in_stock != null) args.in_stock = args.in_stock === 'true' || args.in_stock === '1';
  res.json(searchCatalog(args));
});

// ── Product image proxy ──────────────────────────────────────────────────────
// Mini-Circuits blocks cross-origin hotlinking and keys most product photos by
// case style, not part number. This proxy fetches the real image server-side
// (with a valid referer), trying the known path variants, and caches results so
// product cards can show the same photos as minicircuits.com.
const imgCache = new Map();
function fetchMcImage(p) {
  return new Promise((resolve) => {
    const req = https.get({
      hostname: 'www.minicircuits.com', path: encodeURI(p),
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.minicircuits.com/', 'Accept': 'image/*' },
    }, (r) => {
      if (r.statusCode !== 200 || !/image\//.test(r.headers['content-type'] || '')) { r.resume(); return resolve(null); }
      const ch = []; r.on('data', c => ch.push(c)); r.on('end', () => resolve({ buf: Buffer.concat(ch), type: r.headers['content-type'] }));
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
  });
}
app.get('/api/img', async (req, res) => {
  const pn = String(req.query.pn || '').trim();
  const cs = String(req.query.case || '').trim();
  if (!pn) return res.status(400).end();
  const key = pn + '|' + cs;
  if (imgCache.has(key)) {
    const c = imgCache.get(key);
    if (!c) return res.status(404).end();
    res.set('Content-Type', c.type); res.set('Cache-Control', 'public, max-age=604800');
    return res.end(c.buf);
  }
  const candidates = [`/images/${pn}.png`];
  if (cs) candidates.push(`/images/case_style/${cs}.png`, `/images/model/${cs}_HS.png`, `/images/case_style/${cs}_HS.png`);
  for (const path of candidates) {
    const img = await fetchMcImage(path);
    if (img) { imgCache.set(key, img); res.set('Content-Type', img.type); res.set('Cache-Control', 'public, max-age=604800'); return res.end(img.buf); }
  }
  imgCache.set(key, null);
  res.status(404).end();
});

// ── Live product details (pricing, stock, files) ────────────────────────────
// The minicircuits.com dashboard is server-rendered ONLY when a session cookie
// is present. We grab a session cookie from the homepage, then fetch the
// dashboard for a part and parse its price tiers, current stock, and the full
// "Data, Drawings & Downloads" file list. Results are cached.
function mcGet(path, cookie) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'www.minicircuits.com', path, method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html', 'Cookie': cookie || '' },
    }, (r) => { let d = ''; r.on('data', c => d += c); r.on('end', () => resolve({ status: r.statusCode, setCookie: r.headers['set-cookie'], body: d })); });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.setTimeout(12000, () => { req.destroy(); resolve({ status: 0, body: '' }); });
    req.end();
  });
}
let mcCookie = null, mcCookieAt = 0;
async function getMcCookie() {
  if (mcCookie && Date.now() - mcCookieAt < 25 * 60 * 1000) return mcCookie;
  const home = await mcGet('/', '');
  mcCookie = (home.setCookie || []).map(c => c.split(';')[0]).join('; ');
  mcCookieAt = Date.now();
  return mcCookie;
}
const productCache = new Map();
async function getProductDetails(pn) {
  pn = String(pn || '').trim();
  if (!pn) return { found: false };
  const cached = productCache.get(pn);
  if (cached && Date.now() - cached.at < 30 * 60 * 1000) return cached.data;
  let cookie = await getMcCookie();
  let r = await mcGet(`/WebStore/dashboard.html?model=${encodeURIComponent(pn)}`, cookie);
  if (r.body.length < 2000) { mcCookie = null; cookie = await getMcCookie(); r = await mcGet(`/WebStore/dashboard.html?model=${encodeURIComponent(pn)}`, cookie); }
  const html = r.body || '';
  const data = { pn, found: html.length > 2000, url: `/p/${encodeURIComponent(pn)}` };
  const tm = html.match(/<title>([^<|]+)/); if (tm) data.title = tm[1].trim();
  const tiers = [...html.matchAll(/<td class="td_length">\s*([\s\S]*?)\s*<\/td>\s*<td class="td_length2">\s*(?:&#36;|\$)?\s*([\d.]+)\s*<\/td>/g)]
    .map(m => { const q = m[1].replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim(); const num = parseInt(q.replace(/,/g, ''), 10); return { qty: isNaN(num) ? q : num, price: parseFloat(m[2]) }; });
  if (tiers.length) data.price_tiers = tiers;
  const sm = html.match(/<span[^>]*class="[^"]*current_stock_number[^"]*"[^>]*>([^<]*)<\/span>/i);
  if (sm) { const v = sm[1].replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim(); if (v) data.stock = v; }
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#36;/g, '$').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
  const files = []; const seen = new Set(); let lm;
  const linkRe = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  while ((lm = linkRe.exec(html)) !== null) {
    let href = lm[1]; const label = decode(lm[2].replace(/<[^>]+>/g, ''));
    if (!/\/pdfs\/|\/pages\/s-params\/|\/case_style\/|\/pcb\/|gerber/i.test(href)) continue;
    if (/patent|product-catalog|case_style_search/i.test(href)) continue;
    if (!href.startsWith('http')) href = 'https://www.minicircuits.com' + (href.startsWith('/') ? '' : '/') + href.replace(/^\.\.\//, '/');
    if (seen.has(href) || !label) continue; seen.add(href);
    // Serve files THROUGH our domain (proxied) so nothing leaves the site.
    files.push({ label, href: '/dl?u=' + encodeURIComponent(href) });
  }
  if (files.length) data.files = files.slice(0, 16);
  productCache.set(pn, { data, at: Date.now() });
  return data;
}

app.get('/api/product', async (req, res) => {
  try { res.json(await getProductDetails(req.query.pn)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── File proxy — stream Mini-Circuits files through OUR domain ────────────────
app.get('/dl', (req, res) => {
  let u; try { u = new URL(req.query.u); } catch { return res.status(400).send('bad url'); }
  if (!/(^|\.)minicircuits\.com$/i.test(u.hostname)) return res.status(403).send('forbidden host');
  const opts = { hostname: u.hostname, path: u.pathname + u.search, headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.minicircuits.com/', 'Accept': '*/*' } };
  const upstream = https.get(opts, (r) => {
    if (r.statusCode && r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
      // follow one redirect
      https.get(r.headers.location, { headers: opts.headers }, (r2) => { pipe(r2); }).on('error', () => res.status(502).end());
      return;
    }
    pipe(r);
  });
  upstream.on('error', () => res.status(502).send('upstream error'));
  upstream.setTimeout(15000, () => { upstream.destroy(); res.status(504).end(); });
  function pipe(r) {
    res.set('Content-Type', r.headers['content-type'] || 'application/octet-stream');
    res.set('Cache-Control', 'public, max-age=86400');
    const fn = u.pathname.split('/').pop() || 'file';
    if (/\.(pdf|zip|s2p)$/i.test(fn)) res.set('Content-Disposition', 'inline; filename="' + fn + '"');
    r.pipe(res);
  }
});

// ── Asset proxy — serve minicircuits.com CSS/JS/fonts/images from OUR origin ──
// (same-origin avoids the cross-origin font/CORS blocking that turns icons into
//  boxes, so the mirrored pages render with their exact fonts and icons.)
app.get('/mc/*', (req, res) => {
  const rest = req.originalUrl.slice('/mc/'.length);
  if (!rest) return res.status(400).end();
  const fetchPath = (p, redirects) => {
    const r = https.get({ hostname: 'www.minicircuits.com', path: '/' + p, headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': MC + '/', 'Accept': '*/*' } }, (up) => {
      if (up.statusCode >= 300 && up.statusCode < 400 && up.headers.location && redirects < 3) {
        up.resume(); const loc = up.headers.location.replace(/^https?:\/\/[^/]*minicircuits\.com\//i, ''); return fetchPath(loc.replace(/^\//, ''), redirects + 1);
      }
      res.set('Access-Control-Allow-Origin', '*');
      if (up.headers['content-type']) res.set('Content-Type', up.headers['content-type']);
      res.set('Cache-Control', 'public, max-age=604800');
      up.pipe(res);
    });
    r.on('error', () => res.status(502).end());
    r.setTimeout(15000, () => { r.destroy(); res.status(504).end(); });
  };
  fetchPath(rest, 0);
});

// ── Product page — mirror the REAL dashboard (exact icons/fonts/layout) but
//    rewrite links so products stay on our domain and files stream via /dl. ──
const MC = 'https://www.minicircuits.com';
const dashCache = new Map();
async function mirrorDashboard(pn) {
  const c = dashCache.get(pn);
  if (c && Date.now() - c.at < 30 * 60 * 1000) return c.html;
  let cookie = await getMcCookie();
  let r = await mcGet('/WebStore/dashboard.html?model=' + encodeURIComponent(pn), cookie);
  if ((r.body || '').length < 3000) { mcCookie = null; cookie = await getMcCookie(); r = await mcGet('/WebStore/dashboard.html?model=' + encodeURIComponent(pn), cookie); }
  let h = r.body || '';
  if (h.length < 3000) return null;
  h = rewriteDashboard(h);
  dashCache.set(pn, { html: h, at: Date.now() });
  return h;
}
// Live mirror of the real minicircuits.com homepage (served at "/").
let homeCache = null;
async function mirrorHomepage() {
  if (homeCache && Date.now() - homeCache.at < 30 * 60 * 1000) return homeCache.html;
  const cookie = await getMcCookie();
  let r = await mcGet('/', cookie);
  if ((r.body || '').length < 5000) { const g = await mcGet('/WebStore/Homepage.html', cookie); if ((g.body || '').length > (r.body || '').length) r = g; }
  let h = r.body || '';
  if (h.length < 5000) return null;
  h = rewriteDashboard(h);
  homeCache = { html: h, at: Date.now() };
  return h;
}
// Generic live mirror of any other minicircuits.com page (nav links -> /m/<path>).
const pageCache = new Map();
async function mirrorPage(mcPath) {
  mcPath = '/' + String(mcPath || '').replace(/^\/+/, '');
  const c = pageCache.get(mcPath);
  if (c && Date.now() - c.at < 30 * 60 * 1000) return c.html;
  const cookie = await getMcCookie();
  let r = await mcGet(mcPath, cookie);
  if ((r.body || '').length < 1500) { const g = await mcGet(mcPath.split('?')[0], cookie); if ((g.body || '').length > (r.body || '').length) r = g; }
  let h = r.body || '';
  if (h.length < 800) return null;
  h = rewriteDashboard(h);
  pageCache.set(mcPath, { html: h, at: Date.now() });
  return h;
}
function rewriteDashboard(h) {
  // A) product links -> our /p/  (root-relative, so unaffected by <base>).
  //    WebStore/ prefix is optional (category tables use bare modelSearch.html?model=).
  h = h.replace(/(href|action)\s*=\s*"(?:https?:\/\/[^"]*minicircuits\.com)?(?:\.\.\/|\/)?(?:WebStore\/)?(?:dashboard|modelSearch)\.html\?model=([^"&]+)[^"]*"/gi, (m, a, enc) => `${a}="/p/${enc}"`);
  // B) downloadable files -> /dl proxy (served from our domain)
  h = h.replace(/href\s*=\s*"((?:https?:\/\/[^"]*minicircuits\.com)?(?:\.\.\/|\/)?(?:pdfs|pages\/s-params|case_style|pcb)\/[^"]+)"/gi, (m, p) => {
    let abs = p.startsWith('http') ? p : MC + '/' + p.replace(/^(?:\.\.\/|\/)+/, '');
    return 'href="/dl?u=' + encodeURIComponent(abs) + '" target="_blank"';
  });
  // C) absolute minicircuits.com asset URLs -> our same-origin /mc proxy
  h = h.replace(/(src|href)\s*=\s*"https?:\/\/(?:www\.)?minicircuits\.com\/([^"]+\.(?:css|js|png|jpe?g|gif|svg|woff2?|ttf|eot|ico|webp)(?:\?[^"]*)?)"/gi, (m, a, rest) => `${a}="/mc/${rest}"`);
  // C2) ROOT-relative asset paths (e.g. /images/case_style/X.png) — <base> would
  //     send these to our origin (404), so route them through /mc too.
  h = h.replace(/(src|href)\s*=\s*"\/(?!mc\/|p\/|dl\?|assets\/|minny-widget)([^"]+\.(?:css|js|png|jpe?g|gif|svg|woff2?|ttf|eot|ico|webp)(?:\?[^"]*)?)"/gi, (m, a, rest) => `${a}="/mc/${rest}"`);
  // D) keep Mini-Circuits page navigation on OUR domain: category Table-of-Models
  //    pages -> /c/<code>; any other www.minicircuits.com page -> /m/ live mirror.
  //    External subdomains (blog., lp., trackers) and assets are left untouched.
  h = h.replace(/href\s*=\s*"(?!\/p\/|\/dl\?|\/mc\/|\/c\/|\/m\/|#|mailto:|tel:|javascript:)([^"]*)"/gi, (m, url) => {
    if (/^https?:\/\/(?!(?:www\.)?minicircuits\.com)/i.test(url)) return m;          // external host
    if (/\.(?:css|js|png|jpe?g|gif|svg|woff2?|ttf|eot|ico|webp)(?:\?|$)/i.test(url)) return m; // asset
    let p = url.replace(/^https?:\/\/(?:www\.)?minicircuits\.com/i, '').replace(/#.*$/, '');
    p = p.replace(/^(?:\.\.\/)+/, '/');
    if (!p.startsWith('/')) p = '/' + p.replace(/^\/+/, '');
    if (p === '/' || p === '') return 'href="/"';
    const file = p.replace(/\?.*$/, '').split('/').pop().toLowerCase();
    if (CAT_BY_FILE[file]) return `href="/c/${CAT_BY_FILE[file]}"`;
    return `href="/m${p}"`;
  });
  // E) don't let the Buy form post to their store
  h = h.replace(/<form([^>]*?)\saction\s*=\s*"[^"]*"/gi, '<form$1 action="javascript:void(0)"');
  // F) <base> so ALL relative assets (images/, ../css/, js/) resolve through the
  //    /mc proxy at the correct /WebStore/-relative path → exact icons, fonts, layout.
  h = h.replace(/<head([^>]*)>/i, (m) => m + '\n<base href="/mc/WebStore/">');
  // G) inject (1) a filter enhancer that neutralizes the broken cross-origin
  //    "Network Error" AJAX and adds working client-side filtering, and (2) our widget.
  const inject = '\n' + CATEGORY_ENHANCER + '\n<script src="/minny-widget.js"></script>\n';
  h = /<\/body>/i.test(h) ? h.replace(/<\/body>/i, inject + '</body>') : h + inject;
  return h;
}
const CATEGORY_ENHANCER = `<script>(function(){try{
  var _alert=window.alert;window.alert=function(m){if(/network error/i.test(String(m||'')))return;try{return _alert.apply(window,arguments)}catch(e){}};
  var _open=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url){try{if(typeof url==='string'&&/IBehaviorListener|onPageLoad|wicket|\\\\?.*random=|\\\\.html\\\\?/i.test(url))this.__blk=true;}catch(e){}return _open.apply(this,arguments);};
  var _send=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.send=function(){if(this.__blk){return;}return _send.apply(this,arguments);};
  function ready(fn){if(document.readyState!=='loading')fn();else document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    var rows=[].slice.call(document.querySelectorAll('tr[name="data_row"], tr.data_rows'));
    if(rows.length<2)return;
    rows.forEach(function(r){r.__t=(r.innerText||'').toLowerCase();});
    var table=rows[0].closest('table'); if(!table)return;
    var hrow=null,allTr=[].slice.call(table.querySelectorAll('tr'));
    for(var hk=0;hk<allTr.length&&!hrow;hk++){var hc=allTr[hk].children;for(var hj=0;hj<hc.length;hj++){if(/^\\s*model\\s*number/i.test(hc[hj].innerText||'')){hrow=allTr[hk];break;}}}
    var heads=hrow?[].slice.call(hrow.children).map(function(h){return (h.innerText||'').toLowerCase();}):[];
    function ci(re){for(var i=0;i<heads.length;i++)if(re.test(heads[i]))return i;return -1;}
    var iLow=ci(/f\\s*low/),iHigh=ci(/f\\s*high/);
    var bar=document.createElement('div');
    bar.style.cssText='margin:14px 0;padding:12px 14px;background:#eef3fb;border:1px solid #d6deea;border-radius:6px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-family:Arial,sans-serif';
    bar.innerHTML='<strong style="color:#0b2b66">Quick filter:</strong>'
      +'<input id="mcq" placeholder="Part number or keyword…" style="flex:1;min-width:200px;padding:8px 12px;border:1.5px solid #b9c4d6;border-radius:6px;font-size:14px">'
      +'<input id="mclo" type="number" placeholder="Freq min (MHz)" style="width:140px;padding:8px;border:1.5px solid #b9c4d6;border-radius:6px">'
      +'<input id="mchi" type="number" placeholder="Freq max (MHz)" style="width:140px;padding:8px;border:1.5px solid #b9c4d6;border-radius:6px">'
      +'<span id="mcn" style="color:#5b6b85;font-size:13px"></span>';
    table.parentNode.insertBefore(bar,table);
    function num(v){var m=String(v==null?'':v).match(/-?\\d+(?:\\.\\d+)?/);return m?parseFloat(m[0]):null;}
    var q=bar.querySelector('#mcq'),lo=bar.querySelector('#mclo'),hi=bar.querySelector('#mchi'),cn=bar.querySelector('#mcn');
    function apply(){var t=q.value.toLowerCase().trim(),L=num(lo.value),H=num(hi.value),s=0;
      for(var i=0;i<rows.length;i++){var r=rows[i],ok=true;if(t&&r.__t.indexOf(t)<0)ok=false;
        if(ok&&(L!=null||H!=null)&&iLow>=0&&iHigh>=0){var c=r.children;var rl=num(c[iLow]&&c[iLow].innerText),rh=num(c[iHigh]&&c[iHigh].innerText);
          if(rl!=null&&rh!=null){if(L!=null&&rh<L)ok=false;if(H!=null&&rl>H)ok=false;}}
        r.style.display=ok?'':'none';if(ok)s++;}
      cn.textContent=s+' of '+rows.length+' shown';}
    var tmr;function deb(){clearTimeout(tmr);tmr=setTimeout(apply,130);}
    q.addEventListener('input',deb);lo.addEventListener('input',deb);hi.addEventListener('input',deb);apply();
    var pulsed=false;document.addEventListener('change',function(e){var el=e.target;if(!el||el.tagName!=='INPUT'&&el.tagName!=='SELECT')return;if(bar.contains(el))return;try{bar.scrollIntoView({block:'center',behavior:'smooth'});}catch(e2){}bar.style.transition='box-shadow .25s';bar.style.boxShadow='0 0 0 3px #ff9100';setTimeout(function(){bar.style.boxShadow='';},900);if(!pulsed){pulsed=true;var o=cn.textContent;cn.textContent='\\u2191 Use this Quick filter to narrow the list';setTimeout(function(){cn.textContent=o;},2600);}});
  });
}catch(e){}})();</script>`;

app.get('/p/:pn', requirePasscode2, async (req, res) => {
  const pn = req.params.pn;
  res.set('Cache-Control', 'no-cache');
  res.set('Content-Type', 'text/html; charset=utf-8');
  try {
    const mirrored = await mirrorDashboard(pn);
    if (mirrored) return res.send(mirrored);
  } catch (e) {}
  // fallback: our own dashboard-style template if the live page can't be fetched
  let det = {}; try { det = await getProductDetails(pn); } catch (e) {}
  const rec = ALL_PRODUCTS.find(p => p.pn === pn);
  const n = rec ? normalize(rec) : { pn };
  res.send(renderProductPage(pn, n, det));
});
// product pages are public to browse (no chat cost); keep them open
function requirePasscode2(req, res, next) { return next(); }

// ── Category listing pages — every product in a category, hosted on our site ──
const CAT_NAMES = {
  adapter:'Adapters', amp:'Amplifiers', att:'Attenuators', bias:'Bias Tees', cable:'Cables',
  cpl:'Couplers', dcb:'DC Blocks', eq:'Equalizers', flt:'Filters', mix:'Frequency Mixers',
  mult:'Frequency Multipliers', match:'Impedance Matching Pads', lim:'Limiters',
  mod:'Modulators / Demodulators', osc:'Oscillators', pd:'Phase Detectors', ps:'Phase Shifters',
  pdet:'Power Detectors', psen:'Power Sensors', spl:'Power Splitters / Combiners', chk:'RF Chokes',
  sw:'Switches', syn:'Synthesizers', term:'Terminations', xfmr:'Transformers / Baluns',
  wg:'Waveguides', die:'MMIC Die', test:'Test Solutions', acc:'Accessories',
};
const CAT_INDEX = (() => {
  const m = {}; for (const p of ALL_PRODUCTS) { if (p.cat === 'noncat') continue; (m[p.cat] = m[p.cat] || []).push(p); } return m;
})();
function resolveCat(param) {
  const s = String(param || '').toLowerCase();
  if (CAT_NAMES[s]) return s;
  for (const code in CAT_NAMES) if (CAT_NAMES[code].toLowerCase().replace(/[^a-z]/g, '') === s.replace(/[^a-z]/g, '')) return code;
  // partial alias
  const ali = { amplifier:'amp', filter:'flt', mixer:'mix', attenuator:'att', splitter:'spl', combiner:'spl', switch:'sw', coupler:'cpl', transformer:'xfmr', balun:'xfmr', oscillator:'osc', vco:'osc', synthesizer:'syn' };
  for (const k in ali) if (s.includes(k)) return ali[k];
  return CAT_NAMES[s] ? s : (CAT_INDEX[s] ? s : null);
}
// Map our category codes to the real Mini-Circuits "Table of Models" pages.
const CAT_PAGE = {
  amp:'/WebStore/Amplifiers.html', att:'/WebStore/Attenuators.html', flt:'/WebStore/RF-Filters.html',
  mix:'/WebStore/Mixers.html', spl:'/WebStore/Splitters.html', sw:'/WebStore/Switches.html',
  cpl:'/WebStore/Couplers.html', xfmr:'/WebStore/Transformers.html', osc:'/WebStore/Oscillators.html',
  syn:'/WebStore/Synthesizers.html', ps:'/WebStore/PhaseShifters.html', mult:'/WebStore/Multipliers.html',
  bias:'/WebStore/BiasTees.html', dcb:'/WebStore/dc_blocks.html', term:'/WebStore/terminations.html',
  lim:'/WebStore/Limiters.html', pdet:'/WebStore/pd_coax.html', pd:'/WebStore/PhaseDetectors.html',
  mod:'/WebStore/ModulatorsDemodulators.html', chk:'/WebStore/rf_chokes.html', match:'/WebStore/MatchingPads.html',
  die:'/WebStore/Die.html', eq:'/WebStore/equalizers.html', adapter:'/WebStore/adapters.html',
  psen:'/WebStore/RF-Smart-Power-Sensors.html', cable:'/WebStore/Cables.html', wg:'/WebStore/Waveguides.html',
};
// reverse lookup: lowercased page filename (e.g. "amplifiers.html") -> our /c/ code
const CAT_BY_FILE = (() => { const m = {}; for (const code in CAT_PAGE) m[CAT_PAGE[code].split('/').pop().toLowerCase()] = code; return m; })();
function mcPost(path, cookie) {
  return new Promise((resolve) => {
    const body = 'action%3AX.onPageLoad.ajax=';
    const req = https.request({ hostname: 'www.minicircuits.com', path, method: 'POST',
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html', 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest', 'Referer': MC + path, 'Cookie': cookie || '' } },
      (r) => { let d = ''; r.on('data', c => d += c); r.on('end', () => resolve({ status: r.statusCode, body: d })); });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.setTimeout(20000, () => { req.destroy(); resolve({ status: 0, body: '' }); });
    req.write(body); req.end();
  });
}
const catPageCache = new Map();
async function mirrorCategory(code) {
  const page = CAT_PAGE[code];
  if (!page) return null;
  const c = catPageCache.get(code);
  if (c && Date.now() - c.at < 30 * 60 * 1000) return c.html;
  const cookie = await getMcCookie();
  let r = await mcPost(page, cookie);
  if ((r.body || '').length < 8000) { const g = await mcGet(page, cookie); if ((g.body || '').length > (r.body || '').length) r = g; }
  let h = r.body || '';
  if (h.length < 8000) return null;
  h = rewriteDashboard(h); // same rewrite: modelSearch->/p/, assets-><base>/mc, files->/dl, widget
  catPageCache.set(code, { html: h, at: Date.now() });
  return h;
}

app.get('/c/:cat', async (req, res) => {
  const code = resolveCat(req.params.cat);
  res.set('Cache-Control', 'no-cache'); res.set('Content-Type', 'text/html; charset=utf-8');
  try {
    const mirrored = await mirrorCategory(code);
    if (mirrored) return res.send(mirrored);
  } catch (e) {}
  // fallback: our own grid if the live table can't be fetched
  const list = (CAT_INDEX[code] || []).map(normalize);
  res.send(renderCategoryPage(code, CAT_NAMES[code] || (req.params.cat), list));
});
function renderCategoryPage(code, name, list) {
  const cards = list.map(p => {
    const f = (p.flo != null && p.fhi != null) ? (p.flo + '–' + p.fhi + ' MHz') : '';
    const bits = [f, p.gain != null ? ('Gain ' + p.gain + ' dB') : '', p.nf != null ? ('NF ' + p.nf + ' dB') : '', p.impedance != null ? (p.impedance + 'Ω') : ''].filter(Boolean).slice(0, 3).join(' · ');
    return `<a class="cc" href="/p/${encodeURIComponent(p.pn)}" data-s="${esc((p.pn + ' ' + (p.desc || '')).toLowerCase())}">
      <img loading="lazy" src="/api/img?pn=${encodeURIComponent(p.pn)}&case=${encodeURIComponent(p.case_style || '')}" onerror="this.style.display='none'">
      <div class="pn">${esc(p.pn)}</div>${p.desc ? '<div class="ds">' + esc(p.desc) + '</div>' : ''}${bits ? '<div class="sp">' + esc(bits) + '</div>' : ''}</a>`;
  }).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(name)} | Mini-Circuits</title><link rel="icon" href="/assets/favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Roboto+Condensed:wght@400;500;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Roboto Condensed',Arial,sans-serif;color:#1a2332;background:#f4f6fb}
a{color:#253b98;text-decoration:none}h1{font-family:'Cairo',sans-serif}
.top{background:#fff;border-bottom:1px solid #e6eaf2;padding:14px 24px;display:flex;align-items:center;gap:18px}.top img{height:42px}.top .nav{margin-left:auto;font-weight:700}
.wrap{max-width:1280px;margin:0 auto;padding:22px 24px 60px}
.crumb{color:#ff9100;font-size:13px;font-weight:700;margin-bottom:6px}.crumb a{color:#ff9100}
h1{font-size:30px;color:#0b1a3a;margin-bottom:4px}.cnt{color:#5b6b85;margin-bottom:16px}
#f{width:100%;max-width:380px;padding:10px 14px;border:1.5px solid #cdd6e6;border-radius:8px;font-size:14px;margin-bottom:18px;font-family:inherit}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.cc{background:#fff;border:1.5px solid #e2e8f0;border-radius:9px;padding:12px;display:flex;flex-direction:column;transition:.15s;min-height:120px}
.cc:hover{border-color:#ff9100;box-shadow:0 4px 14px rgba(0,0,0,.08)}
.cc img{height:70px;object-fit:contain;margin-bottom:8px;background:#fff}
.cc .pn{font-family:'Courier New',monospace;font-weight:800;color:#253b98;font-size:13px}
.cc .ds{font-size:11.5px;color:#5b6b85;margin:3px 0;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cc .sp{font-size:11px;color:#33415c;margin-top:auto;padding-top:5px}</style></head><body>
<div class="top"><a href="/"><img src="/assets/logo.png" alt="Mini-Circuits"></a><a class="nav" href="/">← Home / Chat with Minny</a></div>
<div class="wrap">
  <div class="crumb"><a href="/">RF &amp; Microwave Products</a> › ${esc(name)}</div>
  <h1>${esc(name)}</h1>
  <div class="cnt">${list.length.toLocaleString()} products — click any part for specs, pricing, stock &amp; downloads</div>
  <input id="f" placeholder="Filter ${esc(name)} by part number or description…" oninput="(function(v){v=v.toLowerCase();document.querySelectorAll('.cc').forEach(function(c){c.style.display=c.dataset.s.indexOf(v)>-1?'':'none'})})(this.value)">
  <div class="grid">${cards || '<div>No products found.</div>'}</div>
</div>
<script src="/minny-widget.js"></script>
</body></html>`;
}

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function renderProductPage(pn, n, det) {
  const title = n.desc || (det.title ? det.title.split('|')[0].trim() : pn);
  const group = n.group || 'Products';
  // Icons (inline SVG) keyed by file label, matching the real dashboard.
  const ic = {
    datasheet:'📄', data:'▦', graphs:'📈', sparam:'〽', case:'▣', tr:'▤', pcb:'⊞', eval:'🔬', gerber:'🗎', env:'🌡', file:'📄',
  };
  const iconFor = (label) => {
    const l = label.toLowerCase();
    if (l.includes('datasheet')) return ic.datasheet;
    if (l.includes('view data')) return ic.data;
    if (l.includes('graph')) return ic.graphs;
    if (l.includes('s-param')||l.includes('parameter')) return ic.sparam;
    if (l.includes('case')) return ic.case;
    if (l.includes('t & r')||l.includes('tape')) return ic.tr;
    if (l.includes('pcb')) return ic.pcb;
    if (l.includes('eval')) return ic.eval;
    if (l.includes('gerber')) return ic.gerber;
    if (l.includes('environ')) return ic.env;
    return ic.file;
  };
  const files = (det.files || []).map(f =>
    `<a class="dl" href="${esc(f.href)}" target="_blank" rel="noopener"><span class="ico">${iconFor(f.label)}</span> ${esc(f.label)}</a>`).join('');
  const addl = ['Export Info','RoHS','General Technical Notes','Application Notes','PCN History','Tools','Upscreening Services','Contact Us']
    .map(t => `<a class="ai" onclick="window.__minnySend && window.__minnySend('${esc(t)} for ${esc(pn)}');return false;" href="#">▸ ${esc(t)}</a>`).join('');
  const tiers = (det.price_tiers || []).map((t, i) =>
    `<tr class="${i % 2 ? 'alt' : ''}"><td>${esc(t.qty)}</td><td>$${esc(t.price)}</td></tr>`).join('');
  const img = `<img src="/api/img?pn=${encodeURIComponent(pn)}&case=${encodeURIComponent(n.case_style || '')}" onerror="this.style.display='none'" style="max-width:250px;max-height:210px;object-fit:contain">`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | ${esc(pn)} | Mini-Circuits</title>
<link rel="icon" href="/assets/favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Roboto+Condensed:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Roboto Condensed',Arial,sans-serif;color:#1a2332;background:#fff}
a{color:#1f5fbf;text-decoration:none}a:hover{text-decoration:underline}h1,h2,h3{font-family:'Cairo',sans-serif}
.top{background:#fff;border-bottom:1px solid #e6eaf2;padding:14px 24px;display:flex;align-items:center;gap:18px}
.top img{height:44px}.topnav{margin-left:auto;display:flex;gap:22px;font-weight:600;color:#0b1a3a;font-size:14px}
.wrap{max-width:1280px;margin:0 auto;padding:20px 24px 70px}
.crumb{color:#ff9100;font-size:14px;font-weight:700;margin-bottom:6px}.crumb a{color:#ff9100}
h1{font-size:34px;color:#0b1a3a;letter-spacing:-.5px}.sub{font-size:22px;color:#1a2b4a;margin:2px 0 22px;font-weight:400}
.grid{display:grid;grid-template-columns:250px 1fr 1fr 300px;gap:18px;align-items:start}
@media(max-width:1050px){.grid{grid-template-columns:1fr 1fr}}@media(max-width:680px){.grid{grid-template-columns:1fr}}
.box{border:1px solid #d6deea;border-radius:3px;overflow:hidden;background:#fff}
.box h3{background:#0b2b66;color:#fff;font-size:16px;font-weight:700;padding:12px 15px}
.box .bd{padding:6px 15px 14px}
.dl{display:flex;align-items:center;gap:12px;padding:11px 2px;border-bottom:1px solid #eef1f7;font-size:16px;font-weight:600;color:#1f5fbf}
.dl:last-child{border-bottom:0}.dl .ico{font-size:20px;width:26px;text-align:center;color:#0b2b66}
.ai{display:block;padding:11px 2px;border-bottom:1px solid #f0f3f8;font-size:16px;font-weight:600;color:#1f5fbf}.ai:last-child{border-bottom:0}
.xblock{display:flex;align-items:center;gap:10px;background:#0b2b66;color:#cfff45;font-weight:700;padding:9px 12px;border:2px solid #cfff45;margin-bottom:6px;font-size:14px}
.xblock b{background:#cfff45;color:#0b2b66;padding:1px 8px;border-radius:3px}
.intl{text-align:center;color:#1f5fbf;font-weight:600;padding:10px 0;text-decoration:underline}
.price{border-collapse:collapse;width:100%;font-size:16px}
.price th{background:#0b2b66;color:#fff;padding:9px;font-weight:700;border:1px solid #0b2b66}
.price td{text-align:center;border:1px solid #cfdaec;padding:8px}.price tr.alt td{background:#e8f0fb}
.stockrow{display:flex;align-items:center;justify-content:space-between;margin:14px 0 4px}.stockrow .lbl{color:#1f5fbf;font-weight:700}
.stockpill{background:#eef0f3;border:1px solid #cfd6e0;border-radius:6px;padding:7px 14px;font-weight:700}
.buyrow{border-top:1px solid #e3e8f2;margin-top:12px;padding-top:12px}
.buyrow .bf{font-size:20px;color:#0b1a3a;font-weight:700;display:flex;align-items:center;gap:8px}.buyrow .bf img{height:20px}
.qty{display:flex;align-items:center;gap:10px;margin-top:10px}.qty input{flex:1;border:1px solid #b9c4d6;border-radius:3px;padding:8px}
.buynow{background:#e9edf2;border:1px solid #b9c4d6;border-radius:4px;padding:8px 16px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px}
.imgcol{text-align:center}.imgcol .note{color:#5b6b85;font-size:13px;margin:8px 0 16px}
.rohs{color:#1b7a1b;font-weight:900;font-size:24px;letter-spacing:1px}.rohs span{display:block;font-size:13px}
.research{display:inline-block;background:#1f5fbf;color:#fff;border-radius:30px;padding:12px 26px;font-weight:700;font-family:'Cairo';margin:14px 0;cursor:pointer;letter-spacing:.04em}
</style></head><body>
<div class="top"><a href="/"><img src="/assets/logo.png" alt="Mini-Circuits"></a>
  <div class="topnav"><a href="/">Products</a><a href="/">Tools and Resources</a><a href="/">Quality and Compliance</a><a href="/">About Us</a><a href="/">Contact and Support</a></div>
</div>
<div class="wrap">
  <div class="crumb"><a href="/">RF &amp; Microwave Products</a> › <a href="/c/${esc(n.cat || '')}">${esc(group)}</a></div>
  <h1>${esc(pn)}</h1>
  <div class="sub">${esc(title)}</div>
  <div class="grid">
    <div class="imgcol">
      ${img}
      <div class="note">Generic photo used for illustration purposes only.</div>
      <div class="research" onclick="window.__minnySend && window.__minnySend('What applications and related research exist for ${esc(pn)}?')">READ RELATED RESEARCH</div>
      <div class="rohs">✔<span>RoHS</span></div>
    </div>
    <div class="box"><h3>Data, Drawings &amp; Downloads</h3><div class="bd">${files || '<div style="padding:10px 0;color:#5b6b85">Files are on the datasheet — ask Minny.</div>'}</div></div>
    <div class="box"><h3>Additional Information</h3><div class="bd">
      <div class="xblock"><b>X</b> Get the X-MWblock® drop-in</div>${addl}</div></div>
    <div class="box"><h3>Pricing &amp; Availability</h3><div class="bd">
      <div class="intl">International Shipping Option ></div>
      ${tiers ? '<table class="price"><tr><th>Quantity</th><th>Unit Price</th></tr>' + tiers + '</table>' : '<div style="padding:10px 0;color:#5b6b85">Pricing not published online — ask Minny for a quote.</div>'}
      <div class="stockrow"><span class="lbl">Current Stock:</span><span class="stockpill">${esc(det.stock || '—')}</span></div>
      <div class="buyrow"><div class="bf">Buy from: <img src="/assets/logo.png" alt="Mini-Circuits"></div>
        <div class="qty"><span>QTY:</span><input type="text" id="qty"><button class="buynow" onclick="window.__minnySend && window.__minnySend('I want to order ${esc(pn)} — quantity '+(document.getElementById('qty').value||'1'))">🛒 Buy Now</button></div>
      </div>
    </div></div>
  </div>
</div>
<script src="/minny-widget.js"></script>
</body></html>`;
}

// ── Main chat endpoint (Claude tool-use loop) ────────────────────────────────
// Max tool-use turns. Needs enough room for the model to search AND fetch live
// details for a few candidate parts BEFORE writing the answer (a too-low cap
// caused empty replies on parts-heavy queries).
const MAX_TOOL_TURNS = 6;

// Core chat logic (tool-use loop + post-processing). Reusable by the API route
// and offline benchmarking. Returns { reply, products, suggestions, tokens, rawText }.
async function runChat(message, history = []) {
  const systemPrompt = buildSystemPrompt();
  const messages = [
    ...history.slice(-12).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  let usage = { input: 0, output: 0 };
  let finalText = '';

  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const response = await anthropic.messages.create({
      model: MODEL, max_tokens: 1500, system: systemPrompt, tools: TOOLS, messages,
    });
    usage.input += response.usage.input_tokens;
    usage.output += response.usage.output_tokens;

    const toolUses = response.content.filter(c => c.type === 'tool_use');
    finalText = response.content.filter(c => c.type === 'text').map(c => c.text).join('\n').trim();

    if (response.stop_reason !== 'tool_use' || toolUses.length === 0) break;

    messages.push({ role: 'assistant', content: response.content });
    const toolResults = await Promise.all(toolUses.map(async (tu) => ({
      type: 'tool_result',
      tool_use_id: tu.id,
      content: JSON.stringify(
        tu.name === 'search_catalog'      ? searchCatalog(tu.input)
      : tu.name === 'get_product_details' ? await getProductDetails((tu.input || {}).pn)
      : { error: 'unknown tool' }),
    })));
    messages.push({ role: 'user', content: toolResults });
  }

  let reply = finalText;
  const mentionedProducts = extractMentionedProducts(reply);

  // 1) Pull out tappable answer chips: a line "CHIPS:: a :: b :: c".
  let suggestions = [];
  const chipM = reply.match(/CHIPS::\s*(.+?)\s*$/m);
  if (chipM) {
    suggestions = chipM[1].split('::').map(x => x.trim()).filter(Boolean).slice(0, 6);
    reply = reply.replace(chipM[0], '').trim();
  }

  // 2) Auto-hyperlink every recommended part number to its product page on our
  //    domain (/p/<PN>), whether bolded as <strong>PN</strong> or **PN**.
  for (const p of mentionedProducts) {
    const e = p.pn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const href = '/p/' + encodeURIComponent(p.pn);
    reply = reply.replace(
      new RegExp(`(?:<strong>|\\*\\*)${e}(?:</strong>|\\*\\*)`, 'g'),
      `<a href="${href}" target="_blank" rel="noopener"><strong>${p.pn}</strong></a>`
    );
  }

  // 3) Defensive: rewrite any minicircuits.com dashboard/modelSearch links to /p/.
  reply = reply.replace(/href="(?:https?:\/\/[^"]*minicircuits\.com)?(?:\.\.\/|\/)?(?:WebStore\/)?(?:dashboard|modelSearch)\.html\?model=([^"&]+)[^"]*"/gi,
    (m, model) => `href="/p/${model}"`);
  reply = reply.replace(/\]\((?:https?:\/\/[^)\s]*minicircuits\.com)?(?:\.\.\/|\/)?(?:WebStore\/)?(?:dashboard|modelSearch)\.html\?model=([^)\s&]+)[^)\s]*\)/gi,
    (m, model) => `](/p/${model})`);

  return { reply, products: mentionedProducts.slice(0, 4), suggestions, tokens: usage, rawText: finalText };
}

app.post('/api/chat', requirePasscode, async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key missing', message: 'Set ANTHROPIC_API_KEY in your .env file and restart the server.' });
  }
  try {
    const out = await runChat(message, history);
    res.json({ reply: out.reply, products: out.products, suggestions: out.suggestions, tokens: out.tokens });
  } catch (err) {
    console.error('Claude API error:', err.status, err.message);
    if (err.status === 401) return res.status(401).json({ error: 'Invalid API key', message: 'Your ANTHROPIC_API_KEY is invalid.' });
    if (err.status === 529) return res.status(503).json({ error: 'API overloaded', message: 'Claude is very busy right now! Try again in a moment.' });
    res.status(500).json({ error: 'API error', message: err.message });
  }
});

// ── Escalation email (unchanged) ─────────────────────────────────────────────
app.post('/api/escalate', requirePasscode, async (req, res) => {
  const { name, company, userEmail, question, context: ctx } = req.body;
  if (!name?.trim() || !userEmail?.trim() || !question?.trim()) {
    return res.status(400).json({ error: 'name, userEmail, and question are required' });
  }
  console.log(`\n📧 ESCALATION from ${name} <${userEmail}>${company ? ' @ ' + company : ''}: ${question.slice(0, 120)}...`);
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('   ⚠️  No GMAIL creds — logged only.');
    return res.json({ success: true, note: 'Logged (email not configured)' });
  }
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
  const companyLine = company ? `<br><strong>Company:</strong> ${company}` : '';
  const ctxBlock = ctx ? `<p><strong>Conversation context:</strong></p><pre style="font-size:12px;background:#f5f7fa;padding:12px;border-radius:6px;white-space:pre-wrap;">${ctx}</pre>` : '';
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER, to: 'k.revanth123@gmail.com',
      subject: `⚡ Minny Escalation: ${name}${company ? ' @ ' + company : ''}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;"><h2 style="color:#003087;">⚡🤖 Minny couldn't answer this one!</h2><p><strong>Name:</strong> ${name}<br><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a>${companyLine}</p><hr><p><strong>Question / Issue:</strong></p><blockquote style="background:#f5f7fa;border-left:4px solid #F47920;margin:0;padding:12px 16px;">${question}</blockquote>${ctxBlock}<hr><p style="font-size:12px;color:#888;">Sent by Minny ⚡🤖</p></div>`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err.message);
    res.status(500).json({ error: 'Failed to send email', message: err.message });
  }
});

// Homepage — serve a LIVE mirror of minicircuits.com (exact hero, New Products,
// fonts, icons), links rewritten to stay on our domain + Minny injected. Falls
// back to the static recreation if the live page can't be fetched.
app.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-cache'); res.set('Content-Type', 'text/html; charset=utf-8');
  try { const h = await mirrorHomepage(); if (h) return res.send(h); } catch (e) {}
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
// Generic page mirror for nav links (About, Tools, product landing pages, etc.).
app.get(/^\/m\//, async (req, res) => {
  const mcPath = req.originalUrl.replace(/^\/m/, '');
  res.set('Cache-Control', 'no-cache'); res.set('Content-Type', 'text/html; charset=utf-8');
  try { const h = await mirrorPage(mcPath); if (h) return res.send(h); } catch (e) {}
  res.redirect('/');
});

// SPA / mirrored-home fallback.
app.get('*', (req, res) => {
  res.set('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Only start a listener when run directly (local dev). On Vercel the app is
// imported by api/index.js and invoked as a serverless function instead.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('\n⚡ ═══════════════════════════════════════');
    console.log("⚡  Minny is ONLINE!! ZAP ZAP ZAP!! 🤖");
    console.log('⚡ ═══════════════════════════════════════');
    console.log(`📡  http://localhost:${PORT}`);
    console.log(`📦  Catalog       : ${ALL_PRODUCTS.length} models (${RICH.length} with full specs)`);
    console.log(`🧩  Non-catalog   : ${NONCATALOG.length} custom/specialty lines`);
    console.log(`🤖  Model         : ${MODEL} (tool-use search)`);
    console.log(`🔑  API Key       : ${process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ MISSING'}`);
    console.log(`🔒  Passcode gate : ${ACCESS_PASSCODE ? '✅ enabled' : '⚠️  open (no ACCESS_PASSCODE)'}`);
    console.log(`📧  Email         : ${process.env.GMAIL_USER ? '✅ ' + process.env.GMAIL_USER : '⚠️  not configured'}`);
    console.log('⚡ ═══════════════════════════════════════\n');
  });
}

module.exports = app;
module.exports.runChat = runChat;
