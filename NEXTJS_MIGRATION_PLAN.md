# Black Hornets — Next.js + TypeScript Migration Plan

> Snapshot created 2026-06-25. **Migration complete 2026-06-26.** All phases ☑ done.
> Status legend: ☐ not started · ◐ in progress · ☑ done

---

## 1. Goal & Guiding Principles

Refactor the current **vanilla-JS frontend + PHP backend + PHP panels** into a single
**Next.js (App Router) + TypeScript** application, organized by feature, built on a
reusable component system, following modern best practices.

**Principles**

1. **Strangler-fig migration** — never a big-bang rewrite. The new Next.js app runs
   alongside the legacy app and takes over route-by-route. Each phase ships something
   usable and reversible.
2. **TypeScript strict everywhere** — `strict: true`, no implicit `any`, typed API
   boundary end-to-end.
3. **Reusable-first components** — a small, well-tested UI primitive layer; feature
   components compose primitives; pages compose features.
4. **Server-first data** — React Server Components for reads, Server Actions / Route
   Handlers for writes. Client components only where interactivity demands it.
5. **One source of truth for validation** — Zod schemas shared by client forms and
   server handlers.
6. **Parity before polish** — match existing behavior first, improve after.

---

## 2. Current-State Inventory

### 2.1 Public pages (`frontend/pages/*`)
home · about · team · projects · project-details · gallery · sponsors · contact ·
apply · blog · blog-post

### 2.2 Admin panel (`panel/admin/*`)
dashboard · applications_list · application_details · messages · posts · add-edit-post ·
manage_members · add_user · edit_member · edit_profile · manage-gallery ·
manage-projects · add-edit-project · manage-sponsors · add-edit-sponsor ·
content-requests · team_dashboard · change_password · login

### 2.3 Manager panel (`panel/manager/*`)
dashboard · login · request-member · request-post · request-project · request-sponsor

### 2.4 Backend API (`backend/routes/api.php` + `backend/admin/*`)
```
GET    /team
GET    /posts            GET /posts/categories   GET /posts/{id}   POST /posts
GET    /projects         GET /projects/{id}
GET    /sponsors
GET    /gallery          POST /gallery
GET    /brochure
POST   /contact/send
POST   /applications
GET    /requests         POST /requests          POST /requests/{id}/review
# admin actions (outside the router):
POST   /backend/admin/process_application.php     (accept/reject)
POST   /backend/admin/delete_message.php
GET    /backend/admin/delete-post|project|sponsor.php
POST   /panel/admin/change_password.php
POST   /backend/process_login.php
```

### 2.5 Domain / DB tables
users · team_members · posts · projects · sponsors · gallery_images · applications ·
contact_messages · content_requests · site_settings

### 2.6 Cross-cutting concerns
Auth (admin / manager / team roles, PHP sessions, CSRF tokens) · i18n (SR/EN, currently
localStorage + `data-i18n` + `translations.js`) · file uploads (images, PDFs, resumes —
`SecureFileUpload`) · transactional email (Gmail SMTP via PHPMailer on application
approval) · reCAPTCHA v3 on public forms.

---

## 3. Target Architecture

### 3.1 Stack
| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router) | SSR/RSC, file routing, server actions |
| Language | TypeScript (strict) | type safety end-to-end |
| Styling | Tailwind CSS + CSS variables for the existing brand tokens | fast, consistent, themable |
| Forms | react-hook-form + Zod | shared validation, great DX |
| Data (client) | TanStack Query (only where client fetching is needed) | caching, mutations |
| i18n | next-intl | App-Router-native, typed messages |
| Auth | Auth.js (NextAuth) credentials provider + middleware | role-based gating |
| DB access | **Track A:** keep PHP API · **Track B:** Drizzle ORM on existing MySQL | see §3.3 |
| Testing | Vitest (unit) + Playwright (e2e, already exists) | reuse current suite |
| Lint/format | ESLint (typescript-eslint) + Prettier (or Biome) | consistency |

