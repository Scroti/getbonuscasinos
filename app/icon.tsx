import { headers } from "next/headers";
import { brandIconImageResponse } from "@/lib/brand-icon-image";
import { getSiteBrand } from "@/lib/site-brand";

export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  return brandIconImageResponse(brand, 32);
}
