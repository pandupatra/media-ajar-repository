export function getFormatLabel(format: string) {
  const labels: Record<string, string> = {
    pdf: "PDF",
    ebook: "E-Book",
    website: "Website",
    video: "Video",
    audio: "Audio",
    presentasi: "Presentasi",
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
    presentasi: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
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

export function getYouTubeEmbedUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const id = host === "youtu.be"
      ? url.pathname.split("/")[1]
      : host === "youtube.com" || host === "m.youtube.com"
        ? url.pathname === "/watch"
          ? url.searchParams.get("v")
          : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
        : null;
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
  } catch {
    return null;
  }
}

export function getHeyzineEmbedUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (
      !["http:", "https:"].includes(url.protocol) ||
      host !== "heyzine.com" ||
      url.port ||
      !/^\/flip-book\/[a-z0-9]+\.html\/?$/i.test(url.pathname)
    ) {
      return null;
    }
    url.protocol = "https:";
    url.hostname = "heyzine.com";
    return url.toString();
  } catch {
    return null;
  }
}

export function getCanvaEmbedUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const match = url.pathname.match(/^\/design\/([a-z0-9_-]+)(?:\/([a-z0-9_-]+))?\/(?:view|edit)\/?$/i);
    if (!["http:", "https:"].includes(url.protocol) || host !== "canva.com" || url.port || !match) return null;
    const token = match[2] ? `/${match[2]}` : "";
    return `https://www.canva.com/design/${match[1]}${token}/view?embed`;
  } catch {
    return null;
  }
}
