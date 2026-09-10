import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/documents", "/documents/rental", "/documents/power-of-attorney"];
  return routes.map((route) => ({
    url: `https://sigha.app${route}`,
    lastModified: new Date(),
  }));
}
