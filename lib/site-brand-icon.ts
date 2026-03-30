import type { SiteBrand } from "@/lib/site-brand";

/** Two-letter (or best-effort) initials for favicon / app icon — follows site title words. */
export function getBrandInitials(brand: SiteBrand): string {
  const words = brand.siteTitle.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const a = words[0][0] ?? "";
    const b = words[1][0] ?? "";
    return (a + b).toUpperCase() || "??";
  }
  if (words.length === 1) {
    const w = words[0];
    const letters = w.replace(/[^a-zA-Z0-9]/g, "");
    if (letters.length >= 2) {
      return letters.slice(0, 2).toUpperCase();
    }
    if (w.length >= 2) {
      return w.slice(0, 2).toUpperCase();
    }
    return (w + w).slice(0, 2).toUpperCase();
  }
  const line = (brand.logoLine1 || brand.siteTitle).replace(/[^a-zA-Z]/g, "");
  if (line.length >= 2) return line.slice(0, 2).toUpperCase();
  return "??";
}
