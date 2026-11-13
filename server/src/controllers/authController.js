import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

const signAccessToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const signRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id.toString() },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError('Email is already registered. Please log in.', 400);
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'user',
    });

    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    logger.info(`User registered: ${user.email}`);

    return sendSuccess(
      res,
      {
        accessToken,
        user: user.toJSON(),
      },
      'Registration successful',
      201
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new ApiError('Your account has been deactivated. Contact support.', 403);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError('Invalid email or password', 401);
    }

    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    logger.info(`User login: ${user.email} (${user.role})`);

    return sendSuccess(
      res,
      {
        accessToken,
        user: user.toJSON(),
      },
      'Login successful',
      200
    );
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      throw new ApiError('Refresh token not provided', 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch {
      throw new ApiError('Invalid or expired refresh token. Please log in again.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new ApiError('User no longer exists or has been deactivated.', 401);
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    setRefreshTokenCookie(res, newRefreshToken);

    return sendSuccess(
      res,
      { accessToken: newAccessToken },
      'Token refreshed successfully',
      200
    );
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: env.IS_PROD,
      sameSite: 'strict',
      maxAge: 0,
      path: '/api/auth/refresh',
    });

    logger.info(`User logged out: ${req.user?.id || 'unknown'}`);
    return sendSuccess(res, null, 'Logged out successfully', 200);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return sendSuccess(res, { user: user.toJSON() }, 'User fetched successfully', 200);
  } catch (err) {
    next(err);
  }
};
