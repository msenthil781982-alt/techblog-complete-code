
import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'TechBlog | Technology Insights & Architecture';
const DEFAULT_DESCRIPTION =
  'In-depth articles and tutorials on Software Development, AI, Cybersecurity, Cloud, and Engineering Innovations.';
const DEFAULT_IMAGE = '/favicon.svg';

const SEOHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  article = null,
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const fullTitle = title ? `${title} | TechBlog` : DEFAULT_TITLE;
  const fullUrl = url ? `${siteUrl}${url}` : window.location.href;
  const fullImage = image?.startsWith('http') ? image : `${siteUrl}${image}`;

  const articleSchema = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt || description,
        image: fullImage,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
          '@type': 'Person',
          name: article.author?.name || 'TechBlog Editorial',
        },
        publisher: {
          '@type': 'Organization',
          name: 'TechBlog',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/favicon.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullUrl,
        },
      }
    : null;

  return (
    <Helmet>

      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="TechBlog" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {articleSchema && (
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
