
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import env from '../config/env.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Post from '../models/Post.js';
import Tag from '../models/Tag.js';

const INITIAL_CATEGORIES = [
  {
    name: 'Software Development',
    slug: 'software-development',
    description:
      'Best practices, design patterns, and expert insights on building robust software — from architecture to deployment.',
    icon: '💻',
    color: 'blue',
  },
  {
    name: 'Artificial Intelligence & Machine Learning',
    slug: 'artificial-intelligence-machine-learning',
    description:
      'Cutting-edge research, tutorials, and real-world applications of AI, ML, deep learning, and large language models.',
    icon: '🤖',
    color: 'purple',
  },
  {
    name: 'Web and Mobile App Development',
    slug: 'web-and-mobile-app-development',
    description:
      'Frontend frameworks, backend APIs, mobile SDKs, and full-stack techniques for building modern web and mobile apps.',
    icon: '📱',
    color: 'cyan',
  },
  {
    name: 'Technology & Innovation',
    slug: 'technology-innovation',
    description:
      'Emerging technologies, digital transformation, and the latest innovations shaping the future of tech.',
    icon: '🚀',
    color: 'orange',
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description:
      'Threat intelligence, security best practices, ethical hacking, vulnerability research, and how to build secure systems.',
    icon: '🔐',
    color: 'red',
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description:
      'AWS, Azure, GCP, Kubernetes, serverless architectures, DevOps, and everything you need to build in the cloud.',
    icon: '☁️',
    color: 'indigo',
  },
  {
    name: 'Industry Insights',
    slug: 'industry-insights',
    description:
      'Market trends, tech career advice, company analyses, and expert opinions on the technology industry at large.',
    icon: '📊',
    color: 'green',
  },
];

const seedAdmin = async () => {
  console.log('\n👤 Seeding admin user…');

  const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL });

  if (existingAdmin) {
    console.log(`   ✅ Admin already exists: ${env.ADMIN_EMAIL}`);
    return existingAdmin;
  }

  const admin = new User({
    name: 'Blog Admin',
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,  
    role: 'admin',
    bio: 'The TechBlog platform administrator.',
    isActive: true,
  });

  await admin.save();
  console.log(`   ✅ Admin created: ${env.ADMIN_EMAIL}`);
  console.log(`   🔑 Password:      ${env.ADMIN_PASSWORD}`);
  console.log(`   ⚠️  CHANGE THIS PASSWORD in production!`);

  return admin;
};

const seedCategories = async () => {
  console.log('\n🗂️  Seeding categories…');

  const bulkOps = INITIAL_CATEGORIES.map((cat) => ({
    updateOne: {
      filter: { slug: cat.slug },        
      update: {
        $setOnInsert: {                  
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          color: cat.color,
          postCount: 0,
          isActive: true,
        },
      },
      upsert: true,                      
    },
  }));

  const result = await Category.bulkWrite(bulkOps, { ordered: false });

  const created = result.upsertedCount;
  const skipped = INITIAL_CATEGORIES.length - created;

  console.log(`   ✅ ${created} categories created, ${skipped} already existed`);
  INITIAL_CATEGORIES.forEach((cat) => console.log(`      • ${cat.icon}  ${cat.name}`));
};

