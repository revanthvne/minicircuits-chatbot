# Mini-Circuits Catalog Refresh — 2026-06-28 (automated)

Scheduled structural refresh of `db/products_full.json` against live
minicircuits.com. Ran Phase 1 (parametric) in slices + merge, Phase
noncat, Phase sitemap, an enrichment-preservation merge-back, and a
capped Phase 2 batch.

## Headline numbers
| Metric | This run (06-28) | Pre-refresh (start of run) | Δ |
|---|---|---|---|
| Total records | 15,939 | 15,926 | **+13** |
| With parsed specs (all records) | 8,294 | 8,281 | +13 |
| Parametric parts | 3,898 | 3,887 | +11 |
| — of which with parsed specs | 3,892 | 3,881 | +11 |
| With flo/fhi (frequency) | 5,421 | 5,411 | +10 |
| With price | 0 | 0 | 0 |
| New models since last week | **13** | (06-21: 13) | — |
| Removed models | **0** | (06-21: 0) | — |
| Phase-2 enriched (checkpoint) | 281 | 241 | +40 |

Breakdown of the 15,939: **3,898 parametric parts**, **12,016
sitemap-seeded** variant/specialty models, **25 non-catalog/info
records**. Net **+13** = 13 new parametric models, 0 removed.

### ⚠️ Read this before comparing to the 06-21 report
The 06-21 report published "with full specs: **3,325**" (parametric
only). The real number at the **start of this run was 8,281** (3,881
parametric). The gap is **not** a data anomaly: a **manual enrichment
pass on Jun 23** — after the last scheduled run — used `scraper/enrich.js`
to fill specs/frequency for thousands of sitemap-stub and previously
spec-less parametric parts. **This run measured against that Jun-23 state
and preserved it** (see "Enrichment preservation" below). So the honest
week-over-week delta is **+13 records / +13 spec'd records**, not a jump
from 3,325.

## New models since last week (13 new, 0 removed)
All 13 are real parametric parts with parsed specs, matching the
per-category deltas exactly (Adapters +10, Filters +3):
- **Adapters (10)** — DIN 7/16 connector series: DINF-DINF+, DINF-DINM+,
  DINF-NF+, DINF-NM+, DINFR-DINF+, DINFR-DINM+, DINM-DINM+, DINM-NF+,
  DINM-NM+, DINMR-DINM+
- **Filters (3):** ZHPB-500-S+, ZHPB-1000-S+, ZHSS-V26G+

## Phase status
- **Phase 1 (parametric)** — ran in slices 0-12 / 12-24 / 24-43, then
  merge. **Amplifiers returned a transient HTTP 502** on the 0-12 slice
  (would have silently dropped ~779 parts); re-ran that one category and
  **recovered 779 amps**. 4,052 raw → **3,898** after PN de-dup.
- **Non-catalog refresh** — ran `--phase noncat` once; all 25
  capability/family pages returned HTTP 200 content → a clean **25 info
  records** (9 custom/needs-quote + 16 family), no duplication.
