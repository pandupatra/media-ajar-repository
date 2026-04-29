import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load env vars from .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ========== SEED DATA ==========

const ADMIN_ID = "11111111-1111-1111-1111-111111111111";
const CONTRIBUTOR_ID = "22222222-2222-2222-2222-222222222222";

const profiles = [
  {
    id: ADMIN_ID,
    email: "admin@ptp.id",
    name: "Admin Utama",
    role: "admin",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: CONTRIBUTOR_ID,
    email: "kontributor@ptp.id",
    name: "Kontributor A",
    role: "contributor",
    created_at: "2025-02-01T00:00:00Z",
  },
];

const categories = [
  { id: "a1111111-1111-1111-1111-111111111111", name: "Matematika", slug: "matematika", type: "subject", icon: "calculator", sort_order: 1, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "a2222222-2222-2222-2222-222222222222", name: "IPA", slug: "ipa", type: "subject", icon: "flask", sort_order: 2, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "a3333333-3333-3333-3333-333333333333", name: "IPS", slug: "ips", type: "subject", icon: "globe", sort_order: 3, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "a4444444-4444-4444-4444-444444444444", name: "Bahasa Indonesia", slug: "bahasa-indonesia", type: "subject", icon: "book", sort_order: 4, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "a5555555-5555-5555-5555-555555555555", name: "Bahasa Inggris", slug: "bahasa-inggris", type: "subject", icon: "languages", sort_order: 5, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "b1111111-1111-1111-1111-111111111111", name: "SD", slug: "sd", type: "level", icon: "school", sort_order: 1, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "b2222222-2222-2222-2222-222222222222", name: "SMP", slug: "smp", type: "level", icon: "school", sort_order: 2, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "b3333333-3333-3333-3333-333333333333", name: "SMA", slug: "sma", type: "level", icon: "school", sort_order: 3, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "b4444444-4444-4444-4444-444444444444", name: "Umum", slug: "umum", type: "level", icon: "users", sort_order: 4, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "c1111111-1111-1111-1111-111111111111", name: "PDF", slug: "pdf", type: "format", icon: "file-text", sort_order: 1, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "c2222222-2222-2222-2222-222222222222", name: "Video", slug: "video", type: "format", icon: "video", sort_order: 2, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "c3333333-3333-3333-3333-333333333333", name: "Website", slug: "website", type: "format", icon: "globe", sort_order: 3, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "c4444444-4444-4444-4444-444444444444", name: "E-Book", slug: "ebook", type: "format", icon: "book-open", sort_order: 4, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "c5555555-5555-5555-5555-555555555555", name: "Audio", slug: "audio", type: "format", icon: "headphones", sort_order: 5, is_active: true, created_at: "2025-01-01T00:00:00Z" },
];

