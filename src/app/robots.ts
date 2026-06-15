import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://digitalorbit.agency";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/client/", "/api/admin/", "/api/client/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
