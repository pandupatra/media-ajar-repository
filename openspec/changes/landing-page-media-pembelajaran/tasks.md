## 1. Project Setup

- [ ] 1.1 Initialize Next.js 15 project with TypeScript, Tailwind CSS, and App Router
- [ ] 1.2 Setup shadcn/ui with base color and install necessary components (button, card, input, dialog, select, table, dropdown-menu, sheet, badge, toast)
- [ ] 1.3 Install dependencies: supabase-js, @supabase/ssr, lucide-react, clsx, tailwind-merge
- [ ] 1.4 Setup environment variables for Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] 1.5 Create Supabase client utilities (client, server, middleware)
- [ ] 1.6 Setup project folder structure (app, components, lib, types, hooks, utils)

## 2. Database Schema & Supabase Setup

- [ ] 2.1 Create `categories` table with fields: id, name, slug, type (subject/level/format), icon, sort_order, is_active, created_at
- [ ] 2.2 Create `media` table with fields: id, title, slug, description, format, type (file/url), file_url, external_url, thumbnail_url, file_size, status, view_count, download_count, created_by, created_at, updated_at
- [ ] 2.3 Create `media_categories` pivot table for many-to-many relationship
- [ ] 2.4 Create `users` table/profile with fields: id, email, name, role (admin/contributor), created_at
- [ ] 2.5 Setup RLS policies for categories (public read, admin full access)
- [ ] 2.6 Setup RLS policies for media (public read published, admin/contributor CRUD based on role)
- [ ] 2.7 Setup Supabase Storage bucket for thumbnails and files with public read policy
- [ ] 2.8 Create database function for full-text search on media
- [ ] 2.9 Seed initial categories (Matematika, IPA, IPS, B. Indonesia, SD, SMP, SMA, Umum, PDF, Video, Website, Audio, E-Book)

## 3. Public Pages Implementation

- [ ] 3.1 Create root layout with Navbar (logo, search bar, nav links) and Footer
- [ ] 3.2 Implement Home page with Hero section (title, tagline, CTA button)
- [ ] 3.3 Implement Kategori Populer section on Home (fetch categories, display tiles)
- [ ] 3.4 Implement Media Terbaru section on Home (fetch latest 8 published media)
- [ ] 3.5 Create Katalog page (`/katalog`) with grid card layout
- [ ] 3.6 Implement filter panel on Katalog (subject, level, format checkboxes/dropdowns)
- [ ] 3.7 Implement search integration from navbar to katalog page
- [ ] 3.8 Create Detail Media page (`/media/[slug]`) with full info, thumbnail, action buttons
- [ ] 3.9 Implement media terkait section on Detail Media page
- [ ] 3.10 Create Tentang page (`/tentang`) with PTP profile, guide, and contact
- [ ] 3.11 Make all public pages responsive (mobile, tablet, desktop)

## 4. Admin Authentication

- [ ] 4.1 Create login page (`/admin/login`) with email/password form
- [ ] 4.2 Implement Supabase Auth login with error handling
- [ ] 4.3 Create middleware to protect `/admin/*` routes (redirect unauthenticated to login)
- [ ] 4.4 Create admin layout with sidebar navigation and logout button
- [ ] 4.5 Implement role-based access control (check role from users table)
- [ ] 4.6 Create auth context/provider for session management
- [ ] 4.7 Implement auto-refresh session and redirect on expiry

## 5. Admin Dashboard - Media Management

- [ ] 5.1 Create dashboard home page (`/admin`) with stats cards (total media, published, draft)
- [ ] 5.2 Create media list page (`/admin/media`) with data table
- [ ] 5.3 Implement media list filters (status, format) and pagination
- [ ] 5.4 Create add media form page (`/admin/media/new`) with all fields
- [ ] 5.5 Implement file upload handler for PDF/thumbnail to Supabase Storage
- [ ] 5.6 Implement URL input for external media with validation
- [ ] 5.7 Create edit media form page (`/admin/media/[id]/edit`)
- [ ] 5.8 Implement delete media with confirmation dialog
- [ ] 5.9 Implement status toggle (draft/published) inline or in form
- [ ] 5.10 Implement slug auto-generation from title
- [ ] 5.11 Restrict contributor to only CRUD their own media

## 6. Admin Dashboard - Category Management

- [ ] 6.1 Create categories list page (`/admin/categories`) grouped by type
- [ ] 6.2 Create add category form with name, type, slug, icon fields
- [ ] 6.3 Create edit category form
- [ ] 6.4 Implement delete category with check for associated media
- [ ] 6.5 Implement sort_order adjustment for category display order

## 7. Admin Dashboard - User Management (Admin Only)

- [ ] 7.1 Create users list page (`/admin/users`) accessible only by admin role
- [ ] 7.2 Create add user form (invite by email, set role)
- [ ] 7.3 Implement role change for existing users
- [ ] 7.4 Implement password reset functionality

## 8. Search & Filter Implementation

- [ ] 8.1 Implement PostgreSQL full-text search function in Supabase
- [ ] 8.2 Create search API route or server action for media search
- [ ] 8.3 Integrate search results with katalog page
- [ ] 8.4 Implement multi-filter query builder (subject + level + format)
- [ ] 8.5 Implement sorting options (newest, oldest, title A-Z)
- [ ] 8.6 Implement reset filter functionality
- [ ] 8.7 Sync filter state with URL query parameters

## 9. Polish & Optimization

- [ ] 9.1 Add loading states and skeletons for async data
- [ ] 9.2 Add error boundaries and error pages
- [ ] 9.3 Implement toast notifications for CRUD operations
- [ ] 9.4 Add metadata (title, description) for SEO on all pages
- [ ] 9.5 Optimize images with Next.js Image component
- [ ] 9.6 Add favicon and app metadata
- [ ] 9.7 Test responsive design on various screen sizes
- [ ] 9.8 Test role-based access with test accounts

## 10. Deployment

- [ ] 10.1 Build project and fix any build errors
- [ ] 10.2 Deploy to Vercel with environment variables
- [ ] 10.3 Configure Supabase production project settings
- [ ] 10.4 Run end-to-end smoke tests on production
- [ ] 10.5 Create admin account and seed production data
