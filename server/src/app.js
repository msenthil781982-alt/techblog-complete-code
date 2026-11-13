import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import env from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import { sendError } from './utils/apiResponse.js';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = [env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin "${origin}" not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.IS_DEV ? 'dev' : 'combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());

const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

app.use('/api', apiLimiter);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const dbStatus = isConnected ? 'Connected' : 'Disconnected';

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TechBlog API Server</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
        .card { background: #1e293b; border-radius: 16px; padding: 36px 48px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4); max-width: 520px; width: 100%; text-align: center; border: 1px solid #334155; }
        h1 { margin: 0 0 12px; font-size: 26px; }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 9999px; font-weight: 600; font-size: 14px; margin: 16px 0; background: #064e3b; color: #34d399; border: 1px solid #059669; }
        .badge.disconnected { background: #7f1d1d; color: #f87171; border-color: #dc2626; }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: #10b981; }
        .badge.disconnected .dot { background: #ef4444; }
        p { color: #94a3b8; line-height: 1.6; margin: 8px 0; font-size: 15px; }
        .links { margin-top: 24px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        a { color: #38bdf8; text-decoration: none; font-weight: 500; font-size: 14px; padding: 8px 16px; background: #0f172a; border-radius: 8px; border: 1px solid #334155; transition: all 0.2s; }
        a:hover { background: #38bdf8; color: #0f172a; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>TechBlog API Server</h1>
        <div class="badge ${isConnected ? '' : 'disconnected'}">
          <span class="dot"></span>
          MongoDB: ${dbStatus}
        </div>
        <p><strong>Database:</strong> ${mongoose.connection.name || 'techblog'}</p>
        <p><strong>Host:</strong> ${mongoose.connection.host || 'MongoDB Atlas'}</p>
        <div class="links">
          <a href="/api/health" target="_blank">Health Check</a>
          <a href="/api/posts" target="_blank">Posts API</a>
          <a href="/api/categories" target="_blank">Categories API</a>
          <a href="http://localhost:3000" target="_blank">Open Frontend</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/health', (_req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.status(200).json({
    success: true,
    message: 'TechBlog API is running',
    database: {
      status: dbState,
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/', seoRoutes);

app.use((req, res) => {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
});

app.use(errorHandler);

export default app;
