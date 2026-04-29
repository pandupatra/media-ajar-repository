## ADDED Requirements

### Requirement: Skip navigation link
Every page SHALL include a skip navigation link as the first focusable element that allows keyboard users to jump directly to the main content area. The link SHALL be visually hidden by default and become visible on focus.

#### Scenario: Keyboard user tabs into the page
- **WHEN** a keyboard user presses Tab on page load
- **THEN** the first focusable element is a "Skip to content" link that, when activated, moves focus to `<main id="main-content">`

#### Scenario: Mouse user never sees the skip link
- **WHEN** a mouse user views the page normally
- **THEN** the skip link is visually hidden and does not affect layout

### Requirement: Accessible navigation (Navbar)
The main navigation component SHALL meet WCAG 2.1 Level AA requirements:
- The hamburger menu button SHALL have `aria-label="Open menu"` / `aria-label="Close menu"` and `aria-expanded` attribute
- The mobile menu SHALL have `role="navigation"` and `aria-label="Main navigation"` or equivalent landmark
- The mobile menu SHALL trap focus when open and return focus to the toggle button when closed
- The desktop `<nav>` SHALL have an `aria-label`

#### Scenario: Screen reader encounters navbar
- **WHEN** a screen reader navigates the navbar
- **THEN** it announces a navigation landmark with label, and the hamburger button announces "Open menu, button, collapsed"

#### Scenario: Keyboard user opens mobile menu
- **WHEN** a keyboard user activates the hamburger button
- **THEN** focus moves into the open menu; pressing Escape closes it and returns focus to the toggle button

### Requirement: Accessible filter sidebar (Katalog)
The katalog page filter radio groups SHALL use proper `role="radiogroup"` with `aria-label` for each group (subject, level, format). Each radio input SHALL be programmatically associated with its label. The currently applied filters SHALL be announced to screen readers.

#### Scenario: Screen reader navigates filter groups
- **WHEN** a screen reader encounters the filter sidebar
- **THEN** each group is announced as "radiogroup" with its label (e.g., "Filter by subject") and the currently selected option

#### Scenario: User applies a filter
- **WHEN** a user selects a subject filter
- **THEN** an `aria-live` region announces "Filter applied: [subject name]. Showing X results"

### Requirement: Accessible data tables
All `<table>` elements in the admin section (media list, user list) SHALL include:
- A `<caption>` element (visually hidden with `sr-only` class if appropriate)
- `scope="col"` on all `<th>` header cells
- `aria-label` on the table element itself

#### Scenario: Screen reader navigates admin media table
- **WHEN** a screen reader encounters the media table
- **THEN** it announces "Media list table" and column headers (Judul, Format, Status, Tanggal, Aksi) with proper scope

### Requirement: Accessible form labels
Every form control (`<input>`, `<select>`, `<textarea>`) SHALL have an associated `<label>` with matching `htmlFor`/`id` or an `aria-label`/`aria-labelledby` attribute. This applies to all forms: login, create media, edit media, create category, and user management.

#### Scenario: Screen reader encounters media form
- **WHEN** a screen reader focuses the title input in the create media form
- **THEN** it announces "Judul" (or equivalent label text)

#### Scenario: Screen reader encounters select dropdown without visible label
- **WHEN** a screen reader focuses the format `<select>` which has only a sibling `<label>` (no `for`/`id`)
- **THEN** the select is still announced by its associated label via proper `id`/`htmlFor`

### Requirement: Accessible confirmation dialogs
All uses of `window.confirm()` SHALL be replaced with an accessible `<ConfirmDialog>` component built on Radix UI's Dialog primitive. The dialog SHALL:
- Set focus to the confirm button on open
- Trap focus within the dialog while open
- Close on Escape key and return focus to the trigger element
- Have `role="alertdialog"` with `aria-labelledby` and `aria-describedby`

#### Scenario: User triggers delete media
- **WHEN** a user clicks the delete button for a media item
- **THEN** a modal dialog appears with title "Delete Media?", description, Cancel and Confirm buttons; focus moves to Cancel button

#### Scenario: User cancels deletion
- **WHEN** the user presses Escape or clicks Cancel
- **THEN** the dialog closes and focus returns to the delete button that opened it

#### Scenario: Screen reader encounters confirmation dialog
- **WHEN** the dialog opens
- **THEN** the screen reader announces "Delete Media? This action cannot be undone. alert dialog"

### Requirement: Accessible icon buttons
All icon-only buttons (edit, delete, view, logout on mobile, hamburger menu) SHALL have descriptive `aria-label` attributes.

#### Scenario: Screen reader focuses delete icon button
- **WHEN** a screen reader or keyboard user focuses the trash icon button
- **THEN** it announces "Delete [media title]" or "Delete" for the action

### Requirement: Color contrast compliance
All text/background color combinations SHALL meet WCAG 2.1 Level AA minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. Specifically:
- `text-muted-foreground` (#64748b) on `bg-muted` (#f1f5f9) SHALL be adjusted to at least 4.5:1
- Badge color combinations SHALL meet 4.5:1 contrast
- Interactive element focus indicators SHALL be visible (minimum 3:1 against adjacent colors)

#### Scenario: Muted text on muted background
- **WHEN** `text-muted-foreground` text appears on `bg-muted` background (e.g., card descriptions in the media grid)
- **THEN** the contrast ratio is at least 4.5:1

#### Scenario: Badge on white background
- **WHEN** a format badge such as `bg-yellow-100 text-yellow-700` is rendered
- **THEN** the text-on-background contrast meets 4.5:1

### Requirement: Keyboard focus management
The application SHALL implement proper focus management:
- After admin login success, focus SHALL move to the main content area
- After dialog close, focus SHALL return to the triggering element
- After route change in the admin panel sidebar nav, focus management is acceptable via Next.js default behavior
- Visible focus indicators SHALL be present on all interactive elements (use `focus-visible:ring-2 focus-visible:ring-ring`)

#### Scenario: Keyboard user closes a dialog
- **WHEN** a keyboard user presses Escape or clicks Cancel in a confirmation dialog
- **THEN** focus moves back to the button that triggered the dialog

#### Scenario: Keyboard user navigates to admin after login
- **WHEN** a user successfully logs in and is redirected to `/admin`
- **THEN** focus is programmatically moved to the main content landmark

### Requirement: Loading and error state announcements
All loading and error states SHALL use `aria-busy="true"` on the container during loading and `role="alert"` on error messages, with `aria-live="polite"` regions for dynamic content updates.

#### Scenario: Admin media page loads data
- **WHEN** the admin media list is fetching data
- **THEN** the loading container has `aria-busy="true"` and the spinner has `aria-label="Loading"` with `role="status"`

#### Scenario: Login form shows an error
- **WHEN** the login form displays "Email atau password salah"
- **THEN** the error message has `role="alert"` so the screen reader announces it immediately

### Requirement: Katalog subject and level filter functionality
The katalog page filters for subject and level SHALL actually filter the displayed media list. When a user selects a subject or level, only media belonging to that category SHALL be shown. The media data fetched from the server SHALL include associated category information.

#### Scenario: User filters by subject
- **WHEN** a user selects "Matematika" in the subject filter
- **THEN** only media items categorized under "Matematika" are displayed

#### Scenario: User filters by subject and format simultaneously
- **WHEN** a user selects "IPA" as subject and "video" as format
- **THEN** only media items that are both in "IPA" category AND have "video" format are displayed

#### Scenario: User clears all filters
- **WHEN** a user clicks the reset/clear filters button
- **THEN** all filters are removed and all published media are displayed