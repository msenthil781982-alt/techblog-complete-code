
import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    logger.info(`MongoDB connected → ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect…');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected.');
});

if (env.IS_DEV) {
  mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
    logger.debug(`Mongoose → ${collectionName}.${methodName}(${JSON.stringify(methodArgs[0])})`);
  });
}

export default connectDB;
