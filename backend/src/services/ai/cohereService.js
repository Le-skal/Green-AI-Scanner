import { AI_MODELS_CONFIG } from '../../config/ai-apis.js';

/**
 * Service dedicated to Cohere AI interactions
 * Single Responsibility: Handle only Cohere API calls
 */
class CohereService {
  constructor(client) {
    if (!client) {
      throw new Error('Cohere client is required');
    }
    this.client = client;
    this.modelConfig = AI_MODELS_CONFIG.cohere;
  }

  /**
   * Send a prompt to Cohere and get response
   * @param {string} prompt - The text prompt
   * @param {object} options - Configuration options
   * @returns {Promise<object>} Response with text and tokens
   */
  async generateResponse(prompt, options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 500
    } = options;

    try {
      const response = await this.client.chat({
        message: prompt,
        model: this.modelConfig.model,
        max_tokens: maxTokens,
        temperature
      });

      const text = response.text;

      return {
        text,
        tokens: {
          input: response.meta?.tokens?.input_tokens || Math.ceil(prompt.length / 4),
          output: response.meta?.tokens?.output_tokens || Math.ceil(text.length / 4),
          total: (response.meta?.tokens?.input_tokens || 0) + (response.meta?.tokens?.output_tokens || 0) || Math.ceil((prompt.length + text.length) / 4)
        }
      };

    } catch (error) {
      throw new Error(`Cohere API error: ${error.message}`);
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      id: 'cohere',
      name: this.modelConfig.description,
      model: this.modelConfig.model
    };
  }
}

export default CohereService;
