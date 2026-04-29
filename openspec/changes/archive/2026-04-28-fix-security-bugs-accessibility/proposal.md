## Why

The codebase has critical security vulnerabilities (unauthenticated admin server actions, no role-based access control, exposed service role key pattern), functional bugs (katalog filters not working, admin dashboard using client SDK in server components, silent fallback to mock data), and significant WCAG accessibility failures (missing ARIA attributes, inaccessible forms, no skip navigation, keyboard traps, and contrast failures). Left unfixed, any authenticated user can delete all data, and the public katalog is partially broken for all visitors.

## What Changes

- **BREAKING**: Add role-based authorization middleware and server action guards — currently any authenticated user can access admin routes and any anonymous caller can invoke destructive server actions
- Add input validation and sanitization to all server actions (title, slug, URL format, enum values, length limits)
- Fix katalog subject/level filter logic to actually filter media by category
- Replace silent mock-data fallback in `supabaseQuery` with proper error handling and user-visible error states
- Replace `window.confirm()` dialogs with accessible Radix Dialog modals
- Add ARIA attributes, labels, and focus management across all interactive elements (navbar, radio groups, tables, icon buttons, forms)
- Add skip-navigation link for keyboard users
- Fix color contrast issues (muted-foreground on muted background, badge colors)
- Separate client-side data functions from server-side ones; use server Supabase client for Server Components
- Make admin dashboard use server-side data fetching instead of browser client
- Add CSRF-relevant headers and rate-limit awareness for view-count increment
- Remove dead write-path functions in `data.ts` that use anon key (already superseded by server actions)
- Ensure `.env.local` is in `.gitignore` and add `.env.example` template

## Capabilities

### New Capabilities
- `admin-authorization`: Role-based access control for admin routes and server actions; middleware checks user role, server actions verify auth before executing
- `input-validation`: Server-side validation and sanitization for all user inputs (media CRUD, category CRUD) with clear error responses
- `accessible-ui`: WCAG 2.1 Level AA compliance — ARIA labels, focus management, skip nav, keyboard navigation, color contrast, screen reader announcements, accessible confirmation dialogs

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **Security**: All admin server actions and pages gain auth guards. Middleware adds role check.view_count increment gains rate limiting awareness.
- **Data layer**: `src/lib/data.ts` refactored — split into client and server modules; silent mock fallback removed; admin dashboard uses server-side fetching
- **UI/Components**: Navbar gets ARIA + skip nav. Katalog filter sidebar gets radiogroup semantics. Admin tables get proper headers/captions. All icon buttons get aria-label. `window.confirm()` replaced with Radix Dialog. Color tokens adjusted for contrast.
- **Forms**: All `<label>` elements get `htmlFor`, all form controls get `id` attributes, select dropdowns get aria-labels
- **Config**: `.env.local` in `.gitignore`, `.env.example` added