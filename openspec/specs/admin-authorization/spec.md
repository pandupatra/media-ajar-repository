## ADDED Requirements

### Requirement: Admin route middleware authorization
The system SHALL verify that every request to `/admin/*` routes (except `/admin/login`) is made by an authenticated user whose profile role is `admin`. Unauthenticated users SHALL be redirected to `/admin/login`. Authenticated users with a non-admin role SHALL be redirected to `/` with an appropriate message.

#### Scenario: Unauthenticated user visits admin dashboard
- **WHEN** a user without a valid session navigates to `/admin`
- **THEN** the system redirects them to `/admin/login`

#### Scenario: Authenticated non-admin user visits admin route
- **WHEN** an authenticated user with `role: "contributor"` navigates to `/admin/media`
- **THEN** the system redirects them to `/` and displays a toast or flash message "You do not have permission to access the admin area"

#### Scenario: Authenticated admin user visits admin route
- **WHEN** an authenticated user with `role: "admin"` navigates to `/admin`
- **THEN** the system allows the request through without interruption

### Requirement: Server action authorization guard
Every admin server action (`createMediaAction`, `updateMediaAction`, `deleteMediaAction`, `createCategoryAction`, `deleteCategoryAction`) SHALL verify the caller's identity and admin role before executing any database operation. If verification fails, the action SHALL throw a redirect to `/admin/login`.

#### Scenario: Unauthenticated caller invokes deleteMediaAction
- **WHEN** a server action is invoked without a valid auth session
- **THEN** the action throws a `redirect()` to `/admin/login` without performing any database operation

#### Scenario: Non-admin authenticated caller invokes createMediaAction
- **WHEN** an authenticated user with `role: "contributor"` calls `createMediaAction`
- **THEN** the action denies the request with an appropriate error and does not create the media

#### Scenario: Admin user invokes createMediaAction
- **WHEN** an authenticated admin user calls `createMediaAction` with valid data
- **THEN** the action proceeds normally

### Requirement: Auth guard helper module
The system SHALL provide a `requireAdmin()` helper in `src/lib/supabase/auth-guard.ts` that creates a server-side Supabase client, retrieves the authenticated user, fetches their profile, and verifies `role === "admin"`. This helper SHALL be the single source of truth for admin authorization checks.

#### Scenario: requireAdmin called with valid admin session
- **WHEN** called from a server action or server component with a logged-in admin user
- **THEN** it returns the user object with `{ id, email, role }`

#### Scenario: requireAdmin called with no session
- **WHEN** called with no authenticated session
- **THEN** it throws a `redirect()` to `/admin/login`

#### Scenario: requireAdmin called with non-admin session
- **WHEN** called with an authenticated user whose role is not "admin"
- **THEN** it throws a `redirect()` to `/admin/login`

### Requirement: View count service role isolation
The `incrementViewCountAction` SHALL continue using the service role key for the atomic RPC call, but SHALL NOT expose the service role key to the client. The non-atomic fallback path (read-then-update) SHALL be removed to eliminate race conditions.

#### Scenario: User views a media page for the first time
- **WHEN** a user visits `/media/[slug]` and the view count increments
- **THEN** only the atomic RPC `increment_media_view_count` is called; no fallback read-then-update path exists

#### Scenario: RPC call fails
- **WHEN** the `increment_media_view_count` RPC fails
- **THEN** the action logs the error and returns `{ newCount: null }` without attempting a non-atomic fallback

### Requirement: Environment variable security
The `.env.local` file SHALL NOT be committed to version control. A `.env.example` file SHALL be provided as a template. The `.gitignore` SHALL include `.env.local`.

#### Scenario: Developer clones the repository
- **WHEN** a developer clones the repo and runs the app
- **THEN** `.env.local` is not present; `.env.example` provides the required variable names as a template

### Requirement: Data layer separation
The system SHALL separate data access into server-side and client-side modules. `src/lib/data-server.ts` SHALL use `createClient()` from `@/lib/supabase/server` for Server Components. `src/lib/data-client.ts` SHALL use `createClient()` from `@/lib/supabase/client` for Client Components. The `supabaseQuery` wrapper with silent mock fallback SHALL be removed. Shared utility functions (`getFormatLabel`, `getFormatColor`, `formatFileSize`, `formatDate`, `generateSlug`) SHALL remain in a shared module.

#### Scenario: Server Component fetches media list
- **WHEN** the home page Server Component calls `getLatestMedia()`
- **THEN** it uses `data-server.ts` which creates a proper server-side Supabase client with cookie access

#### Scenario: Client Component searches media
- **WHEN** the katalog client component calls `searchMedia()`
- **THEN** it uses `data-client.ts` which creates a browser Supabase client

#### Scenario: Supabase connection fails
- **WHEN** a Supabase query throws an error
- **THEN** the function propagates the error (does NOT silently return mock data); the calling component handles it with an error boundary or error state

### Requirement: Admin dashboard server-side data fetching
The admin dashboard page (`src/app/admin/page.tsx`) SHALL use the server-side Supabase client to fetch data, instead of the current client-side `createClient()` which cannot access cookies in a Server Component context.

#### Scenario: Admin dashboard loads
- **WHEN** an admin user navigates to `/admin`
- **THEN** the page fetches all dashboard data using `data-server.ts` functions with proper server-side auth