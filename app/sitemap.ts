import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.millroyfernandes.com',
      lastModified: new Date(),
    }
  ]
}