### 3.2 Folder structure (feature-oriented)
```
src/
  app/
    (public)/                 # marketing + public features
      page.tsx                # home
      about/  team/  projects/  projects/[id]/
      gallery/  sponsors/  contact/  apply/
      blog/    blog/[id]/
      layout.tsx              # public navbar + footer
    (admin)/admin/
      layout.tsx              # admin sidebar/topbar, auth guard
      dashboard/  applications/  applications/[id]/
      messages/  posts/  posts/[id]/edit/
      members/  members/[id]/edit/  users/new/
      gallery/  projects/  projects/[id]/edit/
      sponsors/ sponsors/[id]/edit/  content-requests/  profile/
    (manager)/manager/
      layout.tsx              # manager sidebar, auth guard
      dashboard/  requests/{member,post,project,sponsor}/
    api/                      # route handlers (Track B) or proxy (Track A)
    login/
  components/
    ui/                       # primitives (Button, Input, Card, Modal, ...)
    layout/                   # Navbar, Footer, Sidebar, PageHeader, Container
    forms/                    # Form, FormField, FormError wrappers
  features/
    posts/ team/ projects/ sponsors/ gallery/
    applications/ contact/ requests/ auth/
      components/   # PostCard, ApplyForm, ...
      hooks/        # useApplications, ...
      api.ts        # typed data access for the feature
      schema.ts     # Zod schemas (shared client/server)
      types.ts
  lib/
    api-client.ts   # typed fetch wrapper
    db.ts           # Drizzle client (Track B)
    auth.ts         # Auth.js config
    i18n.ts
    utils.ts
  messages/ sr.json en.json
  styles/ globals.css
```

### 3.3 Backend decision (the one big fork)

**Track A — Keep PHP API (recommended for Phases 1–6).**
Next.js consumes the existing `/backend/api/*` endpoints. Lowest risk; lets us migrate
100% of the UI before touching the proven DDD backend. Next.js Route Handlers act as a
thin typed proxy / BFF where needed (auth cookie forwarding, file upload streaming).

**Track B — Full Next.js full-stack (optional Phase 7).**
Reimplement the API with Next.js Route Handlers + Server Actions and **Drizzle ORM on the
existing MySQL schema** (no data migration needed). Retire PHP entirely.

> **Recommendation:** Do Track A through the whole UI migration. Re-evaluate Track B only
> after the frontend is fully on Next.js and stable. Splitting the decision this way means
> the risky backend rewrite is isolated, optional, and never blocks UI progress.

---

## 4. Reusable Component System

Build these **before** feature pages (Phase 1). Each gets a unit test + stories/usage doc.

### 4.1 UI primitives (`components/ui/`)
Button · IconButton · Input · Textarea · Select · Checkbox · RadioGroup · Switch ·
FileUpload (image/PDF, drag-drop, preview) · Badge · StatusBadge · RoleBadge · Card ·
Modal/Dialog · Drawer · Tabs · Tooltip · Spinner · Skeleton · Alert · Toast · Pagination ·
Avatar · Table (sortable/filterable) · EmptyState · ProgressBar.

### 4.2 Layout (`components/layout/`)
PublicNavbar · Footer · AdminSidebar · ManagerSidebar · AdminTopbar · PageHeader ·
Container · LanguageToggle · MobileMenu.

### 4.3 Form infrastructure (`components/forms/`)
Form (RHF provider) · FormField (label + control + error) · FormError · SubmitButton ·
FileField · honeypot + reCAPTCHA helpers.

### 4.4 Feature components (`features/*/components/`)
PostCard · NewsCard · BlogList · ProjectCard · ProjectDetails · SponsorCard ·
SponsorTier · BrochureViewer · GalleryGrid · GalleryItem · GalleryModal · TeamMemberCard ·
TeamHierarchy · DepartmentView · ApplicationCard · ApplicationDetails · RequestCard ·
RequestReviewModal · ContactForm · ApplyForm · StatCard · FilterBar.

---

## 5. Phased Roadmap

Each phase = its own branch + PR. Definition of Done per phase noted.

### ☑ Phase 0 — Foundation & tooling
- Scaffold Next.js + TypeScript app (under `/web` or new repo dir to coexist with legacy).
- Tailwind + brand tokens (port colors/fonts from `style.css`).
- ESLint/Prettier, `tsconfig` strict, path aliases (`@/`).
- CI: typecheck + lint + Vitest + existing Playwright.
- Typed `api-client.ts` pointing at the PHP API (`BASE_URL` env).
- **DoD:** app boots, lints clean, CI green, one smoke test passes.

