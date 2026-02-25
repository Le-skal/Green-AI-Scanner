import { AI_SOVEREIGNTY_DATA, AI_MODELS_CONFIG } from '../../config/ai-apis.js';
import GeminiService from './geminiService.js';
import MistralService from './mistralService.js';
import HuggingFaceService from './huggingfaceService.js';
import CohereService from './cohereService.js';

/**
 * Orchestrator Service - Coordinates multiple AI services
 * Single Responsibility: Orchestrate parallel AI calls and aggregate results
 * No direct API calls - delegates to specialized services
 */
class OrchestratorService {
  constructor(aiClients) {
    this.services = this.initializeServices(aiClients);
  }

  /**
   * Initialize AI services based on available clients
   * @private
   */
  initializeServices(aiClients) {
    const services = {};

    if (aiClients.gemini) {
      services.gemini = new GeminiService(aiClients.gemini);
    }

    if (aiClients.mistral) {
      services.mistral = new MistralService(aiClients.mistral);
    }

    if (aiClients.huggingface) {
      services.huggingface = new HuggingFaceService(aiClients.huggingface);
    }

    if (aiClients.cohere) {
      services.cohere = new CohereService(aiClients.cohere);
    }

    return services;
  }

  /**
   * Aggregate responses from multiple AI models in parallel
   * @param {string} prompt - The text prompt
   * @param {string[]} models - List of models to query
   * @param {object} options - Configuration options
   * @returns {Promise<object[]>} Array of responses
   */
  async aggregateResponses(prompt, models = [], options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 500,
      timeout = 30000
    } = options;

    console.log(`\nAggregating responses for prompt: "${prompt.substring(0, 50)}..."`);
    console.log(`Models requested: ${models.join(', ')}`);

    const availableModels = models.filter(model => this.services[model]);

    if (availableModels.length === 0) {
      throw new Error('No AI models available. Please configure API keys.');
    }

    console.log(`Available models: ${availableModels.join(', ')}`);

    const promises = availableModels.map(model =>
      this.queryModel(model, prompt, { temperature, maxTokens, timeout })
    );

    const results = await Promise.all(promises);

    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`Aggregation complete: ${successCount}/${results.length} successful\n`);

    return results;
  }

  /**
   * Query a single AI model with timeout and error handling
   * @private
   */
  async queryModel(model, prompt, options) {
    const startTime = Date.now();

    try {
      console.log(`Querying ${model}...`);

      const service = this.services[model];

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), options.timeout)
      );

      const apiCall = service.generateResponse(prompt, {
        temperature: options.temperature,
        maxTokens: options.maxTokens
      });

      const result = await Promise.race([apiCall, timeoutPromise]);
      const responseTime = Date.now() - startTime;

      console.log(`${model} responded in ${responseTime}ms`);

      return {
        model,
        responseText: result.text,
        responseTime,
        tokens: result.tokens,
        sovereignty: AI_SOVEREIGNTY_DATA[model],
        status: 'success',
        error: null
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`${model} failed: ${error.message}`);

      return {
        model,
        responseText: null,
        responseTime,
        tokens: { input: 0, output: 0, total: 0 },
        sovereignty: AI_SOVEREIGNTY_DATA[model],
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Get available models with their configuration
   */
  getAvailableModels() {
    return Object.keys(this.services).map(model => ({
      id: model,
      name: AI_MODELS_CONFIG[model].description,
      config: AI_MODELS_CONFIG[model],
      sovereignty: AI_SOVEREIGNTY_DATA[model]
    }));
  }
}

export default OrchestratorService;
