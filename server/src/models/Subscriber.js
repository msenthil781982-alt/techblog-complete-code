import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid email address'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'unsubscribed'],
        message: 'Status must be active or unsubscribed',
      },
      default: 'active',
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Subscriber = model('Subscriber', subscriberSchema);

export default Subscriber;

