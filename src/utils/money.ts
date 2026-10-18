export function formatRupiah(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export function parseRupiah(input: string): number {
  const digits = input.replace(/[^\d]/g, "");
  const n = parseInt(digits || "0", 10);
  return Number.isFinite(n) ? n : 0;
}
