
export const getWelcomeEmailHtml = (email, siteUrl = 'http://localhost:3000') => {
  const currentYear = new Date().getFullYear();
  const blogUrl = `${siteUrl}/blog`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TechBlog</title>
  <style>
    /* Reset & base styling */
    body, p, h1, h2, h3, ul, li {
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #f4f4f4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #222222;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f4f4;
      padding: 40px 16px;
    }
    .main-card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header-bar {
      background-color: #ffffff;
      border-bottom: 1px solid #dddddd;
      padding: 24px 32px;
      text-align: left;
    }
    .brand-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #222222;
      text-decoration: none;
    }
    .brand-badge {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
      color: #2563eb;
      background-color: #eff6ff;
      padding: 3px 8px;
      border-radius: 4px;
      margin-left: 8px;
      vertical-align: middle;
    }
    .content {
      padding: 36px 32px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #171717;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    p {
      color: #4b5563;
      font-size: 15px;
      margin-bottom: 20px;
    }
    .feature-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 14px;
    }
    .feature-title {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .feature-desc {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0 16px;
    }
    .cta-button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 28px;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #dddddd;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <!-- Header -->
      <div class="header-bar">
        <a href="${siteUrl}" class="brand-name">TechBlog</a>
        <span class="brand-badge">Newsletter</span>
      </div>

      <!-- Content -->
      <div class="content">
        <h1>Welcome to the TechBlog Community! 👋</h1>
        <p>
          Thank you for subscribing with <strong>${email}</strong>. You're officially on the list to receive our weekly curated engineering insights, architecture deep-dives, and modern technology breakthroughs.
        </p>

        <p style="margin-bottom: 12px; font-weight: 600; color: #171717;">
          Here is what you can look forward to every week:
        </p>

        <!-- Feature 1 -->
        <div class="feature-card">
          <div class="feature-title">🚀 Deep-Dive Engineering Articles</div>
          <p class="feature-desc">Comprehensive explorations of system architecture, distributed services, and production-tested patterns.</p>
        </div>

        <!-- Feature 2 -->
        <div class="feature-card">
          <div class="feature-title">🤖 AI & Machine Learning Insights</div>
          <p class="feature-desc">Practical guides on LLMs, agentic systems, developer productivity tools, and generative technology.</p>
        </div>

        <!-- Feature 3 -->
        <div class="feature-card">
          <div class="feature-title">🛠️ Best Practices & Architecture</div>
          <p class="feature-desc">Clean code tips, performance optimization benchmarks, and lessons learned from senior engineers.</p>
        </div>

        <!-- CTA -->
        <div class="cta-container">
          <a href="${blogUrl}" class="cta-button" target="_blank">
            Explore Latest Articles &rarr;
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin-bottom: 8px;">
          You received this email because you subscribed to the newsletter on <a href="${siteUrl}">${siteUrl}</a>.
        </p>
        <p style="margin-bottom: 8px;">
          TechBlog Publication &bull; Engineering &bull; Architecture &bull; Modern Web
        </p>
        <p>
          &copy; ${currentYear} TechBlog. All rights reserved. | <a href="${siteUrl}">Visit Website</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};

export const getWelcomeEmailText = (email, siteUrl = 'http://localhost:3000') => {
  return `Welcome to TechBlog Newsletter!

Thank you for subscribing with ${email}.

You're now subscribed to receive our weekly curated software engineering, system architecture, and tech insights.

What you'll get:
- Deep-Dive Engineering Articles
- AI & Machine Learning Insights
- Best Practices, Case Studies & Architecture Guides

Explore our latest articles anytime at:
${siteUrl}/blog

Best regards,
The TechBlog Team

© ${new Date().getFullYear()} TechBlog. All rights reserved.
${siteUrl}
`;
};

