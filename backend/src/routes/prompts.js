import express from 'express';
import {
  createPrompt,
  getPrompts,
  getPromptById,
  deletePrompt,
  getAvailableModels
} from '../controllers/promptController.js';
import { optionalAuth, protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * Routes pour les prompts et agrégation IA
 */

// GET /api/prompts/models - Liste des modèles IA disponibles (public)
router.get('/models', getAvailableModels);

// POST /api/prompts - Créer un nouveau prompt et agréger les réponses
// Avec auth optionnelle (fonctionne avec ou sans token)
router.post('/', aiLimiter, optionalAuth, createPrompt);

// GET /api/prompts - Liste des prompts (avec auth optionnelle)
router.get('/', optionalAuth, getPrompts);

// GET /api/prompts/:id - Détails d'un prompt spécifique
router.get('/:id', getPromptById);

// DELETE /api/prompts/:id - Supprimer un prompt (protégé)
router.delete('/:id', protect, deletePrompt);

export default router;
