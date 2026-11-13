import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

function validateEnv() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (!mongoUri) {
    missing.unshift('MONGO_URI');
  }

  if (missing.length > 0) {
    throw new Error(`[env] Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnv();

const env = Object.freeze({
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGO_URI: process.env.MONGO_URI || process.env.MONGO_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@techblog.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@123456',

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'TechBlog <onboarding@resend.dev>',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900_000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  IS_DEV: (process.env.NODE_ENV || 'development') === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
});

export default env;
