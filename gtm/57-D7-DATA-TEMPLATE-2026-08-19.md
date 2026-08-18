# D7 Data Template — Show HN T+24h

**For:** operator · **Filled at:** Mon 2026-09-01 02:00 MSK (T+24h)  
**Inputs into:** `gtm/36-SHOW-HN-D7-PRODUCT-IMPACT-2026-09-07.md` (Sun Sep 7 retro)

Template. 0 emoji. Operator fills cells marked `_________`.

---

## §0 Meta

---

## §0 Meta

| Field | Value |
|-------|-------|
| Date filled (MSK) | _________ |
| Show HN URL | https://news.ycombinator.com/item?id=_________ |
| Total comments at T+24h | _________ |
| Points at T+24h | _________ |
| Time of measurement (UTC) | _________ |
| First-comment variant (A/B/C) | _________ (`gtm/76` §2) |
| Title variant (1/4/6) | _________ (`gtm/76` §1) |
| Ally present? | _________ (`gtm/79` §3) |
| Operator time on launch day (min) | _________ (target ≤17) |

---

## §1 Trajectory

| Metric | Value |
|--------|-------|
| Peak points (T+0 to T+24h) | _________ |
| Peak time (UTC) | _________ |
| Average points T+0 to T+24h | _________ |
| Peak / average ratio | _________ (>3x = spiky, <2x = sustained) |
| Front-page status at T+6h | _________ (front / second / killed / off) |
| Front-page status at T+24h | _________ |
| Trending bracket hit | mark one from list below |

**Trajectory brackets (per `gtm/79:235-242`):** 50+ by T+2h bullseye / 100+ by T+1h mega / 200+ any time spike / 30+ by T+4h acceptable / <30 by T+4h failure / <10 by T+2h flop.

---

## §2 Comment breakdown

Count each HN comment into exactly one type. Sum = total from §0.

| Type | Definition | Count |
|------|------------|-------|
| A — Skeptics | "just use Ollama", "OWUI does this", "12 MB is marketing" | _________ |
| B — Pro lurkers | "self-hostable?", "BYO API key?", "supports X model?" | _________ |
| C — Curious devs | "how does encryption work", "stack choices", "MCP?" | _________ |
| D — Privacy | "are you sure no telemetry", "how do I verify", "SOC2?" | _________ |
| E — Marketing | "feature on my podcast", "$X is better", "send signups" | _________ |
| F — Technical errors | "install error X", "Mac M1 build fails", "feature Y broken" | _________ |
| G — Pure support | "where download", "refund policy", "how upgrade" | _________ |
| **Total** | A + B + C + D + E + F + G | _________ (must equal §0) |

**Unanswered at T+24h:** _________ (target: 0)  
**Response scripts needing 2+ attempts:** _________

---

## §3 Conversion funnel

| Step | Definition | Count | Rate |
|------|------------|-------|------|
| F0 — HN clicks | Show HN click-throughs (UTM `?utm_source=hackernews&utm_campaign=show-hn`) | _________ | — |
| F1 — Site visits | Unique sessions on ownlocalml.com from HN (CF Workers logs) | _________ | ____% of F0 |
| F2 — Free signups | Free tier activations (downloads + trial starts, deduped by device id) | _________ | ____% of F1 |
| F3 — Trial starts (full) | 14-day Pro trial activations | _________ | ____% of F1 |
| F4 — Paid conversions | First PRO or Pro+ payment (NOWPayments webhook) | _________ | ____% of F3 |

**Sources:** F0 = HN view count or CF referer · F1 = CF Workers top referer · F2 = pulse-sync `/redeem` + first-run telemetry · F3 = trial license-key mints · F4 = NOWPayments dashboard.

**Benchmarks (not targets):** F1/F0 ~60-75%, F2/F1 ~20-40%, F4/F3 at T+24h ~0-5% (most convert D7-D14).

---

## §4 Sources of traffic

| Source | Picked up? | Day | % of F0 |
|--------|-----------|-----|---------|
| Hacker Newsletter (Daniel K) | yes/no | _________ (`gtm/77` §1) | ____% |
| r/LocalLLaMA cross-post | yes/no/deferred | _________ (Mon Sep 1 11:00 ET if HN ≥50 at T+3h) | ____% |
| r/selfhosted cross-post | yes/no/deferred | _________ (Mon Sep 1 14:00 ET if HN ≥100) | ____% |
| r/rust (T+72h) | yes/no | _________ (Wed Sep 3) | ____% |
| Twitter/X (Pulse + allies) | yes/no | _________ (`gtm/77`) | ____% |
| Lobsters / Tildes / IH / Habr | yes/no | _________ (Wed-Thu Sep 3-4) | ____% |
| Organic / direct / other | — | — | ____% |

**Top referer by volume:** _________  
**Top referer by visit-to-signup rate:** _________

---

## §5 Hero moments (3 quotes)

**Quote 1 — best technical or credibility moment**

> [paste, 1-3 sentences]
> — @_________ (link: https://news.ycombinator.com/item?id=_________)
> Permission: _________

**Quote 2 — best privacy or local-first endorsement**

> [paste]
> — @_________ (link)
> Permission: _________

**Quote 3 — best "switch trigger" (most actionable for D7-D30 copy)**

> [paste]
> — @_________ (link)
> Permission: _________

Do not quote accounts that asked not to be quoted. Default-don't-quote privacy advocates unless posted publicly with engagement.

---

## §6 Next-action triggers (numeric)

| Condition | Action |
|-----------|--------|
| F2 > 500 by T+24h | SCALE. Open D14 Reddit cadence (Day 17 → Day 14, `gtm/12:118-120`). DM 5 most-engaged. Approve Gergely trigger (`gtm/77:222-230`). |
| F2 in 200-500 | STANDARD. Run `gtm/12` as-written. Beehiiv #1 on Day 13. |
| F2 < 200 | ITERATE. Diagnosis in `gtm/35`. Culprits: (1) title (swap to #4 MCP), (2) first-comment did not disambiguate from Ollama+OWUI, (3) landing <10% (audit `gtm/29`). Defer Gergely. |
| F4 > 5 by T+24h | STRONG PMF. Trigger Gergely paid-sponsor. DM operator for $8-10K counter. Skip D14 gate. |
| F4 = 0 at T+24h | NORMAL. Most convert D7-D14, not D1. Re-check at T+72h. |
| F1 / F0 < 50% | LANDING OR TRACKING. Audit CF logs for 4xx/5xx on `/redeem`, `/download`, `/pricing`. Check UTM preservation. |
| 200+ at any time | SPIKE. Expect Hacker Newsletter within 24-48h. DMs to 10 most-engaged. Update `/blog/monero-manifesto` CTA. |
| <30 at T+4h | FAILURE. Document for D30 retro in `gtm/35`. Reddit cross-post in 2h. Do NOT delete HN post. |

---

## §7 Fill checklist

- [ ] §0 filled, Show HN permalink pasted
- [ ] §1 trajectory points logged T+0 / T+1 / T+2 / T+4 / T+6 / T+12 / T+24
- [ ] §2 comment counts sum to §0 total
- [ ] §3 funnel numbers from CF Workers + NOWPayments (no estimates)
- [ ] §4 sources cross-checked against CF referer report
- [ ] §5 three quotes with permission flags
- [ ] §6 trigger evaluated, next action written
- [ ] Save as `gtm/36` source on Sep 7
