/**
 * @file scripts/addNewArticles.js
 * @description Inserts 5 high-quality, unique technology articles into MongoDB.
 * Ensures idempotent execution (no duplicates) and synchronizes taxonomy counts.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import env from '../src/config/env.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Tag from '../src/models/Tag.js';
import Post from '../src/models/Post.js';

const NEW_ARTICLES = [
  // 1. Artificial Intelligence
  {
    title: 'How AI Is Transforming Software Development: From Code Generation to Autonomous Engineering',
    slug: 'how-ai-is-transforming-software-development',
    categorySlug: 'artificial-intelligence-machine-learning',
    tags: ['Artificial Intelligence', 'Generative AI', 'DevOps', 'Software Engineering'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      altText: 'Artificial Intelligence Transforming Software Engineering Workflow',
      caption: 'Generative AI and autonomous agents are revolutionizing developer workflows.',
    },
    excerpt: 'Discover how generative AI, intelligent code copilots, and autonomous agents are revolutionizing software development lifecycles, automated testing, and system architecture.',
    content: `
      <h2>The Evolution from Autocomplete to AI Pair Programming</h2>
      <p>Software development has reached an inflection point. While early developer tooling focused on syntax highlighting and static type checking, modern large language models (LLMs) and context-aware copilots actively comprehend repository graphs, project documentation, and dependency hierarchies. Developers are no longer writing boilerplate; they are orchestrating intelligent code-generation workflows.</p>

      <h3>Context-Aware Multi-File Reasoning</h3>
      <p>Modern AI coding engines evaluate abstract syntax trees (ASTs) across multiple services. Instead of suggesting single-line completions, they generate interconnected API controllers, database schemas, and migration files while adhering strictly to existing architectural conventions.</p>

      <h2>Automated Testing, Code Reviews, and Vulnerability Detection</h2>
      <p>Beyond authoring initial code, AI models excel at analyzing edge cases and synthesizing rigorous unit and integration tests. Automated code review bots now flag logical race conditions, SQL/NoSQL injection risks, and unoptimized queries before pull requests reach human reviewers.</p>
      <ul>
        <li><strong>Fuzz Testing Generation:</strong> LLMs generate synthetic input vectors to identify memory leaks and boundary exceptions.</li>
        <li><strong>Dependency Vulnerability Scanning:</strong> AI-driven scanners proactively suggest backward-compatible version upgrades.</li>
        <li><strong>Automated Documentation:</strong> Docstrings, OpenAPI specs, and system diagrams are continuously synchronized with codebase changes.</li>
      </ul>

      <h2>The Rise of Agentic Workflows in CI/CD</h2>
      <p>The transition from passive copilots to proactive autonomous agents marks the next frontier. Specialized agents can now triage bug reports, reproduce defects inside isolated containers, implement bug fixes, and trigger automated integration test suites with minimal human intervention.</p>

      <h2>Balancing AI Velocity with Architectural Integrity</h2>
      <p>While AI dramatically accelerates code output, foundational engineering principles—system decoupling, idempotency, security-by-design, and deep observability—remain paramount. Senior software engineers are evolving into system architects who curate, verify, and guide AI-synthesized solutions.</p>
    `,
    isFeatured: true,
    views: 345,
    seo: {
      metaTitle: 'How AI Is Transforming Software Development | TechBlog',
      metaDescription: 'Explore how generative AI copilots and autonomous engineering agents are reshaping software development lifecycles, automated testing, and developer productivity.',
    },
  },

  // 2. Web Development
  {
    title: 'Modern Web Development Trends: Next-Gen Frameworks, Edge Computing, and Micro-Frontends',
    slug: 'modern-web-development-trends',
    categorySlug: 'web-and-mobile-app-development',
    tags: ['Web Development', 'Frontend', 'Edge Computing', 'React', 'Performance'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      altText: 'Modern Web Development and Frontend Architecture Trends',
      caption: 'Edge computing and component streaming redefine web responsiveness.',
    },
    excerpt: 'An in-depth breakdown of prevailing web technologies shaping modern applications, from edge rendering engines and server components to resilient micro-frontend architectures.',
    content: `
      <h2>Next-Generation Server Components and Streaming Hydration</h2>
      <p>The web development landscape has shifted dramatically from massive client-side single-page applications toward hybrid execution paradigms. React Server Components (RSC) and progressive streaming hydration allow developers to execute zero-bundle-size logic directly on the server, streaming interactive chunks as data resolves.</p>

      <h3>Minimizing Client-Side JavaScript Overhead</h3>
      <p>By delivering pre-rendered semantic HTML with selective hydration islands, web applications achieve near-instant First Contentful Paint (FCP) and eliminate the JavaScript execution tax on mobile devices with constrained CPUs.</p>

      <h2>The Shift to Edge Computing and Instant Global Delivery</h2>
      <p>Traditional centralized servers are increasingly augmented by globally distributed Edge runtime networks. Edge functions execute code within milliseconds of end users, providing localized caching, authentication verification, and personalized content delivery with zero cold-start penalties.</p>
      <ul>
        <li><strong>Edge Middleware:</strong> Inspecting headers, geolocation, and session cookies before hitting origin servers.</li>
        <li><strong>Distributed Key-Value Stores:</strong> Storing dynamic configuration and session tokens at edge nodes worldwide.</li>
        <li><strong>Global Asset Optimization:</strong> Dynamic AVIF/WebP image transformation at CDN edge points.</li>
      </ul>

      <h2>Micro-Frontends: Scaling Large Engineering Organizations</h2>
      <p>As enterprise web platforms expand across distributed product teams, monolithic frontends become release bottlenecks. Micro-frontend architectures enable autonomous teams to independently build, test, and deploy domain-specific features using Module Federation while maintaining a cohesive user experience.</p>

      <h2>Core Web Vitals and Modern Performance Standards</h2>
      <p>Modern web engineering emphasizes rigorous metric-driven performance. Optimizing for Interaction to Next Paint (INP) and Cumulative Layout Shift (CLS) ensures fluid user interactions and higher search engine visibility.</p>
    `,
    isFeatured: false,
    views: 280,
    seo: {
      metaTitle: 'Modern Web Development Trends in 2026 | TechBlog',
      metaDescription: 'Learn about the top modern web development trends including edge runtime execution, React server components, and resilient micro-frontend architecture.',
    },
  },

  // 3. Cybersecurity
  {
    title: 'Essential Cybersecurity Practices in 2026: Proactive Defense in an AI-Driven Threat Landscape',
    slug: 'essential-cybersecurity-practices-in-2026',
    categorySlug: 'cybersecurity',
    tags: ['Cybersecurity', 'Zero Trust', 'Cloud Security', 'DevSecOps', 'Threat Intelligence'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      altText: 'Cybersecurity shield and modern threat defense',
      caption: 'Zero-trust architectures provide continuous authentication across distributed networks.',
    },
    excerpt: 'Stay ahead of sophisticated threat vectors with essential security strategies, zero-trust network models, AI-assisted anomaly detection, and automated vulnerability management.',
    content: `
      <h2>Zero-Trust Architecture: Never Trust, Always Verify</h2>
      <p>Perimeter-based castle-and-moat security models are obsolete in an era of distributed remote workforces and multi-cloud infrastructure. Modern enterprise defense requires strict adherence to Zero Trust principles: explicit verification, least-privilege access enforcement, and continuous cryptographic mutual authentication.</p>

      <h3>Continuous Posture Assessment</h3>
      <p>Access decisions are no longer one-time occurrences at initial sign-in. Dynamic policy engines continuously evaluate device compliance, location heuristics, behavioral biometrics, and threat telemetry before granting access to sensitive internal endpoints.</p>

      <h2>Securing the Software Supply Chain Against Compromise</h2>
      <p>Attacks targeting open-source dependencies and build pipelines represent one of the fastest-growing attack surfaces. Engineering organizations must integrate comprehensive DevSecOps guardrails into every stage of the software lifecycle:</p>
      <ul>
        <li><strong>Software Bill of Materials (SBOM):</strong> Cataloging and auditing every third-party component and transitive dependency.</li>
        <li><strong>Cryptographic Artifact Signing:</strong> Verifying container image provenance and build integrity via Sigstore and Cosign.</li>
        <li><strong>Automated Secret Scanning:</strong> Blocking accidental commits of API keys, certificates, and credentials via git pre-commit hooks.</li>
      </ul>

      <h2>AI-Driven Threat Intelligence and Anomaly Detection</h2>
      <p>Security Operations Centers (SOCs) leverage machine learning pipelines to analyze billions of network telemetry logs in real time. Anomalous lateral movements, automated credential-stuffing campaigns, and novel zero-day attack patterns are isolated and neutralized before data exfiltration occurs.</p>

      <h2>Immutable Infrastructure and Backup Resilience</h2>
      <p>To defend against catastrophic ransomware events, organizations maintain air-gapped, append-only immutable backups combined with automated disaster recovery orchestration to guarantee business continuity under any circumstance.</p>
    `,
    isFeatured: false,
    views: 410,
    seo: {
      metaTitle: 'Essential Cybersecurity Practices in 2026 | TechBlog',
      metaDescription: 'Discover essential cybersecurity strategies for 2026, including zero-trust security, securing CI/CD supply chains, and AI-powered threat detection.',
    },
  },

  // 4. Cloud Computing
  {
    title: 'The Future of Cloud Technology: Serverless Evolution, Multi-Cloud Orchestration, and Green Computing',
    slug: 'the-future-of-cloud-technology',
    categorySlug: 'cloud-computing',
    tags: ['Cloud Computing', 'Serverless', 'DevOps', 'Kubernetes', 'Multi-Cloud'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      altText: 'Cloud Computing and Global Infrastructure Networks',
      caption: 'Distributed multi-cloud deployments ensure enterprise redundancy and high availability.',
    },
    excerpt: 'Examine how serverless platforms, autonomous infrastructure orchestration, and sustainable green cloud data centers are redefining enterprise IT efficiency.',
    content: `
      <h2>The Maturation of Serverless: Cold-Start Elimination and Edge Storage</h2>
      <p>Serverless computing has transitioned from ephemeral micro-tasks into a comprehensive foundation for enterprise architecture. Modern lightweight micro-VMs (such as Firecracker) and WebAssembly sandboxes have reduced execution cold starts to under five milliseconds, making serverless workloads indistinguishable from dedicated instances.</p>

      <h3>Stateful Serverless at the Edge</h3>
      <p>Next-generation serverless architectures seamlessly combine distributed compute functions with globally distributed, low-latency stateful storage primitives, allowing real-time collaborative applications to scale automatically without manual provisioning.</p>

      <h2>Multi-Cloud Portability with GitOps and Open Standards</h2>
      <p>To mitigate vendor lock-in and satisfy international data sovereignty regulations, engineering teams are adopting unified multi-cloud management planes. Declarative GitOps workflows using tools like ArgoCD and Crossplane synchronize infrastructure-as-code across AWS, Google Cloud, and Azure simultaneously.</p>
      <ul>
        <li><strong>Cross-Cloud Service Meshes:</strong> Secure mTLS communication connecting microservices across multiple cloud providers.</li>
        <li><strong>Unified Observability:</strong> Standardized OpenTelemetry collectors streaming metrics and traces to vendor-agnostic dashboards.</li>
        <li><strong>Automated Failover:</strong> Geo-DNS routing that dynamically steers traffic away from degraded cloud regions.</li>
      </ul>

      <h2>FinOps: Continuous Cost Optimization and Predictive Scaling</h2>
      <p>Unchecked cloud consumption represents a significant operational cost. Cloud financial management (FinOps) integrates machine learning algorithms to forecast traffic patterns, dynamically allocate spot instances, and eliminate idle computing resources automatically.</p>

      <h2>Sustainable and Carbon-Aware Cloud Computing</h2>
      <p>Leading cloud providers are introducing carbon-aware scheduling engines that route non-urgent batch computations to data centers operating on surplus renewable solar and wind energy, accelerating the global transition toward zero-emission infrastructure.</p>
    `,
    isFeatured: false,
    views: 310,
    seo: {
      metaTitle: 'The Future of Cloud Technology | TechBlog',
      metaDescription: 'Explore the future of cloud computing: advanced serverless architectures, multi-cloud management with GitOps, and sustainable green cloud infrastructure.',
    },
  },

  // 5. Programming
  {
    title: 'Top Programming Skills Every Developer Should Learn: Building Resilient Systems in Modern Tech',
    slug: 'top-programming-skills-every-developer-should-learn',
    categorySlug: 'software-development',
    tags: ['Programming', 'Software Development', 'System Design', 'Clean Code', 'Architecture'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      altText: 'Software Developer Coding on Modern Computer',
      caption: 'System design thinking and concurrency models elevate software engineering craft.',
    },
    excerpt: 'From concurrency models and distributed systems thinking to API design and observability, master the indispensable technical skills required for high-impact software engineering.',
    content: `
      <h2>1. Distributed Systems Thinking and High-Concurrency Models</h2>
      <p>Writing functional code for a single process is fundamentally different from engineering distributed software operating across hundreds of nodes. Modern developers must master concurrent programming concepts, asynchronous message queues, distributed consensus algorithms, and event-driven architectures.</p>

      <h3>Embracing Eventual Consistency</h3>
      <p>Understanding trade-offs in distributed data systems—such as CAP theorem trade-offs, vector clocks, and saga patterns for distributed transactions—distinguishes senior software engineers from junior developers.</p>

      <h2>2. Resilient API Design, Idempotency, and Backward Compatibility</h2>
      <p>APIs are the contracts that power modern digital ecosystems. Robust API engineering requires defensive practices:</p>
      <ul>
        <li><strong>Idempotency Keys:</strong> Guaranteeing that duplicate payment or mutation requests do not execute multiple times.</li>
        <li><strong>Strict Schema Validation:</strong> Enforcing input sanitization and structured error responses.</li>
        <li><strong>Backward Compatibility:</strong> Versioning endpoints gracefully without breaking legacy client integrations.</li>
        <li><strong>Rate Limiting and Throttling:</strong> Protecting downstream services against sudden traffic spikes.</li>
      </ul>

      <h2>3. Deep Observability: Telemetry, Tracing, and Structured Logging</h2>
      <p>When unexpected production anomalies arise, standard print statements are useless. Exceptional developers design software with observability embedded from day one: contextual structured JSON logging, distributed trace spans across network boundaries, and custom metrics that monitor business SLAs.</p>

      <h2>4. Clean Architecture and Test-Driven Refactoring</h2>
      <p>Frameworks and libraries fluctuate, but clean code patterns endure. Applying Domain-Driven Design (DDD), decoupling business logic from external frameworks, and maintaining high unit and integration test coverage enables teams to refactor systems fearlessly as business requirements evolve.</p>

      <h2>5. Continuous Learning and Pragmatic Problem Solving</h2>
      <p>The ultimate meta-skill is the ability to read technical documentation quickly, deconstruct complex abstractions, and choose the simplest viable solution rather than over-engineering for hypothetical scale.</p>
    `,
    isFeatured: false,
    views: 520,
    seo: {
      metaTitle: 'Top Programming Skills Every Developer Should Learn | TechBlog',
      metaDescription: 'Master essential programming skills for modern developers: distributed systems design, asynchronous concurrency, clean architecture, and observability.',
    },
  },
];

const run = async () => {
  console.log('════════════════════════════════════════════════');
  console.log('  🚀 Adding 5 New High-Quality Technology Articles');
  console.log('════════════════════════════════════════════════\n');

  try {
    await connectDB();

    // 1. Locate or create Admin author
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.findOne({ email: env.ADMIN_EMAIL });
    }
    if (!admin) {
      console.log('⚠️ Admin user not found. Creating default admin...');
      admin = new User({
        name: 'Blog Admin',
        email: env.ADMIN_EMAIL || 'admin@techblog.com',
        password: env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        isActive: true,
      });
      await admin.save();
    }
    console.log(`👤 Using author: ${admin.name} (${admin.email}) [ID: ${admin._id}]`);

    // 2. Insert the 5 articles
    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of NEW_ARTICLES) {
      // Duplicate prevention check
      const existing = await Post.findOne({
        $or: [
          { slug: item.slug },
          { title: item.title },
        ],
      });

      if (existing) {
        console.log(`⏭️  Article already exists: "${item.title}" (ID: ${existing._id})`);
        skippedCount++;
        continue;
      }

      // Resolve category
      const category = await Category.findOne({ slug: item.categorySlug });
      if (!category) {
        console.error(`❌ Category not found: ${item.categorySlug}`);
        continue;
      }

      // Resolve tags
      const tagDocs = await Promise.all(item.tags.map((t) => Tag.findOrCreate(t)));
      const tagIds = tagDocs.map((t) => t._id);

      // Create new post
      const post = new Post({
        title: item.title,
        slug: item.slug,
        content: item.content.trim(),
        excerpt: item.excerpt,
        category: category._id,
        tags: tagIds,
        author: admin._id,
        status: 'published',
        publishedAt: new Date(),
        isFeatured: item.isFeatured || false,
        featuredImage: item.featuredImage,
        views: item.views || 100,
        seo: item.seo,
      });

      await post.save();
      insertedCount++;
      console.log(`✅ Inserted article: "${item.title}"`);
      console.log(`   ID: ${post._id} | Slug: ${post.slug} | Category: ${category.name}`);
    }

    console.log(`\n📊 Insertion summary: ${insertedCount} added, ${skippedCount} skipped.`);

    // 3. Resync all Category and Tag counts
    console.log('\n🔄 Synchronizing Category and Tag post counts...');
    const allCategories = await Category.find();
    for (const cat of allCategories) {
      const count = await Post.countDocuments({
        category: cat._id,
        status: { $in: ['approved', 'published'] },
      });
      cat.postCount = count;
      await cat.save();
      console.log(`   📁 Category "${cat.name}": ${count} articles`);
    }

    const allTags = await Tag.find();
    for (const tag of allTags) {
      const count = await Post.countDocuments({
        tags: tag._id,
        status: { $in: ['approved', 'published'] },
      });
      tag.postCount = count;
      await tag.save();
    }

    // 4. Final verification of database state
    const totalPosts = await Post.countDocuments();
    const livePosts = await Post.countDocuments({ status: { $in: ['approved', 'published'] } });
    console.log('\n════════════════════════════════════════════════');
    console.log(`  🎉 Finished! Total posts in database: ${totalPosts}`);
    console.log(`  🌐 Total published/live posts:       ${livePosts}`);
    console.log('════════════════════════════════════════════════\n');
  } catch (err) {
    console.error('❌ Error adding articles:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
};

run();

