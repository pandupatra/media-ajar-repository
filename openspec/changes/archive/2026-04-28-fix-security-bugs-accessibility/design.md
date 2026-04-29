## Context

This is a Next.js 16 app (App Router) with Supabase as the backend, using:
- **Supabase Auth** for authentication (email/password)
- **Supabase client SDK** (`@supabase/ssr`) for both server and client data fetching
- **Service role key** (`createAdminClient()`) for server actions that bypass RLS
- **Tailwind 4 + Radix UI** for the UI layer (Dialog, Select, Toast primitives available but underutilized)
- **`src/lib/data.ts`** as the single data-access module mixing client/server concerns

The app has a public face (home, katalog, media detail, tentang) and an admin face (CRUD for media, categories, users). There is no role-based access control beyond "is user authenticated?".

## Goals / Non-Goals

**Goals:**
- Secure all admin routes and server actions with role-based authorization
- Fix the broken katalog subject/level filter functionality
- Make all interactive elements accessible per WCAG 2.1 Level AA
- Replace silent mock-data fallbacks with proper error handling
- Clean up the data layer to separate client and server concerns
- Replace `window.confirm()` with accessible dialogs

**Non-Goals:**
- Adding new features (media upload, file handling, pagination) — out of scope
- Redesigning the UI or changing the visual design language
- Adding end-to-end or integration tests (can be a follow-up)
- Setting up CI/CD pipelines or deployment automation
- Implementing rate limiting at the infrastructure level (CDN/WAF)

## Decisions

### D1: Authorization architecture — middleware role check + server action guards

**Decision**: Two-layer auth: (1) Next.js middleware checks `isAuthenticated` + `role === 'admin'` for `/admin/*` routes, (2) each server action independently verifies the caller's auth + role before executing.

**Rationale**: Defense in depth. Middleware protects routes (redirects unauthorized users), but server actions are still callable via direct POST. Each action must verify auth independently.

**Implementation**:
- Add a `requireAdmin()` helper in `src/lib/supabase/auth-guard.ts` that:
  1. Creates a server client
  2. Calls `supabase.auth.getUser()`
  3. Fetches the profile to check `role === 'admin'`
  4. Throws `redirect('/admin/login')` or returns the user
- Middleware updated to also check role (not just existence of user)
- All server actions call `requireAdmin()` as their first line

**Alternatives considered**:
- *RLS-only enforcement*: Service role key bypasses RLS, so RLS alone isn't sufficient for admin actions
- *Single middleware-only check*: Server actions remain callable via POST without route protection

### D2: Katalog filter fix — join categories in data queries

**Decision**: Add a `withCategories` parameter to `getPublishedMedia` / `searchMedia` / `getLatestMedia` so the katalog page can filter by subject/level client-side with the full category data available.

**Rationale**: The current data model stores category relationships in `media_categories` junction table, but `select("*")` on media doesn't include them. Two approaches: (A) client-side filtering with pre-fetched categories, (B) server-side filtering via Supabase query. Given the small dataset and the need for category data in the UI anyway, fetching categories alongside media and filtering client-side is simpler and avoids complex Supabase join syntax for filtering.

**Implementation**:
- Modify `getPublishedMedia` and `searchMedia` to also fetch `media_categories` and join them
- Add `categories` to the returned `Media` objects
- In `KatalogPage`, filter `displayMedia` by checking `media.categories` for matching subject/level slugs

### D3: Data layer split — `data.ts` → `data-server.ts` + `data-client.ts` + remove dead code

**Decision**: Split `data.ts` into:
- `data-server.ts` — functions using `createClient()` from `@/lib/supabase/server` (for Server Components)
- `data-client.ts` — functions using `createClient()` from `@/lib/supabase/client` (for Client Components)
- Keep `getFormatLabel`, `getFormatColor`, `formatFileSize`, `formatDate`, `generateSlug` as shared utils
- Remove all write-path functions that use anon key (superseded by server actions)
- Remove `supabaseQuery` wrapper + mock fallback — replace with proper error handling

**Rationale**: The current `data.ts` mixes client/server concerns and the `supabaseQuery` mock fallback hides errors. Server Components need the server client (correct cookie handling), client components need the browser client. The mock data served as development scaffolding but is now a liability.

**Migration**:
- Public pages (home, katalog, media detail) are Server Components → use `data-server.ts`
- Admin dashboard page is a Server Component → use `data-server.ts`
- Client-side search in katalog → use `data-client.ts` for the `searchMedia` function
- Remove all unused write-path code from `data.ts`

### D4: Accessible confirmation dialogs — Radix Dialog

**Decision**: Replace all `window.confirm()` calls with `<ConfirmDialog>` component built on `@radix-ui/react-dialog` (already a dependency).

**Implementation**: Create `src/components/ui/confirm-dialog.tsx` with:
- Trigger (button), title, description, cancel + confirm actions
- Focus trap, escape-to-close, proper ARIA roles
- Callers: delete media, delete category

### D5: WCAG compliance approach

**Decision**: Systematic fixes organized by severity:
1. **Skip nav** — Add `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` above each nav
2. **ARIA labels** — Add `aria-label` to all icon-only buttons, `aria-expanded`/`aria-controls` to hamburger menu
3. **Form labels** — Add `id` to every form control and `htmlFor` to every `<label>`
4. **Radio groups** — Wrap filter radio groups in `<fieldset>` + `<legend>`, or add `role="radiogroup"` + `aria-label`
5. **Tables** — Add `<caption>`, `scope="col"` on `<th>`, `aria-label` on table
6. **Color contrast** — Replace `text-muted-foreground` on `bg-muted` surfaces with a darker shade; verify badge colors meet 4.5:1
7. **Focus management** — Add focus trap to mobile menu, manage focus after dialog close, add `aria-live` regions for loading/error states
8. **Language** — Keep `lang="id"`, consider adding `<span lang="en">` around English terms if needed

### D6: View count rate limiting approach

**Decision**: Keep the current cookie-based dedup (24h window, 100 slugs) but add a server-side check — use a simple fingerprint (IP + user-agent hash) stored in a lightweight in-memory rate limit alongside the cookie approach. For the MVP, just improving the cookie dedup and making the RPC call is sufficient; full rate limiting requires infrastructure-level changes.

**For this change**: Ensure the RPC function exists and is the only path (remove the fallback read-then-update path in the action since it creates race conditions). The cookie dedup is acceptable for MVP.

## Risks / Trade-offs

- **[Migration risk]** Removing mock fallback means the app breaks visually if Supabase is down → Mitigation: Add proper error UI components (error boundary, `error.tsx` pages) so users see a clear message instead of blank pages
- **[Breaking change]** Adding auth guards to server actions means existing admin flows fail if auth is misconfigured → Mitigation: Test thoroughly in development; the middleware redirect provides a clear UX signal
- **[Performance]** Joining categories with every media query adds a small overhead → Mitigation: Dataset is small (<1000 entries), overhead is negligible; can add caching later if needed
- **[Intrusiveness]** The data layer split touches many import sites → Mitigation: Do it as a single refactor pass with clear rename mapping

## Open Questions

- Should the admin authorization also support a `contributor` role with limited permissions (e.g., can create/edit media but not delete or manage users)? The current schema has `contributor` role but the proposal only guards for `admin`.
- Should we implement Supabase RLS policies on the database side as a second layer of defense, or rely solely on the service role key + middleware?
- For the katalog filter, should subject/level filtering happen server-side (Supabase query) for larger datasets, or is client-side filtering acceptable for the current scale?