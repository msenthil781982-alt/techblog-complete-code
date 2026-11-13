
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { isCloudinaryConfigured, uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '..', '..', 'uploads', 'images');

const saveImageLocally = async (buffer, originalName) => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const randomHash = crypto.randomBytes(8).toString('hex');
  const baseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30);
  const fileName = `${Date.now()}-${baseName}-${randomHash}.webp`;
  const filePath = path.join(UPLOADS_DIR, fileName);

  const image = sharp(buffer);
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > 1920) {
    pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
  }

  const processedBuffer = await pipeline
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  await fs.writeFile(filePath, processedBuffer);

  return {
    url: `/uploads/images/${fileName}`,
    fileName,
    format: 'webp',
    width: metadata.width && metadata.width > 1920 ? 1920 : metadata.width,
    height: metadata.height,
    size: processedBuffer.length,
    isRemote: false,
  };
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError('No image file provided', 400);
    }

    let fileInfo;

    if (isCloudinaryConfigured) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'techblog/posts');
      fileInfo = {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        isRemote: true,
      };
    } else {
      fileInfo = await saveImageLocally(req.file.buffer, req.file.originalname);
    }

    logger.info(`Uploaded image [${fileInfo.isRemote ? 'Cloudinary' : 'Local'}]: ${fileInfo.url}`);

    return sendSuccess(res, fileInfo, 'Image uploaded and optimized successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError('No image files provided', 400);
    }

    const uploadPromises = req.files.map(async (file) => {
      if (isCloudinaryConfigured) {
        const result = await uploadBufferToCloudinary(file.buffer, 'techblog/gallery');
        return {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          size: result.bytes,
          isRemote: true,
        };
      } else {
        return saveImageLocally(file.buffer, file.originalname);
      }
    });

    const files = await Promise.all(uploadPromises);

    return sendSuccess(res, { files }, `${files.length} images uploaded successfully`, 201);
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { url, publicId, fileName } = req.body;

    if (!url && !publicId && !fileName) {
      throw new ApiError('Please provide either url, fileName, or publicId to delete', 400);
    }

    if (publicId && isCloudinaryConfigured) {
      await deleteFromCloudinary(publicId);
      return sendSuccess(res, null, 'Cloudinary asset deleted successfully');
    }

    const targetFile = fileName || (url ? path.basename(url) : null);
    if (targetFile) {
      const filePath = path.join(UPLOADS_DIR, targetFile);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        if (e.code !== 'ENOENT') throw e; 
      }
    }

    return sendSuccess(res, null, 'Image deleted successfully');
  } catch (err) {
    next(err);
  }
};
