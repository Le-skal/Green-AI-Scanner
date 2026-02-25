import { AI_SOVEREIGNTY_DATA, AI_MODELS_CONFIG } from '../config/ai-apis.js';

/**
 * Service d'agrégation des réponses de plusieurs APIs IA
 */
class AIAggregatorService {
  constructor(aiClients) {
    this.clients = aiClients;
  }

  /**
   * Envoie un prompt à toutes les APIs sélectionnées
   * @param {string} prompt - Le texte du prompt
   * @param {string[]} models - Liste des modèles à utiliser ['gemini', 'mistral', etc.]
   * @param {object} options - Options de configuration
   * @returns {Promise<object[]>} - Tableau des réponses
   */
  async aggregateResponses(prompt, models = [], options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 500,
      timeout = 30000 // 30 secondes par défaut
    } = options;

    console.log(`\n🚀 Aggregating responses for prompt: "${prompt.substring(0, 50)}..."`);
    console.log(`📊 Models requested: ${models.join(', ')}`);

    // Filtrer les modèles disponibles
    const availableModels = models.filter(model => this.clients[model]);

    if (availableModels.length === 0) {
      throw new Error('No AI models available. Please configure API keys.');
    }

    console.log(` Available models: ${availableModels.join(', ')}`);

    // Créer les promesses pour chaque API
    const promises = availableModels.map(async (model) => {
      const startTime = Date.now();

      try {
        console.log(`⏳ Querying ${model}...`);

        let responseText;
        let tokens = { input: 0, output: 0, total: 0 };

        // Appeler l'API correspondante avec timeout
        const apiCall = this.callAPI(model, prompt, { temperature, maxTokens });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        );

        const result = await Promise.race([apiCall, timeoutPromise]);
        responseText = result.text;
        tokens = result.tokens || tokens;

        const responseTime = Date.now() - startTime;

        console.log(` ${model} responded in ${responseTime}ms`);

        return {
          model,
          responseText,
          responseTime,
          tokens,
          sovereignty: AI_SOVEREIGNTY_DATA[model],
          status: 'success',
          error: null
        };

      } catch (error) {
        const responseTime = Date.now() - startTime;
        console.error(`${model} failed:`, error.message);

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
    });

    // Attendre toutes les réponses
    const results = await Promise.all(promises);

    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`\n📊 Aggregation complete: ${successCount}/${results.length} successful\n`);

    return results;
  }

  /**
   * Appelle une API spécifique
   * @private
   */
  async callAPI(model, prompt, options) {
    const client = this.clients[model];

    switch (model) {
      case 'gemini':
        return await this.callGemini(client, prompt, options);

      case 'mistral':
        return await this.callMistral(client, prompt, options);

      case 'huggingface':
        return await this.callHuggingFace(client, prompt, options);

      case 'cohere':
        return await this.callCohere(client, prompt, options);

      default:
        throw new Error(`Unknown model: ${model}`);
    }
  }

  /**
   * Appel à Google Gemini
   * @private
   */
  async callGemini(client, prompt, options) {
    const model = client.getGenerativeModel({
      model: AI_MODELS_CONFIG.gemini.model
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      tokens: {
        input: prompt.length / 4, // Estimation
        output: text.length / 4,
        total: (prompt.length + text.length) / 4
      }
    };
  }

  /**
   * Appel à Mistral AI
   * @private
   */
  async callMistral(client, prompt, options) {
    const response = await client.chat({
      model: AI_MODELS_CONFIG.mistral.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature,
      max_tokens: options.maxTokens
    });

    return {
      text: response.choices[0].message.content,
      tokens: {
        input: response.usage?.prompt_tokens || 0,
        output: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0
      }
    };
  }

  /**
   * Appel à Hugging Face
   * @private
   */
  async callHuggingFace(client, prompt, options) {
    const result = await client.chatCompletion({
      model: AI_MODELS_CONFIG.huggingface.model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: options.maxTokens,
      temperature: options.temperature
    });

    const text = result.choices[0].message.content;

    return {
      text,
      tokens: {
        input: result.usage?.prompt_tokens || prompt.length / 4,
        output: result.usage?.completion_tokens || text.length / 4,
        total: result.usage?.total_tokens || (prompt.length + text.length) / 4
      }
    };
  }

  /**
   * Appel à Cohere
   * @private
   */
  async callCohere(client, prompt, options) {
    // Use Chat API (generate API was deprecated September 2025)
    const response = await client.chat({
      message: prompt,
      model: AI_MODELS_CONFIG.cohere.model,
      max_tokens: options.maxTokens,
      temperature: options.temperature
    });

    const text = response.text;

    return {
      text,
      tokens: {
        input: response.meta?.tokens?.input_tokens || prompt.length / 4,
        output: response.meta?.tokens?.output_tokens || text.length / 4,
        total: (response.meta?.tokens?.input_tokens + response.meta?.tokens?.output_tokens) || (prompt.length + text.length) / 4
      }
    };
  }

  /**
   * Retourne les modèles disponibles
   */
  getAvailableModels() {
    return Object.keys(this.clients).map(model => ({
      id: model,
      name: AI_MODELS_CONFIG[model].description,
      config: AI_MODELS_CONFIG[model],
      sovereignty: AI_SOVEREIGNTY_DATA[model]
    }));
  }
}

export default AIAggregatorService;



