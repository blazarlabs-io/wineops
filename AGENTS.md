# WineOps Agents Guide

## Repo at a Glance
- Turborepo managed with `pnpm` (see `pnpm-workspace.yaml`); main app is `apps/pwa` (Next.js 15 App Router, React 19, TypeScript strict).
- UI stack: MUI 7 + Toolpad layout (`DashboardLayout`), Notistack for toasts, Tailwind v4 (imported in `src/app/globals.css`), Google Maps via `@vis.gl/react-google-maps`.
- State + data: Firebase Auth/Firestore (`src/lib/firebase`) with collection constants in `config.ts`; domain contexts in `src/context` subscribe via `onSnapshot` for real-time data. Extra UI state uses Zustand stores in `src/store`.
- Forms: `react-hook-form` with Joi resolvers; schemas live in `src/models/schemas/**/*` and sample payloads in `src/data`.
- Path alias `@/*` maps to `apps/pwa/src`.

## Running Things
- Requirements: Node >= 18, pnpm 9.
- Install deps: `pnpm install`.
- Dev server: `pnpm turbo run dev --filter pwa` (or `pnpm --filter pwa dev` inside `apps/pwa`).
- Build: `pnpm turbo run build --filter pwa`.
- Lint: `pnpm turbo run lint --filter pwa` (ESLint 9 flat config in `apps/pwa/eslint.config.mjs`, builds ignore lint errors per `next.config.ts`).
- Format: `pnpm format` (Prettier 3).

## Environment
- Firebase client envs validated on import (`src/lib/envs/client.ts`): `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
- Maps: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for `APIProvider` in `context/providers.tsx`.
- Missing values throw before render; stub or set when testing.

## App Structure Highlights
- App Router segments: public landing (`app/page.tsx`), auth routes under `(auth)` using Toolpad `SignInPage`, workspace routes under `(private)/workspace/...` aligned with `components/navigation/sidebar-navigation.tsx`.
- Root layout wraps `AppRouterCacheProvider`, `AuthProvider` (Firebase auth) fed by server user from `getAuthenticatedAppForUser`, then `context/providers.tsx` nesting Sidebar/Toolsbar/QuickDrawer/Bottle/Winery/Vineyard/Grape/Localization/Vessel/Consumable/Must/Chemistry/Wine/Anexa14/Anexa7 + Google Maps.
- Workspace shell (`components/layout/workspace-layout.tsx`) uses Toolpad `DashboardLayout`, quick drawers for tasks/actions, and session info from `useAuth`.
- Data access helpers in `src/lib/firebase/services/*` return `{ data, error, status }`; Firestore documents live under `WINERY/{uid}/<collection>` per constants in `config.ts`.

## Patterns to Follow
- Mark client components with `"use client"` when using hooks/state; server components remain default.
- Prefer MUI `sx` styling and existing Tailwind utilities; theme lives in `src/lib/themes/main-theme.ts` (Lato typography, light/dark schemes).
- Reuse context data rather than duplicating Firestore queries; quick actions/drawers are registered per domain context.
- Keep navigation additions consistent with `NAVIGATION` in `components/navigation/sidebar-navigation.tsx` and workspace routing.
- Use `useAuth` for user + auth actions; do not bypass the provider chain in `layout.tsx`.

## Domain Map
- Wine production dashboards: vineyards, grapes, primary/secondary vinification, bottling.
- Operations: storage, vessels, expendables (chemistry/consumables), tools/equipment, team (people/tasks), reports (Anexa 7/14), documents/preferences/widgets.
- Reports and tables render printable layouts (see `globals.css` print styles and `components/table/*`).

## Pitfalls / Notes
- Env validation happens at import time; missing vars break builds immediately.
- Context/provider nesting is intentional (e.g., LocalizationProvider wraps date pickers, QuickDrawer/Toolsbar dependencies); avoid reordering unless necessary.
- Firestore writes assume `uid` scoping; use the helper services instead of manual path strings.
- Storybook static output lives in `apps/pwa/storybook-static`; not part of runtime app.
