export function buildContributorProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata ?? {};
  const email = user.email ?? "";
  return {
    id: user.id,
    email,
    name: typeof metadata.name === "string" && metadata.name.trim() ? metadata.name.trim() : email.split("@")[0],
    role: "contributor" as const,
    madrasah: typeof metadata.madrasah === "string" ? metadata.madrasah : null,
    teaching_subject: typeof metadata.teaching_subject === "string" ? metadata.teaching_subject : null,
    phone: typeof metadata.phone === "string" ? metadata.phone : null,
  };
}
