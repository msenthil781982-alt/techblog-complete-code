
import Subscriber from '../models/Subscriber.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email || typeof email !== 'string') {
      return sendError(res, 'Email is required', 400);
    }

    email = email.trim().toLowerCase();

    if (!emailRegex.test(email)) {
      return sendError(res, 'Invalid email.', 400);
    }

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return sendError(res, 'Already subscribed.', 409);
      }

      existingSubscriber.status = 'active';
      existingSubscriber.subscribedAt = new Date();
      existingSubscriber.unsubscribedAt = null;
      await existingSubscriber.save();

      const emailResult = await sendWelcomeEmail(email);

      return sendSuccess(
        res,
        {
          subscriber: existingSubscriber,
          emailSent: emailResult.success,
        },
        'Successfully subscribed!',
        200
      );
    }

    const newSubscriber = await Subscriber.create({
      email,
      status: 'active',
      subscribedAt: new Date(),
    });

    const emailResult = await sendWelcomeEmail(email);

    return sendSuccess(
      res,
      {
        subscriber: newSubscriber,
        emailSent: emailResult.success,
      },
      'Successfully subscribed!',
      201
    );
  } catch (error) {
    logger.error('[newsletterController] Subscribe error:', error);

    if (error.code === 11000) {
      return sendError(res, 'Already subscribed.', 409);
    }

    return sendError(res, 'Something went wrong.', 500);
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const { status = 'active', page = 1, limit = 50 } = req.query;
    const query = status ? { status } : {};

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [subscribers, total] = await Promise.all([
      Subscriber.find(query).sort({ subscribedAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Subscriber.countDocuments(query),
    ]);

    return sendSuccess(res, {
      subscribers,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    }, 'Subscribers fetched successfully');
  } catch (error) {
    logger.error('[newsletterController] getSubscribers error:', error);
    return sendError(res, 'Something went wrong.', 500);
  }
};

export const unsubscribe = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return sendError(res, 'Email is required', 400);
    }
    email = email.trim().toLowerCase();

    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return sendError(res, 'Subscriber not found', 404);
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return sendSuccess(res, null, 'Successfully unsubscribed.');
  } catch (error) {
    logger.error('[newsletterController] Unsubscribe error:', error);
    return sendError(res, 'Something went wrong.', 500);
  }
};

