import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/siteConfig'
import { getPlays } from '@/lib/getPlays'
import { getPeople } from '@/lib/getPeople'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [plays, people] = await Promise.all([getPlays(), getPeople()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/spettacoli`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/attori`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/archivio`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/media`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/chi-siamo`, priority: 0.5, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/contatti`, priority: 0.5, changeFrequency: 'yearly' },
  ]

  const playRoutes: MetadataRoute.Sitemap = (plays ?? []).map((play) => ({
    url: `${SITE_URL}/spettacoli/${play.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }))

  const peopleRoutes: MetadataRoute.Sitemap = (people ?? []).map((person) => ({
    url: `${SITE_URL}/attori/${person.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }))

  return [...staticRoutes, ...playRoutes, ...peopleRoutes]
}
