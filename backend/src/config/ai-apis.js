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
    console.warn('⚠️  Google Gemini API key not found');
    return null;
  }
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  console.log('✅ Google Gemini initialized');
  return genAI;
};

// Mistral AI
export const initMistral = () => {
  if (!process.env.MISTRAL_API_KEY) {
    console.warn('⚠️  Mistral API key not found');
    return null;
  }
  const client = new MistralClient(process.env.MISTRAL_API_KEY);
  console.log('✅ Mistral AI initialized');
  return client;
};

// Hugging Face
export const initHuggingFace = () => {
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.warn('⚠️  Hugging Face API key not found');
    return null;
  }
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  console.log('✅ Hugging Face initialized');
  return hf;
};

// Cohere
export const initCohere = () => {
  if (!process.env.COHERE_API_KEY) {
    console.warn('⚠️  Cohere API key not found');
    return null;
  }
  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });
  console.log('✅ Cohere initialized');
  return cohere;
};

/**
 * Métadonnées de souveraineté pour chaque API
 */
export const AI_SOVEREIGNTY_DATA = {
  gemini: {
    score: 60,
    serverLocation: 'USA',
    rgpdCompliant: true,
    cloudProvider: 'Google Cloud',
    dataRetention: '30 days',
    description: 'Serveurs principalement aux USA, conformité RGPD partielle'
  },
  mistral: {
    score: 90,
    serverLocation: 'EU',
    rgpdCompliant: true,
    cloudProvider: 'European Cloud',
    dataRetention: 'No retention',
    description: 'Solution souveraine européenne, serveurs en France'
  },
  huggingface: {
    score: 70,
    serverLocation: 'USA',
    rgpdCompliant: true,
    cloudProvider: 'AWS/Azure',
    dataRetention: 'Variable',
    description: 'Open source, localisation variable selon le modèle'
  },
  cohere: {
    score: 55,
    serverLocation: 'USA',
    rgpdCompliant: false,
    cloudProvider: 'AWS',
    dataRetention: '90 days',
    description: 'Serveurs USA/Canada, conformité RGPD limitée'
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
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    maxTokens: 1024,
    temperature: 0.7,
    rateLimit: 100,
    description: 'Mistral 7B via Hugging Face - Gratuit',
    alternatives: [
      'meta-llama/Llama-2-7b-chat-hf',
      'tiiuae/falcon-7b-instruct',
      'google/flan-t5-large'
    ]
  },
  cohere: {
    model: 'command',
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

  console.log(`\n🤖 Active AI APIs: ${Object.keys(activeClients).join(', ')}\n`);

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