### ☑ Phase 1 — Design system & layout
- Build all UI primitives (§4.1) + layout (§4.2) + form infra (§4.3).
- next-intl wired with `sr.json` / `en.json` (port from `translations.js`).
- LanguageToggle + locale routing.
- **DoD:** component library renders, unit-tested, i18n switches language.

### ☑ Phase 2 — Public read-only pages (lowest risk)
- home · about · team · projects · project-details · gallery · sponsors · blog · blog-post.
- Server Components fetch from PHP API; feature cards from §4.4.
- SEO: metadata, OpenGraph, sitemap, structured data (port from existing `<head>`).
- **DoD:** all public read pages at parity, Lighthouse ≥ 90, e2e nav tests pass.

### ☑ Phase 3 — Public forms
- ContactForm + ApplyForm via Server Actions; Zod schemas shared.
- File upload (resume PDF) through a Route Handler → PHP (Track A) or storage (Track B).
- Honeypot + reCAPTCHA v3 parity.
- **DoD:** submissions land in DB; validation matches legacy; e2e form tests pass.

### ☑ Phase 4 — Auth & route protection
- Auth.js credentials provider against `users` table (verify against existing bcrypt hashes).
- Roles: admin · manager · team_member/leader. Middleware guards `(admin)` / `(manager)`.
- Login page + logout + session handling; CSRF handled by Next.js conventions.
- **DoD:** login works for all roles; guards redirect unauth; e2e auth tests pass.

### ☑ Phase 5 — Admin panel (CMS)
- Sub-features, shippable independently:
  - 5a Dashboard (stat cards) + Messages (list, delete).
  - 5b Applications (list, filters, details, accept/reject + email, create-account).
  - 5c Posts (list, add/edit, toggle, delete, author select).
  - 5d Members (list, add user, edit member, edit profile).
  - 5e Gallery (add/edit/delete/toggle, category).
  - 5f Projects & Sponsors (CRUD, brochure upload).
- **DoD:** each sub-feature at parity; e2e admin specs pass against new UI.

### ☑ Phase 6 — Manager panel & content-request workflow
- Manager dashboard + 4 request forms (member/post/project/sponsor) with live preview.
- Admin content-requests review (approve / decline / edit-and-approve) → creates real records.
- **DoD:** full manager→admin pipeline works; e2e content-request tests pass.

### ☑ Phase 7 — (Optional) Backend migration to Next.js full-stack
- Drizzle schema mapped to existing MySQL tables (no data migration).
- Reimplement each endpoint as Route Handler / Server Action; port email (Nodemailer),
  uploads, CSRF, rate-limiting.
- Run PHP and Next API in parallel; cut over endpoint-by-endpoint behind a flag.
- Decommission PHP once parity + tests confirmed.
- **DoD:** all data ops served by Next.js; PHP removed; full e2e suite green.

### ☑ Phase 8 — Cutover & cleanup
- Point production domain at Next.js; redirects from old URLs.
- Delete `frontend/` and `panel/` (and `backend/` if Track B done).
- Update docs (README, ARCHITECTURE, DEPLOYMENT).
- **DoD:** legacy code removed; deploy pipeline updated; monitoring in place.

---

## 6. Frontend Migration — Step by Step (Detailed)

This section explains **exactly what to do** to move the current vanilla-JS frontend to
Next.js, so the work is mechanical and repeatable. It covers the mental model, a one-time
setup, a per-page recipe, a full worked example, and the gotchas.

### 6.1 Mental model — how today's files map to Next.js

Today each public page is a folder like `frontend/pages/sponsors/` containing an HTML
shell, `helpers/*.js` (build HTML strings), `hooks/fetch.js` (call the API, write
`innerHTML`), plus shared `constants/*.js` and `assets/translation/translations.js`.
Everything hangs off `window.*` globals and is wired by `<script>` tags.

In Next.js the same responsibilities split into typed modules:

