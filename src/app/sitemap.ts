import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://digitalorbit.agency";

  const routes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/pricing",
    "/contact",
    "/book",
    "/ai-solutions",
  ];

  const currentDate = new Date().toISOString();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
