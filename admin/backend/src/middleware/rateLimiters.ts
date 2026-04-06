import rateLimit from 'express-rate-limit';
import { rateLimitWindowMs, rateLimitMax } from '../config/env';

const generalLimiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

const authLimiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: Math.min(rateLimitMax, 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Authentication rate limit exceeded.'
  }
});

export {
  generalLimiter,
  authLimiter
};

