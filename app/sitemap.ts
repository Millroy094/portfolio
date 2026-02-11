import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.PUBLIC_URL,
      lastModified: new Date(),
    },
  ];
}
