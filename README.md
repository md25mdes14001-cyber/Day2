# Ascend Sustainability

A home wet-waste-management / composting platform — guides, a product catalogue,
a journal, and a community submission flow. Built as the production version of
the "Ascend Sustainability" (WWM) design project from UP Institute of Design.

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, with its own
lightweight data layer and email/password auth. **No external services are
required to run this locally** — everything (content, accounts, search,
form submissions) is genuinely functional out of the box.

## Quick start

```bash
npm install
npm run seed   # populates guides, products and articles
npm run dev    # http://localhost:3000
```

Create an account, log in, run the onboarding quiz on the homepage, submit the
"Share your setup" form on /community, send a product enquiry, subscribe to
the newsletter popup, and search — all of it writes to and reads from a real
local database (`.data/app.db`), so it's functional immediately, not a static
mock.

## How it's built

- **Data layer** — `src/lib/db.ts` + `src/lib/repo.ts`. Uses Node's built-in
  `node:sqlite` (zero install dependencies, which matters because this project
  was built inside a sandboxed environment with no access to download native
  database engine binaries). Every page/component talks only to the typed
  functions in `repo.ts` — never to SQL directly — so swapping the backing
  store later is contained to one file.
- **Auth** — `next-auth` v5 with a Credentials provider, JWT sessions,
  passwords hashed with `bcryptjs`.
- **Forms** — React 19 Server Actions (`src/app/actions.ts`) with `zod`
  validation. The "Share your setup" form accepts a real photo upload, saved
  to `public/uploads/`.
- **Content** — guides, products and articles are seeded from
  `src/lib/seed-data/*.ts`, written from the original Figma design project's
  brief (goals, personas, DIY kit specs, composting methods, blog post
  titles). Images are generated, on-brand SVG placeholders
  (`scripts/generate-placeholder-art.mjs`) — swap any file under
  `public/images/` for real photography whenever you have it; paths are
  matched by slug.

## Going to production

This was deliberately built to need zero paid services to run and review. Before a public launch:

### 1. Swap SQLite for Postgres (Supabase)

`node:sqlite` is excellent for local development but is a single-file,
single-process database — not meant for a deployed, multi-instance app.
Replace `src/lib/db.ts` with a Postgres client:

```bash
npm install @supabase/supabase-js
# or: npm install pg
```

Create a Supabase project, run the equivalent of the `CREATE TABLE` statements
in `db.ts` as a migration (Supabase's SQL editor, or `supabase db push`), and
rewrite the functions in `repo.ts` to query Postgres instead of SQLite — the
function signatures (`listGuides()`, `createUser()`, etc.) can stay identical,
so no page or component needs to change.

### 2. Move file uploads off local disk

`submissionAction` in `src/app/actions.ts` currently writes uploaded photos to
`public/uploads/`. On Vercel (or any serverless host) the filesystem is
ephemeral — switch this to Supabase Storage or an S3-compatible bucket.

### 3. Set a real `AUTH_SECRET`

```bash
npx auth secret
```

Put the generated value in your host's environment variables — never commit
it. `.env.local` here uses a placeholder for local development only.

### 4. Swap in real brand fonts (optional)

`next/font/google` was intentionally avoided because this sandbox can't reach
`fonts.googleapis.com` at build time. In an environment with normal internet
access, you can restore it:

```tsx
// src/app/layout.tsx
import { Manrope, Fraunces } from "next/font/google";
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
// add `${manrope.variable} ${fraunces.variable}` back to the <html> className
```

### 5. Deploy

```bash
npx vercel
```

Set `AUTH_SECRET` (and your database connection string, once step 1 is done)
as environment variables in the Vercel project settings.

## Design source

Structural and UX reference: the project's Figma file
(`WWM`, fileKey `COPCuyHLiYzaAcfatGTvBt`) — three homepage explorations, a
dedicated outdoor/leaf composting guide page, and a product catalogue
section. The Figma file reused an existing recipe-website template during
early exploration; this codebase was written from scratch with original
composting-specific copy throughout — it does not ship any of the
template's original food-blog content or branding.
