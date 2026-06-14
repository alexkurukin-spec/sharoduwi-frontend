import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sharoduwi — гелиевые шары и праздничный декор",
    template: "%s · Sharoduwi",
  },
  description:
    "Гелиевые шары, готовые наборы на выписку и рождение, пиротехника. Доставка в день заказа по юго-востоку Московской области.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