const media = [
  {
    id: "d1111111-1111-1111-1111-111111111111",
    title: "Pembelajaran Matematika Dasar - Pecahan",
    slug: "pembelajaran-matematika-dasar-pecahan",
    description: "Materi pembelajaran matematika dasar tentang pecahan untuk siswa SD kelas 3-4. Dilengkapi dengan contoh soal dan pembahasan.",
    format: "pdf",
    type: "file",
    file_url: "https://example.com/files/matematika-pecahan.pdf",
    external_url: null,
    thumbnail_url: null,
    file_size: 2500000,
    status: "published",
    view_count: 120,
    download_count: 45,
    created_by: ADMIN_ID,
    created_at: "2025-01-15T08:00:00Z",
    updated_at: "2025-01-15T08:00:00Z",
  },
  {
    id: "d2222222-2222-2222-2222-222222222222",
    title: "Video Eksperimen IPA - Perubahan Wujud Benda",
    slug: "video-eksperimen-ipa-perubahan-wujud-benda",
    description: "Video eksperimen sederhana tentang perubahan wujud benda (padat, cair, gas) yang mudah dipahami oleh siswa SD.",
    format: "video",
    type: "url",
    file_url: null,
    external_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: null,
    file_size: null,
    status: "published",
    view_count: 89,
    download_count: 0,
    created_by: ADMIN_ID,
    created_at: "2025-01-20T10:30:00Z",
    updated_at: "2025-01-20T10:30:00Z",
  },
  {
    id: "d3333333-3333-3333-3333-333333333333",
    title: "E-Book IPS: Kenali Negara-Negara ASEAN",
    slug: "ebook-ips-kenali-negara-negara-asean",
    description: "E-book interaktif tentang negara-negara ASEAN dengan peta, bendera, dan informasi menarik untuk siswa SMP.",
    format: "ebook",
    type: "url",
    file_url: null,
    external_url: "https://example.com/ebook-asean",
    thumbnail_url: null,
    file_size: null,
    status: "published",
    view_count: 67,
    download_count: 23,
    created_by: ADMIN_ID,
    created_at: "2025-02-01T09:00:00Z",
    updated_at: "2025-02-01T09:00:00Z",
  },
  {
    id: "d4444444-4444-4444-4444-444444444444",
    title: "Website Interaktif: Belajar Bahasa Indonesia",
    slug: "website-interaktif-belajar-bahasa-indonesia",
    description: "Website interaktif untuk belajar tata bahasa Indonesia dengan kuis dan latihan soal untuk siswa SMA.",
    format: "website",
    type: "url",
    file_url: null,
    external_url: "https://example.com/belajar-bi",
    thumbnail_url: null,
    file_size: null,
    status: "published",
    view_count: 156,
    download_count: 0,
    created_by: ADMIN_ID,
    created_at: "2025-02-10T14:00:00Z",
    updated_at: "2025-02-10T14:00:00Z",
  },
  {
    id: "d5555555-5555-5555-5555-555555555555",
    title: "Modul Pembelajaran Matematika SMP - Aljabar",
    slug: "modul-pembelajaran-matematika-smp-aljabar",
    description: "Modul lengkap pembelajaran aljabar untuk siswa SMP kelas 7-8 dengan penjelasan langkah demi langkah.",
    format: "pdf",
    type: "file",
    file_url: "https://example.com/files/matematika-aljabar.pdf",
    external_url: null,
    thumbnail_url: null,
    file_size: 4800000,
    status: "published",
    view_count: 95,
    download_count: 38,
    created_by: ADMIN_ID,
    created_at: "2025-02-15T11:00:00Z",
    updated_at: "2025-02-15T11:00:00Z",
  },
  {
    id: "d6666666-6666-6666-6666-666666666666",
    title: "Podcast Belajar: Tips Menulis Esai Bahasa Inggris",
    slug: "podcast-belajar-tips-menulis-esai-bahasa-inggris",
    description: "Podcast edukasi tentang tips dan trik menulis esai dalam bahasa Inggris untuk persiapan ujian nasional.",
    format: "audio",
    type: "url",
    file_url: null,
    external_url: "https://example.com/podcast-esai",
    thumbnail_url: null,
    file_size: null,
    status: "published",
    view_count: 42,
    download_count: 15,
    created_by: ADMIN_ID,
    created_at: "2025-03-01T08:00:00Z",
    updated_at: "2025-03-01T08:00:00Z",
  },
  {
    id: "d7777777-7777-7777-7777-777777777777",
    title: "Panduan Praktikum IPA SMA - Biologi Sel",
    slug: "panduan-praktikum-ipa-sma-biologi-sel",
    description: "Panduan praktikum lengkap untuk pelajaran biologi tentang struktur dan fungsi sel untuk siswa SMA kelas 10-11.",
    format: "pdf",
    type: "file",
    file_url: "https://example.com/files/praktikum-biologi-sel.pdf",
    external_url: null,
    thumbnail_url: null,
    file_size: 3200000,
    status: "draft",
    view_count: 0,
    download_count: 0,
    created_by: ADMIN_ID,
    created_at: "2025-03-10T09:30:00Z",
    updated_at: "2025-03-10T09:30:00Z",
  },
  {
    id: "d8888888-8888-8888-8888-888888888888",
    title: "Media Interaktif: Peta Digital Indonesia",
    slug: "media-interaktif-peta-digital-indonesia",
    description: "Peta digital interaktif Indonesia dengan informasi provinsi, suku bangsa, dan kekayaan alam.",
    format: "website",
    type: "url",
    file_url: null,
    external_url: "https://example.com/peta-indonesia",
    thumbnail_url: null,
    file_size: null,
    status: "published",
    view_count: 203,
    download_count: 0,
    created_by: ADMIN_ID,
    created_at: "2025-03-15T10:00:00Z",
    updated_at: "2025-03-15T10:00:00Z",
  },
];

