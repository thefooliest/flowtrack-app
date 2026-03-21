export const uid = () =>
  crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);

export const now = () => new Date().toISOString();

export function formatDuration(ms) {
  if (!ms || ms < 0) return "0s";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

export function calcRealTime(timeHistory) {
  let total = 0;
  for (let i = 0; i < timeHistory.length - 1; i += 2) {
    total += new Date(timeHistory[i + 1]).getTime() - new Date(timeHistory[i]).getTime();
  }
  if (timeHistory.length % 2 === 1) {
    total += Date.now() - new Date(timeHistory[timeHistory.length - 1]).getTime();
  }
  return total;
}

export function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

export const TAG_COLORS = [
  "#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#4ecdc4",
  "#74c0fc", "#9775fa", "#f783ac", "#e599f7", "#66d9e8",
];
