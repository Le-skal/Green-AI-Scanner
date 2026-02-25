/**
 * Sovereignty Service - Calcul dynamique de la souveraineté des données
 * Basé sur trois critères scientifiques:
 * - Hosting (50 pts): Localisation des serveurs
 * - Company (30 pts): Nationalité de l'entreprise
 * - License (20 pts): Type de licence (Open Source vs Propriétaire)
 *
 * Référence: PromptOptim (Souveraineté détaillée)
 */
class SovereigntyService {
  constructor() {
    // Scores par localisation de serveur (sur 50 points)
    this.HOSTING_SCORES = {
      'France': 50,
      'EU': 40,
      'USA': 20,
      'China': 10,
      'Other': 15
    };

    // Scores par nationalité d'entreprise (sur 30 points)
    this.COMPANY_SCORES = {
      'France': 30,
      'EU': 25,
      'USA': 15,
      'China': 5,
      'Other': 10
    };

    // Scores par type de licence (sur 20 points)
    this.LICENSE_SCORES = {
      'Open Source': 20,        // Apache, MIT, GPL
      'Open Weights': 15,       // Modèle ouvert mais pas le code
      'Proprietary': 5,         // Fermé
      'Unknown': 0
    };

    // Seuil pour le Cloud Act Risk
    this.CLOUD_ACT_THRESHOLD = 50;
  }

  /**
   * Calcule le score de souveraineté complet
   * @param {object} modelMetadata - Métadonnées du modèle IA
   * @returns {object} - Score de souveraineté détaillé
   */
  calculateSovereignty(modelMetadata) {
    const {
      serverLocation = 'Other',
      companyNationality = 'Other',
      licenseType = 'Unknown',
      cloudProvider = 'Unknown',
      dataRetention = 'Unknown',
      rgpdCompliant = false
    } = modelMetadata;

    // 1. Score Hosting (50 pts max)
    const hostingScore = this.HOSTING_SCORES[serverLocation] || this.HOSTING_SCORES['Other'];

    // 2. Score Company (30 pts max)
    const companyScore = this.COMPANY_SCORES[companyNationality] || this.COMPANY_SCORES['Other'];

    // 3. Score License (20 pts max)
    const licenseScore = this.LICENSE_SCORES[licenseType] || this.LICENSE_SCORES['Unknown'];

    // 4. Score total (sur 100)
    const totalScore = hostingScore + companyScore + licenseScore;

    // 5. Cloud Act Risk (si score < 50, données accessibles par USA)
    const cloudActRisk = totalScore < this.CLOUD_ACT_THRESHOLD;

    // 6. RGPD Compliance bonus/malus
    const rgpdStatus = this.calculateRGPDStatus(rgpdCompliant, serverLocation);

    // 7. Niveau de souveraineté (texte)
    const sovereigntyLevel = this.getSovereigntyLevel(totalScore);

    // 8. Recommandations
    const recommendations = this.generateRecommendations({
      totalScore,
      cloudActRisk,
      serverLocation,
      licenseType,
      rgpdCompliant
    });

    return {
      score: totalScore,
      breakdown: {
        hosting: {
          score: hostingScore,
          maxScore: 50,
          location: serverLocation,
          percentage: parseFloat(((hostingScore / 50) * 100).toFixed(1))
        },
        company: {
          score: companyScore,
          maxScore: 30,
          nationality: companyNationality,
          percentage: parseFloat(((companyScore / 30) * 100).toFixed(1))
        },
        license: {
          score: licenseScore,
          maxScore: 20,
          type: licenseType,
          percentage: parseFloat(((licenseScore / 20) * 100).toFixed(1))
        }
      },
      rgpd: rgpdStatus,
      cloudActRisk: cloudActRisk,
      sovereigntyLevel: sovereigntyLevel,
      metadata: {
        cloudProvider,
        dataRetention,
        serverLocation,
        companyNationality,
        licenseType
      },
      recommendations: recommendations
    };
  }

  /**
   * Calcule le statut RGPD
   * @private
   */
  calculateRGPDStatus(rgpdCompliant, serverLocation) {
    const isEU = ['France', 'EU'].includes(serverLocation);

    return {
      compliant: rgpdCompliant,
      location: serverLocation,
      status: rgpdCompliant && isEU
        ? 'Full Compliance'
        : rgpdCompliant && !isEU
        ? 'Partial Compliance (Non-EU)'
        : !rgpdCompliant && isEU
        ? 'EU Location but Non-Compliant'
        : 'Non-Compliant',
      risk: rgpdCompliant ? 'Low' : 'High'
    };
  }