| Today (vanilla JS) | Next.js + TS equivalent |
|---|---|
| `pages/sponsors/sponsors.html` | `app/(public)/sponsors/page.tsx` (Server Component) |
| `hooks/fetch.js` (`window.API.x.getAll`) | `features/sponsors/api.ts` (typed server fetch) |
| `helpers/render.js` (HTML strings) | `features/sponsors/components/*.tsx` (JSX) |
| `constants/sponsors.js` | `features/sponsors/constants.ts` (typed) |
| `translations.js` + `data-i18n` | `messages/sr.json` + `messages/en.json` (next-intl) |
| `api/client.js` (`window.API`) | `lib/api-client.ts` (typed `fetch`) |
| `components/header`, `components/footer` | `components/layout/Navbar.tsx`, `Footer.tsx` |
| global `window.*`, `<script>` order | ES `import` / `export` |
| `innerHTML = "..."` | return JSX from a component |
| AOS scroll animations | CSS animations or `framer-motion` |
| `localStorage.language` toggle | next-intl locale + `<LanguageToggle/>` |

**Key shift:** stop generating HTML strings and writing `innerHTML`. Instead, fetch typed
data on the server and render JSX from reusable components.

### 6.2 One-time setup (do once, before any page)

1. **Scaffold** (if not done in Phase 0):
   ```bash
   npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   cd web && npm i react-hook-form zod @hookform/resolvers next-intl
   ```
2. **Port brand tokens** from `frontend/assets/css/style.css` (the gold `#FFD700`, dark
   panels, fonts Poppins/Michroma/Rajdhani) into `tailwind.config.ts` `theme.extend` +
   `globals.css` CSS variables.
3. **Typed API client** `src/lib/api-client.ts`:
   ```ts
   const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/backend/api";

   export async function apiGet<T>(path: string): Promise<T> {
     const res = await fetch(`${BASE}/${path}`, { cache: "no-store" });
     if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
     return res.json() as Promise<T>;
   }
   export async function apiPost<T>(path: string, body: FormData | object): Promise<T> {
     const res = await fetch(`${BASE}/${path}`, {
       method: "POST",
       body: body instanceof FormData ? body : JSON.stringify(body),
       headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
     });
     return res.json() as Promise<T>;
   }
   ```
4. **next-intl** wiring: create `messages/sr.json` + `messages/en.json`, a `[locale]`
   segment or middleware, and a `<LanguageToggle/>` that swaps locale (replaces the
   `localStorage.language` + `data-i18n` system).
5. Build the **layout shell** once: `app/(public)/layout.tsx` with `<Navbar/>` +
   `<Footer/>` so every page inherits it (replaces the `header-footer.js` injection).

### 6.3 The per-page recipe (repeat for each page)

For each public page, do these steps in order:

1. **Identify the data.** Open the page's `hooks/fetch.js`, note which `window.API.*`
   call it makes and the response shape. Write a `types.ts` describing it.
2. **Write the typed fetch** in `features/<x>/api.ts` using `apiGet`/`apiPost`.
3. **Convert each render helper to a component.** Take each HTML-string builder in
   `helpers/render.js` and rewrite it as a `.tsx` component returning JSX. Pull anything
   reusable (cards, badges) into `components/ui` or the feature's `components/`.
4. **Move constants** to a typed `constants.ts`.
5. **Move strings** to `messages/*.json`; replace `t.foo || "Foo"` with `useTranslations`/
   `getTranslations`.
6. **Write `page.tsx`** as a Server Component: `await` the fetch, map data to components.
   Handle the three states the old hook handled — data / empty ("coming soon") / error.
7. **Port styles** — reuse the existing CSS (move the page's CSS into a CSS module or
   Tailwind classes). Keep class names if reusing the CSS file verbatim.
8. **Interactivity** (hover, modals, sliders) goes in small `"use client"` components.
9. **Verify** with the existing Playwright spec by pointing `BASE_URL` at the Next.js app;
   the selectors should still match if you keep the same structural classes/ids.

### 6.4 Worked example — Sponsors page (old → new)

The current page calls `window.API.sponsors.getAll()` → `{ success, data }`, groups by
tier, and renders `.sponsor-item` cards with logo, name, and a hover panel. Here is the
Next.js version.

