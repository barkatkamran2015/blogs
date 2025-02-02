const fs = require('fs');
const path = require('path');

// Example blog posts (replace with database or API call)
const blogPosts = [
  { slug: 'best-outfits-for-moms', lastMod: '2024-02-01' },
  { slug: 'trendy-mom-fashion-2024', lastMod: '2024-01-25' },
  { slug: 'affordable-stylish-clothing', lastMod: '2024-01-18' }
];

// Base URL of your website
const BASE_URL = 'https://www.thestylishmama.com';

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  ${blogPosts
    .map(
      post => `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.lastMod}</lastmod>
    <priority>0.8</priority>
  </url>
  `
    )
    .join('')}
</urlset>`;

// Save sitemap to public folder
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap, 'utf8');

console.log('✅ Sitemap generated successfully!');
