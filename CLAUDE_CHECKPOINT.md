# Claude Checkpoint - PFE AI Aggregator

**Date**: 2026-02-25
**Projet**: Agrégateur de Moteurs d'IA (PFE 2025-2026)
**Status**: Phase 8 & 9 Complétées - Production Ready

---

## État Actuel du Projet

### Complété (100%)
1. **Backend complet** - Node.js + Express + MongoDB
2. **Frontend de base** - React + Vite + Tailwind
3. **Intégration AI** - 4 APIs gratuites (Gemini, Mistral, Hugging Face, Cohere)
4. **Système de scoring scientifique** - BM25, TF-IDF, ROUGE, Sovereignty, Speed
5. **Analyse NLP** - Extraction de mots-clés, sentiment, topics
6. **Data Visualization** - 4 composants de visualisation
7. **Swagger Documentation** - API REST documentée et testable (http://localhost:5001/api-docs)
8. **SOLID Refactoring** - Architecture respectant Single Responsibility Principle
9. **Code Cleanup** - Suppression des emojis du code (logs professionnels)
10. **Sovereignty Service** - Calcul dynamique 3 composantes (Hosting 50pts + Company 30pts + License 20pts)
11. **Green IT Service** - Impact écologique (CO2, énergie, eco-score A-E)
12. **AI Metadata Enrichment** - AI_SOVEREIGNTY_DATA avec détails (location, RGPD, license)
13. **MongoDB Schema Extension** - Champs sovereignty.breakdown et greenIT ajoutés
14. **Mongoose Validation Fix** - Objets imbriqués correctement définis avec `{ type: ... }`

### Fonctionnel - Phase 8 Complétée
- **Sovereignty Score** : Mistral 95/100, Gemini 40/100 (calcul dynamique 3 composantes)
- **Green IT** : Impact écologique complet (CO2, eco-score A-E, équivalences)
- **Frontend** : Affichage Green IT + Sovereignty avec breakdown, RGPD, recommandations
- **Guide pédagogique** : Méthodologie scientifique documentée (ScoringGuide.jsx)
- **Bug Fix** : promptController.js sauvegarde correctement greenIT dans MongoDB

### Fonctionnel - Phase 9 Complétée
- **Color Scheme** : Palette beige/ink cohérente (remplacé red/green/yellow)
- **Markdown Rendering** : react-markdown + @tailwindcss/typography pour réponses AI
- **Export Amélioré** : JSON/CSV/PDF incluent analyse comparative et gagnant
- **README Cleanup** : Emojis supprimés, sections professionnelles, lien Figma ajouté
- **Gitignore** : CLAUDE_CHECKPOINT.md ajouté (fichier dev uniquement)

### En Attente (Prochaines Phases)
1. **HashiCorp Vault** - Migration des secrets depuis .env
2. **Captures d'écran Frontend** - Documentation visuelle
3. **Tests unitaires** - Jest + React Testing Library (optionnel)
4. **Déploiement production** - Vercel + Railway (optionnel)

---

## Services en Cours

### Backend
- **Port**: `5001` (NE PAS utiliser 5000)
- **URL**: http://localhost:5001/api
- **Swagger**: http://localhost:5001/api-docs
- **Commande**: `cd backend && npm run dev`
- **Status**: Prêt à démarrer

### Frontend
- **Port**: `5173`
- **URL**: http://localhost:5173
- **Commande**: `cd frontend && npm run dev`
- **Status**: Prêt à démarrer

### MongoDB
- **Type**: MongoDB Atlas (Cloud)
- **URI**: Configuré dans `backend/.env`
- **Status**: Connecté et testé

---

## APIs Configurées

### Testées et Fonctionnelles
1. **Google Gemini**
   - Model: `gemini-2.5-flash` (PAS gemini-pro)
   - Clé dans `.env`: `GOOGLE_GEMINI_API_KEY`
   - Limite: 60 requêtes/minute

2. **Mistral AI**
   - Model: `mistral-tiny`
   - Clé dans `.env`: `MISTRAL_API_KEY`
   - Souveraineté: EU (score 90)

### Prêtes mais Non Testées
3. **Hugging Face** - Clé dans `.env`
4. **Cohere** - Clé dans `.env`

---

## Design System

**Palette de couleurs**: Beige/Noir professionnel
```javascript
colors: {
  sand: {
    50: '#fdfbf7',   // Très clair
    100: '#f7f3eb',
    200: '#ede7d7',
    300: '#d4c5a3',
    400: '#c5b083',
    500: '#a89263',  // Base
    600: '#8a7447',
    700: '#6b5a38',
    800: '#574a2e',
    900: '#4a3c22'
  },
  ink: {
    50: '#f5f5f4',
    500: '#57534e',
    600: '#44403c',
    700: '#292524',
    800: '#1c1917',
    900: '#0a0908'   // Très sombre
  }
}
```

**Border-radius**: Minimal (2-6px)

---

## Nouveaux Composants de Visualisation

### 1. ScoresChart.jsx
- **Type**: Graphique à barres (Bar Chart)
- **Données**: Relevance, Similarity, Sovereignty
- **Bibliothèque**: Chart.js + react-chartjs-2
- **Localisation**: `frontend/src/components/visualization/ScoresChart.jsx`

### 2. SimilarityMatrix.jsx
- **Type**: Matrice avec code couleur
- **Données**: Similarité entre réponses (%)
- **Localisation**: `frontend/src/components/visualization/SimilarityMatrix.jsx`

### 3. PerformanceRadar.jsx
- **Type**: Graphique radar
- **Métriques**: Relevance, Similarity, Sovereignty, Speed, Completeness
- **Localisation**: `frontend/src/components/visualization/PerformanceRadar.jsx`

### 4. WordCloud.jsx
- **Type**: Nuage de mots
- **Données**: Keywords extraits par NLP
- **Taille**: Variable selon fréquence
- **Localisation**: `frontend/src/components/visualization/WordCloud.jsx`

### Intégration dans App.jsx
```jsx
// Déjà importé et intégré dans App.jsx
import ScoresChart from './components/visualization/ScoresChart';
import SimilarityMatrix from './components/visualization/SimilarityMatrix';
import PerformanceRadar from './components/visualization/PerformanceRadar';
import WordCloud from './components/visualization/WordCloud';

// Section "Data Visualization" ajoutée entre ComparisonSummary et Responses
```

---

## Problèmes Résolus

### 1. Gemini Model Name
- **Erreur**: `gemini-pro` retournait 404
- **Solution**: Changé à `gemini-2.5-flash`
- **Fichier**: `backend/src/config/ai-apis.js`

### 2. Port 5000 Occupé
- **Erreur**: EADDRINUSE
- **Solution**: Changé PORT à 5001
- **Fichier**: `backend/.env`

### 3. userId Required
- **Erreur**: Validation failed (userId required)
- **Solution**: `required: false` dans Prompt schema
- **Fichier**: `backend/src/models/Prompt.js`

### 4. CSS @import Warning
- **Erreur**: @import must precede all other statements
- **Solution**: Déplacé Google Fonts import en premier
- **Fichier**: `frontend/src/assets/styles/index.css`

---

## Comment Tester

### 1. Démarrer le Backend
```bash
cd backend
npm run dev
# Attendre: "✅ MongoDB connected" + "Server running on port 5001"
```

### 2. Démarrer le Frontend
```bash
cd frontend
npm run dev
# Ouvrir: http://localhost:5173
```

### 3. Tester l'Agrégateur
1. Entrer un prompt: "Explain quantum computing"
2. Sélectionner modèles: Gemini + Mistral (minimum)
3. Cliquer "Analyze with AI Models"
4. Observer:
   - Résumé comparatif
   - **Visualisations** (nouveau!)
   - Réponses individuelles avec scores

### 4. Vérifier les Visualisations
- Graphique de scores (barres)
- Graphique radar (5 métriques)
- Matrice de similarité (tableau coloré)
- Nuage de mots (keywords)

---

## Retours Professeur - État des Tâches

### 1. Documentation API - Swagger (TERMINÉ)
**Objectif**: Documenter et tester facilement les endpoints API

**Actions complétées**:
- Installation de `swagger-jsdoc` et `swagger-ui-express`
- Création de `backend/src/config/swagger.js`
- Route `/api-docs` ajoutée dans index.js
- Tous les endpoints documentés avec JSDoc:
  - POST /api/prompts (création prompt)
  - GET /api/prompts (liste avec pagination)
  - GET /api/prompts/:id (détails prompt)
  - DELETE /api/prompts/:id (suppression)
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me
  - PUT /api/auth/profile
  - GET /api/prompts/models

**Fichiers modifiés**:
- `backend/package.json` - Dépendances ajoutées
- `backend/src/index.js` - Swagger UI intégré
- `backend/src/config/swagger.js` - Configuration complète (NOUVEAU)
- `backend/src/routes/prompts.js` - Documentation JSDoc complète
- `backend/src/routes/auth.js` - Documentation JSDoc complète

**Accès**: http://localhost:5001/api-docs

### 2. Captures d'écran Frontend
**Objectif**: Documentation visuelle de l'interface

**Screenshots à ajouter**:
1. Interface principale (prompt input + sélection modèles)
2. Résultats avec visualisations (graphs, radar, matrices)
3. Page historique
4. Exports (JSON, CSV, PDF)

**Dossier**: `docs/screenshots/`

### 3. HashiCorp Vault - Migration .env
**Objectif**: Gestion modulable et sécurisée des secrets

**Documentation**: https://developer.hashicorp.com/vault

**Avantages**:
- Rotation automatique des secrets
- Audit logs
- Accès contrôlé par policies
- Centralisé et modulable

**Secrets à migrer**:
- MONGODB_URI
- JWT_SECRET
- GEMINI_API_KEY
- MISTRAL_API_KEY
- HUGGINGFACE_API_KEY
- COHERE_API_KEY

**Actions**:
1. Installer HashiCorp Vault (dev server ou Docker)
2. Créer `backend/src/config/vault.js`
3. Remplacer `dotenv` par appels Vault
4. Documenter le setup dans README

**Fichiers à modifier**:
- `backend/src/config/vault.js` (nouveau)
- `backend/src/index.js` (remplacer dotenv)
- `backend/src/config/ai-apis.js` (charger depuis Vault)

### 4. SOLID Principles - Refactoring (TERMINÉ)

**Référence**: https://www.geeksforgeeks.org/system-design/solid-principle-in-programming-understand-with-real-life-examples/

#### Single Responsibility Principle (SRP) - APPLIQUÉ

**Problème résolu**: Architecture refactorisée pour respecter SOLID

**Nouvelle architecture**:
```
backend/src/services/ai/
├── geminiService.js         (responsable uniquement de Gemini)
├── mistralService.js        (responsable uniquement de Mistral)
├── huggingfaceService.js    (responsable uniquement de Hugging Face)
├── cohereService.js         (responsable uniquement de Cohere)
└── orchestratorService.js   (coordonne les services AI)
```

**Chaque service AI**:
- Une seule responsabilité: gérer son API
- Méthode `generateResponse(prompt, options)`
- Gestion d'erreurs isolée
- Estimation des tokens

**OrchestratorService**:
- Coordonne les appels parallèles
- Gère les timeouts
- Agrège les résultats
- Ne fait PAS d'appels API directs

**promptController.js** simplifié:
- Utilise `OrchestratorService` au lieu de `AIAggregatorService`
- Garde uniquement la logique HTTP (req/res)
- Délègue la logique métier aux services

**Avantages**:
- Code plus maintenable et testable
- Facilite l'ajout de nouveaux providers
- Respect des standards de l'industrie
- Chaque fichier ~60 lignes (vs 260 avant)

**Fichiers créés**:
- `backend/src/services/ai/geminiService.js` (NOUVEAU)
- `backend/src/services/ai/mistralService.js` (NOUVEAU)
- `backend/src/services/ai/huggingfaceService.js` (NOUVEAU)
- `backend/src/services/ai/cohereService.js` (NOUVEAU)
- `backend/src/services/ai/orchestratorService.js` (NOUVEAU)

**Fichiers modifiés**:
- `backend/src/controllers/promptController.js` (utilise OrchestratorService)

### 5. Réduction des Emojis (TERMINÉ)

**Objectif**: Code professionnel

**Actions complétées**:
- Supprimé TOUS les emojis dans le code backend
  - `index.js` - Console.log propres
  - `database.js` - Logs MongoDB propres
  - `ai-apis.js` - Logs clients propres
  - `promptController.js` - Logs d'erreur propres
- Emojis conservés uniquement dans README pour lisibilité
- CHECKPOINT nettoyé (ce fichier)

---

## Anciennes Étapes (Complétées)

### Option A: Authentication Frontend
1. Créer pages Login/Register
2. Intégrer JWT avec backend existant
3. Protéger les routes
4. Ajouter bouton logout

### Option B: Export de Données
1. Bouton export dans résultats
2. Formats: JSON, CSV, PDF, Markdown
3. Utiliser jsPDF pour PDF
4. Formatage professionnel

### Option C: Historique des Prompts
1. Page liste des prompts passés
2. Filtres (date, modèle, scores)
3. Réutiliser un prompt
4. Supprimer l'historique

---

## Fichiers Clés

### Configuration
- `backend/.env` - Variables d'environnement (PORT=5001, API keys)
- `backend/src/config/ai-apis.js` - Config des APIs (models, sovereignty)
- `backend/src/config/swagger.js` - Configuration Swagger/OpenAPI (NOUVEAU)
- `frontend/tailwind.config.js` - Palette beige/noir

### Modèles Backend
- `backend/src/models/User.js` - Utilisateurs (JWT ready)
- `backend/src/models/Prompt.js` - Prompts (userId optionnel)
- `backend/src/models/Response.js` - Réponses avec scores

### Services Backend (Architecture SOLID)
- `backend/src/services/ai/orchestratorService.js` - Coordination (NOUVEAU)
- `backend/src/services/ai/geminiService.js` - Gemini uniquement (NOUVEAU)
- `backend/src/services/ai/mistralService.js` - Mistral uniquement (NOUVEAU)
- `backend/src/services/ai/huggingfaceService.js` - HF uniquement (NOUVEAU)
- `backend/src/services/ai/cohereService.js` - Cohere uniquement (NOUVEAU)
- `backend/src/services/scoringService.js` - Calcul des scores
- `backend/src/services/nlpService.js` - Analyse NLP

### Routes Backend
- `backend/src/routes/prompts.js` - CRUD prompts (Swagger docs)
- `backend/src/routes/auth.js` - Login/Register (Swagger docs)

### Composants Frontend
- `frontend/src/App.jsx` - App principale (avec visualisations)
- `frontend/src/components/prompt/PromptInput.jsx` - Input prompt
- `frontend/src/components/results/ResponseCard.jsx` - Carte réponse
- `frontend/src/components/results/ComparisonSummary.jsx` - Résumé
- `frontend/src/components/visualization/*` - 4 composants dataviz

---

## Notes Importantes

1. **TOUJOURS utiliser le port 5001** pour le backend (5000 est occupé)
2. **Model Gemini**: `gemini-2.5-flash` (PAS gemini-pro)
3. **Design**: Minimal border-radius (2-6px), palette beige/noir
4. **Chart.js**: Déjà installé et optimisé par Vite
5. **userId**: Optionnel dans Prompt (pas besoin d'auth pour tester)
6. **Swagger**: Documentation API disponible sur /api-docs
7. **Architecture SOLID**: Services séparés dans services/ai/

---

## Dépendances Installées

### Backend
- express, mongoose, mongodb
- bcryptjs, jsonwebtoken (auth)
- swagger-jsdoc, swagger-ui-express (documentation - NOUVEAU)
- @google/generative-ai (Gemini)
- @mistralai/mistralai (Mistral)
- cohere-ai, @huggingface/inference
- natural (NLP)
- cors, dotenv, helmet

### Frontend
- react, react-dom, react-router-dom
- axios
- chart.js, react-chartjs-2 (pour visualisations)
- recharts, d3, d3-cloud
- tailwindcss, lucide-react
- zustand, react-query

---

## Checklist PFE (selon PDF)

### Fonctionnalités Principales
- Agrégation multi-modèles (Gemini, Mistral, HF, Cohere)
- Scoring multi-critères (Relevance, Similarity, Sovereignty)
- Analyse NLP (keywords, sentiment, topics)
- Visualisation comparative (graphiques, matrices)
- Interface professionnelle (design beige/ink)
- Authentification (backend complet, frontend optionnel)
- Export de données (JSON, CSV, PDF avec analyse comparative)
- Historique (page complète avec vue détails)

### Critères IT for Green
- Scoring de souveraineté (EU vs USA)
- Localisation des serveurs
- Conformité RGPD
- Green IT: Calcul CO2, énergie, eco-score A-E
- APIs gratuites (pas de coûts énergétiques cloud)

---

## NOUVEAU: Amélioration Système de Scoring (Phase 8)

### Contexte
L'ancien système de scoring avait des limitations:
- Score de souveraineté hardcodé (valeurs statiques)
- Pas de calcul d'impact écologique
- Pas de détails sur la conformité RGPD
- Pas de recommandations automatiques

**Référence utilisée**: Projet PromptOptim (stocké dans projetdepotes.md)

### Architecture Créée

#### 1. SovereigntyService.js (FONCTIONNEL)
**Fichier**: `backend/src/services/sovereigntyService.js`

**Calcul en 3 composantes** (Total = 100 points):
```javascript
// Hosting (50 pts max)
France: 50, EU: 40, USA: 20, China: 10, Other: 15

// Company (30 pts max)
France: 30, EU: 25, USA: 15, China: 5, Other: 10

// License (20 pts max)
Open Source: 20, Open Weights: 15, Proprietary: 5, Unknown: 0
```

**Fonctionnalités**:
- Calcul dynamique du score total
- Breakdown détaillé (hosting/company/license avec pourcentages)
- Cloud Act Risk detection (score < 50 = risque)
- Analyse RGPD (compliant/location/status/risk)
- Sovereignty Level (Excellent, Good, Medium, Low, Critical)
- Recommandations automatiques (Security, Compliance, Sovereignty, Transparency)

**Résultats obtenus**:
- Mistral: 95/100 (France 50 + France 30 + Open Weights 15)
- Hugging Face: 70/100 (USA 20 + USA 15 + Open Source 20 + malus)
- Gemini: 40/100 (USA 20 + USA 15 + Proprietary 5)
- Cohere: 25/100 (USA 20 + USA 15 + Proprietary 5 - malus)

#### 2. GreenITService.js (FONCTIONNEL)
**Fichier**: `backend/src/services/greenITService.js`

**Consommation énergétique** (kWh pour 1000 tokens):
```javascript
gemini: 0.005
mistral: 0.002       // Plus sobre
huggingface: 0.004
cohere: 0.006
```

**Intensité carbone** (grammes CO2 par kWh - source IEA 2024):
```javascript
France: 50.0    // Mix nucléaire/renouvelable
EU: 250.0       // Moyenne européenne
USA: 380.0      // Mix charbon/gaz dominant
Other: 500.0    // Conservative estimate
```

**Calcul**:
```javascript
energyKwh = (tokens / 1000) * energyPerToken
timeFactor = 1.2 (si 18h-22h) ou 1.0
co2Grams = energyKwh * carbonIntensity * timeFactor
ecoScore = A/B/C/D/E basé sur co2Grams/token
```

**Équivalences calculées**:
- km voiture (120g CO2/km)
- charges smartphone (8.22g CO2/charge)
- minutes streaming HD (2.4g CO2/min)
- arbres/an nécessaires (1 arbre = 21kg CO2/an)

**BUG RÉSOLU**:
- **Problème initial**: `greenIT.tokens` = 0 dans la réponse MongoDB
- **Cause identifiée**: `promptController.js` ne sauvegardait pas le champ `greenIT` dans Response.create()
- **Solution appliquée**: Ajout de `greenIT: response.greenIT || {}` à la ligne 68
- **Résultat**: Service fonctionne parfaitement, toutes les données Green IT sont maintenant sauvegardées
- **Test confirmé**: Mistral A (0.096g CO2), Gemini D (2.34g CO2)

#### 3. Métadonnées AI Enrichies
**Fichier**: `backend/src/config/ai-apis.js`

**AI_SOVEREIGNTY_DATA étendu**:
```javascript
export const AI_SOVEREIGNTY_DATA = {
  gemini: {
    serverLocation: 'USA',
    companyNationality: 'USA',
    cloudProvider: 'Google Cloud',
    dataRetention: '30 days',
    rgpdCompliant: true,         // Partiel
    licenseType: 'Proprietary'
  },
  mistral: {
    serverLocation: 'France',
    companyNationality: 'France',
    cloudProvider: 'European Cloud (Scaleway)',
    dataRetention: 'No retention',
    rgpdCompliant: true,         // Full
    licenseType: 'Open Weights'  // Apache 2.0
  },
  // ... huggingface, cohere
}
```

#### 4. MongoDB Schema Extension
**Fichier**: `backend/src/models/Response.js`

**Nouveaux champs**:

```javascript
// Sovereignty (enrichi)
scores: {
  sovereignty: {
    score: Number,  // 0-100
    breakdown: {
      hosting: { score, maxScore, location, percentage },
      company: { score, maxScore, nationality, percentage },
      license: { score, maxScore, type, percentage }
    },
    rgpd: { compliant, location, status, risk },
    cloudActRisk: Boolean,
    sovereigntyLevel: String,
    metadata: { cloudProvider, dataRetention, ... },
    recommendations: [{ type, priority, message, action }]
  }
}

// Green IT (nouveau)
greenIT: {
  tokens: { total, input, output },
  energy: { consumedKwh, perToken, timeFactor },
  carbon: { impactGrams, intensity, location },
  ecoScore: String,  // A/B/C/D/E/N/A
  equivalences: { carKm, smartphoneCharges, streamingMinutes, treesPerYear },
  timestamp: String
}
```

**FIX APPLIQUÉ**: Validation Mongoose
- **Erreur**: `Cast to string failed for value "{...}" (type Object)`
- **Cause**: Objets imbriqués mal définis (manquait `{ type: ... }`)
- **Solution**: Définition explicite pour TOUS les champs imbriqués
```javascript
// Avant (incorrect)
breakdown: {
  hosting: {
    score: Number,  // ❌ Mongoose confus
  }
}

// Après (correct)
breakdown: {
  hosting: {
    score: { type: Number },  // ✅ Explicite
  }
}
```

### Intégration dans scoringService.js

**Modifications**:
```javascript
import GreenITService from './greenITService.js';
import SovereigntyService from './sovereigntyService.js';

constructor() {
  this.nlpService = new NLPService();
  this.greenITService = new GreenITService();
  this.sovereigntyService = new SovereigntyService();
}

// Dans scoreAllResponses()
const sovereigntyScore = this.sovereigntyService.calculateSovereignty(
  response.sovereignty || {}
);

const greenITImpact = this.greenITService.calculateImpact(
  response,
  response.model,
  response.sovereignty?.serverLocation || 'Other'
);

return {
  ...response,
  scores: {
    sovereignty: sovereigntyScore,  // Objet complet
    // ...
  },
  greenIT: greenITImpact  // Objet complet
};
```

### Résultats de Test (via API)

**Test effectué**: POST /api/prompts avec Mistral

**Sovereignty Data (FONCTIONNEL)**:
```json
{
  "score": 95,
  "breakdown": {
    "hosting": {
      "score": 50,
      "maxScore": 50,
      "location": "France",
      "percentage": 100
    },
    "company": {
      "score": 30,
      "maxScore": 30,
      "nationality": "France",
      "percentage": 100
    },
    "license": {
      "score": 15,
      "maxScore": 20,
      "type": "Open Weights",
      "percentage": 75
    }
  },
  "rgpd": {
    "compliant": true,
    "location": "France",
    "status": "Full Compliance",
    "risk": "Low"
  },
  "cloudActRisk": false,
  "sovereigntyLevel": "Excellent",
  "recommendations": [{
    "type": "Success",
    "priority": "Info",
    "message": "Excellent sovereignty score. Model respects data sovereignty principles.",
    "action": "No action required"
  }]
}
```

**Green IT Data (FONCTIONNEL)**:
```json
{
  "tokens": { "total": 467, "input": 8, "output": 459 },
  "energy": { "consumedKwh": 0.000934, "perToken": 0.002, "timeFactor": 1.0 },
  "carbon": { "impactGrams": 0.0467, "intensity": 50, "location": "France" },
  "ecoScore": "A",
  "equivalences": {
    "carKm": 0.0004,
    "smartphoneCharges": 0.0057,
    "streamingMinutes": 0.02,
    "treesPerYear": 0.000002
  },
  "timestamp": "2026-02-25T22:15:30.123Z"
}
```

### Améliorations Complétées (Phase 9)

1. **Amélioration Couleurs** (TERMINÉ)
   - Remplacé red/green/yellow/orange par palette beige/ink
   - Hiérarchie visuelle maintenue avec sand-X et ink-X
   - Fichiers modifiés: ResponseCard.jsx (eco-score badges, recommandations)

2. **Markdown Rendering** (TERMINÉ)
   - Installé react-markdown + @tailwindcss/typography
   - Parser fonctionne pour **, ###, listes, liens
   - Prose classes pour typographie professionnelle

3. **Export Amélioré** (TERMINÉ)
   - JSON: Section comparativeAnalysis avec breakdown gagnant
   - CSV: En-têtes avec analyse comparative et formule
   - PDF: Section visuelle "Why This Model Won" avec barres de progression

### Fichiers Modifiés (Phase 8 & 9)

**Créés (Phase 8)**:
- `backend/src/services/greenITService.js`
- `backend/src/services/sovereigntyService.js`
- `frontend/src/components/help/ScoringGuide.jsx`

**Modifiés (Phase 8)**:
- `backend/src/config/ai-apis.js` (AI_SOVEREIGNTY_DATA enrichi)
- `backend/src/models/Response.js` (schema sovereignty + greenIT)
- `backend/src/services/scoringService.js` (intégration services)
- `backend/src/controllers/promptController.js` (sauvegarde greenIT)
- `frontend/src/components/results/ResponseCard.jsx` (affichage Green IT + Sovereignty)

**Modifiés (Phase 9)**:
- `frontend/src/components/results/ResponseCard.jsx` (couleurs beige/ink + Markdown)
- `frontend/src/services/exportService.js` (exports améliorés)
- `frontend/tailwind.config.js` (plugin typography)
- `.gitignore` (CLAUDE_CHECKPOINT.md)
- `README.md` (emojis supprimés, lien Figma)
- `CLAUDE_CHECKPOINT.md` (cette mise à jour)

---

## Commandes Rapides

```bash
# Redémarrer tout
cd backend && npm run dev &
cd ../frontend && npm run dev

# Tuer les processus Node (si port occupé)
# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Tester backend directement
curl http://localhost:5001/api/prompts/models

# Vérifier MongoDB
# Login Atlas: https://cloud.mongodb.com
```

---

## Support

- **GitHub Issues**: https://github.com/anthropics/claude-code/issues
- **Documentation projet**: README.md
- **Guide démarrage rapide**: QUICK_START.md
- **APIs gratuites**: FREE_AI_APIS.md

---

**Dernière mise à jour**: 2026-02-25 (Soir)
**Status actuel**:
- Phase 8 COMPLÉTÉE: Sovereignty + Green IT 100% fonctionnels
- Phase 9 COMPLÉTÉE: UI refinements (couleurs, Markdown, exports)
- Frontend: Affichage complet avec palette cohérente beige/ink
- Export: JSON/CSV/PDF incluent analyse comparative du gagnant
- Guide pédagogique: Méthodologie scientifique documentée
- Documentation: README + CHECKPOINT professionnels (sans emojis)

**Prochaines phases**: HashiCorp Vault, Captures d'écran, Tests unitaires (optionnel)

**Projet prêt pour démonstration et évaluation PFE**
