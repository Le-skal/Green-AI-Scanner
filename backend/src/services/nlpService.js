import natural from 'natural';
import compromise from 'compromise';

/**
 * Service d'analyse NLP (Natural Language Processing)
 */
class NLPService {
  constructor() {
    // Tokenizer pour compter les mots
    this.tokenizer = new natural.WordTokenizer();

    // Analyseur de sentiment
    this.sentimentAnalyzer = new natural.SentimentAnalyzer(
      'English',
      natural.PorterStemmer,
      'afinn'
    );
  }

  /**
   * Analyse complète d'un texte
   * @param {string} text - Le texte à analyser
   * @returns {object} - Résultats de l'analyse
   */
  analyzeText(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyAnalysis();
    }

    return {
      keywords: this.extractKeywords(text),
      sentiment: this.analyzeSentiment(text),
      topics: this.extractTopics(text),
      wordCount: this.countWords(text),
      sentenceCount: this.countSentences(text),
      readability: this.calculateReadability(text)
    };
  }

  /**
   * Extrait les mots-clés importants du texte
   * @private
   */
  extractKeywords(text, limit = 10) {
    try {
      // Tokenize et nettoyer
      const tokens = this.tokenizer.tokenize(text.toLowerCase());

      // Supprimer les stop words et mots courts
      const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how']);

      const filteredTokens = tokens.filter(token =>
        token.length > 3 &&
        !stopWords.has(token) &&
        /^[a-z]+$/.test(token)
      );

      // Compter les occurrences
      const frequency = {};
      filteredTokens.forEach(token => {
        frequency[token] = (frequency[token] || 0) + 1;
      });

      // Trier par fréquence et limiter
      const sortedKeywords = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word, count]) => ({
          word,
          count,
          relevance: count / filteredTokens.length
        }));

      return sortedKeywords;
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return [];
    }
  }

  /**
   * Analyse le sentiment du texte
   * @private
   */
  analyzeSentiment(text) {
    try {
      const tokens = this.tokenizer.tokenize(text.toLowerCase());
      const score = this.sentimentAnalyzer.getSentiment(tokens);

      let sentiment;
      if (score > 0.2) sentiment = 'positive';
      else if (score < -0.2) sentiment = 'negative';
      else sentiment = 'neutral';

      return {
        sentiment,
        score: Math.max(-1, Math.min(1, score)) // Normaliser entre -1 et 1
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return { sentiment: 'neutral', score: 0 };
    }
  }

  /**
   * Extrait les topics/thèmes du texte
   * @private
   */
  extractTopics(text) {
    try {
      const doc = compromise(text);

      // Extraire différents types d'entités
      const topics = new Set();

      // Noms propres (personnes, lieux, organisations)
      doc.people().forEach(person => topics.add(person.text()));
      doc.places().forEach(place => topics.add(place.text()));
      doc.organizations().forEach(org => topics.add(org.text()));

      // Sujets importants (noms communs fréquents)
      const nouns = doc.nouns().out('array');
      nouns.slice(0, 5).forEach(noun => topics.add(noun));

      return Array.from(topics).slice(0, 10);
    } catch (error) {
      console.error('Error extracting topics:', error);
      return [];
    }
  }

  /**
   * Compte le nombre de mots
   * @private
   */
  countWords(text) {
    const tokens = this.tokenizer.tokenize(text);
    return tokens ? tokens.length : 0;
  }

  /**
   * Compte le nombre de phrases
   * @private
   */
  countSentences(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length;
  }

  /**
   * Calcule un score de lisibilité
   * @private
   */
  calculateReadability(text) {
    const wordCount = this.countWords(text);
    const sentenceCount = this.countSentences(text);

    if (sentenceCount === 0) return 0;

    // Formule simplifiée de Flesch Reading Ease
    const avgWordsPerSentence = wordCount / sentenceCount;
    const score = 100 - avgWordsPerSentence * 1.5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Retourne une analyse vide
   * @private
   */
  getEmptyAnalysis() {
    return {
      keywords: [],
      sentiment: { sentiment: 'neutral', score: 0 },
      topics: [],
      wordCount: 0,
      sentenceCount: 0,
      readability: 0
    };
  }

  /**
   * Compare la similarité entre deux textes
   * @param {string} text1
   * @param {string} text2
   * @returns {number} - Score de similarité (0-1)
   */
  calculateSimilarity(text1, text2) {
    try {
      const tokens1 = new Set(this.tokenizer.tokenize(text1.toLowerCase()));
      const tokens2 = new Set(this.tokenizer.tokenize(text2.toLowerCase()));

      // Coefficient de Jaccard
      const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
      const union = new Set([...tokens1, ...tokens2]);

      return intersection.size / union.size;
    } catch (error) {
      console.error('Error calculating similarity:', error);
      return 0;
    }
  }
}

export default NLPService;
