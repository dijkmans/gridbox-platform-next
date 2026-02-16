export function getStatusColor(lastSeen: Date): "ok" | "warn" | "bad" {
  const diff = (Date.now() - new Date(lastSeen).getTime()) / 60000;
  if (diff <= 2) return "ok";
  if (diff <= 10) return "warn";
  return "bad";
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "zojuist";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min. geleden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} uur geleden`;
  return `${Math.floor(hours / 24)} dagen geleden`;
}