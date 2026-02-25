import Prompt from '../models/Prompt.js';
import Response from '../models/Response.js';
import User from '../models/User.js';
import OrchestratorService from '../services/ai/orchestratorService.js';
import ScoringService from '../services/scoringService.js';

/**
 * Controller pour gérer les prompts et l'agrégation IA
 */

/**
 * POST /api/prompts - Créer un nouveau prompt et obtenir les réponses agrégées
 */
export const createPrompt = async (req, res) => {
  try {
    const { promptText, aiModels, parameters } = req.body;
    const userId = req.user?._id; // Depuis le middleware auth

    // Validation
    if (!promptText || !aiModels || aiModels.length === 0) {
      return res.status(400).json({
        error: 'Prompt text and at least one AI model are required'
      });
    }

    console.log(`New prompt from user ${userId}: "${promptText.substring(0, 50)}..."`);

    // Créer le prompt dans la DB
    const prompt = await Prompt.create({
      userId,
      promptText,
      aiModels,
      parameters: parameters || {},
      status: 'processing'
    });

    // Obtenir les clients AI (depuis req.app.locals)
    const orchestrator = new OrchestratorService(req.app.locals.aiClients);
    const scoringService = new ScoringService();

    const startTime = Date.now();

    // Agréger les réponses
    const aggregatedResponses = await orchestrator.aggregateResponses(
      promptText,
      aiModels,
      parameters || {}
    );

    // Calculer les scores
    const scoredResponses = scoringService.scoreAllResponses(
      aggregatedResponses,
      promptText
    );

    const processingTime = Date.now() - startTime;

    // Sauvegarder les réponses dans la DB
    const savedResponses = [];
    for (const response of scoredResponses) {
      const responseDoc = await Response.create({
        promptId: prompt._id,
        aiModel: response.model,
        responseText: response.responseText || '',
        responseTime: response.responseTime,
        tokens: response.tokens,
        scores: response.scores,
        greenIT: response.greenIT || {},
        nlpAnalysis: response.nlpAnalysis || {},
        status: response.status,
        error: response.error
      });
      savedResponses.push(responseDoc);
    }

    // Mettre à jour le prompt
    const successfulResponses = scoredResponses.filter(r => r.status === 'success').length;
    prompt.status = successfulResponses > 0 ? 'completed' : 'failed';
    prompt.metadata = {
      processingTime,
      totalResponses: scoredResponses.length,
      successfulResponses,
      failedResponses: scoredResponses.length - successfulResponses
    };
    await prompt.save();

    // Mettre à jour les stats utilisateur
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.totalPrompts': 1, 'stats.totalAnalyses': successfulResponses }
      });
    }

    // Générer le résumé comparatif
    const summary = scoringService.generateComparativeSummary(scoredResponses);

    // Calculer la matrice de similarité
    const similarityMatrix = scoringService.calculateSimilarityMatrix(scoredResponses);

    console.log(`Prompt processed successfully in ${processingTime}ms`);

    res.status(201).json({
      prompt: {
        id: prompt._id,
        text: prompt.promptText,
        models: prompt.aiModels,
        status: prompt.status,
        createdAt: prompt.createdAt
      },
      responses: savedResponses,
      summary,
      similarityMatrix,
      metadata: {
        processingTime,
        totalResponses: scoredResponses.length,
        successfulResponses,
        failedResponses: scoredResponses.length - successfulResponses
      }
    });

  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({
      error: 'Failed to process prompt',
      message: error.message
    });
  }
};

/**
 * GET /api/prompts - Récupérer l'historique des prompts
 */
export const getPrompts = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { limit = 20, skip = 0, status } = req.query;

    const query = userId ? { userId } : {};
    if (status) query.status = status;

    const prompts = await Prompt.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-__v');

    const total = await Prompt.countDocuments(query);

    res.json({
      prompts,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: skip + prompts.length < total
      }
    });

  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({
      error: 'Failed to fetch prompts',
      message: error.message
    });
  }
};

/**
 * GET /api/prompts/:id - Récupérer un prompt spécifique avec ses réponses
 */
export const getPromptById = async (req, res) => {
  try {
    const { id } = req.params;

    const prompt = await Prompt.findById(id);

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    // Récupérer toutes les réponses associées
    const responses = await Response.find({ promptId: id });

    // Générer le résumé et la matrice
    const scoringService = new ScoringService();
    const summary = scoringService.generateComparativeSummary(responses);
    const similarityMatrix = scoringService.calculateSimilarityMatrix(responses);

    res.json({
      prompt,
      responses,
      summary,
      similarityMatrix
    });

  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({
      error: 'Failed to fetch prompt',
      message: error.message
    });
  }
};

/**
 * DELETE /api/prompts/:id - Supprimer un prompt
 */
export const deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const prompt = await Prompt.findById(id);

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (userId && prompt.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Supprimer les réponses associées
    await Response.deleteMany({ promptId: id });

    // Supprimer le prompt
    await Prompt.findByIdAndDelete(id);

    res.json({ message: 'Prompt deleted successfully' });

  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({
      error: 'Failed to delete prompt',
      message: error.message
    });
  }
};

/**
 * GET /api/models - Récupérer les modèles IA disponibles
 */
export const getAvailableModels = async (req, res) => {
  try {
    const orchestrator = new OrchestratorService(req.app.locals.aiClients);
    const models = orchestrator.getAvailableModels();

    res.json({
      models,
      count: models.length
    });

  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      error: 'Failed to fetch available models',
      message: error.message
    });
  }
};

export default {
  createPrompt,
  getPrompts,
  getPromptById,
  deletePrompt,
  getAvailableModels
};
