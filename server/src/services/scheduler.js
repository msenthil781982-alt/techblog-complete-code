
import cron from 'node-cron';
import Post from '../models/Post.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import logger from '../utils/logger.js';

export const initScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      const duePosts = await Post.find({
        status: 'scheduled',
        scheduledAt: { $lte: now },
      });

      if (duePosts.length === 0) return;

      logger.info(`Scheduler: Found ${duePosts.length} article(s) due for publishing.`);

      for (const post of duePosts) {
        post.status = 'published';
        post.publishedAt = now;
        post.scheduledAt = null;

        await post.save();

        await Promise.all([
          Category.incrementPostCount(post.category),
          Tag.incrementPostCount(post.tags),
        ]);

        logger.info(`Scheduler: Published article "${post.title}" (${post.slug})`);
      }
    } catch (err) {
      logger.error('Scheduler execution error:', err.message);
    }
  });

  logger.info('Background publication scheduler initialized (interval: 1 minute)');
};

export default initScheduler;
