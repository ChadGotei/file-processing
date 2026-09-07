export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function isViewable(mimeType: string) {
  return mimeType === "application/pdf" || mimeType.startsWith("image/");
}