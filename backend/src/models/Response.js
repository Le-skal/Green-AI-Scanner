import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  promptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    required: true,
    index: true
  },
  aiModel: {
    type: String,
    enum: ['gemini', 'mistral', 'huggingface', 'cohere'],
    required: true
  },
  responseText: {
    type: String,
    required: false, // Peut être vide en cas d'erreur
    default: ''
  },
  responseTime: {
    type: Number, // en millisecondes
    required: true
  },
  tokens: {
    input: { type: Number, default: 0 },
    output: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  // Scores d'évaluation
  scores: {
    // Score de pertinence (0-100)
    relevance: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    // Score de similarité avec les autres réponses (0-100)
    similarity: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    // Scoring de souveraineté des données
    sovereignty: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        required: false
      },
      serverLocation: {
        type: String,
        required: false,
        enum: ['USA', 'EU', 'ASIA', 'OTHER']
      },
      rgpdCompliant: {
        type: Boolean,
        required: false
      },
      cloudProvider: {
        type: String,
        required: false
      },
      dataRetention: {
        type: String,
        default: 'Unknown'
      }
    }
  },
  // Analyse NLP de la réponse
  nlpAnalysis: {
    keywords: [{
      word: String,
      count: Number,
      relevance: Number
    }],
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'mixed'],
      default: 'neutral'
    },
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
      default: 0
    },
    topics: [String],
    wordCount: { type: Number, default: 0 },
    sentenceCount: { type: Number, default: 0 }
  },
  // Statut de la réponse
  status: {
    type: String,
    enum: ['success', 'failed', 'timeout'],
    default: 'success'
  },
  error: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index composé pour recherche efficace
responseSchema.index({ promptId: 1, aiModel: 1 });
responseSchema.index({ aiModel: 1, createdAt: -1 });

// Méthode virtuelle pour calculer le score global
responseSchema.virtual('overallScore').get(function() {
  const { relevance, similarity, sovereignty } = this.scores;
  const weights = {
    relevance: 0.4,
    similarity: 0.3,
    sovereignty: 0.3
  };

  return (
    (relevance || 0) * weights.relevance +
    (similarity || 0) * weights.similarity +
    (sovereignty?.score || 0) * weights.sovereignty
  );
});

// S'assurer que les virtuels sont inclus dans JSON
responseSchema.set('toJSON', { virtuals: true });
responseSchema.set('toObject', { virtuals: true });

const Response = mongoose.model('Response', responseSchema);

export default Response;
