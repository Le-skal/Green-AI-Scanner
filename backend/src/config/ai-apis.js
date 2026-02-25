import { GoogleGenerativeAI } from '@google/generative-ai';
import MistralClient from '@mistralai/mistralai';
import { HfInference } from '@huggingface/inference';
import { CohereClient } from 'cohere-ai';

/**
 * Configuration des clients API IA gratuites
 */

// Google Gemini
export const initGemini = () => {
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.warn('Google Gemini API key not found');
    return null;
  }
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  console.log('Google Gemini initialized');
  return genAI;
};

// Mistral AI
export const initMistral = () => {
  if (!process.env.MISTRAL_API_KEY) {
    console.warn('Mistral API key not found');
    return null;
  }
  const client = new MistralClient(process.env.MISTRAL_API_KEY);
  console.log('Mistral AI initialized');
  return client;
};

// Hugging Face
export const initHuggingFace = () => {
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.warn('Hugging Face API key not found');
    return null;
  }
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY, {
    baseUrl: 'https://router.huggingface.co'
  });
  console.log('Hugging Face initialized (using router.huggingface.co)');
  return hf;
};

// Cohere
export const initCohere = () => {
  if (!process.env.COHERE_API_KEY) {
    console.warn('Cohere API key not found');
    return null;
  }
  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });
  console.log('Cohere initialized');
  return cohere;
};

/**
 * Métadonnées détaillées pour le calcul dynamique de souveraineté et Green IT
 * Ces données sont utilisées par SovereigntyService et GreenITService
 */
export const AI_SOVEREIGNTY_DATA = {
  gemini: {
    // Localisation et infrastructure
    serverLocation: 'USA',              // Pour GreenIT (intensité carbone) et Souveraineté
    companyNationality: 'USA',          // Pour calcul souveraineté (30 pts)
    cloudProvider: 'Google Cloud',
    dataRetention: '30 days',

    // Conformité et licence
    rgpdCompliant: true,                // Partiel (Privacy Shield)
    licenseType: 'Proprietary',         // Pour calcul souveraineté (20 pts)

    // Métadonnées supplémentaires
    description: 'Serveurs principalement aux USA, conformité RGPD partielle via Privacy Shield'
  },
  mistral: {
    // Localisation et infrastructure
    serverLocation: 'France',           // EU optimisé pour Green IT
    companyNationality: 'France',       // Entreprise française
    cloudProvider: 'European Cloud (Scaleway)',
    dataRetention: 'No retention',

    // Conformité et licence
    rgpdCompliant: true,                // Full RGPD compliance
    licenseType: 'Open Weights',        // Modèle ouvert (Apache 2.0)

    // Métadonnées supplémentaires
    description: 'Solution souveraine européenne, serveurs en France, RGPD complet'
  },
  huggingface: {
    // Localisation et infrastructure
    serverLocation: 'USA',              // Infrastructure mixte EU/USA
    companyNationality: 'USA',          // Entreprise américaine
    cloudProvider: 'AWS/Azure (Multi-cloud)',
    dataRetention: 'Variable',          // Dépend du modèle

    // Conformité et licence
    rgpdCompliant: true,                // Via modèles EU-hosted
    licenseType: 'Open Source',         // Plateforme open source

    // Métadonnées supplémentaires
    description: 'Open source, localisation variable selon le modèle, communauté mondiale'
  },
  cohere: {
    // Localisation et infrastructure
    serverLocation: 'USA',              // Canada/USA
    companyNationality: 'USA',          // Entreprise canadienne (considéré USA pour simplicité)
    cloudProvider: 'AWS',
    dataRetention: '90 days',

    // Conformité et licence
    rgpdCompliant: false,               // Conformité RGPD limitée
    licenseType: 'Proprietary',         // Modèle fermé

    // Métadonnées supplémentaires
    description: 'Serveurs USA/Canada, conformité RGPD limitée, modèle propriétaire'
  }
};

/**
 * Configuration des modèles par API
 */
export const AI_MODELS_CONFIG = {
  gemini: {
    model: 'gemini-2.5-flash', // Modèle gratuit mis à jour (Google AI Studio 2025)
    maxTokens: 2048,
    temperature: 0.7,
    rateLimit: 60, // requêtes par minute
    description: 'Google Gemini Pro - Gratuit'
  },
  mistral: {
    model: 'mistral-tiny',
    maxTokens: 2048,
    temperature: 0.7,
    rateLimit: 10,
    description: 'Mistral Tiny - Gratuit'
  },
  huggingface: {
    model: 'meta-llama/Llama-3.2-3B-Instruct',
    maxTokens: 1024,
    temperature: 0.7,
    rateLimit: 100,
    description: 'Meta Llama 3.2 3B via Hugging Face - Gratuit',
    alternatives: [
      'meta-llama/Llama-3.2-1B-Instruct',
      'microsoft/Phi-3.5-mini-instruct',
      'Qwen/Qwen2.5-Coder-7B-Instruct'
    ]
  },
  cohere: {
    model: 'command-r-08-2024', // Updated: 'command' was deprecated Sept 15, 2025
    maxTokens: 2048,
    temperature: 0.7,
    rateLimit: 5000, // par mois
    description: 'Cohere Command - Gratuit (5000/mois)'
  }
};

/**
 * Initialise tous les clients API disponibles
 */
export const initAllAIClients = () => {
  const clients = {
    gemini: initGemini(),
    mistral: initMistral(),
    huggingface: initHuggingFace(),
    cohere: initCohere()
  };

  // Filtrer les clients non initialisés
  const activeClients = Object.entries(clients)
    .filter(([_, client]) => client !== null)
    .reduce((acc, [key, client]) => ({ ...acc, [key]: client }), {});

  console.log(`\nActive AI APIs: ${Object.keys(activeClients).join(', ')}\n`);

  return activeClients;
};

export default {
  initGemini,
  initMistral,
  initHuggingFace,
  initCohere,
  initAllAIClients,
  AI_SOVEREIGNTY_DATA,
  AI_MODELS_CONFIG
};