const mediaCategories = [
  // med-1: Matematika, SD, PDF
  { media_id: "d1111111-1111-1111-1111-111111111111", category_id: "a1111111-1111-1111-1111-111111111111" },
  { media_id: "d1111111-1111-1111-1111-111111111111", category_id: "b1111111-1111-1111-1111-111111111111" },
  { media_id: "d1111111-1111-1111-1111-111111111111", category_id: "c1111111-1111-1111-1111-111111111111" },
  // med-2: IPA, SD, Video
  { media_id: "d2222222-2222-2222-2222-222222222222", category_id: "a2222222-2222-2222-2222-222222222222" },
  { media_id: "d2222222-2222-2222-2222-222222222222", category_id: "b1111111-1111-1111-1111-111111111111" },
  { media_id: "d2222222-2222-2222-2222-222222222222", category_id: "c2222222-2222-2222-2222-222222222222" },
  // med-3: IPS, SMP, E-Book
  { media_id: "d3333333-3333-3333-3333-333333333333", category_id: "a3333333-3333-3333-3333-333333333333" },
  { media_id: "d3333333-3333-3333-3333-333333333333", category_id: "b2222222-2222-2222-2222-222222222222" },
  { media_id: "d3333333-3333-3333-3333-333333333333", category_id: "c4444444-4444-4444-4444-444444444444" },
  // med-4: Bahasa Indonesia, SMA, Website
  { media_id: "d4444444-4444-4444-4444-444444444444", category_id: "a4444444-4444-4444-4444-444444444444" },
  { media_id: "d4444444-4444-4444-4444-444444444444", category_id: "b3333333-3333-3333-3333-333333333333" },
  { media_id: "d4444444-4444-4444-4444-444444444444", category_id: "c3333333-3333-3333-3333-333333333333" },
  // med-5: Matematika, SMP, PDF
  { media_id: "d5555555-5555-5555-5555-555555555555", category_id: "a1111111-1111-1111-1111-111111111111" },
  { media_id: "d5555555-5555-5555-5555-555555555555", category_id: "b2222222-2222-2222-2222-222222222222" },
  { media_id: "d5555555-5555-5555-5555-555555555555", category_id: "c1111111-1111-1111-1111-111111111111" },
  // med-6: Bahasa Inggris, SMA, Audio
  { media_id: "d6666666-6666-6666-6666-666666666666", category_id: "a5555555-5555-5555-5555-555555555555" },
  { media_id: "d6666666-6666-6666-6666-666666666666", category_id: "b3333333-3333-3333-3333-333333333333" },
  { media_id: "d6666666-6666-6666-6666-666666666666", category_id: "c5555555-5555-5555-5555-555555555555" },
  // med-7: IPA, SMA, PDF
  { media_id: "d7777777-7777-7777-7777-777777777777", category_id: "a2222222-2222-2222-2222-222222222222" },
  { media_id: "d7777777-7777-7777-7777-777777777777", category_id: "b3333333-3333-3333-3333-333333333333" },
  { media_id: "d7777777-7777-7777-7777-777777777777", category_id: "c1111111-1111-1111-1111-111111111111" },
  // med-8: IPS, Umum, Website
  { media_id: "d8888888-8888-8888-8888-888888888888", category_id: "a3333333-3333-3333-3333-333333333333" },
  { media_id: "d8888888-8888-8888-8888-888888888888", category_id: "b4444444-4444-4444-4444-444444444444" },
  { media_id: "d8888888-8888-8888-8888-888888888888", category_id: "c3333333-3333-3333-3333-333333333333" },
];

// ========== HELPERS ==========

async function upsert(table: string, data: any[], conflictColumns: string[]) {
  const { error } = await supabase.from(table).upsert(data, {
    onConflict: conflictColumns.join(","),
  });
  if (error) {
    console.error(`Error upserting ${table}:`, error.message);
    throw error;
  }
  console.log(`✅ Seeded ${table}: ${data.length} rows`);
}

async function clearTable(table: string) {
  const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    console.warn(`⚠️ Could not clear ${table}: ${error.message}`);
    return;
  }
  console.log(`🗑️ Cleared ${table}`);
}

async function clearMediaCategories() {
  const { error } = await supabase.from("media_categories").delete().neq("media_id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    console.warn(`⚠️ Could not clear media_categories: ${error.message}`);
  } else {
    console.log("🗑️ Cleared media_categories");
  }
}

async function createAuthUser(email: string, password: string) {
  // Check if user already exists
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.warn(`⚠️ Could not list users: ${listError.message}`);
  } else {
    const existing = listData.users.find((u) => u.email === email);
    if (existing) {
      console.log(`👤 User already exists: ${email} (${existing.id})`);
      return existing.id;
    }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error(`❌ Failed to create user ${email}:`, error.message);
    throw error;
  }

  console.log(`👤 Created user: ${email} (${data.user.id})`);
  return data.user.id;
}

// ========== MAIN ==========

async function seed() {
  console.log("🌱 Starting seed...\n");

  // Create auth users first (profiles depend on them)
  const adminId = await createAuthUser("admin@ptp.id", "password123");
  const contributorId = await createAuthUser("kontributor@ptp.id", "password123");

  // Update profile IDs to match auth users
  const seededProfiles = profiles.map((p) => ({
    ...p,
    id: p.email === "admin@ptp.id" ? adminId : contributorId,
  }));

  // Update media created_by to match admin
  const seededMedia = media.map((m) => ({
    ...m,
    created_by: adminId,
  }));

  // Clear existing data (reverse order of dependencies)
  await clearMediaCategories();
  await clearTable("media");
  await clearTable("categories");
  await clearTable("profiles");

  console.log("");

  // Insert in dependency order
  await upsert("profiles", seededProfiles, ["id"]);
  await upsert("categories", categories, ["id"]);
  await upsert("media", seededMedia, ["id"]);
  await upsert("media_categories", mediaCategories, ["media_id", "category_id"]);

  console.log("\n🎉 Seed completed successfully!");
  console.log(`\n📋 Login credentials:`);
  console.log(`   Admin:    admin@ptp.id / password123`);
  console.log(`   Kontributor: kontributor@ptp.id / password123`);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