**`features/sponsors/types.ts`**
```ts
export interface Sponsor {
  id: number;
  name: string;
  tier: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  description_en: string | null;
}
export interface SponsorsResponse { success: boolean; data: Sponsor[] }
```

**`features/sponsors/api.ts`**
```ts
import { apiGet } from "@/lib/api-client";
import type { SponsorsResponse } from "./types";

export const getSponsors = () => apiGet<SponsorsResponse>("sponsors");
```

**`features/sponsors/constants.ts`** (ported from `constants/sponsors.js`)
```ts
export const SPONSOR_TIERS = [
  "Institucija", "F1 - Platinum", "F2 - Gold",
  "F3 - Silver", "F4 - Bronze", "Friends of the Project",
] as const;

export const TIER_KEYWORDS: { tier: string; keywords: string[] }[] = [
  { tier: "Institucija", keywords: ["institu"] },
  { tier: "F1 - Platinum", keywords: ["platinum", "f1"] },
  // ...rest ported verbatim
];
```

**`features/sponsors/group.ts`** (the old `groupSponsorsByTier`, now typed & pure)
```ts
import type { Sponsor } from "./types";
import { SPONSOR_TIERS, TIER_KEYWORDS } from "./constants";

export function groupByTier(sponsors: Sponsor[]): Record<string, Sponsor[]> {
  const tiers: Record<string, Sponsor[]> = Object.fromEntries(
    SPONSOR_TIERS.map((t) => [t, []]),
  );
  for (const s of sponsors) {
    const raw = s.tier.trim().toLowerCase();
    const match = TIER_KEYWORDS.find((r) => r.keywords.some((k) => raw.includes(k)));
    (tiers[match?.tier ?? "F1 - Platinum"] ??= []).push(s);
  }
  return tiers;
}
```

**`features/sponsors/components/SponsorCard.tsx`** (reusable; `"use client"` for hover)
```tsx
"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Sponsor } from "../types";

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const t = useTranslations("sponsors");
  const desc = sponsor.description_en ?? sponsor.description ?? "";
  return (
    <div className="sponsor-item">
      {sponsor.logo_url ? (
        <Image src={`/${sponsor.logo_url}`} alt={sponsor.name} width={160} height={160}
               className="sponsor-logo" />
      ) : (
        <div className="sponsor-logo-placeholder">{sponsor.name.charAt(0)}</div>
      )}
      <p className="sponsor-name">{sponsor.name}</p>
      {(desc || sponsor.website) && (
        <div className="sponsor-hover-info">
          <p className="sponsor-hover-name">{sponsor.name}</p>
          {desc && <p className="sponsor-description">{desc}</p>}
          {sponsor.website && (
            <a href={sponsor.website} target="_blank" rel="noopener"
               className="sponsor-website">{t("visitWebsite")}</a>
          )}
        </div>
      )}
    </div>
  );
}
```

**`app/(public)/sponsors/page.tsx`** (Server Component — no `window`, no `innerHTML`)
```tsx
import { getTranslations } from "next-intl/server";
import { getSponsors } from "@/features/sponsors/api";
import { groupByTier } from "@/features/sponsors/group";
import { SponsorCard } from "@/features/sponsors/components/SponsorCard";

export default async function SponsorsPage() {
  const t = await getTranslations("sponsors");
  let grouped: Record<string, ReturnType<typeof groupByTier>[string]> = {};
  let error = false;
  try {
    const { success, data } = await getSponsors();
    if (success && data.length) grouped = groupByTier(data);
  } catch { error = true; }

  if (error) return <ComingSoonOrError title={t("errorLoadingSponsors")} />;
  if (!Object.values(grouped).some((a) => a.length))
    return <ComingSoonOrError title={t("comingSoon")} />;

  return (
    <section className="sponsors-container">
      {Object.entries(grouped).map(([tier, list]) =>
        list.length ? (
          <div key={tier} className="sponsor-category">
            <h3 className="tier-title">{t(`tier.${tier}`)}</h3>
            <div className="sponsors-list">
              {list.map((s) => <SponsorCard key={s.id} sponsor={s} />)}
            </div>
          </div>
        ) : null,
      )}
    </section>
  );
}
```

