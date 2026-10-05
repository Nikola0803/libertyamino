import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const privateRoutes = ["/api/", "/account", "/checkout", "/order-success"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: privateRoutes,
      },
    ],
    sitemap: "https://evlvpeptides.com/sitemap.xml",
    host: "https://evlvpeptides.com",
  };
}
