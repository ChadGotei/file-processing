export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) return "Not available";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)) - 1, units.length - 1);
  return `${(bytes / 1024 ** (unitIndex + 1)).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export function fileTypeLabel(mimeType: string) {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType === "application/msword" || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "Document";
  if (mimeType.startsWith("image/")) return "Image";
  return mimeType;
}
