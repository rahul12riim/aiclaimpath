# AIWorkforce — AI-Powered Unemployment Filing Guide

> Free, private, AI-guided help to file unemployment insurance in all 50 US states.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_ORG/aiworkforce)

---

## What it does

AIWorkforce helps people navigate the confusing process of filing for unemployment insurance:

- **AI Q&A agent** — conversational guide powered by Claude claude-sonnet-4-20250514
- **RAG-grounded answers** — agent retrieves verified state rules from Pinecone, not hallucinations
- **All 50 states** — specific rules, deadlines, benefit amounts, and portal links
- **Eligibility checker** — 60-second check before investing time in the full application
- **Appeal letter generator** — drafts personalized letters for denied claims
- **Privacy-first** — we never store SSNs, DOB, names, or bank info. Ever.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| AI | Claude claude-sonnet-4-20250514 (Anthropic), Vercel AI SDK |
| RAG | Pinecone (vector DB) + OpenAI text-embedding-3-small |
| Cache / Rate limit | Upstash Redis |
| Database (non-sensitive) | Supabase Postgres |
| Hosting | Vercel Edge Network |
| CI/CD | GitHub Actions |

---

## Quick start (local dev)

### Prerequisites
- Node.js 20+
- Accounts at: Anthropic, OpenAI (embeddings), Pinecone, Upstash, Supabase, Vercel

### 1. Clone and install

```bash
git clone https://github.com/YOUR_ORG/aiworkforce.git
cd aiworkforce
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your API keys (see `.env.example` for all required keys).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Ingest knowledge base (RAG setup)

Before deploying, you need to populate the Pinecone vector database with state rules.

```bash
# One-time setup
npm run ingest
```

This script:
1. Scrapes official state DOL websites
2. Chunks content into 512-token segments
3. Generates embeddings via OpenAI
4. Upserts to Pinecone with state + topic metadata

Re-run weekly to keep knowledge current (use the provided GitHub Actions cron job).

---

## Deploying to Vercel

> **Important:** The repository must be deployed via Vercel with the project linked to `rahul12riim/aiclaimpath`.
> A `vercel.json` is included at the repo root with the correct framework settings.
> All three GitHub Actions secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) must be set for CI/CD deploys to succeed.

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahul12riim/aiclaimpath)

### Manual deploy

```bash
npm install -g vercel
vercel login
vercel link
vercel env add ANTHROPIC_API_KEY
# ... add all other env vars
vercel --prod
```

### Vercel project settings

| Setting | Value |
|---|---|
| Framework Preset | **Next.js** |
| Root Directory | `.` (repo root) |
| Build Command | `npm run build` |
| Install Command | `npm ci` |
| Output Directory | `.next` (auto-detected) |

These are also encoded in `vercel.json` at the repo root so they apply automatically on Vercel.

### Connect your domain

1. In Vercel dashboard → Settings → Domains
2. Add `aiclaimpath.com` (or your custom domain)
3. Update DNS at your registrar:
   - `A` record → `76.76.21.21`
   - `CNAME www` → `cname.vercel-dns.com`

### Required GitHub Secrets (for CI/CD)

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | vercel.com/account → your team ID |
| `VERCEL_PROJECT_ID` | your project settings in Vercel |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `OPENAI_API_KEY` | platform.openai.com |
| `PINECONE_API_KEY` | app.pinecone.io |
| `UPSTASH_REDIS_REST_URL` | console.upstash.com |
| `UPSTASH_REDIS_REST_TOKEN` | console.upstash.com |
| `NEXT_PUBLIC_SUPABASE_URL` | supabase.com/dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase.com/dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | supabase.com/dashboard |

### Verifying `/feedback` after deploy

Once deployed, confirm the route is live:

```bash
curl -I https://aiclaimpath.vercel.app/feedback
# Expect: HTTP/2 200
```

Or open `https://aiclaimpath.vercel.app/feedback` in a browser — you should see the feedback form, not a Vercel 404.

---

## Domain purchase guide

### Recommended: aiworkforce.com

Check and purchase at one of these registrars:
- **Namecheap**: namecheap.com — ~$12/year, good privacy
- **Cloudflare Registrar**: cloudflare.com/products/registrar — at-cost pricing
- **Google Domains (now Squarespace)**: ~$12/year

### Alternative: aiworkforce.ai (if .com is taken)

.ai domains cost ~$70–100/year but signal AI clearly.
Purchase via Cloudflare for best pricing + free DNSSEC.

---

## Architecture

```
User browser
    ↓
Vercel Edge CDN (global, auto-scales)
    ↓
Next.js API Routes (/api/chat, /api/eligibility, /api/state)
    ↓ (parallel)
┌─────────────────┬──────────────────┬───────────────┐
│  Upstash Redis  │  Pinecone RAG    │  Anthropic    │
│  (rate limit +  │  (state rules +  │  Claude API   │
│   session cache)│   FAQ retrieval) │  (streaming)  │
└─────────────────┴──────────────────┴───────────────┘
    ↓ (non-sensitive only)
Supabase Postgres
(session progress, opt-in reminders)
```

### Privacy enforcement

- PII scrubber runs on EVERY message before it reaches Claude or any storage
- Session IDs are UUIDs — never linked to identity
- No SSN, DOB, bank info, or full name is ever transmitted to our servers
- All session data has a 24-hour TTL in Redis
- Supabase has no PII columns by design

---

## Adding a new state

1. Add the state object to `src/lib/states-data.ts`
2. Run `npm run ingest` to pull and embed that state's rules
3. Test the eligibility checker and chat with the new state

---

## Contributing

PRs welcome. Please:
1. Never add PII collection to any endpoint
2. Keep the system prompt in `src/lib/agents/unemployment-agent.ts` accurate
3. Verify any state rule changes against the official state DOL website
4. Add tests for any new eligibility logic

---

## Launch checklist (Friday deploy)

- [ ] All API keys added to Vercel environment variables
- [ ] Domain purchased and DNS pointed at Vercel
- [ ] `npm run ingest` completed for at least 10 states
- [ ] Test chat with California, Texas, New York
- [ ] Test eligibility checker for all 5 scenarios
- [ ] Privacy review: confirm no PII reaches any endpoint
- [ ] Analytics (PostHog) tracking key funnel events
- [ ] Error monitoring (Sentry) connected
- [ ] Rate limiting tested (10 req/min per session)
- [ ] SSL certificate active on domain

---

## License

MIT — free to use, fork, and build on.

---

*Built with ❤️ to help people get the benefits they're entitled to.*
