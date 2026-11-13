
import { Router } from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { protect, authorOrAdmin } from '../middleware/auth.js';

const router = Router();

router.post(
  '/image',
  protect,
  authorOrAdmin,
  handleUploadError(upload.single('image')),
  uploadController.uploadImage
);

router.post(
  '/images',
  protect,
  authorOrAdmin,
  handleUploadError(upload.array('images', 5)),
  uploadController.uploadMultipleImages
);

router.delete(
  '/image',
  protect,
  authorOrAdmin,
  uploadController.deleteImage
);

export default router;
