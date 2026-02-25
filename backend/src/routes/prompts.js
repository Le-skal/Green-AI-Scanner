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
 * @swagger
 * /api/prompts/models:
 *   get:
 *     summary: Liste des modèles IA disponibles
 *     description: Retourne la liste complète des modèles d'IA configurés avec leurs informations de souveraineté
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Liste des modèles IA récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 models:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AIModel'
 */
router.get('/models', getAvailableModels);

/**
 * @swagger
 * /api/prompts:
 *   post:
 *     summary: Créer un prompt et obtenir des réponses agrégées
 *     description: Envoie un prompt à plusieurs modèles d'IA en parallèle, calcule les scores scientifiques (BM25, TF-IDF, ROUGE), et retourne une analyse comparative complète
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promptText
 *               - aiModels
 *             properties:
 *               promptText:
 *                 type: string
 *                 description: Le texte du prompt à envoyer aux modèles IA
 *                 example: "Explain quantum computing in simple terms"
 *               aiModels:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [gemini, mistral, huggingface, cohere]
 *                 description: Liste des modèles IA à interroger
 *                 example: ["gemini", "mistral"]
 *     responses:
 *       201:
 *         description: Prompt créé et réponses agrégées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prompt:
 *                   $ref: '#/components/schemas/Prompt'
 *                 responses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Response'
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Trop de requêtes (rate limit)
 *       500:
 *         description: Erreur serveur
 */
router.post('/', aiLimiter, optionalAuth, createPrompt);

/**
 * @swagger
 * /api/prompts:
 *   get:
 *     summary: Liste des prompts
 *     description: Récupère la liste des prompts avec pagination. Si authentifié, retourne uniquement les prompts de l'utilisateur
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de résultats par page
 *     responses:
 *       200:
 *         description: Liste des prompts récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prompts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prompt'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     pages:
 *                       type: number
 */
router.get('/', optionalAuth, getPrompts);

/**
 * @swagger
 * /api/prompts/{id}:
 *   get:
 *     summary: Détails d'un prompt
 *     description: Récupère un prompt spécifique avec toutes ses réponses IA et scores détaillés
 *     tags: [Prompts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du prompt
 *     responses:
 *       200:
 *         description: Détails du prompt récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prompt:
 *                   $ref: '#/components/schemas/Prompt'
 *                 responses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Response'
 *       404:
 *         description: Prompt non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getPromptById);

/**
 * @swagger
 * /api/prompts/{id}:
 *   delete:
 *     summary: Supprimer un prompt
 *     description: Supprime un prompt et toutes ses réponses associées. Nécessite une authentification
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du prompt
 *     responses:
 *       200:
 *         description: Prompt supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Prompt deleted successfully"
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (pas le propriétaire)
 *       404:
 *         description: Prompt non trouvé
 */
router.delete('/:id', protect, deletePrompt);

export default router;
