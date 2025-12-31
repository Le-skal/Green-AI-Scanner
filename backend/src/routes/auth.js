import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * Routes d'authentification
 */

// POST /api/auth/register - Inscription
router.post('/register', authLimiter, register);

// POST /api/auth/login - Connexion
router.post('/login', authLimiter, login);

// GET /api/auth/me - Profil utilisateur (protégé)
router.get('/me', protect, getMe);

// PUT /api/auth/profile - Mise à jour du profil (protégé)
router.put('/profile', protect, updateProfile);

export default router;
