# Mini-Circuits Chatbot — 100% Site Parity Roadmap & Status

_Last updated: 2026-06-03_

Goal: make Minny's tool match **minicircuits.com** as closely as possible — every
catalog model, plus the non-catalog / custom lines.

---

## TL;DR — what changed in this pass

| | Before | After |
|---|---|---|
| Models in catalog | 3,533 | **15,908** (full sitemap) |
| Categories covered | ~22 components | **all ~40 product lines** (components + test solutions) |
| Non-catalog / custom lines | none | **9 captured** (Custom Assemblies, Hi-Rel, Space Upscreening, Custom Test Systems, Designer Kits, Reference Designs, Research Kits, Quantum, Automotive) |
| Scraper | hard-coded column maps per category | **schema-agnostic** (reads table headers dynamically) + sitemap seeding |
| Chatbot scale | whole catalog stuffed in the prompt (breaks past a few thousand parts) | **search tool** — Claude queries the catalog on demand (~7K tokens/turn at 16K models) |
| Refresh | manual, one-off | **weekly scheduled refresh** + resumable enrichment |

The number to know: **the live sitemap lists 15,311 models.** We now seed all of
them, so coverage of *what exists on the site* is effectively 100%. Depth of data
per model is the remaining work (see below).

---

## How completeness is achieved

The site exposes products three ways, and we use all three:

1. **Parametric category pages** (`/WebStore/*.html`) — the spec tables. The plain
   GET truncates to a default view; the site's own "show all" uses an AJAX **POST**
   (`action:X.onPageLoad.ajax=`) that returns every row. We POST. Example: Filters
   return **642 on GET vs 1,741 on POST**. → gives full **structured specs** for
   ~3,300 base models.
2. **Sitemap.xml** — the definitive list of every model dashboard URL (15,311). We
   seed a base record (part number + canonical dashboard / datasheet / S-parameter
   links) for any model not already covered. → guarantees **every model is present**.
3. **Non-catalog / family landing pages** — custom and configurable lines that have
   no public price/specs. Captured as `info` records with a summary + page link and
   flagged `needs_quote` so Minny describes them and routes to the team.

Two table layouts exist on the site (modern `data_row`/`Nth_col` and legacy
`first_col`/sequential `<output>`). The parser handles both, so new categories work
without code changes.

---

## Current data depth

| Layer | Count | Has structured specs | Has datasheet/S-param links | Has live price/stock |
|---|---|---|---|---|
| Parametric base models | ~3,300 | ✅ | ✅ | ⚠️ not yet |
| Sitemap-seeded models (mostly connector/mechanical variants) | ~12,000 | ⛔ (inherit from base design) | ✅ | ⚠️ not yet |
| Non-catalog / custom lines | 9 | n/a (capability text) | link to page | quote-only |

Datasheet PDFs (`/pdfs/{PN}.pdf`) and S-parameter files resolve for essentially
every part (verified), so each part links to its real datasheet today.

---

## The one real gap: live price & stock

minicircuits.com migrated product **dashboards to a JavaScript SPA** (Apache
Wicket). A plain HTTP fetch of `dashboard.html?model=...` returns an empty shell;
even the AJAX POST returns a template without the price/stock/spec values — those
are populated by client-side JS calls that are session-bound and not scriptable
with raw HTTP.

**What this means:** price tiers, stock, and the full per-model spec sheet cannot be
scraped with plain requests anymore. (The old build's 1,473 priced parts came from a
period when dashboards were server-rendered; that path no longer works.)

**The fix — pick one:**

1. **Headless browser enrichment (recommended).** Add Playwright/Puppeteer to Phase 2:
   load each dashboard, let JS render, read price/stock/specs from the DOM. Reuses the
   existing checkpoint/resume + batching. ~15K pages at a polite rate ≈ a few hours,
   run nightly in batches. This closes the gap to true 100%.
2. **Datasheet PDF parsing.** Every part has a real datasheet PDF with full electrical
   specs. Parse them (offline, cacheable) to fill specs for the ~12K variant models.
   Best for *specs*; doesn't give live stock.
3. **Live lookup at query time.** Have Minny fetch price/stock on demand for a single
   part the user asks about (via the rendered-browser path), instead of pre-scraping
   all 15K. Always current; only works one part at a time.

The Phase 2 scraper is already built as a **resumable, checkpointed batch job**, so
adding the rendered-browser fetch is a localized change (swap the fetch, keep the
loop, checkpoint, and merge).

---

## What was delivered (files)

- `scraper/scrape.js` — rewritten, schema-agnostic, multi-layout, with phases:
  `1` / `slice` (categories), `noncat` (custom/family), `sitemap` (seed all models),
  `2` (price/stock enrichment, resumable), `merge`.
- `scraper/refresh.js` — one-shot orchestrator for cron/scheduled runs.
- `server.js` — rebuilt around a `search_catalog` **tool** Claude calls on demand;
  scales to the full catalog; new `/api/search`; `/api/products` now serves clean
  (spec-bearing) records by default and `?all=1` for everything; non-catalog lines
  summarized into Minny's prompt for smart escalation.
- `db/products_full.json` — 15,908-record catalog.
- Backups kept: `scraper/scrape.v1.backup.js`, `server.v1.backup.js`.
- Scheduled task **"minicircuits-catalog-refresh"** — Sundays 03:00 local: re-scrape
  categories, refresh non-catalog, seed new sitemap models, enrich a 1,500-part batch,
  and report new-model count + any category returning 0 (markup-change alarm).

### npm scripts
```
npm run scrape:phase1    # all parametric categories
npm run scrape:noncat    # custom/family lines
npm run scrape:sitemap   # seed every model from sitemap
npm run scrape:phase2    # price/stock/files (resumable; needs rendered-browser to fully work)
npm run refresh          # structural refresh + enrichment batch (used by the schedule)
```

---

## Roadmap to literal 100% (depth)

1. **[High value] Rendered-browser Phase 2** — price, stock, and full specs for all
   15K models. Closes the only real gap. (Playwright; nightly batches.)
2. **Descriptions** — parametric rows have no prose description; pull each model's
   one-line description from the dashboard/datasheet so application keyword search
   (GPS, 5G, DOCSIS) is sharper. (Falls out of #1 for free.)
3. **Variant → base linking** — map connector/mechanical variants (e.g.
   `047-12SMP+`, `…SMPR+`, `…SMPRC+`) to their base design so variants inherit specs
   without re-scraping.
4. **Spec-sheet PDF cache** — store parsed datasheet specs as a fallback spec source.
5. **Freshness telemetry** — record per-category counts each refresh and alert on big
   swings (catches site redesigns early).

---

## Verification snapshot

```
TOTAL records          : 15,908
  rich parametric specs:  3,307
  sitemap-seeded models: 12,014
  non-catalog lines    :      9
  with datasheet link  : 15,883
  with price           :      0   (pending rendered-browser Phase 2)
```

End-to-end chat verified: "2.4 GHz LNA, NF < 1.5 dB, 5V" → Minny called
`search_catalog` and returned real in-range parts (CMA-5043+, CMA-83LN+, PGA-103-D+)
with correct specs, at ~7K input tokens.
