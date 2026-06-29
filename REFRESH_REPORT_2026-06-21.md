# Mini-Circuits Catalog Refresh — 2026-06-21 (automated)

Scheduled structural refresh of `db/products_full.json` against live
minicircuits.com. Ran Phase 1 (parametric) in slices + merge, Phase
noncat, Phase sitemap, and a capped Phase 2 enrichment batch.

## Headline numbers
| Metric | This run (06-21) | Last week (06-08) | Δ |
|---|---|---|---|
| Total records | 15,926 | 15,929 | −3 |
| With full specs | 3,325 | 3,312 | +13 |
| With price | 0 | 0 | 0 |
| New models since last week | 13 | +21 (06-08) | — |
| Removed models | 0 | — | — |
| Phase-2 enriched (checkpoint) | 241 | 201 | +40 |

Breakdown of the 15,926: **3,887 parametric parts** (3,325 with parsed
specs), **12,014 sitemap-seeded** variant/specialty models, **25
non-catalog/info records**.

The −3 net total is fully explained: parametric **+13**, info records
**−16** (a deliberate de-dup fix, see below), sitemap unchanged. So the
catalog actually grew by 13 real models while shedding 16 duplicate info
rows.

## New models since last week (13 new, 0 removed)
All 13 are real parametric parts with specs (no removals):
- **Filters (11):** BPF-BV880+, CBP2-1060+, CBP2-2250CC+, HFHKI-4000+,
  HFHKI-5000+, HFHKI-7300+, LFHK-3000+, LFHK-4800+, ZABF-K11R5G+,
  ZALF-K9000+, ZALF-K12000+
- **Amplifiers (2):** LEE1-84+, ZX60-10203LN+

This matches the per-category deltas exactly (Filters +11, Amplifiers +2).

## Phase status
- **Phase 1 (parametric)** — ran in slices 0-12 / 12-24 / 24-43, then
  merge. OK. 4,041 raw → 3,887 after PN de-dup.
- **Non-catalog refresh** — OK; all 25 capability/family pages returned
  HTTP 200 content.
- **Sitemap seeding** — sitemap listed 15,311 models; seeded 12,014 base
  records (identical to last week).
- **Phase 2 enrichment** — ran a 40-part batch (checkpoint 201→241), then
  **deliberately capped** (not the full 1,500). Rationale below.

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

Every genuinely-parametric category returned healthy counts: Filters
1,754; Amplifiers 781; Transformers 353; MMIC Die 200; Switches 150;
Adapters 144; Oscillators 128; Equalizers 103; Multipliers 90; Bias Tees
54; Terminations 34; Mixers/Splitters/Fixed-Atten 30 each; … Synthesizers
returned only 1 (low, but non-zero and consistent with prior runs —
worth a glance if it trends to 0).

## Fixed this run
- **Info-record duplication (last week's issue #2).** Last week showed 41
  info records instead of 25 because `noncat-slice` + `--phase noncat`
  were both run and the cleanup filter only de-dupes `cat==='noncat'`,
  leaving the 16 `family`-kind rows (cat=cable/wg/test) doubled. This run
  skipped `noncat-slice` and ran `--phase noncat` once → a clean **25 info
  records** (9 custom/needs-quote + 16 family). This also avoided fetching
  the noncat pages twice (politer).

## NEEDS ATTENTION
1. **Phase-2 price/stock parser is still broken — root cause now
   pinpointed.** Direct test of two parts that DO sell online
   (`ZX60-P33ULN+`, `ZFL-1000LN+`): the scraper's `onPageLoad` AJAX POST
   returns an **identical 91,760-byte, model-agnostic SPA shell** for
   both — it contains no price, no "in stock", no "add to cart", and no
   ECCN at all (`parseDashboard()` → `{}`). The price/stock/ECCN data is
   loaded by a **separate downstream call** the scraper never makes. Fix:
   point the enrichment at the real data endpoint (capture the dashboard's
   secondary AJAX/JSON request in a browser's network tab) rather than the
   `onPageLoad` HTML. Until then, "with price" stays 0 regardless of how
   many parts are processed.
2. **Don't bulk-run Phase 2 until #1 is fixed — it poisons the
   checkpoint.** Each part processed now is marked done in
   `.phase2_checkpoint.json` while capturing nothing, so after the parser
   is fixed those parts get **skipped**. Recommend: fix the parser, then
   **reset the checkpoint** (or clear entries for parts with `price==null`)
   before the next large Phase 2 run. This is why this run capped Phase 2
   at 40 parts instead of 1,500.
3. **Empty-specs categories (stable, not new).** ~17 parametric categories
   (Switches, Oscillators, MMIC Die, Bias Tees, Terminations, Limiters,
   etc.) capture model PNs and counts but **no parsed specs** — same as
   last week (spec'd total flat at ~3,312→3,325). These pages use a table
   layout `parseCategory()` doesn't map to spec columns. Not a regression,
   but the biggest remaining parity opportunity (~560 parts could gain
   specs if the parser is extended to that layout).

## Run notes / deviations
- Sandbox enforces a 45s/command limit, so Phase 1 used the documented
  slice fallback (0-12, 12-24, 24-43, merge) and Phase 2 was chunked.
- **Baseline snapshot now persisted** (fixes last run's lost-diff
  problem): the pre-refresh PN set (15,929 PNs) was written to
  `scraper/.baseline_pns_2026-06-21.json` before overwriting the catalog,
  which is what enabled the exact 13-new / 0-removed diff above. Future
  runs should keep doing this.
- Deviations from the literal task script (both reasonable, both noted):
  skipped `noncat-slice` (fixes issue #2 + politer); capped Phase 2 at 40
  rather than 1,500 (item #2 above).
- `.env` was not read or modified; no secrets written. The scraper only
  fetches public pages and the run respected the built-in 250 ms
  rate-limit.
