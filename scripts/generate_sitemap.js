import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://toolzio.com'

const routes = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/pdf-to-word', changefreq: 'monthly', priority: 0.9 },
  { path: '/word-to-pdf', changefreq: 'monthly', priority: 0.9 },
  { path: '/merge-pdf', changefreq: 'monthly', priority: 0.8 },
  { path: '/split-pdf', changefreq: 'monthly', priority: 0.8 },
  { path: '/compress-pdf', changefreq: 'monthly', priority: 0.8 },
]

function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  fs.writeFileSync(path.join(import.meta.dirname, '..', 'public', 'sitemap.xml'), xml)
  console.log('Generated sitemap.xml')
}

generateSitemap()
