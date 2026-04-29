## ADDED Requirements

### Requirement: Media input validation
All server actions that create or update media (`createMediaAction`, `updateMediaAction`) SHALL validate input fields before database operations. Validation rules:
- `title`: non-empty string, max 255 characters
- `slug`: auto-generated from title, must match `^[a-z0-9-]+$`, max 255 characters
- `description`: optional string, max 2000 characters
- `format`: one of `["pdf", "ebook", "website", "video", "audio", "other"]`
- `type`: one of `["file", "url"]`
- `status`: one of `["draft", "published"]`
- `external_url`: when `type === "url"`, MUST be a valid URL starting with `https://` or `http://`; MUST NOT be a `javascript:` URL
- `subject` and `level`: when provided, MUST reference existing category IDs

#### Scenario: Create media with empty title
- **WHEN** `createMediaAction` is called with `title: ""`
- **THEN** the action returns an error "Title is required" without creating a record

#### Scenario: Create media with javascript: URL
- **WHEN** `createMediaAction` is called with `type: "url"` and `external_url: "javascript:alert(1)"`
- **THEN** the action rejects the URL and returns an error "Invalid URL format"

#### Scenario: Create media with valid data
- **WHEN** `createMediaAction` is called with valid title, format, type, and proper URL
- **THEN** the action proceeds to create the media record

### Requirement: Category input validation
Server actions for categories (`createCategoryAction`) SHALL validate:
- `name`: non-empty string, max 100 characters
- `type`: one of `["subject", "level", "format"]`
- `slug`: auto-generated from name, must match `^[a-z0-9-]+$`
- Duplicate check: creating a category with the same `type` + `name` (or same `type` + `slug`) SHALL return an error

#### Scenario: Create category with duplicate name in same type
- **WHEN** `createCategoryAction` is called with `name: "Matematika"` and `type: "subject"` when one already exists
- **THEN** the action returns an error "A subject category with this name already exists"

#### Scenario: Create category with valid unique name
- **WHEN** `createCategoryAction` is called with `name: "Fisika"` and `type: "subject"`
- **THEN** the action creates the category with slug `fisika`

### Requirement: Validation error responses
Server actions SHALL return structured error objects that can be displayed in the UI. Errors SHALL include a field identifier and a human-readable message (in Indonesian where appropriate).

#### Scenario: Multiple validation failures
- **WHEN** `createMediaAction` is called with empty title AND invalid format
- **THEN** the action returns an object containing all validation errors, e.g., `{ errors: { title: "Judul wajib diisi", format: "Format tidak valid" } }`

### Requirement: Search query sanitization
The `searchMedia` and `getAllMedia` functions SHALL sanitize user-provided search strings before constructing Supabase filter expressions. Special characters `%`, `(`, `)` that could manipulate `.or()` / `ilike` filter expressions SHALL be escaped. Search queries SHALL be trimmed and max length enforced (200 characters).

#### Scenario: Search with special characters
- **WHEN** a user searches for `test%2C)(description.ilike.%`
- **THEN** the special characters are escaped and the search is treated as a literal string, not a filter injection

#### Scenario: Search with empty or whitespace-only query
- **WHEN** `searchMedia` is called with `"   "` (whitespace only)
- **THEN** the function returns all published media (same as empty query)