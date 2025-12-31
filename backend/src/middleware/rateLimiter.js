import rateLimit from 'express-rate-limit';

/**
 * Rate limiter pour les routes d'authentification
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes max
  message: {
    error: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les requêtes d'agrégation IA
 * Plus restrictif car les APIs ont des quotas
 */
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requêtes par minute max
  message: {
    error: 'Too many AI requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter général pour l'API
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
  message: {
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  authLimiter,
  aiLimiter,
  generalLimiter
};
