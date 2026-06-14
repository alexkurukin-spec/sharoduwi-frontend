import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Морф грид→PDP через View Transitions API (спека §7).
  experimental: {
    viewTransition: true,
  },
  images: {
    // AVIF/WebP — спека §6. CDN-loader (Cloudinary / CDN AdvantShop) подключим в фазе изображений.
    formats: ["image/avif", "image/webp"],
    // До подключения CDN карточки используют локальный SVG-плейсхолдер.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
