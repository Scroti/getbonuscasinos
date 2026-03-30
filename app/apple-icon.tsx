import { headers } from "next/headers";
import { brandIconImageResponse } from "@/lib/brand-icon-image";
import { getSiteBrand } from "@/lib/site-brand";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  return brandIconImageResponse(brand, 180);
}
