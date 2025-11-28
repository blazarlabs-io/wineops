# WineOps Monorepo Docs

## Overview
- Monorepo managed by Turborepo + pnpm. Workspace packages live in `apps/*` and `packages/*` (see `pnpm-workspace.yaml`).
- Primary product: `apps/pwa` (Next.js 15 App Router, React 19, TypeScript). Shared configs live under `packages/*` (eslint, tsconfig, ui kit).
- Tooling: pnpm 9, Node >= 18, Prettier 3, ESLint 9 (flat), Tailwind v4, MUI 7 + Toolpad, ag-Grid Enterprise.

## Prerequisites
- Node >= 18
- pnpm 9 (`corepack enable` recommended)
- Firebase project credentials for client-side auth/Firestore
- Google Maps API key (Maps JavaScript)

## Install
```bash
pnpm install
```

## Core Commands
- Dev server (PWA only): `pnpm --filter pwa dev` (Turbopack) or `pnpm turbo run dev --filter pwa`
- Build (PWA only): `pnpm --filter pwa build`
- Lint: `pnpm --filter pwa lint`
- Format: `pnpm format`
- Type checks (if wired in tasks): `pnpm --filter pwa check-types`

## Repository Structure
- `apps/pwa` – main Next.js application (see `docs/pwa.md` for full details)
- `packages/ui` – shared UI package (MUI/Toolpad helpers, if used)
- `packages/eslint-config`, `packages/typescript-config` – shared lint/tsconfig presets
- `turbo.json` – task graph definitions
- `cleanup-comments-and-logs.js` – housekeeping script
- `pnpm-lock.yaml`, `pnpm-workspace.yaml` – workspace plumbing

## Environment
The PWA validates env vars on import; missing values throw during build/runtime.
- Firebase client envs (`apps/pwa/src/lib/envs/client.ts`):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
- Google Maps:
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

For local dev, create `.env.local` in `apps/pwa` with the above keys.

## Conventions
- Path alias: `@/*` -> `apps/pwa/src/*`
- Client components must include `"use client"` when using hooks/state.
- UI styling via MUI `sx` + theme (`mainTheme`) and Tailwind utilities in `globals.css`.
- Data access through Firebase service helpers in `apps/pwa/src/lib/firebase/services/*`; collections live under `WINERY/{uid}/...`.
- Forms: `react-hook-form` + Joi schemas (`apps/pwa/src/models/schemas`).
- Toasts via Notistack; global providers registered in `apps/pwa/src/context/providers.tsx`.

## How to Contribute
- Keep changes isolated per workspace (prefer `--filter pwa` when running scripts).
- Follow existing contexts/state stores instead of duplicating fetch logic.
- Add navigation items consistently with `components/navigation/sidebar-navigation.tsx` and corresponding `app/(private)/workspace/...` routes.
- Run `pnpm format` and `pnpm --filter pwa lint` before opening PRs.
