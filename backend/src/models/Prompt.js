import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optionnel pour permettre l'usage sans authentification
    index: true
  },
  promptText: {
    type: String,
    required: [true, 'Prompt text is required'],
    trim: true,
    minlength: [3, 'Prompt must be at least 3 characters long'],
    maxlength: [2000, 'Prompt must not exceed 2000 characters']
  },
  aiModels: [{
    type: String,
    enum: ['gemini', 'mistral', 'huggingface', 'cohere'],
    required: true
  }],
  // Paramètres optionnels pour la requête
  parameters: {
    temperature: { type: Number, default: 0.7, min: 0, max: 1 },
    maxTokens: { type: Number, default: 500, min: 50, max: 2000 }
  },
  // Statut du prompt
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  // Métadonnées
  metadata: {
    processingTime: { type: Number }, // en millisecondes
    totalResponses: { type: Number, default: 0 },
    successfulResponses: { type: Number, default: 0 },
    failedResponses: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
promptSchema.index({ userId: 1, createdAt: -1 });
promptSchema.index({ status: 1 });

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;
