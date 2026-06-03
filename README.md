# Minny ⚡🤖 — Mini-Circuits RF Chatbot

An AI assistant for the Mini-Circuits catalog. Minny answers RF product questions,
recommends parts, does RF math, and routes custom/non-catalog requests to the team.
It is grounded in a ~16,000-model catalog mirrored from minicircuits.com and uses
Claude with a `search_catalog` tool so it scales to the whole catalog.

## Stack
- **Backend:** Node.js + Express (`server.js`), Anthropic Claude (tool use)
- **Frontend:** static SPA in `public/`
- **Data:** `db/products_full.json` (scraped catalog)
- **Scraper:** `scraper/scrape.js` (+ `refresh.js`)

## Run locally
```bash
npm install
cp .env.example .env        # then add your keys
npm start                   # http://localhost:3000
```

### Environment variables
| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Claude API key (server-side only) |
| `ACCESS_PASSCODE` | optional | If set, the chat requires this shared passcode (protects API spend on public deploys) |
| `PORT` | optional | Local port (default 3000) |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | optional | Enables escalation emails |

## Refresh the catalog
```bash
npm run scrape:phase1     # all parametric categories (full set via AJAX POST)
npm run scrape:noncat     # custom / family lines
npm run scrape:sitemap    # seed every model from the sitemap (full coverage)
npm run scrape:phase2     # price/stock/files (resumable; needs a rendered browser to fully populate)
npm run refresh           # structural refresh + enrichment batch (used by the weekly scheduled job)
```
See `CATALOG_PARITY_ROADMAP.md` for how site parity is achieved and what remains.

## Deploy (Vercel)
The app is serverless-ready: `api/index.js` imports the Express app and `vercel.json`
routes all traffic to it.

1. Import the repo in Vercel (or `vercel` CLI).
2. Set **Environment Variables** in the Vercel project: `ANTHROPIC_API_KEY` and
   `ACCESS_PASSCODE` (and Gmail vars if using escalation).
3. Deploy. Every push to the default branch auto-deploys.

> Never commit `.env` — it's gitignored. Set secrets in Vercel's dashboard.
