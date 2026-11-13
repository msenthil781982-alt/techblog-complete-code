
import { Router } from 'express';
import * as sitemapController from '../controllers/sitemapController.js';

const router = Router();

router.get('/sitemap.xml', sitemapController.getSitemapXml);
router.get('/robots.txt', sitemapController.getRobotsTxt);

export default router;
