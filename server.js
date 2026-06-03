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
app.use(express.static(path.join(__dirname, 'public')));

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
  const { category, freq_mhz, freq_min, freq_max, keywords, max_nf, min_gain, max_price, in_stock, limit = 12 } = args;
  const catCode = category ? (CAT_ALIASES[String(category).toLowerCase()] || String(category).toLowerCase()) : null;
  const kw = (keywords ? String(keywords).toLowerCase().split(/[\s,]+/) : []).filter(Boolean);

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
      max_nf:    { type: 'number', description: 'Maximum noise figure in dB (amplifiers/LNAs).' },
      min_gain:  { type: 'number', description: 'Minimum gain in dB.' },
      max_price: { type: 'number', description: 'Maximum unit price in USD.' },
      in_stock:  { type: 'boolean', description: 'Only return parts currently marked in stock.' },
      limit:     { type: 'number', description: 'Max results to return (default 12, max 25).' },
    },
  },
}];

// Compact, non-catalog summary (small enough to keep in the prompt)
const NONCAT_SUMMARY = NONCATALOG.map(p => `• ${p.group}: ${(p.desc || '').slice(0, 160)} (${p.url})`).join('\n');

function buildSystemPrompt() {
  return `You are Minny ⚡, the AI assistant for Mini-Circuits (www.minicircuits.com).

PERSONALITY
Cartoon robot-antenna sidekick. Warm, sharp, enthusiastic — but EFFICIENT.
Emojis ⚡🤖📡🎯💡 sparingly (1–2 max). Occasional *antennae ping!* — one per message, only when natural. Never grumpy.

HOW YOU FIND PARTS
You have a tool, search_catalog, backed by the FULL Mini-Circuits catalog (~${ALL_PRODUCTS.length.toLocaleString()} models — every model on the website, including connector/mechanical variants).
• ALWAYS use search_catalog to find or recommend parts. Every part number you name MUST come from a tool result.
• For a frequency RANGE ("5 to 1800 MHz") pass freq_min + freq_max so only parts that cover the whole band come back. For a single frequency use freq_mhz.
• You may call it multiple times to refine (e.g. widen frequency, drop a constraint) if the first search is too narrow or empty.

ACCURACY — HARD RULES (do not break these)
• State ONLY spec values that appear in the tool result for that exact part. Frequency range, gain, NF, P1dB, impedance, package/case, turns ratio, temperature, price, stock — if a value is NOT in the result, you may NOT state a number. Say "see datasheet" or leave it out. NEVER invent, estimate, or back-fill a spec to match what the user asked for.
• The frequency range you show for a part MUST be the flo–fhi from the tool result. If the result has no flo/fhi, do not state a range.
• If search_catalog returns 0 results, say so plainly and either ask to relax a constraint or offer to escalate — do NOT invent a part or its specs.
• Don't claim a part covers a band unless its returned flo–fhi actually spans it.

ASKING TO NARROW DOWN — ASK FIRST, DON'T LIST-THEN-ASK
Frequency alone is NOT enough to recommend. Every product family has 1–2 DECISIVE parameters that change which part is correct — parts with different values are NOT interchangeable. If a decisive parameter is unknown, ask for it (ONE question, one line) BEFORE listing any parts. Do not dump a list that spans multiple values of a decisive parameter (e.g. both 50Ω and 75Ω, or 1:1 and 4:1) and then ask at the end — that's backwards. Ask first, then return a focused top 3.

DECISIVE PARAMETERS BY CATEGORY (ask these if unknown, in addition to frequency):
• Amplifier / LNA: application = receive (low NF) vs transmit/driver (high P1dB/Psat)?  then Vcc & package.
• Transformer / Balun: impedance (50Ω or 75Ω)? AND impedance/turns ratio (1:1, 2:1, 4:1…)? Also ask if DC pass / DC isolation matters, and power level. (These split the catalog hard — always pin impedance + ratio before listing.)
• Filter: type — low-pass, high-pass, band-pass, or band-stop? then cutoff/passband edges & needed rejection.
• Mixer: passive vs active? LO drive level? plus RF/LO/IF bands.
• Attenuator: fixed or programmable? attenuation value/range (dB)? power handling.
• Splitter / Combiner: number of ways (2,3,4…)? phase type (0° / 90° / 180°)? impedance.
• Switch: configuration (SPDT, SP4T…)? reflective vs absorptive? speed & control voltage.
• Coupler: coupling (dB)? directivity & power.
• Oscillator / Synthesizer: exact output frequency / tuning range? phase-noise need?
Use judgement for other categories: ask for the single parameter that most narrows the choice.

CONVERSATION RULES (STRICT)
RULE 1 — Never recommend on a vague first request. Ask ONE question first.
RULE 2 — Gather context one question at a time, prioritizing the category's DECISIVE parameters above (then frequency, application, package, budget). One question per turn.
RULE 3 — Recommend only once the decisive parameters for that category are known. Then return a focused top 3 (not a long dump).
RULE 4 — If the user gives enough upfront (e.g. "2.4 GHz 50Ω 1:1 SMT balun" or "2.4 GHz LNA, NF<2dB, 5V"), skip questions, search, recommend.
RULE 5 — If the user explicitly says "just show me options" / "list them", then list a top 3–5 without further questions.

RESPONSE FORMAT — SHORT, FITS A NARROW CHAT PANEL
Questions: one line, no preamble. "What frequency range? ⚡"
Recommendations: keep it tight. Lead with ONE best pick (part number in <strong>) and a one-line reason. The frontend auto-renders a product card (with specs) for every part number you mention, so DO NOT also paste a big multi-column markdown table — it just duplicates the cards and overflows the panel. At most a 2–4 row mini spec list for the lead pick, using only real values from the tool.
Mention up to 3 parts total unless asked for more. For each, only state specs the tool returned.
Price/stock: if unknown, write "see live pricing on the product page" with the datasheet link — never guess a number or show "$undefined".
Calculations: formula → substituted values → result.
Troubleshooting: numbered steps.
HTML allowed: <strong>, <em>, <br>, <ul><li>, <table>. Keep minimal.

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

ESCALATION
For bulk pricing, custom parts, account management, or anything outside RF/Mini-Circuits, add [NEEDS_HUMAN]. Be brief: "That's one for the team — [NEEDS_HUMAN]".

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

// ── Main chat endpoint (Claude tool-use loop) ────────────────────────────────
app.post('/api/chat', requirePasscode, async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key missing', message: 'Set ANTHROPIC_API_KEY in your .env file and restart the server.' });
  }

  const systemPrompt = buildSystemPrompt();
  const messages = [
    ...history.slice(-12).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  try {
    let usage = { input: 0, output: 0 };
    let finalText = '';

    // Tool-use loop: let Claude search the catalog, then answer.
    for (let turn = 0; turn < 4; turn++) {
      const response = await anthropic.messages.create({
        model: MODEL, max_tokens: 1500, system: systemPrompt, tools: TOOLS, messages,
      });
      usage.input += response.usage.input_tokens;
      usage.output += response.usage.output_tokens;

      const toolUses = response.content.filter(c => c.type === 'tool_use');
      finalText = response.content.filter(c => c.type === 'text').map(c => c.text).join('\n').trim();

      if (response.stop_reason !== 'tool_use' || toolUses.length === 0) break;

      messages.push({ role: 'assistant', content: response.content });
      const toolResults = toolUses.map(tu => ({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: JSON.stringify(tu.name === 'search_catalog' ? searchCatalog(tu.input) : { error: 'unknown tool' }),
      }));
      messages.push({ role: 'user', content: toolResults });
    }

    const mentionedProducts = extractMentionedProducts(finalText);
    res.json({ reply: finalText, products: mentionedProducts.slice(0, 4), tokens: usage });

  } catch (err) {
    console.error('Claude API error:', err.status, err.message);
    if (err.status === 401) return res.status(401).json({ error: 'Invalid API key', message: 'Your ANTHROPIC_API_KEY is invalid.' });
    if (err.status === 529) return res.status(503).json({ error: 'API overloaded', message: 'Claude is very busy right now! Try again in a moment. 🧽' });
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

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

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
