# Mini-Circuits Catalog Refresh — 2026-06-08 (automated)

## Headline numbers
| Metric | This run | Last week | Δ |
|---|---|---|---|
| Total records | 15,929 | 15,908 | +21 |
| With full specs | 3,312 | 3,307 | +5 |
| With price | 0 | 0 | 0 |
| Phase-2 enriched (checkpoint) | 201 | 6 | +195 |

Breakdown of the 15,929: 3,874 parametric parts, 12,014 sitemap-seeded
variant/specialty models, 41 non-catalog/custom info records.

## Phase status
- Phase 1 (parametric) — ran in slices 0-12 / 12-24 / 24-43, noncat-slice, merge. OK.
- Non-catalog refresh — OK (all 25 capability/family pages returned content).
- Sitemap seeding — sitemap listed 15,311 models; seeded 12,014 base records.
- Phase 2 enrichment — partial: 201/15,914 parts (resumable via checkpoint).

## Categories returning 0 parts (all EXPECTED, not regressions)
These are non-parametric landing/configurable pages (no spec table). All are in
the non-catalog "family" set and were captured with descriptions in the noncat
phase; their individual models come in via sitemap seeding:
Programmable Attenuators, Cables, Waveguides, and the test-system lines
(High Power / Instrumentation Amps / Modular / Mechanical Switch Matrix /
Mesh Network / NxM Switch / Panel Mounted / Signal Distribution /
Signal Gen & Measurement / Solid State Switch / Precision Connector Gauges /
UVNA-63 / IMAGEVK-74).
All genuinely parametric categories returned healthy counts
(Filters 1,743; Amplifiers 779; Transformers 353; Switches 150; Adapters 144; …).

## NEEDS ATTENTION
1. **Phase-2 price/stock parser no longer matches the live dashboard.** Test fetches
   of parts that DO sell online (ZX60-P33ULN+, ZFL-1000LN+) return 0 price tiers —
   the dashboard now loads price/stock dynamically (not in static HTML). Result:
   "with price" stays at 0 no matter how many parts are enriched. The price-tier
   regex in parseDashboard() needs updating (likely an AJAX endpoint).
   The ECCN regex is also mis-matching (returns junk like "not").
2. **Minor:** the `--phase noncat` cleanup filters on `cat==='noncat'`, so the 16
   "family"-kind records (cat=cable/wg/test) are not de-duplicated and appear twice
   (41 info records instead of 25). Bounded, but worth tightening the filter.

## Run notes / deviations
- Ran in a sandbox with a 45s/command limit, so Phase 1 used the documented slice
  fallback and Phase 2 was chunked. Phase 2 stopped at ~201 parts (not the full
  1,500) because the checkpoint is resumable AND prices are currently unparseable,
  so further batches add little until item #1 is fixed. Next scheduled run continues
  automatically from the checkpoint.
- Exact new-vs-removed model identity diff is unavailable this run: the baseline PN
  snapshot was written to ephemeral /tmp and lost when the sandbox rebooted mid-run,
  and the repo has no commit history to recover last week's file. Net record delta
  (+21) is reported instead. Future runs should snapshot the baseline into the
  project folder before overwriting db/products_full.json.
- .env was not touched; no secrets written.
