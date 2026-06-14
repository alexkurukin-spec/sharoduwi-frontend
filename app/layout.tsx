import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { YandexMetrica } from "@/components/analytics/YandexMetrica";
import { env } from "@/lib/env";
import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  weight: ["700", "800", "900"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Sharoduwi — гелиевые шары и праздничный декор",
    template: "%s · Sharoduwi",
  },
  description:
    "Гелиевые шары, готовые наборы на выписку и рождение, пиротехника. Доставка в день заказа по юго-востоку Московской области.",
  openGraph: {
    type: "website",
    siteName: "Sharoduwi",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
        >
          К содержимому
        </a>
        <NuqsAdapter>
          <LenisProvider>{children}</LenisProvider>
        </NuqsAdapter>
        <YandexMetrica />
      </body>
    </html>
  );
}
