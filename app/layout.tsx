import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { NewsletterFeature } from "@/components/newsletter-feature";
import StoreProvider from "@/components/providers/store-provider";
import { SiteBrandProvider } from "@/components/site-brand-provider";
import { getSiteBrand, siteBrandDescription } from "@/lib/site-brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const brand = getSiteBrand(host);
  return {
    title: brand.siteTitle,
    description: siteBrandDescription(brand),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const brand = getSiteBrand(host);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <SiteBrandProvider brand={brand}>
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              forcedTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
              <NewsletterFeature />
              <Footer />
            </ThemeProvider>
          </StoreProvider>
        </SiteBrandProvider>
      </body>
    </html>
  );
}
