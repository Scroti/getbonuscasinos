export type SiteBrand = {
  siteTitle: string;
  logoLine1: string;
  logoLine2: string;
};

const DEFAULT_BRAND: SiteBrand = {
  siteTitle: "Get Bonus Casinos",
  logoLine1: "getbonus",
  logoLine2: "CASINOS",
};

const MULTI_TLD_PARENT = new Set([
  "co.uk",
  "com.au",
  "co.nz",
  "co.jp",
  "com.br",
  "com.mx",
  "co.za",
]);

/** Built-in map (normalized host without www). Add domains or use env JSON / single SITE_TITLE per deploy. */
const HOST_BRAND_MAP: Record<string, SiteBrand> = {
  "getbonuscasinos.com": {
    siteTitle: "Get Bonus Casinos",
    logoLine1: "getbonus",
    logoLine2: "CASINOS",
  },
  "reelslots.org": {
    siteTitle: "ReelSlots",
    logoLine1: "reelslots",
    logoLine2: "",
  },
};

export function normalizeHost(raw: string | null): string {
  if (!raw) return "";
  const h = raw.split(":")[0].trim().toLowerCase();
  return h.startsWith("www.") ? h.slice(4) : h;
}

/** Local / loopback hosts should not become the brand name (e.g. “Localhost”). */
function isLoopbackHost(host: string): boolean {
  const h = host.split(":")[0].toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "::1" ||
    h === "0.0.0.0"
  );
}

function apexSlug(host: string): string {
  const h = host.replace(/^www\./, "").toLowerCase();
  const parts = h.split(".").filter(Boolean);
  if (parts.length < 2) return parts[0] || "";
  const lastTwo = parts.slice(-2).join(".");
  if (parts.length >= 3 && MULTI_TLD_PARENT.has(lastTwo)) {
    return parts[parts.length - 3] || parts[0];
  }
  return parts[parts.length - 2] || parts[0];
}

function titleCaseWords(s: string): string {
  return s
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function brandFromEnv(): SiteBrand | null {
  const title = process.env.NEXT_PUBLIC_SITE_TITLE?.trim();
  const l1 = process.env.NEXT_PUBLIC_LOGO_LINE1?.trim();
  const l2Raw = process.env.NEXT_PUBLIC_LOGO_LINE2;
  const l2 = l2Raw === undefined || l2Raw === "" ? "" : l2Raw.trim().toUpperCase();

  if (!title && !l1) return null;

  const siteTitle =
    title ||
    [l1, l2].filter(Boolean).join(" ").trim() ||
    DEFAULT_BRAND.siteTitle;

  let logoLine1 = l1 ?? "";
  let logoLine2 = l2;

  if (!logoLine1 && title) {
    const parts = title.trim().split(/\s+/);
    if (parts.length === 1) {
      logoLine1 = parts[0].toLowerCase();
      logoLine2 = "";
    } else {
      logoLine1 = parts.slice(0, -1).join(" ").toLowerCase();
      logoLine2 = parts[parts.length - 1].toUpperCase();
    }
  }

  if (!logoLine1) {
    logoLine1 = DEFAULT_BRAND.logoLine1;
    logoLine2 = logoLine2 || DEFAULT_BRAND.logoLine2;
  }

  return { siteTitle, logoLine1, logoLine2 };
}

function parseBrandsJson(): Record<string, SiteBrand> | null {
  const raw = process.env.NEXT_PUBLIC_SITE_BRANDS_JSON?.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<
      string,
      {
        siteTitle?: string;
        title?: string;
        logoLine1?: string;
        line1?: string;
        logoLine2?: string;
        line2?: string;
      }
    >;
    const out: Record<string, SiteBrand> = {};
    for (const [key, v] of Object.entries(parsed)) {
      const host = normalizeHost(key);
      const siteTitle = (v.siteTitle || v.title)?.trim();
      if (!host || !siteTitle) continue;
      const line1 = (v.logoLine1 || v.line1)?.trim() ?? "";
      let line2Raw = v.logoLine2 ?? v.line2;
      const line2 =
        line2Raw === undefined || line2Raw === ""
          ? ""
          : String(line2Raw).trim().toUpperCase();
      let logoLine1 = line1;
      let logoLine2 = line2;
      if (!logoLine1) {
        const parts = siteTitle.split(/\s+/);
        if (parts.length === 1) {
          logoLine1 = parts[0].toLowerCase();
          logoLine2 = "";
        } else {
          logoLine1 = parts.slice(0, -1).join(" ").toLowerCase();
          logoLine2 = parts[parts.length - 1].toUpperCase();
        }
      }
      out[host] = { siteTitle, logoLine1, logoLine2 };
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

function fallbackFromHost(host: string): SiteBrand {
  const slug = apexSlug(host);
  if (!slug) return DEFAULT_BRAND;
  const siteTitle = titleCaseWords(slug);
  const words = slug.split(/[-_]/).filter(Boolean);
  if (words.length <= 1) {
    return {
      siteTitle,
      logoLine1: siteTitle.toLowerCase(),
      logoLine2: "",
    };
  }
  const rest = words.slice(0, -1).join(" ").toLowerCase();
  const last = words[words.length - 1].toUpperCase();
  return {
    siteTitle,
    logoLine1: rest,
    logoLine2: last,
  };
}

/**
 * Resolve brand for the current request host.
 * Priority: NEXT_PUBLIC_SITE_* env (per-deploy) → JSON map by host → built-in map → heuristic from hostname.
 */
export function getSiteBrand(hostHeader: string | null): SiteBrand {
  const fromEnv = brandFromEnv();
  if (fromEnv) return fromEnv;

  const host = normalizeHost(hostHeader);
  const jsonMap = parseBrandsJson();
  if (host && jsonMap?.[host]) return jsonMap[host];
  if (host && HOST_BRAND_MAP[host]) return HOST_BRAND_MAP[host];

  if (host && isLoopbackHost(host)) return DEFAULT_BRAND;
  if (host) return fallbackFromHost(host);
  return DEFAULT_BRAND;
}

/**
 * Default meta description (layout + pages). Target ~120–160 chars for audit/SERP tools;
 * Google may still rewrite snippets from body text.
 */
export function siteBrandDescription(brand: SiteBrand): string {
  return `${brand.siteTitle}: casino bonuses & welcome offers compared. Publisher, not a casino—confirm terms on each operator. 18+ only.`;
}
