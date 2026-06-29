# Minny — Performance & Cost Optimization Plan

Goal: faster + cheaper responses with **no loss of accuracy and no hallucinations**.

Guiding principle used here: anything that depends on model behavior is **built but gated behind an environment flag, OFF by default**, so the live bot is byte-for-byte unchanged until each optimization is verified with API credits. Nothing below can affect the CEO demo until you deliberately turn it on.

---

## 1. Model routing — Haiku for simple, Sonnet for advanced  ✅ built (gated)

**Flag:** `ENABLE_MODEL_ROUTING`

Simple, conceptual/educational questions (definitions, "why/how does…", "difference between…") route to **Claude Haiku 4.5** (faster, ~5× cheaper). Anything where accuracy matters — a named part, a spec value, a recommendation, or troubleshooting — stays on **Claude Sonnet 4.6**. The router defaults to Sonnet whenever it isn't certain, so it never trades accuracy by mistake.

Verified on the 100-question benchmark (no API needed): **17 → Haiku, 83 → Sonnet.** The 17 Haiku-routed questions are all purely conceptual (e.g. "what is a reflectionless filter", "absorptive vs reflective switch", "why does noise figure matter"). Every question that names a part or asks for a number (max current, torque, ECCN, settling time, OIP3…) stays on Sonnet.

The anti-hallucination rule ("if you don't have it, say so + apps@minicircuits.com") applies to **both** models, so even a Haiku answer defers instead of guessing.

**Expected gain:** ~17% of traffic answered ~2× faster and ~5× cheaper, with the hard/technical 83% unchanged.

---

## 2. Prompt caching  ✅ built (gated)

**Flag:** `ENABLE_PROMPT_CACHE`

Caches the large static system prompt so it isn't re-processed and re-billed on every step of the tool loop and on every follow-up. Output is identical — caching changes cost/latency, not content.

**Expected gain:** up to ~90% reduction on the cached input tokens; noticeably faster on multi-step answers; large cost reduction (the system prompt is the bulk of input tokens today).

---

## 3. Semantic caching  ✅ built (gated, conservative)

**Flag:** `ENABLE_SEMANTIC_CACHE`

Returns an instant, free answer when a **stable conceptual** question repeats. Deliberately conservative so it can never serve a wrong number:
- Only conceptual answers are cached — **never** anything with a number in the question, and **never** an answer that surfaced specific parts.
- Fuzzy matching is skipped entirely for any question containing a digit, and otherwise requires very high word overlap (≥ 0.82).
- 6-hour TTL.

Net effect: definitions and "what is…/difference between…" repeat instantly; every spec/part question is always answered fresh. **No stale figure can ever be served.**

> Note: this is similarity-based caching, not full embeddings. A future upgrade is true vector embeddings (Voyage AI) for smarter matching — but that adds a second API dependency and its own accuracy review, so it's intentionally a later step.

---

## 4. Streamline RAG (retrieval)  ◻ designed — next phase

Today retrieval is *agentic*: the model calls `search_catalog` as a tool (1 round-trip) before answering. Two safe improvements:
- **Pre-retrieve in parallel:** kick off a catalog search from the user's message *before* the first model call and pass the candidates in as context, so simple recommendations resolve in **one** model call instead of two. Guardrail: keep the model's own `search_catalog` available so it can refine — pre-retrieval only *adds* context, never replaces the model's judgment.
- **Better ranking of results:** return catalog matches pre-sorted by how well they fit the stated constraints (and the new priority picker), so the model sees the best candidates first and writes a tighter answer.

Why it's phase 2: pre-retrieval can pull the wrong parts if the seed query is naive, which is an accuracy risk — it needs A/B verification against the benchmark before going live.

---

## 5. Optimize model & prompts  ◻ designed — next phase

- **Trim & reorder the system prompt:** it has grown large (persona + decisive-params + anti-hallucination + picker + escalation). Move the hard rules to the top, collapse verbose examples. Smaller prompt = faster + cheaper. Guardrail: this directly touches the rules that prevent hallucination, so every edit must be re-run against the 100-question benchmark to confirm the anti-hallucination behavior is intact before shipping.
- **Right-size `max_tokens`** per route (Haiku conceptual answers are short).
- **Cap detail-fetches** (already partly done via the tool-discipline rule + forced-answer fallback).

---

## How to turn it on safely (once API credits are restored)

Enable **one flag at a time** in the Vercel project env, redeploy, and verify before adding the next:

1. Add Anthropic credits (the bot is down until this is done).
2. `ENABLE_PROMPT_CACHE=1` → run a few queries → confirm answers are identical and latency drops. (Lowest risk — start here.)
3. `ENABLE_MODEL_ROUTING=1` → run the 17 Haiku-routed benchmark questions → confirm answers stay accurate and defer correctly. Keep if good.
4. `ENABLE_SEMANTIC_CACHE=1` → ask the same conceptual question twice → confirm the 2nd is instant and identical.
5. Then tackle phase-2 items (RAG, prompt trim) with a benchmark A/B each.

To revert any optimization instantly: remove its env flag and redeploy. No code change required.

I can run steps 2–4 and report accuracy the moment credits are back.
