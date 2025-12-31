# Structure du Projet

```
ProjetFinale3/
│
├── README.md                 # Cahier des charges et documentation
├── STRUCTURE.md             # Ce fichier - explication de la structure
├── .gitignore              # Fichiers à ignorer par Git
│
├── backend/                # Backend Node.js + Express
│   ├── src/
│   │   ├── config/        # Configuration (DB, APIs externes, etc.)
│   │   │   ├── database.js
│   │   │   ├── ai-apis.js
│   │   │   └── index.js
│   │   │
│   │   ├── models/        # Modèles MongoDB (Mongoose)
│   │   │   ├── User.js
│   │   │   ├── Prompt.js
│   │   │   └── Response.js
│   │   │
│   │   ├── controllers/   # Logique métier des routes
│   │   │   ├── authController.js
│   │   │   ├── promptController.js
│   │   │   └── analysisController.js
│   │   │
│   │   ├── services/      # Services métier (agrégation IA, scoring, etc.)
│   │   │   ├── aiAggregatorService.js
│   │   │   ├── scoringService.js
│   │   │   ├── nlpService.js
│   │   │   └── sovereigntyService.js
│   │   │
│   │   ├── routes/        # Définition des routes API
│   │   │   ├── auth.js
│   │   │   ├── prompts.js
│   │   │   └── analysis.js
│   │   │
│   │   ├── middleware/    # Middlewares Express
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   │
│   │   ├── utils/         # Fonctions utilitaires
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   │
│   │   └── index.js       # Point d'entrée du serveur
│   │
│   ├── package.json       # Dépendances backend
│   ├── .env.example       # Exemple de variables d'environnement
│   └── tsconfig.json      # Configuration TypeScript (optionnel)
│
└── frontend/              # Frontend React + Vite
    ├── public/            # Assets statiques
    │   └── favicon.ico
    │
    ├── src/
    │   ├── components/    # Composants réutilisables
    │   │   ├── common/   # Composants génériques
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   └── Card.jsx
    │   │   │
    │   │   ├── layout/   # Composants de mise en page
    │   │   │   ├── Header.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── Footer.jsx
    │   │   │
    │   │   ├── prompt/   # Composants liés aux prompts
    │   │   │   ├── PromptInput.jsx
    │   │   │   └── ModelSelector.jsx
    │   │   │
    │   │   └── visualization/ # Composants DataViz
    │   │       ├── ComparisonTable.jsx
    │   │       ├── SimilarityMatrix.jsx
    │   │       ├── WordCloud.jsx
    │   │       └── ScoreChart.jsx
    │   │
    │   ├── pages/         # Pages de l'application
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Analysis.jsx
    │   │   └── History.jsx
    │   │
    │   ├── services/      # Services API et logique métier
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── promptService.js
    │   │
    │   ├── hooks/         # Custom React Hooks
    │   │   ├── useAuth.js
    │   │   └── usePrompt.js
    │   │
    │   ├── contexts/      # React Contexts
    │   │   └── AuthContext.jsx
    │   │
    │   ├── types/         # Types TypeScript (optionnel)
    │   │   └── index.ts
    │   │
    │   ├── utils/         # Fonctions utilitaires
    │   │   └── helpers.js
    │   │
    │   ├── assets/        # Images, styles, etc.
    │   │   └── styles/
    │   │       └── index.css
    │   │
    │   ├── App.jsx        # Composant principal
    │   └── main.jsx       # Point d'entrée React
    │
    ├── index.html         # Template HTML
    ├── package.json       # Dépendances frontend
    ├── vite.config.js     # Configuration Vite
    ├── tailwind.config.js # Configuration Tailwind CSS
    └── postcss.config.js  # Configuration PostCSS

```

## Description des Dossiers

### Backend

- **config/** : Configurations de la base de données, APIs externes, variables d'environnement
- **models/** : Schémas Mongoose pour MongoDB
- **controllers/** : Logique de traitement des requêtes
- **services/** : Logique métier réutilisable (agrégation IA, scoring, NLP)
- **routes/** : Définition des endpoints API
- **middleware/** : Middlewares Express (auth, validation, error handling)
- **utils/** : Fonctions utilitaires

### Frontend

- **components/** : Composants React réutilisables, organisés par domaine
- **pages/** : Pages de l'application (une page = une route)
- **services/** : Communication avec le backend via API
- **hooks/** : Custom React Hooks pour logique réutilisable
- **contexts/** : Gestion d'état globale avec Context API
- **utils/** : Fonctions utilitaires
- **assets/** : Fichiers statiques (images, styles)

## Flux de Données

```
User Input (Frontend)
    ↓
React Component
    ↓
Service API Call
    ↓
Backend Route
    ↓
Controller
    ↓
Service (AI Aggregator)
    ↓
External AI APIs (OpenAI, Claude, Gemini, Mistral)
    ↓
Service (Scoring & NLP)
    ↓
MongoDB (Save Results)
    ↓
Response to Frontend
    ↓
DataViz Components
    ↓
User sees results
```
