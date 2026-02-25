import { AI_MODELS_CONFIG } from '../../config/ai-apis.js';

/**
 * Service dedicated to Google Gemini AI interactions
 * Single Responsibility: Handle only Gemini API calls
 */
class GeminiService {
  constructor(client) {
    if (!client) {
      throw new Error('Gemini client is required');
    }
    this.client = client;
    this.modelConfig = AI_MODELS_CONFIG.gemini;
  }

  /**
   * Send a prompt to Gemini and get response
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
      const model = this.client.getGenerativeModel({
        model: this.modelConfig.model
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        text,
        tokens: this.estimateTokens(prompt, text)
      };

    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Estimate token usage (Gemini doesn't provide exact counts)
   * @private
   */
  estimateTokens(prompt, responseText) {
    return {
      input: Math.ceil(prompt.length / 4),
      output: Math.ceil(responseText.length / 4),
      total: Math.ceil((prompt.length + responseText.length) / 4)
    };
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      id: 'gemini',
      name: this.modelConfig.description,
      model: this.modelConfig.model
    };
  }
}

export default GeminiService;
