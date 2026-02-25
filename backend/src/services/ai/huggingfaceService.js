import { AI_MODELS_CONFIG } from '../../config/ai-apis.js';

/**
 * Service dedicated to Hugging Face AI interactions
 * Single Responsibility: Handle only Hugging Face API calls
 */
class HuggingFaceService {
  constructor(client) {
    if (!client) {
      throw new Error('Hugging Face client is required');
    }
    this.client = client;
    this.modelConfig = AI_MODELS_CONFIG.huggingface;
  }

  /**
   * Send a prompt to Hugging Face and get response
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
      const result = await this.client.chatCompletion({
        model: this.modelConfig.model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature
      });

      const text = result.choices[0].message.content;

      return {
        text,
        tokens: {
          input: result.usage?.prompt_tokens || Math.ceil(prompt.length / 4),
          output: result.usage?.completion_tokens || Math.ceil(text.length / 4),
          total: result.usage?.total_tokens || Math.ceil((prompt.length + text.length) / 4)
        }
      };

    } catch (error) {
      throw new Error(`Hugging Face API error: ${error.message}`);
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      id: 'huggingface',
      name: this.modelConfig.description,
      model: this.modelConfig.model
    };
  }
}

export default HuggingFaceService;
