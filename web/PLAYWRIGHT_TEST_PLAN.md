# Playwright E2E Test Plan — Black Hornets Site

## Decisions (locked)
- **Cleanup:** truncate content tables in seed before each run (keep users/team).
- **Scope now:** Phase 0 + 1 + 2. Phase 3 after these pass.
- **Test users:** dedicated `test_admin` / `test_manager` seeded with known password (existing accounts have unknown bcrypt passwords).

## App facts
- Auth: cookie session (next-auth). Guards in `src/proxy.ts`: `/admin` = admin only, `/manager` = admin+manager.
- Request-based flow:
  - Manager submits at `/manager/requests/new/{post,sponsor,member,project,gallery}` → server action `submitRequestAction` → row in `content_requests` (status `pending`). Action returns `{success}` (no redirect — stays on form, shows success message).
  - Admin reviews at `/admin/requests/[id]` (`RequestReviewClient`) → approve / edit+approve / decline → `reviewRequestAction` → `redirect("/admin/requests")`.
  - Approve inserts into real content tables (posts/sponsors/projects/gallery_images, members → users+team_members) + sets request `approved`. Decline sets `declined`.
- next-intl: locale via `NEXT_LOCALE` cookie (`localePrefix: never`, no URL change). Default `sr`. Tests force `en` cookie for deterministic text selectors.

## Form selectors (by `name=`)
- **post** (`type=post`): `title_sr`*, `title_en`, content via TipTap editor, `category`, `image` (file).
- **sponsor** (`type=sponsor`): `name`, `tier`, `website`, `description_sr`, `description_en`, `logo` (file).
- **member** (`type=member`): `full_name`*, `email`*, `phone`, `position`, `role`, `team`, `department`, `study_field`, `faculty`, `academic_year`, `profile_picture` (file).
- **project** (`type=project`): `name`, `description`, `status`, `due_date`* (date), `duration`, `progress`, `image` (file).
- **gallery** (`type=gallery`): `category`, `title`, `images` (file), `alt_text`.
- All forms: one `button[type=submit]`.
- Login (`/login`): `input[name=username]`, `input[name=password]`, submit button "Sign In".
- Admin review notes: `Textarea`; approve = Check button, decline = X button (lucide icons) — select by accessible name/role.

## Files to create
```
playwright.config.ts                      # webServer npm run dev, baseURL :3000, en-locale cookie, setup project dep
tests/
  seed.mjs                                # truncate content tables; upsert test_admin/test_manager (bcryptjs + mysql2)
  e2e/
    auth.setup.ts                         # UI login both roles -> .auth/manager.json, .auth/admin.json (storageState)
    helpers.ts                            # uniqueName(prefix), role storageState paths
    manager/
      post-request.spec.ts                # submit -> success msg -> pending in /manager/requests
      sponsor-request.spec.ts
      member-request.spec.ts
      project-request.spec.ts
      gallery-request.spec.ts
    admin/
      review-approve.spec.ts              # create req in-test -> approve -> approved + visible on public page
      review-edit-approve.spec.ts         # edit a field -> approve -> edited value persists
      review-decline.spec.ts              # decline + notes -> declined, not on public site
```
`.auth/` added to `.gitignore`.

## Phases
- **Phase 0 — infra:** install `@playwright/test` + chromium; config; `seed.mjs`; `auth.setup.ts`; helpers. Gate: setup logs in both roles, storageState saved.
- **Phase 1 — manager creates (priority):** 5 specs, submit each request type, assert success + `pending` row in manager queue.
- **Phase 2 — admin review (core):** approve (→ public site), edit+approve (→ edited persists), decline (→ declined, absent from site).
- **Phase 3 — later:** admin direct CRUD (`/admin/*/new`, edit, delete), public smoke (11 pages 200+render), i18n SR↔EN nav flip, auth guard redirects.

## Data isolation
- Every spec creates uniquely-named content: `` `Post ${Date.now()}` `` etc. → find-by-name in admin queue, no collisions across approve/decline.
- `seed.mjs` truncates `content_requests` + `posts` + `sponsors` + `projects` + `gallery_images` (and test-created members) before run. Real members/users preserved.

## Setup commands
```
npm i -D @playwright/test
npx playwright install chromium
node tests/seed.mjs        # seed users + truncate (also run as global/CI pretest)
npx playwright test
```