That single example demonstrates every move you'll repeat: typed response → typed fetch →
pure util → reusable card component → server page handling data/empty/error, with strings
from next-intl and styling reused from the existing CSS class names.

### 6.5 Common conversions & gotchas

- **`innerHTML = "<div>…"` → JSX.** Never build HTML strings. Map arrays to components.
- **`window.API.x` → typed `apiGet/apiPost`.** Delete `window.apiReady`; server fetches
  just `await`.
- **`localStorage.language` → next-intl locale.** One `<LanguageToggle/>`; pages read
  `useTranslations`/`getTranslations`. `description` vs `description_en` selection moves
  from inline ternaries into the component using the active locale.
- **`<img onerror>` fallback → `next/image` + a placeholder branch** (as in `SponsorCard`).
- **AOS `data-aos` scroll animations → CSS keyframes or `framer-motion`** in a small client
  component; don't pull AOS into Next.
- **PDF flipbook (brochure)** stays a `"use client"` component using `pdfjs-dist` via
  `useEffect`; it's the one genuinely client-heavy widget — migrate it last.
- **Global `<script>` ordering → ES imports.** Each module imports exactly what it needs.
- **Forms (contact/apply)** use react-hook-form + a Zod schema in `features/<x>/schema.ts`,
  submitted via a Server Action that calls the PHP endpoint (Track A). Keep honeypot +
  reCAPTCHA fields.
- **Keep structural class names/ids** that the Playwright specs assert on, so the existing
  e2e suite keeps passing during migration.

### 6.6 Suggested page migration order (easiest → hardest)

1. **about** — mostly static, almost no data. Good first conversion to validate setup.
2. **home** — hero + latest-news cards (one API read).
3. **projects** + **project-details** — simple list + detail.
4. **team** — list + hierarchy/department grouping (pure util like sponsors).
5. **sponsors** — tier grouping + hover cards (the worked example) + brochure widget.
6. **gallery** — category grids + lightbox modal (`"use client"`).
7. **blog** + **blog-post** — list, search, pagination, single post.
8. **contact** + **apply** — forms with validation, file upload, reCAPTCHA (Phase 3).

### 6.7 Per-page Definition of Done

- [ ] Typed `types.ts` + `api.ts` for the page's data.
- [ ] Render helpers rewritten as components; reusable bits extracted to `components/ui`.
- [ ] Strings in `messages/*.json`; no hardcoded English fallbacks in JSX.
- [ ] `page.tsx` handles data / empty / error states.
- [ ] Styles ported; structural selectors preserved for e2e.
- [ ] Interactivity isolated in `"use client"` components.
- [ ] Existing Playwright spec passes against the new route (`BASE_URL` re-pointed).
- [ ] Lighthouse ≥ 90; no console errors.

---

## 7. Cross-cutting Workstreams (run across phases)

- **i18n:** port SR/EN strings to typed `next-intl` message catalogs (Phase 1 onward).
- **Testing:** keep the Playwright suite green against each migrated route; add Vitest unit
  tests per component/feature. Re-point `BASE_URL` to the Next.js app per phase.
- **Accessibility:** semantic HTML, keyboard nav, focus management on modals, alt text.
- **Performance:** RSC by default, image optimization (`next/image`), route-level code split.
- **Security:** server-side authz on every mutation, Zod input validation, CSRF, rate limits,
  keep secrets in env, preserve `SecureFileUpload` validation rules.

---

## 8. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Big-bang rewrite stalls | Strangler-fig; every phase ships & is reversible |
| Auth/session parity bugs | Verify against existing bcrypt hashes; e2e auth tests first |
| File-upload regressions | Port `SecureFileUpload` rules into a shared validator; test with real files |
| i18n drift | Single typed message catalog; lint for missing keys |
| Backend rewrite scope creep | Track B isolated to Phase 7, optional, flag-gated cutover |
| SEO loss on cutover | Preserve URLs + redirects; verify sitemap/metadata parity |

---

## 9. Immediate Next Actions
1. Approve **Track A** (keep PHP API during UI migration) vs **Track B** (full-stack now).
2. Decide repo layout: `/web` subdir in this repo **(recommended)** vs separate repo.
3. Scaffold Phase 0; port brand tokens; wire CI.
4. Start Phase 1 component library.
