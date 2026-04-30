# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### NexTerm (`artifacts/nexterm`)
- **Kind**: Web app (React + Vite + Tailwind v4)
- **Preview path**: `/` (root)
- **Port**: 20608
- **Description**: Full SSH & Remote Desktop management web app
- **Stack**: React, wouter, framer-motion, xterm.js (`@xterm/xterm`), lucide-react, @tanstack/react-query, Tailwind v4
- **Pages**: Dashboard, Terminal (xterm.js with SFTP panel + multi-tab), Remote Desktop (canvas viewer + toolbar + perf panel), Connections manager, Settings
- **Data**: All mock data — no backend required
- **Custom theme**: `--bg-primary` through `--accent-*` CSS vars, JetBrains Mono font for terminal, Inter/Space Grotesk for UI
