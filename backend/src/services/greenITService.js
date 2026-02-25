/**
 * Green IT Service - Calcul de l'impact écologique des requêtes IA
 * Basé sur les meilleures pratiques Green IT et calculs scientifiques
 *
 * Références:
 * - PromptOptim (Green IT calculation)
 * - Energy consumption data from AI model providers
 */
class GreenITService {
  constructor() {
    // Consommation énergétique par modèle (kWh pour 1000 tokens)
    // Sources: Documentation providers + études académiques
    this.ENERGY_PER_1K_TOKENS = {
      gemini: 0.005,      // Google Gemini (optimisé mais datacenter USA)
      mistral: 0.002,     // Mistral (plus sobre, infra EU optimisée)
      huggingface: 0.004, // Hugging Face (variable selon modèle)
      cohere: 0.006       // Cohere (architecture moins optimisée)
    };

    // Intensité carbone par pays (grammes CO2 par kWh)
    // Source: IEA (International Energy Agency) 2024
    this.CARBON_INTENSITY = {
      'France': 50.0,    // Mix nucléaire/renouvelable
      'EU': 250.0,       // Moyenne européenne
      'USA': 380.0,      // Mix charbon/gaz dominant
      'Other': 500.0     // Pays sans data (conservative)
    };

    // Facteur temporel (heures de pointe = consommation électrique élevée)
    this.TIME_FACTOR_PEAK = 1.2;    // Entre 18h-22h
    this.TIME_FACTOR_NORMAL = 1.0;  // Reste du temps
  }

  /**
   * Calcule l'impact écologique d'une réponse IA
   * @param {object} response - Réponse du modèle IA
   * @param {string} modelId - Identifiant du modèle (gemini, mistral, etc.)
   * @param {string} serverLocation - Localisation du serveur (France, EU, USA, Other)
   * @returns {object} - Impact écologique détaillé
   */
  calculateImpact(response, modelId, serverLocation) {
    const tokens = response.tokens?.total || 0;

    if (tokens === 0) {
      return this.getEmptyImpact();
    }

    // 1. Calcul de la consommation énergétique
    const energyPerToken = this.ENERGY_PER_1K_TOKENS[modelId] || 0.005;
    const energyConsumedKwh = (tokens / 1000) * energyPerToken;

    // 2. Facteur temporel (si on est en heures de pointe)
    const timeFactor = this.getTimeFactor();

    // 3. Intensité carbone selon la localisation
    const carbonIntensity = this.CARBON_INTENSITY[serverLocation] || this.CARBON_INTENSITY['Other'];

    // 4. Impact CO2 (grammes)
    const co2ImpactGrams = energyConsumedKwh * carbonIntensity * timeFactor;

    // 5. Eco-Score (A à E, comme Nutri-score)
    const ecoScore = this.calculateEcoScore(co2ImpactGrams, tokens);

    // 6. Équivalences pour mieux comprendre l'impact
    const equivalences = this.calculateEquivalences(co2ImpactGrams);

    return {
      tokens: {
        total: tokens,
        input: response.tokens?.input || 0,
        output: response.tokens?.output || 0
      },
      energy: {
        consumedKwh: parseFloat(energyConsumedKwh.toFixed(6)),
        perToken: energyPerToken,
        timeFactor: timeFactor
      },
      carbon: {
        impactGrams: parseFloat(co2ImpactGrams.toFixed(4)),
        intensity: carbonIntensity,
        location: serverLocation
      },
      ecoScore: ecoScore,
      equivalences: equivalences,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Détermine le facteur temporel selon l'heure
   * @private
   */
  getTimeFactor() {
    const hour = new Date().getHours();
    // Heures de pointe: 18h-22h
    if (hour >= 18 && hour < 22) {
      return this.TIME_FACTOR_PEAK;
    }
    return this.TIME_FACTOR_NORMAL;
  }

  /**
   * Calcule l'Eco-Score (A à E)
   * Basé sur les grammes de CO2 par token
   * @private
   */
  calculateEcoScore(co2Grams, tokens) {
    const co2PerToken = tokens > 0 ? co2Grams / tokens : 0;

    // Seuils basés sur les benchmarks de l'industrie
    if (co2PerToken <= 0.0001) return 'A';      // Très sobre (Mistral EU)
    if (co2PerToken <= 0.0005) return 'B';      // Sobre
    if (co2PerToken <= 0.001) return 'C';       // Moyen
    if (co2PerToken <= 0.002) return 'D';       // Élevé
    return 'E';                                  // Très élevé
  }

  /**
   * Calcule des équivalences pour mieux comprendre l'impact
   * @private
   */
  calculateEquivalences(co2Grams) {
    return {
      // Équivalent en km de voiture (120g CO2/km en moyenne)
      carKm: parseFloat((co2Grams / 120).toFixed(4)),

      // Équivalent en charge de smartphone (8.22g CO2 par charge complète)
      smartphoneCharges: parseFloat((co2Grams / 8.22).toFixed(4)),

      // Équivalent en minutes de streaming vidéo (2.4g CO2/min en HD)
      streamingMinutes: parseFloat((co2Grams / 2.4).toFixed(2)),

      // Arbres nécessaires pour compenser (1 arbre absorbe ~21kg CO2/an)
      treesPerYear: parseFloat((co2Grams / 21000).toFixed(6))
    };
  }

  /**
   * Compare deux réponses et calcule les économies potentielles
   * Utile pour comparer différents modèles
   */
  compareImpacts(impact1, impact2) {
    const energySaved = impact1.energy.consumedKwh - impact2.energy.consumedKwh;
    const co2Saved = impact1.carbon.impactGrams - impact2.carbon.impactGrams;

    return {
      energySavedKwh: parseFloat(energySaved.toFixed(6)),
      co2SavedGrams: parseFloat(co2Saved.toFixed(4)),
      percentageSaved: parseFloat(((co2Saved / impact1.carbon.impactGrams) * 100).toFixed(2)),
      recommendation: co2Saved > 0
        ? `Use ${impact2.carbon.location}-based model for better eco-score`
        : `Current model is more eco-friendly`
    };
  }

  /**
   * Retourne un impact vide pour les réponses en échec
   * @private
   */
  getEmptyImpact() {
    return {
      tokens: { total: 0, input: 0, output: 0 },
      energy: { consumedKwh: 0, perToken: 0, timeFactor: 1.0 },
      carbon: { impactGrams: 0, intensity: 0, location: 'Unknown' },
      ecoScore: 'N/A',
      equivalences: {
        carKm: 0,
        smartphoneCharges: 0,
        streamingMinutes: 0,
        treesPerYear: 0
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calcule l'impact total pour un ensemble de réponses
   */
  calculateTotalImpact(impacts) {
    const totalCO2 = impacts.reduce((sum, impact) => sum + (impact.carbon?.impactGrams || 0), 0);
    const totalEnergy = impacts.reduce((sum, impact) => sum + (impact.energy?.consumedKwh || 0), 0);
    const totalTokens = impacts.reduce((sum, impact) => sum + (impact.tokens?.total || 0), 0);

    return {
      totalCO2Grams: parseFloat(totalCO2.toFixed(4)),
      totalEnergyKwh: parseFloat(totalEnergy.toFixed(6)),
      totalTokens: totalTokens,
      averageCO2PerToken: totalTokens > 0 ? parseFloat((totalCO2 / totalTokens).toFixed(6)) : 0,
      modelsCount: impacts.length
    };
  }
}

export default GreenITService;
