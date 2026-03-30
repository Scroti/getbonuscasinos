import { ImageResponse } from "next/og";
import type { SiteBrand } from "@/lib/site-brand";
import { getBrandInitials } from "@/lib/site-brand-icon";

/** PNG icon: per-request brand from host (multi-domain) or env / static map. */
export function brandIconImageResponse(brand: SiteBrand, sizePx: number) {
  const initials = getBrandInitials(brand);
  const fontSize = Math.max(11, Math.round(sizePx * 0.36));
  const radius = Math.round(sizePx * 0.18);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #160b1f 0%, #0a0610 45%, #12081c 100%)",
          borderRadius: radius,
          border: `${Math.max(1, Math.round(sizePx / 32))}px solid rgba(168, 85, 247, 0.35)`,
          color: "#f0abfc",
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {initials}
      </div>
    ),
    {
      width: sizePx,
      height: sizePx,
    }
  );
}
