import http from 'http';
import env from './config/env.js';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import initScheduler from './services/scheduler.js';

await connectDB();

initScheduler();

const server = http.createServer(app);

server.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  logger.info(`Health check available at http://localhost:${env.PORT}/api/health`);
});

const shutdown = (signal) => {
  logger.warn(`${signal} received: closing HTTP server and database connections`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      const { default: mongoose } = await import('mongoose');
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    } catch (err) {
      logger.error('Error closing MongoDB connection:', err.message);
    }

    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Graceful shutdown timed out, forcing exit');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err.message);
  shutdown('uncaughtException');
});
