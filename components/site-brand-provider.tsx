"use client";

import React, { createContext, useContext } from "react";
import type { SiteBrand } from "@/lib/site-brand";

const SiteBrandContext = createContext<SiteBrand | null>(null);

export function SiteBrandProvider({
  brand,
  children,
}: {
  brand: SiteBrand;
  children: React.ReactNode;
}) {
  return (
    <SiteBrandContext.Provider value={brand}>
      {children}
    </SiteBrandContext.Provider>
  );
}

export function useSiteBrand(): SiteBrand {
  const ctx = useContext(SiteBrandContext);
  if (!ctx) {
    throw new Error("useSiteBrand must be used within SiteBrandProvider");
  }
  return ctx;
}
