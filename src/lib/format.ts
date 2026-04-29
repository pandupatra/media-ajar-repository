export function getFormatLabel(format: string) {
  const labels: Record<string, string> = {
    pdf: "PDF",
    ebook: "E-Book",
    website: "Website",
    video: "Video",
    audio: "Audio",
    other: "Lainnya",
  };
  return labels[format] || format;
}

export function getFormatColor(format: string) {
  const colors: Record<string, string> = {
    pdf: "bg-red-100 text-red-800 hover:bg-red-100",
    ebook: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    website: "bg-green-100 text-green-800 hover:bg-green-100",
    video: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    audio: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    other: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };
  return colors[format] || "bg-gray-100 text-gray-800";
}

export function formatFileSize(bytes: number | null) {
  if (!bytes) return null;
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}