import { AI_MODELS_CONFIG } from '../../config/ai-apis.js';

/**
 * Service dedicated to Mistral AI interactions
 * Single Responsibility: Handle only Mistral API calls
 */
class MistralService {
  constructor(client) {
    if (!client) {
      throw new Error('Mistral client is required');
    }
    this.client = client;
    this.modelConfig = AI_MODELS_CONFIG.mistral;
  }

  /**
   * Send a prompt to Mistral and get response
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
        model: this.modelConfig.model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens
      });

      return {
        text: response.choices[0].message.content,
        tokens: {
          input: response.usage?.prompt_tokens || 0,
          output: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        }
      };

    } catch (error) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      id: 'mistral',
      name: this.modelConfig.description,
      model: this.modelConfig.model
    };
  }
}

export default MistralService;
