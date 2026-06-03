#!/usr/bin/env node
/**
 * refresh.js — one-shot catalog refresh for cron / scheduled runs.
 *
 * Order:
 *   1) Phase 1   — re-scrape every parametric category (specs, new parts)
 *   2) Non-catalog — refresh custom/family capability pages
 *   3) Merge      — write db/products_full.json
 *   4) Sitemap    — seed any newly-added models so coverage stays 100%
 *   5) Phase 2    — enrich a batch of price/stock/files (resumable; the
 *                   checkpoint means each run continues where the last stopped)
 *
 * Usage:
 *   node scraper/refresh.js                # full structural refresh + 500 enrich
 *   node scraper/refresh.js --enrich 0     # structure only, skip enrichment
 *   node scraper/refresh.js --enrich 2000  # bigger enrichment batch
 *
 * Recommended cron (weekly structure, nightly enrichment):
 *   0 3 * * 0  cd /path/to/app && node scraper/refresh.js --enrich 0   # Sun 3am
 *   0 2 * * *  cd /path/to/app && node scraper/refresh.js --enrich 1500 # nightly
 */
const { execFileSync } = require('child_process');
const path = require('path');

const SCRAPE = path.join(__dirname, 'scrape.js');
const args = process.argv.slice(2);
const enrich = args.indexOf('--enrich') !== -1 ? parseInt(args[args.indexOf('--enrich') + 1], 10) : 500;

function run(extra) {
  console.log(`\n▶ node scrape.js ${extra.join(' ')}`);
  execFileSync('node', [SCRAPE, ...extra], { stdio: 'inherit' });
}

(async () => {
  const t0 = Date.now();
  console.log('=== Mini-Circuits catalog refresh ===', new Date().toISOString());

  run(['--phase', '1']);            // parametric categories (writes products_full.json)
  run(['--phase', 'noncat']);       // merge non-catalog/family pages
  run(['--phase', 'sitemap']);      // seed any newly-listed models

  if (enrich > 0) {
    run(['--phase', '2', '--limit', String(enrich)]);  // price/stock/files (resumable)
  }

  console.log(`\n✅ Refresh complete in ${Math.round((Date.now() - t0) / 1000)}s`);
})();
