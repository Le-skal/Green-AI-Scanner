# Backend Complet - Documentation

## ✅ Ce qui a été développé

### 📁 Structure complète

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js           ✅ Configuration MongoDB
│   │   ├── ai-apis.js            ✅ Configuration APIs IA gratuites
│   │   └── index.js              ✅ Export de configuration
│   │
│   ├── models/
│   │   ├── User.js               ✅ Modèle utilisateur avec auth
│   │   ├── Prompt.js             ✅ Modèle prompt
│   │   └── Response.js           ✅ Modèle réponse IA
│   │
│   ├── controllers/
│   │   ├── authController.js     ✅ Logique authentification
│   │   └── promptController.js   ✅ Logique agrégation IA
│   │
│   ├── services/
│   │   ├── aiAggregatorService.js    ✅ Agrégation multi-IA
│   │   ├── nlpService.js             ✅ Analyse NLP
│   │   └── scoringService.js         ✅ Calcul des scores
│   │
│   ├── routes/
│   │   ├── auth.js               ✅ Routes authentification
│   │   └── prompts.js            ✅ Routes prompts/IA
│   │
│   ├── middleware/
│   │   ├── auth.js               ✅ JWT authentication
│   │   ├── rateLimiter.js        ✅ Rate limiting
│   │   └── errorHandler.js       ✅ Gestion d'erreurs
│   │
│   └── index.js                  ✅ Serveur principal
│
├── package.json                  ✅ Dépendances
├── .env.example                  ✅ Template configuration
└── .env                          ✅ Configuration locale
```

---

## 🚀 Fonctionnalités Implémentées

### 1. APIs IA Gratuites (4 providers)
- ✅ **Google Gemini** - API principale (60 req/min)
- ✅ **Mistral AI** - Souveraineté européenne
- ✅ **Hugging Face** - Modèles open source
- ✅ **Cohere** - Analyse NLP (5000 req/mois)

### 2. Système d'Agrégation
- ✅ Envoi simultané à plusieurs APIs
- ✅ Gestion des timeouts
- ✅ Gestion des erreurs par API
- ✅ Récupération des tokens utilisés

### 3. Système de Scoring
- ✅ **Score de pertinence** (0-100) - Basé sur le prompt
- ✅ **Score de similarité** (0-100) - Comparaison entre réponses
- ✅ **Score de souveraineté** (0-100) - Localisation et RGPD
- ✅ **Matrice de similarité** - Comparaison croisée

### 4. Analyse NLP
- ✅ Extraction de mots-clés
- ✅ Analyse de sentiment
- ✅ Détection de topics
- ✅ Comptage mots/phrases
- ✅ Score de lisibilité

### 5. Authentification & Sécurité
- ✅ Inscription/Connexion JWT
- ✅ Hash des passwords (bcrypt)
- ✅ Protection des routes
- ✅ Rate limiting
- ✅ CORS configuré
- ✅ Helmet (sécurité headers)

### 6. Base de Données
- ✅ Modèles Mongoose complets
- ✅ Validation des données
- ✅ Index pour performances
- ✅ Relations entre collections

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register      - Inscription
POST   /api/auth/login         - Connexion
GET    /api/auth/me            - Profil utilisateur (protégé)
PUT    /api/auth/profile       - Mise à jour profil (protégé)
```

### Prompts (`/api/prompts`)
```
GET    /api/prompts/models     - Liste des modèles IA disponibles
POST   /api/prompts            - Créer un prompt et agréger (rate limited)
GET    /api/prompts            - Liste des prompts
GET    /api/prompts/:id        - Détails d'un prompt
DELETE /api/prompts/:id        - Supprimer un prompt (protégé)
```

### Autres
```
GET    /                       - Info API
GET    /health                 - Health check
```

---

## 🧪 Comment Tester le Backend

### 1. Configuration MongoDB

**Option A : MongoDB Local**
```bash
# Installer MongoDB Community Edition
# Puis démarrer :
mongod

# Le backend utilisera : mongodb://localhost:27017/ai-aggregator
```

**Option B : MongoDB Atlas (Cloud - Gratuit)**
```bash
1. Créer un compte sur mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Obtenir l'URI de connexion
4. Mettre à jour MONGODB_URI dans .env
```

### 2. Obtenir les Clés API Gratuites

Consultez `FREE_AI_APIS.md` pour les instructions détaillées.

**Minimum requis pour tester** :
- Google Gemini (le plus simple et rapide à obtenir)

**Liens rapides** :
- Gemini: https://makersuite.google.com/app/apikey
- Mistral: https://console.mistral.ai/
- Hugging Face: https://huggingface.co/settings/tokens
- Cohere: https://cohere.com/

### 3. Configurer le .env

Éditez `backend/.env` et ajoutez au moins une clé API :

```env
MONGODB_URI=mongodb://localhost:27017/ai-aggregator
JWT_SECRET=your_secret_key_here

# Au minimum Gemini pour tester
GOOGLE_GEMINI_API_KEY=votre_cle_ici
```