- **Sitemap seeding** — sitemap listed **15,311** models; seeded
  **12,016** base records (≈ identical to last week's 12,014).
- **Enrichment preservation (merge-back)** — restored cat for 3,474
  stubs, specs for ~8,200 records, frequency for ~4,000, from the
  pre-refresh snapshot (fill-missing-only; fresh structural data always
  wins). Without it, uncategorized would have reverted to ~12,016 and
  "with specs" would have collapsed from 8,281 → ~3,892.
- **Phase 2 enrichment** — **deliberately capped at 40** (not the full
  1,500). Checkpoint 241 → 281. Rationale in NEEDS ATTENTION #1/#2.

## Categories returning 0 parts (16 — all EXPECTED, no regressions)
All 16 are the known non-parametric landing/configurable pages with no
spec table; they were captured with descriptions in the noncat phase and
their models arrive via sitemap seeding. The set is **identical to last
week** — no category that normally has data dropped to 0, so **no sign of
a markup change**:
Programmable Attenuators, Cables, Waveguides, and the test-system lines
(High Power, Instrumentation Amps, Modular, Mechanical Switch Matrix,
Mesh Network, NxM Switch, Panel Mounted, Signal Distribution, Signal Gen
& Measurement, Solid State Switch, Precision Connector Gauges, UVNA-63,
IMAGEVK-74).

Every genuinely-parametric category returned healthy counts (vs last
week): Filters 1,757 (1,754); Amplifiers 779 (781); Transformers 354
(353); MMIC Die 205 (200); Switches 160 (150); Adapters 154 (144);
Oscillators 128 (128); Equalizers 104 (103); Multipliers 90 (90); Bias
Tees 67 (54); Terminations 34; Mixers / Splitters / Fixed-Atten 30 each.
**Synthesizers returned only 1** again — low, but non-zero and consistent
with prior runs (worth a glance if it ever trends to 0).

## NEEDS ATTENTION
1. **Phase-2 price/stock parser is still broken (3rd consecutive run
   flagging this).** Verified live this run: `ZX60-P33ULN+` and
   `ZFL-1000LN+` (both sell online) each return an **identical
   91,760-byte, model-agnostic SPA shell** on the `onPageLoad` AJAX POST.
   `parseDashboard()` → `{}` for both: no price tiers, no "in stock", no
   "add to cart", no ECCN. **Price stays 0 regardless of batch size.**
   Fix: capture the dashboard's *secondary* AJAX/JSON data request (the
   one that actually carries price/stock) in a browser network tab and
   point enrichment at that endpoint instead of the `onPageLoad` HTML.
2. **Don't bulk-run Phase 2 until #1 is fixed — it poisons the
   checkpoint.** Every part processed is marked done in
   `.phase2_checkpoint.json` while capturing nothing, so after the parser
   is fixed those parts get **skipped**. This run therefore **capped at 40
   (not 1,500)**. Before the next large Phase 2 run: fix the parser, then
   **reset the checkpoint** (or clear entries where `price==null`).
3. **Scraper has no retry on 5xx.** Amplifiers' transient 502 this run
   would have silently dropped ~779 parts in a single-shot (non-sliced)
   run. Recommend adding a 1–2× retry with backoff on non-200 responses
   in `phase1()` before giving up on a category.
4. **~8,542 sitemap stubs remain uncategorized / spec-less** — the
   standing catalog-parity opportunity. The right tool is the separate
   `scraper/enrich.js` pass (frequency + category from each part's
   dashboard text), which is independent of the broken Phase-2 dashboard
   price parser. Continuing to run it is what drove the 3,325 → 8,281
   spec coverage gain since 06-21.

## Run notes / deviations (all reasonable, all noted)
- **Enrichment preservation (new this week).** This is the first
  scheduled run to encounter pre-existing stub enrichment (the Jun-23
  pass). A literal `--phase 1` overwrites `db/products_full.json` with
  bare structural data, which would have wiped **4,956 enriched spec
  records + the categorization of 3,474 stubs + ~4,000 frequency ranges**.
  To honor the task's GOAL (stay matched to the live site *without
  regressing coverage*), the pre-refresh catalog was snapshotted and
  merged back **fill-missing-only** (fresh structural data always wins;
  old enrichment only fills gaps; removed parts are not resurrected).
- **Cleared the stale `.phase1_parts.json`** (it still held last week's
  06-21 slice parts) before slicing, so the structural refresh was clean.
- **Re-ran the Amplifiers slice** after its transient 502.
- **Capped Phase 2 at 40** instead of 1,500 (items #1/#2).
- **Baseline persisted** to `scraper/.baseline_pns_2026-06-28.json`
  (15,926 PNs) before overwrite → enabled the exact 13-new / 0-removed
  diff above.
- **`.env` was not read or modified; no secrets written; no git commit
  made.** The scraper fetched only public pages and respected its
  built-in 250 ms rate-limit. (A harmless `.git/index.lock` permission
  warning surfaced from a read-only `git status`; no commit was
  attempted.)
