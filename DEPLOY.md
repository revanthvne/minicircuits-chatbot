# Deploy Minny to GitHub + Vercel

The app is already production-ready: serverless entry (`api/index.js`), `vercel.json`,
`.gitignore` (excludes your `.env`/key), passcode gate, and a verified build.

You just need to run the account-connected steps (they need your GitHub/Vercel login,
which a sandbox can't have). Two options — pick one.

---

## Option A — Easiest: GitHub website + Vercel import (no terminal)

**1. Put the code on GitHub**
- Go to https://github.com/new → name it `minicircuits-chatbot` → **Create repository** (leave it empty).
- On your Mac, open Terminal and run (this folder already has everything):
  ```bash
  cd ~/mini-circuits_chat_bot
  rm -rf .git                     # clear the partial repo from the sandbox
  git init && git add -A
  git commit -m "Minny: full-site catalog + tool-use search, Vercel-ready"
  git branch -M main
  git remote add origin https://github.com/<YOUR_USERNAME>/minicircuits-chatbot.git
  git push -u origin main
  ```

**2. Deploy on Vercel**
- Go to https://vercel.com/new → **Import** the `minicircuits-chatbot` repo.
- Before clicking Deploy, open **Environment Variables** and add:
  | Name | Value |
  |---|---|
  | `ANTHROPIC_API_KEY` | your Claude API key (from your `.env`) |
  | `ACCESS_PASSCODE` | a passcode you choose (e.g. `minny2026`) |
  | `GMAIL_USER` / `GMAIL_APP_PASSWORD` | *(optional, for escalation emails)* |
- Click **Deploy**. You'll get a live URL like `https://minicircuits-chatbot.vercel.app`.

Every future `git push` auto-redeploys. ✅

---

## Option B — All terminal (Vercel CLI)

```bash
cd ~/mini-circuits_chat_bot
rm -rf .git && git init && git add -A && git commit -m "Minny deploy"

npm i -g vercel
vercel login                      # opens browser
vercel                            # follow prompts → creates the project
vercel env add ANTHROPIC_API_KEY  # paste your key
vercel env add ACCESS_PASSCODE    # choose a passcode
vercel --prod                     # production deploy
```

---

## After deploy — verify
- Open the URL. The catalog + chat should load.
- Ask Minny: *"2.4 GHz LNA with NF under 1.5 dB"* → it should recommend real parts.
- First chat will prompt for the **passcode** you set in `ACCESS_PASSCODE`.

## Notes
- **Never commit `.env`** — it's gitignored; set secrets only in Vercel.
- Public bot = anyone with the URL + passcode can spend your Anthropic credits. Rotate the
  passcode or the key if it leaks.
- `db/products_full.json` (~6 MB) ships with the function — fine for Vercel limits.
