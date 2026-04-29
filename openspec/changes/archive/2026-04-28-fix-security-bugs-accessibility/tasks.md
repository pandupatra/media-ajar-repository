## 1. Security: Auth Guard & Middleware

- [x] 1.1 Create `src/lib/supabase/auth-guard.ts` with `requireAdmin()` helper
- [x] 1.2 Update `src/middleware.ts` to check user role
- [x] 1.3 Add `requireAdmin()` call as the first line in every admin server action
- [x] 1.4 Remove the non-atomic fallback path in `src/app/media/[slug]/actions.ts`
- [x] 1.5 Ensure `.env.local` is in `.gitignore`; create `.env.example`

## 2. Security: Input Validation

- [x] 2.1 Create `src/lib/validations.ts` with validation functions
- [x] 2.2 Add `title` validation: non-empty, max 255 chars
- [x] 2.3 Add `slug` validation: auto-generated, must match `^[a-z0-9-]+$`, max 255 chars
- [x] 2.4 Add `format` validation: must be one of MediaFormat enum values
- [x] 2.5 Add `type` validation: must be one of MediaType enum values
- [x] 2.6 Add `status` validation: must be one of MediaStatus enum values
- [x] 2.7 Add `external_url` validation: must start with https:// or http://, no javascript:, max 2048 chars
- [x] 2.8 Add `description` validation: max 2000 chars
- [x] 2.9 Add category name validation: non-empty, max 100 chars; duplicate check
- [x] 2.10 Add search query sanitization in `data-client.ts`
- [x] 2.11 Update all server actions to call validation before database operations

## 3. Bug Fix: Data Layer & Katalog Filters

- [x] 3.1 Create `src/lib/data-server.ts`
- [x] 3.2 Create `src/lib/data-client.ts`
- [x] 3.3 Create `src/lib/format.ts`
- [x] 3.4 Update media queries to fetch `media_categories` join
- [x] 3.5 Add `error.tsx` boundary; remove `supabaseQuery` wrapper
- [x] 3.6 Remove write-path functions from `data.ts`
- [x] 3.7 Delete `src/lib/data.ts`
- [x] 3.8 Update all import paths across the codebase
- [x] 3.9 Fix katalog subject/level filter logic

## 4. Accessibility: Skip Nav & Structure

- [x] 4.1 Add skip navigation link and `id="main-content"` to all `<main>` elements
- [x] 4.2 Add `aria-label` to desktop `<nav>` and mobile menu

## 5. Accessibility: Interactive Elements

- [x] 5.1 Add `aria-label` and `aria-expanded` to hamburger button
- [x] 5.2 Add focus trap (Escape key) to mobile menu
- [x] 5.3 Add `aria-label` to all icon-only buttons in admin
- [x] 5.4 Add `<caption>` and `scope="col"` to admin tables
- [x] 5.5 Add `aria-label` to katalog sort `<select>`

## 6. Accessibility: Forms & Labels

- [x] 6.1 Add `id`/`htmlFor` to all form controls in login, create/edit media, category, users
- [x] 6.2 Add `aria-label` to search inputs in navbar and katalog
- [x] 6.3 Wrap katalog filter radio groups in `role="radiogroup"` with `aria-label`
- [x] 6.4 Add `aria-required="true"` to required form fields

## 7. Accessibility: Confirmation Dialogs & States

- [x] 7.1 Create `src/components/ui/confirm-dialog.tsx` using `@radix-ui/react-dialog`
- [x] 7.2 Replace `window.confirm()` in media with `<ConfirmDialog>`
- [x] 7.3 Replace `window.confirm()` in categories in `src/app/admin/categories/page.tsx` with `<ConfirmDialog>`
- [x] 7.4 Add `aria-busy="true"` to loading containers; add `aria-label` to loading spinners
- [x] 7.5 Add `role="alert"` to error messages; add `aria-live="polite"` to katalog results count

## 8. Accessibility: Color Contrast

- [x] 8.1 Change `text-muted-foreground` on `bg-muted` surfaces to meet 4.5:1 contrast
- [x] 8.2 Adjust badge colors
- [x] 8.3 Ensure focus indicators on all interactive elements

## 9. Bug Fix: Admin Dashboard Data Fetching

- [x] 9.1 Convert `src/app/admin/page.tsx` to use server-side data functions
- [x] 9.2 Verify admin dashboard fetches data correctly