const INITIAL_POSTS = [
  {
    title: 'The Future of Generative AI: From LLMs to Autonomous Agents',
    slug: 'the-future-of-generative-ai',
    categorySlug: 'artificial-intelligence-machine-learning',
    tags: ['Artificial Intelligence', 'Machine Learning', 'Autonomous Agents'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      altText: 'Artificial Intelligence Network',
    },
    excerpt: 'Explore how large language models are evolving into proactive autonomous agents capable of complex reasoning and real-world actions.',
    content: `
      <h2>The Shift to Agentic AI</h2>
      <p>Generative AI is rapidly evolving beyond reactive prompt-response workflows. Today's state-of-the-art systems leverage reasoning loops, tool invocation, and multi-agent coordination to accomplish end-to-end tasks.</p>
      <h3>Core Architectures</h3>
      <p>Modern autonomous agents rely on perception, planning, memory, and tool execution. By combining retrieval-augmented generation (RAG) with chain-of-thought prompting, agents can solve non-trivial software engineering, analytics, and automation challenges.</p>
      <p>As models become more efficient and context windows expand, autonomous agents will become essential co-workers across engineering teams worldwide.</p>
    `,
    isFeatured: true,
    views: 142,
  },
  {
    title: 'Building Scalable Microservices with Node.js and Docker',
    slug: 'building-scalable-microservices-nodejs-docker',
    categorySlug: 'software-development',
    tags: ['Node.js', 'Docker', 'Microservices', 'Architecture'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      altText: 'Server rack infrastructure',
    },
    excerpt: 'A comprehensive engineering guide to structuring resilient, event-driven microservices using Node.js, Express, and Docker containers.',
    content: `
      <h2>Designing for High Concurrency</h2>
      <p>Microservice architectures decouple monolithic bottlenecks, allowing teams to deploy independent components with clear failure boundaries.</p>
      <h3>Containerisation Best Practices</h3>
      <p>Using multi-stage Docker builds reduces image sizes dramatically, while container orchestrators ensure self-healing deployments and zero-downtime rolling updates.</p>
      <p>Observability, structured logging, and distributed tracing are critical prerequisites for maintaining reliable microservices in production.</p>
    `,
    isFeatured: true,
    views: 98,
  },
  {
    title: 'Modern Full-Stack Development with React 18, Vite, and Tailwind CSS',
    slug: 'modern-fullstack-react-vite-tailwind',
    categorySlug: 'web-and-mobile-app-development',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Frontend'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
      altText: 'React code editor',
    },
    excerpt: 'Step-by-step best practices for creating lightning-fast web applications with React 18, Vite bundling, and responsive Tailwind styling.',
    content: `
      <h2>Why Vite is the Standard</h2>
      <p>Vite harnesses native ES modules in development to deliver instant server starts and sub-second Hot Module Replacement (HMR).</p>
      <h3>Component Composition & Clean Styling</h3>
      <p>Combining Tailwind utility classes with modular React components allows frontend engineers to build accessible, consistent design systems without runtime CSS overhead.</p>
    `,
    isFeatured: false,
    views: 65,
  },
  {
    title: 'Cloud Security Fundamentals: Zero Trust in Modern Architectures',
    slug: 'cloud-security-fundamentals-zero-trust',
    categorySlug: 'cybersecurity',
    tags: ['Security', 'Zero Trust', 'Cloud', 'DevOps'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      altText: 'Cybersecurity lock visualization',
    },
    excerpt: 'Why perimeter security is obsolete and how implementing Zero Trust principles safeguards cloud infrastructure against modern attack vectors.',
    content: `
      <h2>Never Trust, Always Verify</h2>
      <p>The Zero Trust security model assumes threat actors exist both inside and outside the network perimeter. Every request must be authenticated, authorized, and encrypted before granting access.</p>
      <h3>Practical Implementation</h3>
      <p>Implement least-privilege role-based access control (RBAC), rotate short-lived credentials automatically, and inspect all telemetry for anomalous activity in real time.</p>
    `,
    isFeatured: false,
    views: 47,
  },
  {
    title: 'Architecting Event-Driven Systems with Apache Kafka',
    slug: 'architecting-event-driven-systems-apache-kafka',
    categorySlug: 'software-development',
    tags: ['Kafka', 'Architecture', 'Event-Driven', 'Microservices'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      altText: 'Microchip circuit technology',
    },
    excerpt: 'Deep dive into designing high-throughput, loosely coupled distributed architectures using event streams and message brokers.',
    content: `
      <h2>The Shift to Asynchronous Architecture</h2>
      <p>Synchronous REST architectures often create brittle coupling between services. Event-driven architectures replace point-to-point calls with immutable log streams.</p>
      <h3>Partitioning and Ordering Guarantees</h3>
      <p>Kafka provides strict message ordering within partitions. Choosing appropriate partition keys ensures consumer group scalability while preserving transactional order.</p>
      <p>Coupling schema registries with Avro or Protobuf guarantees backwards-compatible evolutions across producer-consumer boundaries.</p>
    `,
    isFeatured: true,
    views: 215,
  },
  {
    title: 'Mastering Retrieval-Augmented Generation (RAG) with Vector Databases',
    slug: 'mastering-retrieval-augmented-generation-rag',
    categorySlug: 'artificial-intelligence-machine-learning',
    tags: ['Artificial Intelligence', 'RAG', 'Vector Search', 'LLM'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
      altText: 'AI deep learning abstract visualization',
    },
    excerpt: 'How vector embeddings, semantic retrieval, and reranking pipelines eliminate LLM hallucinations in enterprise knowledge bases.',
    content: `
      <h2>Grounding LLMs with Proprietary Knowledge</h2>
      <p>Retrieval-Augmented Generation (RAG) grounds language models in current, domain-specific data without costly fine-tuning cycles.</p>
      <h3>From Chunking to Hybrid Search</h3>
      <p>Effective RAG requires intelligent chunking strategies, contextual metadata filtering, and hybrid search combining dense vector embeddings with BM25 sparse keyword matching.</p>
      <p>Adding a cross-encoder re-ranking stage reliably yields significant precision improvements for complex retrieval queries.</p>
    `,
    isFeatured: true,
    views: 340,
  },
  {
    title: 'Building Native iOS and Android Apps with Flutter 3.x',
    slug: 'building-native-mobile-apps-with-flutter',
    categorySlug: 'web-and-mobile-app-development',
    tags: ['Flutter', 'Mobile', 'Dart', 'Cross-Platform'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      altText: 'Smartphone application mobile development',
    },
    excerpt: 'Best practices for writing single-codebase cross-platform mobile applications with custom rendering engines and 120Hz smooth animations.',
    content: `
      <h2>The Impeller Rendering Engine</h2>
      <p>Flutter's Impeller engine replaces runtime shader compilation with pre-compiled pipelines, virtually eliminating first-run animation jank on modern iOS and Android hardware.</p>
      <h3>Predictable State Management</h3>
      <p>Managing asynchronous state using modern Riverpod or Bloc providers decouples business logic from rendering widgets, facilitating automated unit testing and robust offline synchronization.</p>
    `,
    isFeatured: false,
    views: 110,
  },
  {
    title: 'Quantum Computing: From Lab Benchmarks to Commercial Qubits',
    slug: 'quantum-computing-benchmarks-to-commercial-qubits',
    categorySlug: 'technology-innovation',
    tags: ['Quantum', 'Hardware', 'Innovation', 'Future Tech'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      altText: 'Quantum computing hardware physics',
    },
    excerpt: 'A realistic assessment of fault-tolerant quantum error correction, neutral atom processors, and their impact on modern public-key cryptography.',
    content: `
      <h2>Crossing the Threshold of Logical Qubits</h2>
      <p>Quantum computing is transitioning from noisy intermediate-scale quantum (NISQ) systems toward fault-tolerant logical qubits supported by quantum error correction codes.</p>
      <h3>Post-Quantum Cryptography (PQC) Readiness</h3>
      <p>Organizations must begin migrating classical RSA and ECC cryptosystems to NIST-standardized lattice-based algorithms like ML-KEM and ML-DSA to guard against harvest-now-decrypt-later attacks.</p>
    `,
    isFeatured: true,
    views: 185,
  },
  {
    title: 'Kubernetes Multi-Cluster Management and GitOps with ArgoCD',
    slug: 'kubernetes-multi-cluster-gitops-argocd',
    categorySlug: 'cloud-computing',
    tags: ['Kubernetes', 'DevOps', 'GitOps', 'Cloud'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
      altText: 'Cloud infrastructure data center',
    },
    excerpt: 'Automating declarative multi-region cluster deployments, progressive rollouts, and disaster recovery using Git as the single source of truth.',
    content: `
      <h2>Eliminating Manual Cluster Configuration</h2>
      <p>GitOps enforces continuous synchronization between version-controlled declarative manifests and active Kubernetes cluster state.</p>
      <h3>Progressive Delivery with Argo Rollouts</h3>
      <p>Automated canary deployments backed by Prometheus metrics allow automated rollbacks if latency thresholds or HTTP error rates exceed tolerance boundaries during releases.</p>
    `,
    isFeatured: false,
    views: 154,
  },
  {
    title: 'API Security Essentials: Mitigating OWASP API Top 10 Vulnerabilities',
    slug: 'api-security-essentials-owasp-top-10',
    categorySlug: 'cybersecurity',
    tags: ['Cybersecurity', 'API Security', 'OWASP', 'Web Security'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      altText: 'Matrix binary code security screen',
    },
    excerpt: 'Practical defense mechanisms against broken object level authorization (BOLA), mass assignment, and JWT replay attacks in REST and GraphQL APIs.',
    content: `
      <h2>The Prevalence of BOLA (IDOR)</h2>
      <p>Broken Object Level Authorization remains the number one risk in production APIs. Applications frequently validate user identity while failing to verify whether the requesting user owns the requested record ID.</p>
      <h3>Defensive Engineering</h3>
      <p>Implement object-level access control checks within data access layers rather than relying solely on perimeter API gateway filters.</p>
    `,
    isFeatured: false,
    views: 192,
  },
  {
    title: 'The 2026 Tech Hiring Landscape: Engineering Specializations in Demand',
    slug: 'tech-hiring-landscape-engineering-specializations',
    categorySlug: 'industry-insights',
    tags: ['Career', 'Tech Trends', 'Leadership', 'Industry'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      altText: 'Software engineers team collaboration',
    },
    excerpt: 'Data-driven insights into how AI copilots, platform engineering, and full-stack competency are reshaping software career progression.',
    content: `
      <h2>The Evolution of Senior Engineering Roles</h2>
      <p>AI coding assistants have shifted software engineering requirements from rote syntax memorization toward high-level architectural reasoning, domain modelling, and systems verification.</p>
      <h3>High-Growth Focus Areas</h3>
      <p>Platform engineers, AI infrastructure specialists, and security-conscious backend architects continue to see strong demand across venture-backed scaleups and multinational enterprises.</p>
    `,
    isFeatured: false,
    views: 280,
  },
  {
    title: 'Database Indexing Deep Dive: B-Trees, LSM-Trees, and Query Optimization',
    slug: 'database-indexing-deep-dive-btrees-lsm',
    categorySlug: 'software-development',
    tags: ['Database', 'PostgreSQL', 'Performance', 'Indexing'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
      altText: 'Database server disks storage',
    },
    excerpt: 'Understanding how storage engines read and write pages on disk, and how to write composite indexes that turn slow queries into sub-millisecond lookups.',
    content: `
      <h2>B-Trees vs Log-Structured Merge Trees</h2>
      <p>Relational systems like PostgreSQL rely on B-Tree indexes for balanced O(log N) lookups, while write-heavy systems like Cassandra employ LSM trees that transform random disk writes into sequential append operations.</p>
      <h3>Index Selectivity and Covering Indexes</h3>
      <p>Covering indexes (INCLUDE clauses in SQL, index projection in MongoDB) allow databases to answer queries entirely from index leaves without requiring heap page reads.</p>
    `,
    isFeatured: false,
    views: 130,
  },
  {
    title: 'Serverless vs Containers: Total Cost of Ownership (TCO) in 2026',
    slug: 'serverless-vs-containers-tco-analysis',
    categorySlug: 'cloud-computing',
    tags: ['Serverless', 'AWS', 'Cloud', 'Architecture'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      altText: 'Global cloud network connectivity',
    },
    excerpt: 'Analyzing cold starts, concurrency limits, egress fees, and maintenance overhead to decide between Lambda, Fargate, and managed Kubernetes.',
    content: `
      <h2>Beyond Compute Costs: Operational Burden</h2>
      <p>Evaluating serverless versus container architectures solely on CPU/RAM runtime costs misses the substantial ongoing overhead of cluster maintenance, security patching, and capacity planning.</p>
      <h3>Decision Matrix</h3>
      <p>Serverless architectures excel for spiky, event-driven workloads, while sustained high-throughput workloads with predictable utilization achieve lower cost thresholds on containerized Kubernetes nodes.</p>
    `,
    isFeatured: false,
    views: 175,
  },
  {
    title: 'Spatial Computing and WebGPU: Immersive 3D Experiences on the Web',
    slug: 'spatial-computing-webgpu-immersive-3d',
    categorySlug: 'technology-innovation',
    tags: ['WebGPU', 'Three.js', 'Spatial Computing', 'WebXR'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1200&q=80',
      altText: 'Virtual reality headset 3D technology',
    },
    excerpt: 'How WebGPU and WebXR are bringing native-performance 3D graphics and immersive spatial computing into everyday web browsers.',
    content: `
      <h2>The Leap from WebGL to WebGPU</h2>
      <p>WebGPU reduces CPU driver validation overhead and provides compute shaders directly within modern web browsers, enabling desktop-class real-time graphics and client-side neural network inference.</p>
      <h3>Spatial UI with WebXR</h3>
      <p>Developers can build interactive headsets and mobile AR experiences using familiar Web standards, bridging desktop browsers and spatial computing hardware seamlessly.</p>
    `,
    isFeatured: false,
    views: 122,
  },
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
    `,
    isFeatured: true,
    views: 345,
  },
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
      <h2>The Shift to Edge Computing and Instant Global Delivery</h2>
      <p>Traditional centralized servers are increasingly augmented by globally distributed Edge runtime networks. Edge functions execute code within milliseconds of end users, providing localized caching, authentication verification, and personalized content delivery with zero cold-start penalties.</p>
    `,
    isFeatured: false,
    views: 280,
  },
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
      <h2>Securing the Software Supply Chain Against Compromise</h2>
      <p>Attacks targeting open-source dependencies and build pipelines represent one of the fastest-growing attack surfaces. Engineering organizations must integrate comprehensive DevSecOps guardrails into every stage of the software lifecycle.</p>
    `,
    isFeatured: false,
    views: 410,
  },
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
      <p>Serverless computing has transitioned from ephemeral micro-tasks into a comprehensive foundation for enterprise architecture. Modern lightweight micro-VMs and WebAssembly sandboxes have reduced execution cold starts to under five milliseconds, making serverless workloads indistinguishable from dedicated instances.</p>
      <h2>Multi-Cloud Portability with GitOps and Open Standards</h2>
      <p>To mitigate vendor lock-in and satisfy international data sovereignty regulations, engineering teams are adopting unified multi-cloud management planes. Declarative GitOps workflows synchronize infrastructure-as-code across clouds.</p>
    `,
    isFeatured: false,
    views: 310,
  },
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
      <p>Writing functional code for a single process is fundamentally different from engineering distributed software operating across hundreds of nodes. Modern developers must master concurrent programming concepts, asynchronous message queues, and event-driven architectures.</p>
      <h2>2. Resilient API Design, Idempotency, and Backward Compatibility</h2>
      <p>APIs are the contracts that power modern digital ecosystems. Robust API engineering requires defensive practices including idempotency keys, strict schema validation, and graceful versioning.</p>
      <h2>3. Deep Observability: Telemetry, Tracing, and Structured Logging</h2>
      <p>Exceptional developers design software with observability embedded from day one: contextual structured JSON logging, distributed trace spans, and custom metrics.</p>
    `,
    isFeatured: false,
    views: 520,
  },
];

const seedPosts = async (admin) => {
  console.log('\n📝 Seeding sample published posts…');

  const totalExisting = await Post.countDocuments();
  if (totalExisting > 0) {
    console.log(`   ⏭️  Posts collection already contains ${totalExisting} articles. Skipping to prevent duplicates.`);
    return;
  }

  for (const item of INITIAL_POSTS) {
    const existing = await Post.findOne({
      $or: [{ slug: item.slug }, { title: item.title }],
    });
    if (existing) {
      console.log(`   ⏭️  Post already exists: "${item.title}"`);
      continue;
    }

    const category = await Category.findOne({ slug: item.categorySlug });
    if (!category) {
      console.log(`   ⚠️ Category not found for slug: ${item.categorySlug}`);
      continue;
    }

    const tagDocs = await Promise.all(item.tags.map((t) => Tag.findOrCreate(t)));
    const tagIds = tagDocs.map((t) => t._id);

    const post = new Post({
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt,
      category: category._id,
      tags: tagIds,
      author: admin._id,
      status: 'published',
      publishedAt: new Date(),
      isFeatured: item.isFeatured,
      featuredImage: item.featuredImage,
      views: item.views,
    });

    await post.save();

    await Promise.all([
      Category.incrementPostCount(category._id),
      Tag.incrementPostCount(tagIds),
    ]);

    console.log(`   ✅ Created post: "${item.title}" (${item.slug})`);
  }
};

const runSeed = async () => {
  console.log('═══════════════════════════════════════════════');
  console.log('  🌱 TechBlog Database Seeder');
  console.log('═══════════════════════════════════════════════');

  try {
    await connectDB();

    const admin = await seedAdmin();
    await seedCategories();
    await seedPosts(admin);

    console.log('\n═══════════════════════════════════════════════');
    console.log('  ✅ Seeding complete!');
    console.log('═══════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed. Goodbye! 👋\n');
    process.exit(0);
  }
};

runSeed();
