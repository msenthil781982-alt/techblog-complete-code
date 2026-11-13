import env from '../config/env.js';

const getTimestamp = () => new Date().toTimeString().split(' ')[0];

const logger = {
  info: (...args) => {
    console.log(`[${getTimestamp()}] INFO:`, ...args);
  },

  warn: (...args) => {
    console.warn(`[${getTimestamp()}] WARN:`, ...args);
  },

  error: (...args) => {
    console.error(`[${getTimestamp()}] ERROR:`, ...args);
  },

  debug: (...args) => {
    if (env.IS_DEV) {
      console.log(`[${getTimestamp()}] DEBUG:`, ...args);
    }
  },
};

export default logger;
