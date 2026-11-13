import { sendError, ApiError } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';


const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  if (env.IS_DEV) {
    logger.debug(err.stack);
  }

  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  if (err.name === 'CastError') {
    return sendError(res, `Invalid value for field: ${err.path}`, 400);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, 'Validation failed', 400, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue?.[field];
    return sendError(res, `A record with ${field} "${value}" already exists.`, 409);
  }

  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired. Please log in again.', 401);
  }

  const message = env.IS_DEV ? err.message : 'Internal server error';
  return sendError(res, message, 500);
};

export default errorHandler;
