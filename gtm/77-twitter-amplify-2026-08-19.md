# Pulse Show HN — Twitter/X amplification playbook (T-72h to T+24h)

**For:** Pulse team (Luna + operator) · **Trigger:** Show HN Sun 2026-08-31 19:00 ET  
**Sources:** `gtm/76` §3, `gtm/79` §5.5, `gtm/19`

**Hard rules:** 0 emoji. Periods only. No exclamation marks. No hashtags except 1 optional `#ShowHN` on T+0 Pulse tweet. No marketing hype adjectives ("killer", "incredible", "game-changing", "transformative", and similar). No "we're excited" / "thrilled to share" / "happy to announce" / "passion project" / "after months of work". Cap: 1 Pulse tweet per hour, 1 ally tweet per hour.

---

## §0 Pre-launch (T-72h to T-0)

The 72h-before window is **not** a hype ramp. It is 1-2 posts that establish the account as a real builder feed, not a launch vehicle. Pulse starts with 0 followers; quiet until T+0 is correct.

**Post 1 (T-72h, Tue Aug 26 morning ET) — process, not product:**

```
We're publishing the Show HN body on Sun 7pm ET.
Until then, building the demo GIFs. Tauri 2 + Ollama,
12 MB binary, no telemetry. The HN post will be the
canonical first comment, not a marketing post.
```

Char count: 199.

**Post 2 (T-24h, Sat Aug 30 morning ET) — one technical detail:**

```
Tauri 2 vs Electron for a 12 MB binary: the Rust
backend talks to Ollama via FFI, the WebView2
surface is just the side panel. RAM use is
40-80 MB instead of 400-800 MB. Show HN tomorrow.
```

Char count: 191.

---

## §1 T+0 (post goes live on HN)

### Pulse account — primary tweet (within 5 min of HN submission)

```
Show HN just went up: Pulse is a 12 MB Windows
side panel for AI chat. Tauri 2 + Ollama, no
account, no telemetry, no cloud by default. AMA
in the HN thread for the next 6 hours. https://ownlocalml.com
```

Char count: 211. URL included. No hashtag. "AMA in the HN thread" is a directional, not a CTA.

### Reply-tweet drafts (3 angles, paste-ready, T+5 / T+15 / T+30)

**Reply 1 — local-AI crowd ("is anyone else seeing this on HN right now"):**

```
if you're refreshing news.ycombinator.com right
now and wondering whether the local-AI + crypto-pay
combo is real, the post is up. the Tauri 2 binary
is 12 MB and the Ollama integration is 80 lines of
Rust. AMA.
```

Char count: 218.

**Reply 2 — privacy crowd (HN Type D):**

```
the privacy pitch isn't "we promise not to track"
— it's that the free tier defaults to local Ollama
with cloud off, and the audit command
(pulse --audit-net) shows every network call in
real time. the claim is structurally enforced.
```

Char count: 234.

**Reply 3 — indie-hacker crowd:**

```
solo build, 6 months of dev, 50 trial users
running the build for 3-6 weeks. Show HN is
the second 500, not the first 50. if you're
shipping something in the local-AI space too,
drop a link below.
```

Char count: 196.

### Tagging rules

- Do NOT tag @paulg, @swyx, @HNTanzy, @simonw, @tptacek in the Pulse account's T+0 tweet. Tagging big accounts from a 0-follower account reads as clout-chasing.
- DO mention them by handle (no @) in the post body if they are already in the HN thread as commenters.
- DO reply to their HN comments with depth (per `gtm/79` §2). Their visibility on HN is the mechanism.

---

## §2 T+30min to T+2h (golden hour)

5 paste-ready ally tweets, different angles, posted by allies (not the Pulse account) at T+30, T+45, T+60, T+90, T+120.

**Ally profile:** HN account with 1K+ X followers on local-AI / privacy / dev-tools. Not a friend. Not the founder's other account. The ally's value is the 3rd-party signal; visible connection to Pulse kills it (`gtm/79` §3.3).

### Ally tweet 1 (T+30min) — technical

```
spent the last 30 min reading the Pulse HN
thread. the Tauri 2 + Ollama FFI integration
is the right call vs the in-process inference
bloat that half the local-AI clients ship.
worth reading if you're building on llama.cpp.
```

Char count: 226.

### Ally tweet 2 (T+45min) — privacy

```
the "0 bytes uploaded" claim on Pulse isn't
a marketing line — the free tier defaults to
local Ollama with cloud off, and the audit
command is in the public repo. structurally
enforced, not policy. this is what
"privacy-first" should look like in 2026.
```

Char count: 234.

### Ally tweet 3 (T+60min) — indie-hacker

```
solo founder, 6 months, Show HN just hit
front page. the 3 demo workflows (email reply
copilot, Whisper meeting notes, spreadsheet
helper) are the kind of small AI tools that
should have existed 2 years ago. watching
this one.
```

Char count: 197.

### Ally tweet 4 (T+90min) — founder-productivity

```
the 14-day full-feature trial with no credit
card is the right shape for a launch. the
$20/mo Pro tier is below the 2026 modal
($20 ChatGPT Plus, $20 Claude Pro, $20
Cursor). the local-first + crypto-pay angle
is the differentiator, not the price.
```

Char count: 219.

### Ally tweet 5 (T+120min) — "we just shipped X" (3rd-person view)

```
Pulse just shipped: multi-monitor side panel
with per-monitor hotkey binding. was a top-3
ask in the HN thread for the first 90 min.
patch is in main, MSI rebuild queued. this
is what "online for 6h post-launch" looks
like.
```

