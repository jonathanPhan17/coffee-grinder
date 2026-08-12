# Coffee Grinder

An AI job-matching tool: upload a resume, point it at a batch of job postings, and get
an explainable scorecard for each one — every score backed by evidence quotes pulled
from the actual resume and posting, not a black-box number.

This repo is the web app, built with **React 19 + TypeScript + Vite**, styled with
Tailwind CSS. The backend — a Node.js/TypeScript serverless API on AWS (Lambda, Step
Functions, DynamoDB, Amazon Bedrock) — lives in
[coffeegrinder-backend](https://github.com/jonathanPhan17/coffeegrinder-backend).

## Screens

- **Upload** — drop in a resume; the backend parses it into a profile.
- **Run setup** — choose the job search (query, location, how many postings to screen),
  and see how many free runs you have left this month.
- **Run status** — live progress while the pipeline fetches and scores postings.
- **Results** — the scored matches for a run, best first.
- **Scorecard** — one match in detail: per-criterion scores with the evidence quotes
  behind each one.
- **Board** — a pipeline view of every match across runs, with drag-and-drop status
  (saved / applied / interviewing / …).
- **Cover letter** — tailored draft cover letters for a match.

## How it talks to the backend

All server calls go through one place: `src/lib/api/`. An axios client points at the
backend API (`VITE_API_URL`), `endpoints.ts` holds one typed function per endpoint, and
TanStack React Query handles caching, polling, and loading/error state. The TypeScript
shapes for everything the API returns live in `src/types/` — the same shapes the backend
serves.

## Commands

```bash
npm install
npm run dev      # local dev server (Vite)
npm run build    # typecheck (tsc -b) + production build
npm run lint     # ESLint
npm run preview  # serve the production build locally
npm run deploy   # build, sync dist/ to the site's S3 bucket, invalidate CloudFront
```

For local dev, create a `.env.local` with `VITE_API_URL=<backend API URL>` so the app
has an API to talk to. Deploys read `DEPLOY_STACK` from `.env.production` and pull the
bucket, CloudFront distribution, and site URL from that stack's CloudFormation outputs,
so the deploy script carries no per-environment values.

## Folder structure

```
coffeegrinder-frontend/
├── src/
│   ├── routes/            # one file per screen — the pages the router renders
│   ├── features/          # the building blocks of each screen, grouped by feature
│   │                      #   (resume, runs, matches, results, scorecard, board, coverletter)
│   ├── components/        # shared UI pieces used across features
│   ├── lib/
│   │   ├── api/           # axios client, typed endpoint functions, React Query setup
│   │   ├── theme/         # colors and fonts
│   │   └── utils/         # small helpers
│   ├── mocks/             # fixture data (only cover-letter drafts still use it)
│   └── types/             # TypeScript shapes shared with the backend API
├── scripts/
│   └── deploy.mjs         # ships the built app to the live site (S3 + CloudFront)
└── vite.config.ts
```
