import NLPService from './nlpService.js';

/**
 * Service de scoring et évaluation des réponses IA
 */
class ScoringService {
  constructor() {
    this.nlpService = new NLPService();
  }

  /**
   * Calcule tous les scores pour un ensemble de réponses
   * @param {object[]} responses - Tableau de réponses des différentes APIs
   * @param {string} originalPrompt - Le prompt original
   * @returns {object[]} - Réponses avec scores ajoutés
   */
  scoreAllResponses(responses, originalPrompt) {
    // Filtrer les réponses réussies
    const successfulResponses = responses.filter(r => r.status === 'success' && r.responseText);

    if (successfulResponses.length === 0) {
      return responses;
    }

    // Calculer les scores pour chaque réponse
    const scoredResponses = responses.map((response, index) => {
      if (response.status !== 'success' || !response.responseText) {
        const emptyAnalysis = this.nlpService.getEmptyAnalysis();
        return {
          ...response,
          scores: {
            relevance: null,
            similarity: null,
            sovereignty: response.sovereignty
          },
          nlpAnalysis: {
            keywords: emptyAnalysis.keywords,
            sentiment: emptyAnalysis.sentiment.sentiment,
            sentimentScore: emptyAnalysis.sentiment.score,
            topics: emptyAnalysis.topics,
            wordCount: emptyAnalysis.wordCount,
            sentenceCount: emptyAnalysis.sentenceCount
          }
        };
      }

      // Analyse NLP
      const nlpAnalysis = this.nlpService.analyzeText(response.responseText);

      // Score de pertinence (basé sur le prompt)
      const relevanceScore = this.calculateRelevanceScore(
        response.responseText,
        originalPrompt
      );

      // Score de similarité (moyenne avec toutes les autres réponses)
      const similarityScore = this.calculateAverageSimilarity(
        response.responseText,
        successfulResponses.filter((_, i) => i !== index).map(r => r.responseText)
      );

      return {
        ...response,
        scores: {
          relevance: relevanceScore,
          similarity: similarityScore,
          sovereignty: response.sovereignty
        },
        nlpAnalysis: {
          keywords: nlpAnalysis.keywords,
          sentiment: nlpAnalysis.sentiment.sentiment,
          sentimentScore: nlpAnalysis.sentiment.score,
          topics: nlpAnalysis.topics,
          wordCount: nlpAnalysis.wordCount,
          sentenceCount: nlpAnalysis.sentenceCount
        }
      };
    });

    return scoredResponses;
  }

  /**
   * Calcule le score de pertinence par rapport au prompt
   * @private
   * @param {string} response - La réponse de l'IA
   * @param {string} prompt - Le prompt original
   * @returns {number} - Score de 0 à 100
   */
  calculateRelevanceScore(response, prompt) {
    try {
      // Critères de pertinence
      let score = 0;

      // 1. Similarité textuelle avec le prompt (40 points)
      const similarity = this.nlpService.calculateSimilarity(response, prompt);
      score += similarity * 40;

      // 2. Longueur de la réponse (20 points)
      const wordCount = this.nlpService.countWords(response);
      if (wordCount > 20 && wordCount < 500) {
        score += 20;
      } else if (wordCount >= 10) {
        score += 10;
      }

      // 3. Présence de mots-clés du prompt dans la réponse (40 points)
      const promptKeywords = this.nlpService.extractKeywords(prompt, 5);
      const responseText = response.toLowerCase();

      let keywordMatches = 0;
      promptKeywords.forEach(kw => {
        if (responseText.includes(kw.word.toLowerCase())) {
          keywordMatches++;
        }
      });

      if (promptKeywords.length > 0) {
        score += (keywordMatches / promptKeywords.length) * 40;
      }

      return Math.round(Math.min(100, Math.max(0, score)));
    } catch (error) {
      console.error('Error calculating relevance score:', error);
      return 50; // Score par défaut en cas d'erreur
    }
  }

  /**
   * Calcule la similarité moyenne avec les autres réponses
   * @private
   * @param {string} response - La réponse à évaluer
   * @param {string[]} otherResponses - Les autres réponses
   * @returns {number} - Score de 0 à 100
   */
  calculateAverageSimilarity(response, otherResponses) {
    if (otherResponses.length === 0) {
      return 100; // Si c'est la seule réponse, score max
    }

    try {
      const similarities = otherResponses.map(other =>
        this.nlpService.calculateSimilarity(response, other)
      );

      const avgSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;

      return Math.round(avgSimilarity * 100);
    } catch (error) {
      console.error('Error calculating similarity score:', error);
      return 50;
    }
  }

  /**
   * Calcule une matrice de similarité entre toutes les réponses
   * @param {object[]} responses - Tableau des réponses
   * @returns {number[][]} - Matrice de similarité
   */
  calculateSimilarityMatrix(responses) {
    const successfulResponses = responses.filter(r => r.status === 'success' && r.responseText);

    if (successfulResponses.length < 2) {
      return [];
    }

    const matrix = [];

    for (let i = 0; i < successfulResponses.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < successfulResponses.length; j++) {
        if (i === j) {
          matrix[i][j] = 100; // Similarité avec soi-même = 100%
        } else {
          const similarity = this.nlpService.calculateSimilarity(
            successfulResponses[i].responseText,
            successfulResponses[j].responseText
          );
          matrix[i][j] = Math.round(similarity * 100);
        }
      }
    }

    return matrix;
  }

  /**
   * Génère un résumé comparatif des réponses
   * @param {object[]} responses - Réponses avec scores
   * @returns {object} - Statistiques et insights
   */
  generateComparativeSummary(responses) {
    const successfulResponses = responses.filter(r => r.status === 'success');

    if (successfulResponses.length === 0) {
      return {
        totalResponses: responses.length,
        successfulResponses: 0,
        failedResponses: responses.length,
        averageRelevance: 0,
        averageSimilarity: 0,
        bestResponse: null,
        worstResponse: null,
        consensusLevel: 0,
        sovereigntyDistribution: {}
      };
    }

    // Calculer les moyennes
    const avgRelevance = successfulResponses.reduce((sum, r) =>
      sum + (r.scores?.relevance || 0), 0
    ) / successfulResponses.length;

    const avgSimilarity = successfulResponses.reduce((sum, r) =>
      sum + (r.scores?.similarity || 0), 0
    ) / successfulResponses.length;

    // Trouver la meilleure et pire réponse
    const sortedByRelevance = [...successfulResponses].sort((a, b) =>
      (b.scores?.relevance || 0) - (a.scores?.relevance || 0)
    );

    // Distribution de souveraineté
    const sovereigntyDist = {};
    responses.forEach(r => {
      const location = r.sovereignty?.serverLocation || 'UNKNOWN';
      sovereigntyDist[location] = (sovereigntyDist[location] || 0) + 1;
    });

    return {
      totalResponses: responses.length,
      successfulResponses: successfulResponses.length,
      failedResponses: responses.length - successfulResponses.length,
      averageRelevance: Math.round(avgRelevance),
      averageSimilarity: Math.round(avgSimilarity),
      averageResponseTime: Math.round(
        responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length
      ),
      bestResponse: {
        model: sortedByRelevance[0]?.model,
        relevance: sortedByRelevance[0]?.scores?.relevance
      },
      worstResponse: {
        model: sortedByRelevance[sortedByRelevance.length - 1]?.model,
        relevance: sortedByRelevance[sortedByRelevance.length - 1]?.scores?.relevance
      },
      consensusLevel: avgSimilarity, // Niveau de consensus entre les réponses
      sovereigntyDistribution: sovereigntyDist
    };
  }
}

export default ScoringService;