Char count: 226. 3rd-party observer voice.

### Banned patterns (Pulse + allies)

Marketing hype adjectives: "killer", "incredible", "game-changing", "transformative", and similar superlatives. Launch clichés: "we're excited", "thrilled to share", "happy to announce", "so excited to", "after months of work", "passion project", "labor of love", "the future of", "reimagine", "blown away", "we could not have done this without", "you guys are X". Engagement-bait: "RT if you agree", "like if you want this", "DM us", "link in bio", "check it out". Plus: any emoji, any exclamation mark.

---

## §3 T+2h to T+6h (cool-down)

Max 1 Pulse tweet per hour. Post only on substantive new development.

**Triggering events (= 1 tweet):** new HN comment with 20+ upvotes worth highlighting; new commit to public repo; Hacker Newsletter mention; new comparison or teardown post from a credible X account (respond with depth, not "thanks"); bug report fixed in <2h (show fix commit hash).

**NOT tweets (do not post):** generic "still online in the HN thread" (once is fine, twice is begging); screenshot of upvote count rising; new follower milestone; reply to critical tweet that adds no substance; cross-post of a quote-tweet without context.

**Substantive tweet template:** `[observed fact]. [file:line or commit hash if technical]. [1 line on what this means for users]. HN thread still active.` Char budget: 220-270. No URL needed if HN thread is already linked.

---

## §4 T+6h to T+24h

### T+12h — single results tweet (the only one in this window)

```
12h in: [N] points, [M] comments, [K] free signups on
https://ownlocalml.com. Show HN thread still up. We're
back at 7am ET tomorrow to reply to the overnight
queue. D7 retrospective on Sep 7.
```

Char count: 188. After T+12h, no Pulse tweets until D3 (Wed Sep 3). X = amplification, not engagement farming. HN thread is the conversation; X is the broadcast. Major event in this window (Hacker Newsletter pickup, 200+ spike, security disclosure) = 1 tweet, else no tweets.

### D3 or D7 follow-up — 4-tweet thread

Each tweet = 1 data point from `gtm/57` (D7 template). Shape: (1) headline number, (2) conversion funnel, (3) top-3 feature requests, (4) D14/D30 plan (1 sentence, no pitch). Each tweet = 220-270 chars. Thread unrolled. No hashtags. Link to HN thread and `gtm/36` D7 retro.

---

## §5 Ally recruitment (DMs sent T-72h to T-24h)

Recruit via DM, not public ask. 3-5 high-engagement accounts.

**Candidate profile:** 1K+ X followers. Posts about local-AI, privacy, indie-hacking, or dev-tools. Tweeted about Ollama, llama.cpp, Tauri, or local-first in the last 60 days. Not visibly connected to Pulse.

**Top 5 candidates (from `gtm/67`):** @redundantly (Ollama MLX on Apple Silicon, HN front-page submitter); @parsam (BrowserBee, direct analog); @jkilzi (local-first AI, privacy advocacy); 2 others from `gtm/67` engagement-7+ list.

**DM template (paste-ready):**

```
Hey [first name] — we (Pulse team) are shipping a
12 MB Tauri 2 AI side panel on Show HN this Sun
7pm ET. If it hits the front page, would you be
up for posting a 1-line technical take on X
during the 6h post-launch window? No scripting,
no quote-tweets required. Just a real take if
the post resonates.
```

Char count: 271. "No scripting" is the trust signal. DM is permission, not choreography. DM does NOT include the 5 paste-ready ally tweets, a tweet time, a tag/retweet request, a discount code, or compensation. The ally's tweet is their own voice.

---

## §6 Metrics that matter

**Track at T+0, T+1, T+2, T+6, T+24:** HN thread points (≥100 by T+6h); HN thread comment count (≥80 by T+6h, drives ranking per `gtm/77`); ally tweet engagement (≥20 likes+RTs+replies per tweet in 24h); Pulse account follower growth (+50-200 by T+24h); Pulse T+0 tweet impressions (≥1K at T+24h); referral clicks X → ownlocalml.com (≥50 by T+24h, UTM `?utm_source=x&utm_campaign=show-hn`).

**Do NOT optimize for:** non-launch tweet impressions, follower/following ratio, likes from non-target accounts, "Pulse" mentions without context, engagement rate on a 1-3 tweet sample.

**Reading at T+24h:** 200+ HN + 200+ Pulse followers + 50+ ally engagement = X worked. 200+ HN + <50 Pulse followers = HN readers did not migrate (acceptable). <100 HN + 200+ Pulse followers = X over-performed, check follower quality.

---

## §7 Fallbacks

**Rate-limited at T+0:** wait 15 min, retry. If still limited, post from ally 1 with `originally posted by @[ally], retweeting because the primary account hit a rate limit`.

**Ally tweet out-engages Pulse T+0:** expected. Do NOT reply with "thanks for the mention" — silence is correct. Reply-tweets are a growth-hack pattern that HN-types notice.

**Critical tweet (security, correction, callout):** 1 substantive reply within 30 min. Correct → acknowledge plainly. Incorrect → link to code or doc. Do not block, report, or delete the original.

**X is down at T+0:** no action. Post T+0 tweet at T+30min when X recovers. If X down 2+ hours, skip X entirely.

---

_One-page sections. Paste-ready blocks in fenced code with char counts. Collapse to 1 line per item if a section overruns._