  /**
   * Détermine le niveau de souveraineté
   * @private
   */
  getSovereigntyLevel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Medium';
    if (score >= 20) return 'Low';
    return 'Critical';
  }

  /**
   * Génère des recommandations basées sur le score
   * @private
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    // Recommandation Cloud Act
    if (analysis.cloudActRisk) {
      recommendations.push({
        type: 'Security',
        priority: 'High',
        message: 'Cloud Act Risk detected. Consider using EU-based alternatives for sensitive data.',
        action: 'Switch to Mistral (France) or EU-based models'
      });
    }

    // Recommandation RGPD
    if (!analysis.rgpdCompliant) {
      recommendations.push({
        type: 'Compliance',
        priority: 'High',
        message: 'Model is not RGPD compliant. Avoid processing personal data.',
        action: 'Use only for non-personal data or switch to compliant model'
      });
    }

    // Recommandation Localisation
    if (analysis.serverLocation === 'USA' || analysis.serverLocation === 'China') {
      recommendations.push({
        type: 'Sovereignty',
        priority: 'Medium',
        message: `Servers located in ${analysis.serverLocation}. Data may be subject to foreign jurisdiction.`,
        action: 'Prefer EU/France-based models for data sovereignty'
      });
    }

    // Recommandation Licence
    if (analysis.licenseType === 'Proprietary') {
      recommendations.push({
        type: 'Transparency',
        priority: 'Low',
        message: 'Proprietary model with limited transparency.',
        action: 'Consider Open Source alternatives for auditability'
      });
    }

    // Si tout est bon
    if (analysis.totalScore >= 80) {
      recommendations.push({
        type: 'Success',
        priority: 'Info',
        message: 'Excellent sovereignty score. Model respects data sovereignty principles.',
        action: 'No action required'
      });
    }

    return recommendations;
  }

  /**
   * Compare la souveraineté de deux modèles
   */
  compareSovereignty(sovereignty1, sovereignty2) {
    const diff = sovereignty1.score - sovereignty2.score;

    return {
      scoreDifference: diff,
      winner: diff > 0 ? 'Model 1' : diff < 0 ? 'Model 2' : 'Equal',
      analysis: {
        hostingDiff: sovereignty1.breakdown.hosting.score - sovereignty2.breakdown.hosting.score,
        companyDiff: sovereignty1.breakdown.company.score - sovereignty2.breakdown.company.score,
        licenseDiff: sovereignty1.breakdown.license.score - sovereignty2.breakdown.license.score
      },
      recommendation: Math.abs(diff) > 20
        ? `Significant difference (${Math.abs(diff)} pts). Prefer the higher-scored model for sensitive data.`
        : `Minor difference (${Math.abs(diff)} pts). Both models have similar sovereignty levels.`
    };
  }

  /**
   * Calcule le score moyen de souveraineté pour un ensemble de modèles
   */
  calculateAverageSovereignty(sovereignties) {
    if (sovereignties.length === 0) return null;

    const totalScore = sovereignties.reduce((sum, s) => sum + s.score, 0);
    const cloudActRiskCount = sovereignties.filter(s => s.cloudActRisk).length;
    const rgpdCompliantCount = sovereignties.filter(s => s.rgpd.compliant).length;

    return {
      averageScore: parseFloat((totalScore / sovereignties.length).toFixed(2)),
      cloudActRiskPercentage: parseFloat(((cloudActRiskCount / sovereignties.length) * 100).toFixed(1)),
      rgpdCompliancePercentage: parseFloat(((rgpdCompliantCount / sovereignties.length) * 100).toFixed(1)),
      modelCount: sovereignties.length,
      sovereigntyDistribution: {
        excellent: sovereignties.filter(s => s.score >= 80).length,
        good: sovereignties.filter(s => s.score >= 60 && s.score < 80).length,
        medium: sovereignties.filter(s => s.score >= 40 && s.score < 60).length,
        low: sovereignties.filter(s => s.score < 40).length
      }
    };
  }
}

export default SovereigntyService;
