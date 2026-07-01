# Black Hornets Racing — Formula Student Team Platform

[![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20SR-orange.svg)](README.md)

Bilingual (English/Serbian) web platform for the Black Hornets Formula Student team. Handles public engagement, team management, project tracking, sponsor relations, content requests, and admin/manager workflows — all in a single Next.js App Router application.

## Architecture

```
blackhornets-site/
├── web/                        # Next.js application (single source of truth)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/           # Public-facing pages (home, team, projects, sponsors…)
│   │   │   ├── (admin)/admin/      # Admin panel (auth-guarded, role: admin)
│   │   │   ├── (manager)/manager/  # Manager panel (auth-guarded, role: manager)
│   │   │   ├── (backend)/api/      # Route handlers (REST API layer)
│   │   │   └── login/
│   │   ├── components/         # Reusable UI primitives + layout
│   │   ├── lib/
│   │   │   ├── db/             # Drizzle ORM schema + mysql2 client
│   │   │   └── api/            # Typed fetch client + file upload helper
│   │   ├── hooks/              # Shared React hooks
│   │   ├── constants/          # Typed constants (statuses, tiers, icons…)
│   │   └── types/              # Shared TypeScript types
│   ├── public/uploads/         # Local upload fallback (dev / no R2 configured)
│   ├── drizzle.config.ts
│   └── next.config.ts
└── database.sql                # Database schema + seed
```

## Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS variables |
| Database | MySQL via Drizzle ORM + mysql2 |
| Auth | Auth.js v5 (credentials, JWT sessions) |
| i18n | next-intl (English / Serbian) |
| Rich text | Tiptap v3 |
| File uploads | Cloudflare R2 (S3-compatible), falls back to local `public/uploads/` if unconfigured |
| Lint/format | Biome |
| E2E tests | Playwright |

## Getting started

**Requirements:** Node 20+, MySQL (XAMPP or any MySQL 5.7+/MariaDB 10.4+)

```bash
# 1. Import database
mysql -u root blackhornets < database.sql

# 2. Install dependencies
cd web && npm install

# 3. Configure environment
# Create web/.env.local (see below)

# 4. Sync Drizzle schema
npm run db:push

# 5. Dev server
npm run dev           # → http://localhost:3000
```

**web/.env.local**
```
NEXT_PUBLIC_API_BASE=http://localhost:3000/api
AUTH_SECRET=<generate with: openssl rand -base64 32>
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=blackhornets

# Cloudflare R2 (optional in dev — omit to fall back to public/uploads/)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_PUBLIC=
R2_BUCKET_PRIVATE=
NEXT_PUBLIC_R2_PUBLIC_URL=
```

## Default credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `BlackHornets2025!` |

**Change the admin password immediately after first login.**

## Scripts

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run lint         # Biome check
npm run db:push      # Sync Drizzle schema → MySQL
npm run db:studio    # Drizzle Studio (visual DB browser)
```

## File uploads

Uploads go to Cloudflare R2 (`R2_BUCKET_PUBLIC`/`R2_BUCKET_PRIVATE`) when configured, served from `NEXT_PUBLIC_R2_PUBLIC_URL`. Without R2 env vars set, falls back to `web/public/uploads/{type}/`, served at `/uploads/{type}/filename`. Required on Vercel (no persistent local disk).

## Roles & panels

| Role | Panel | Capabilities |
|---|---|---|
| `admin` | `/admin` | Full CMS — members, posts, projects, sponsors, gallery, brochure, messages, applications, request review |
| `manager` | `/manager` | Submit content requests (post/project/sponsor/member) for admin approval |

## API

All endpoints live under `/api/`. Route handlers are in `web/src/app/(backend)/api/`.

Public:
- `GET /api/team` — team members
- `GET /api/posts`, `GET /api/posts/[id]`, `GET /api/posts/categories` — news/posts
- `GET /api/projects`, `GET /api/projects/[id]` — projects
- `GET /api/sponsors` — sponsors
- `GET /api/gallery`, `GET /api/gallery/[id]` — gallery images
- `GET /api/brochure` — brochure download
- `POST /api/applications` — join applications
- `POST /api/contact/send` — contact form

Admin-only (`/api/admin/*`): CRUD for members, posts, projects, sponsors, gallery, messages, applications, stats

Manager request workflow: `POST /api/requests` → admin reviews via `POST /api/requests/[id]/review`

Request types: `member`, `post`, `project`, `sponsor`, `gallery`
