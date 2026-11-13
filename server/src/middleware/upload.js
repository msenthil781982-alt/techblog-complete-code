
import multer from 'multer';
import { ApiError } from '../utils/apiResponse.js';

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        `Invalid file format (${file.mimetype}). Only JPEG, PNG, WebP, GIF, and AVIF are allowed.`,
        400
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 5,                   
  },
});

export const handleUploadError = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError('File is too large. Maximum size allowed is 5MB.', 400));
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(new ApiError('Too many files uploaded at once. Maximum is 5.', 400));
      }
      return next(new ApiError(`Upload error: ${err.message}`, 400));
    }
    if (err) {
      return next(err);
    }
    next();
  });
};
