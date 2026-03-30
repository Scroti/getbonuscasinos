import type { Metadata } from "next";

/** Utility route; keep out of the index. */
export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from the newsletter.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/unsubscribe" },
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