### 4. Démarrer le Backend

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
🚀 Starting AI Aggregator API Server...
📊 Connecting to MongoDB...
✅ MongoDB Connected: localhost
🤖 Initializing AI clients...
✅ Google Gemini initialized

✅ Server is running!
🌐 URL: http://localhost:5000
📝 Environment: development
🤖 AI Clients: 1 active
```

### 5. Tester avec cURL ou Postman

**Test 1 : Health Check**
```bash
curl http://localhost:5000/health
```

**Test 2 : Liste des modèles disponibles**
```bash
curl http://localhost:5000/api/prompts/models
```

**Test 3 : Créer un prompt (sans auth)**
```bash
curl -X POST http://localhost:5000/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "promptText": "Explique-moi ce qu est l intelligence artificielle en 2 phrases",
    "aiModels": ["gemini"],
    "parameters": {
      "temperature": 0.7,
      "maxTokens": 200
    }
  }'
```

**Réponse attendue** :
```json
{
  "prompt": {
    "id": "...",
    "text": "Explique-moi...",
    "models": ["gemini"],
    "status": "completed"
  },
  "responses": [
    {
      "aiModel": "gemini",
      "responseText": "...",
      "responseTime": 1234,
      "scores": {
        "relevance": 85,
        "similarity": 100,
        "sovereignty": { ... }
      },
      "nlpAnalysis": { ... }
    }
  ],
  "summary": {
    "totalResponses": 1,
    "successfulResponses": 1,
    "averageRelevance": 85,
    ...
  },
  "similarityMatrix": [[100]]
}
```

**Test 4 : Inscription**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Test 5 : Connexion**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Récupérez le `token` de la réponse pour les requêtes protégées.

**Test 6 : Profil (avec token)**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 🎯 Exemple Complet avec Plusieurs APIs

```bash
curl -X POST http://localhost:5000/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "promptText": "Quels sont les avantages de l energie solaire?",
    "aiModels": ["gemini", "mistral", "huggingface", "cohere"],
    "parameters": {
      "temperature": 0.7,
      "maxTokens": 300
    }
  }'
```

Cette requête va :
1. Envoyer le prompt aux 4 APIs simultanément
2. Récupérer et analyser les 4 réponses
3. Calculer les scores de pertinence, similarité, souveraineté
4. Effectuer l'analyse NLP
5. Générer la matrice de similarité
6. Retourner un résumé comparatif

---

## 📊 Données Retournées

### Structure de la Réponse

```json
{
  "prompt": { ... },
  "responses": [
    {
      "aiModel": "gemini",
      "responseText": "Le texte de la réponse...",
      "responseTime": 1234,
      "tokens": { "input": 10, "output": 50, "total": 60 },
      "scores": {
        "relevance": 85,
        "similarity": 75,
        "sovereignty": {
          "score": 60,
          "serverLocation": "USA",
          "rgpdCompliant": true,
          "cloudProvider": "Google Cloud"
        }
      },
      "nlpAnalysis": {
        "keywords": [
          { "word": "energie", "count": 3, "relevance": 0.15 }
        ],
        "sentiment": "positive",
        "sentimentScore": 0.6,
        "topics": ["énergie", "solaire"],
        "wordCount": 45,
        "sentenceCount": 3
      },
      "status": "success"
    }
  ],
  "summary": {
    "totalResponses": 4,
    "successfulResponses": 4,
    "failedResponses": 0,
    "averageRelevance": 82,
    "averageSimilarity": 68,
    "averageResponseTime": 1500,
    "bestResponse": { "model": "gemini", "relevance": 90 },
    "consensusLevel": 68,
    "sovereigntyDistribution": { "USA": 3, "EU": 1 }
  },
  "similarityMatrix": [
    [100, 75, 68, 72],
    [75, 100, 70, 65],
    [68, 70, 100, 80],
    [72, 65, 80, 100]
  ]
}
```

---

## 🔧 Troubleshooting

### Erreur : MongoDB connection failed
```bash
# Vérifier que MongoDB est démarré
# Windows :
net start MongoDB

# Mac/Linux :
sudo systemctl start mongod
```

### Erreur : No AI clients initialized
```bash
# Vérifier que les clés API sont dans .env
# Et que le fichier .env est dans le dossier backend/
```

### Erreur : Rate limit exceeded
```bash
# Attendre 1 minute ou ajuster les limites dans
# src/middleware/rateLimiter.js
```

---

## 📈 Prochaines Étapes

1. ✅ Backend complet et fonctionnel
2. 🔄 Développer le frontend React
3. 🔄 Créer les composants de visualisation DataViz
4. 🔄 Implémenter l'historique et l'export
5. 🔄 Tests et démo finale

---

**Backend 100% fonctionnel !** 🎉

Vous pouvez maintenant tester l'agrégation IA avec les APIs gratuites.
