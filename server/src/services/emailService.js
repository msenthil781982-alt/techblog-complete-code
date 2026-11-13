
import { Resend } from 'resend';
import env from '../config/env.js';
import logger from '../utils/logger.js';
import { getWelcomeEmailHtml, getWelcomeEmailText } from '../templates/welcomeEmail.js';

let resendClient = null;

const getResendClient = () => {
  if (!resendClient && env.RESEND_API_KEY) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
};

export const sendWelcomeEmail = async (toEmail) => {
  if (!env.RESEND_API_KEY) {
    logger.warn('[emailService] RESEND_API_KEY is not configured in environment variables. Email sending skipped.');
    return {
      success: false,
      skipped: true,
      error: 'RESEND_API_KEY is not configured',
    };
  }

  try {
    const resend = getResendClient();
    const fromAddress = env.EMAIL_FROM || 'TechBlog <onboarding@resend.dev>';
    const siteUrl = env.CLIENT_URL || 'http://localhost:3000';

    logger.info(`[emailService] Sending welcome email to: ${toEmail} from: ${fromAddress}`);

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toEmail],
      subject: 'Welcome to TechBlog Newsletter! 🎉',
      html: getWelcomeEmailHtml(toEmail, siteUrl),
      text: getWelcomeEmailText(toEmail, siteUrl),
    });

    if (error) {
      logger.error(`[emailService] Resend API error: ${JSON.stringify(error)}`);
      return {
        success: false,
        error: error.message || 'Failed to send welcome email via Resend',
      };
    }

    logger.info(`[emailService] Welcome email delivered successfully. Resend Email ID: ${data?.id}`);
    return {
      success: true,
      id: data?.id,
    };
  } catch (err) {
    logger.error(`[emailService] Unexpected error sending email: ${err.message}`);
    return {
      success: false,
      error: err.message,
    };
  }
};

export default {
  sendWelcomeEmail,
};

