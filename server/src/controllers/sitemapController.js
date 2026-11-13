
import Post from '../models/Post.js';
import Category from '../models/Category.js';
import env from '../config/env.js';

export const getSitemapXml = async (req, res, next) => {
  try {
    const siteUrl = env.CLIENT_URL || 'http://localhost:3000';

    const posts = await Post.find({ status: { $in: ['approved', 'published'] } })
      .select('slug updatedAt publishedAt')
      .sort({ publishedAt: -1 })
      .lean();

    const categories = await Category.find({ isActive: true })
      .select('slug updatedAt')
      .lean();

    const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}/</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}/blog</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;

    categories.forEach((cat) => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/blog?category=${encodeURIComponent(cat.slug)}</loc>\n`;
      xml += `    <lastmod>${formatDate(cat.updatedAt)}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    posts.forEach((post) => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/blog/${encodeURIComponent(post.slug)}</loc>\n`;
      xml += `    <lastmod>${formatDate(post.updatedAt || post.publishedAt)}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600'); 
    return res.status(200).send(xml);
  } catch (err) {
    next(err);
  }
};

export const getRobotsTxt = (_req, res) => {
  const siteUrl = env.CLIENT_URL || 'http://localhost:3000';

  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  res.header('Cache-Control', 'public, max-age=86400'); 
  return res.status(200).send(robots);
};
