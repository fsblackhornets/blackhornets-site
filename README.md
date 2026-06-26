# Black Hornets Racing — Formula Student Team Platform

[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
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
│   │   │   ├── (public)/       # Public-facing pages (home, team, projects, sponsors…)
│   │   │   ├── (admin)/admin/  # Admin panel (auth-guarded, role: admin)
│   │   │   ├── (manager)/manager/ # Manager panel (auth-guarded, role: manager)
│   │   │   ├── api/            # Next.js route handlers (REST API layer)
│   │   │   └── login/
│   │   ├── components/         # Reusable UI primitives + layout
│   │   ├── lib/
│   │   │   ├── db/             # Drizzle ORM schema + mysql2 client
│   │   │   └── api/            # Typed fetch client + file upload helper
│   │   ├── hooks/              # Shared React hooks
│   │   ├── constants/          # Typed constants (statuses, tiers, icons…)
│   │   └── types/              # Shared TypeScript types
│   ├── public/uploads/         # Uploaded files (images, PDFs, resumes)
│   ├── drizzle.config.ts
│   └── next.config.ts
├── playwright/                 # End-to-end tests
├── uploads/                    # Legacy uploaded files (copy to web/public/uploads/ on cutover)
└── blackhornets_full_dump.sql  # Database snapshot
```

## Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS variables |
| Database | MySQL via Drizzle ORM + mysql2 |
| Auth | Auth.js v5 (credentials, JWT sessions) |
| File uploads | Server-side to `public/uploads/` |
| Lint/format | Biome |

## Getting started

**Requirements:** Node 20+, MySQL (XAMPP or any MySQL 5.7+/MariaDB 10.4+)

```bash
# 1. Import database
mysql -u root blackhornets < blackhornets_full_dump.sql

# 2. Install dependencies
cd web && npm install

# 3. Configure environment
cp .env.local.example .env.local  # or create manually (see below)

# 4. Sync Drizzle schema (adds any missing columns)
npm run db:push

# 5. Dev server
npm run dev           # → http://localhost:3000
```

**.env.local**
```
NEXT_PUBLIC_API_BASE=http://localhost:3000/api
AUTH_SECRET=<generate with: openssl rand -base64 32>
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=blackhornets
```

## Default credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `BlackHornets2025!` |

**Change the admin password immediately after first login.**

## Useful scripts

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run lint         # Biome check
npm run db:push      # Sync Drizzle schema → MySQL
npm run db:studio    # Drizzle Studio (visual DB browser)
```

## File uploads

New uploads (images, PDFs, resumes) are written to `web/public/uploads/{type}/` and served at `/uploads/{type}/filename`.

If migrating from the legacy PHP app, copy existing files:
```bash
cp -r uploads/  web/public/uploads/
```

## Roles & panels

| Role | Panel | Capabilities |
|---|---|---|
| `admin` | `/admin` | Full CMS — members, posts, projects, sponsors, gallery, brochure, messages, applications, request review |
| `manager` | `/manager` | Submit content requests (post/project/sponsor/member) for admin approval |

## API

All endpoints live under `/api/`. See `web/src/app/api/` for route handlers.

Public: `GET /api/team`, `GET /api/posts`, `GET /api/projects`, `GET /api/sponsors`, `GET /api/gallery`, `GET /api/brochure`

Admin-only: `GET|POST /api/admin/*`

Request workflow: `POST /api/requests` → `POST /api/requests/[id]/review`
