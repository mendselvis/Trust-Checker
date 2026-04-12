# TrustCheck

## Overview

TrustCheck is an AI-powered romance scam detector. Users paste a conversation (WhatsApp, DM, or any chat text) and receive an instant analysis including a Trust Score, colour-coded verdict, red flag breakdown, and a Red Flag Timeline.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + Framer Motion
- **API framework**: Express 5
- **AI**: Anthropic Claude (claude-sonnet-4-6) via Replit AI Integrations
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- `artifacts/trust-check` — React + Vite frontend (served at `/`)
- `artifacts/api-server` — Express API server (served at `/api`)

## Key Features

- Paste any conversation and click "Analyse"
- AI scans for: speed of romantic escalation, avoidance of video calls, mentions of money/crypto/investment, overseas location claims, inconsistent story details, excessive flattery, urgency and emotional pressure
- Returns: Trust Score (0-100), verdict (safe/caution/danger), plain English breakdown, Red Flag Timeline
- Dark navy + white design, mobile-first, no login required

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## API Endpoints

- `GET /api/healthz` — health check
- `POST /api/analyse` — analyse a conversation; body: `{ conversation: string }`; returns `AnalyseResult`

## Environment Variables (auto-set)

- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic API proxy URL (via Replit AI Integrations)
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key (via Replit AI Integrations)
