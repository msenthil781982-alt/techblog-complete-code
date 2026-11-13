import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';
import { ApiError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No authentication token provided. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError('Malformed authorization header.', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError('User belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      throw new ApiError('Your account has been deactivated.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new ApiError('Access denied. Admin privileges required.', 403));
  }
  next();
};

export const authorOrAdmin = (req, res, next) => {
  if (!['admin', 'author'].includes(req.user?.role)) {
    return next(new ApiError('Access denied.', 403));
  }
  next();
};
