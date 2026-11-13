
import { v2 as cloudinary } from 'cloudinary';
import env from './env.js';
import logger from '../utils/logger.js';

const isCloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info('Cloudinary configured for remote media delivery');
} else {
  logger.info('Cloudinary credentials not provided — using local disk storage for images');
}

export const uploadBufferToCloudinary = (buffer, folder = 'techblog/posts') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured || !publicId) return null;
  return cloudinary.uploader.destroy(publicId);
};

export { isCloudinaryConfigured, cloudinary };
export default cloudinary;
