# Projet 3 - Agrégateur de Moteurs d'IA

## 📋 Cahier des Charges (CDC)

### 🎯 Objectif du Projet

Créer une plateforme web permettant de **consolider et comparer les réponses de plusieurs moteurs d'IA** (ChatGPT, Claude, Gemini, Mistral, etc.) pour un même prompt, en évaluant leur pertinence, cohérence et niveau de souveraineté des données.

---

## 🌟 Fonctionnalités Principales

### 1. Agrégation Multi-API IA
- Interface de saisie de prompt unique
- Envoi simultané vers plusieurs APIs d'IA :
  - OpenAI (ChatGPT)
  - Anthropic (Claude)
  - Google (Gemini)
  - Mistral AI
  - Autres modèles open source

### 2. Analyse Sémantique et Scoring
- **Scoring de similarité** : Comparaison sémantique entre les réponses
- **Analyse de cohérence** : Détection des points communs et divergences
- **Évaluation de pertinence** : Score de qualité par réponse
- **Analyse NLP** : Extraction de mots-clés, sentiments, thématiques

### 3. Scoring Data Souverain
- **Localisation des serveurs** : Identification géographique des datacenters
- **Conformité RGPD** : Niveau de conformité européenne
- **Risque de dépendance cloud** : Évaluation des risques liés aux fournisseurs
- **Transparence des données** : Traçabilité du traitement des données

### 4. Visualisation Comparative (DataViz)
- **Tableau comparatif** : Affichage côte à côte des réponses
- **Nuages de mots** : Visualisation des termes fréquents
- **Matrices de similarité** : Graphiques de corrélation entre réponses
- **Graphiques de scores** : Barres, radars, jauges pour les différents scores
- **Timeline de réponse** : Temps de réponse par API

### 5. Historique et Export
- **Sauvegarde des prompts** : Historique des recherches effectuées
- **Export multi-format** :
  - JSON (données brutes)
  - CSV (pour analyse)
  - PDF (rapport visuel)
  - Markdown (documentation)

---

## 🏗️ Architecture Technique

### Stack Technique Recommandée

#### Frontend
- **Framework** : React.js avec Vite
- **Styling** : Tailwind CSS
- **State Management** : Context API / Zustand
- **Requêtes API** : Axios / React Query
- **Visualisation** : Chart.js, Recharts, D3.js
- **UI Components** : shadcn/ui ou Material-UI

#### Backend
- **Framework** : Node.js avec Express.js
- **Langage** : TypeScript
- **API Architecture** : RESTful API
- **Validation** : Zod / Joi
- **Documentation API** : Swagger / OpenAPI

#### Base de Données
- **Primary** : MongoDB (stockage flexible des réponses)
- **Cache** : Redis (optimisation des requêtes)
- **ORM** : Mongoose

#### Intelligence Artificielle
- **APIs IA** :
  - OpenAI API (GPT-4, GPT-3.5)
  - Anthropic API (Claude)
  - Google AI API (Gemini)
  - Mistral AI API
- **Analyse NLP** :
  - natural (Node.js NLP library)
  - compromise (text analysis)
  - sentiment analysis libraries

#### Sécurité & Auth
- **Authentification** : JWT (JSON Web Tokens)
- **Gestion des secrets** : dotenv
- **Rate limiting** : express-rate-limit
- **CORS** : cors middleware

---

## 📐 Architecture Système

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  (React + Tailwind + Chart.js + Recharts)              │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Prompt     │  │  Results     │  │   DataViz    │ │
│  │   Interface  │  │  Comparison  │  │  Dashboard   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │   History    │  │   Export     │                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js)                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │     API      │  │   AI Proxy   │  │   Scoring    │ │
│  │   Gateway    │  │   Manager    │  │   Engine     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   NLP        │  │  Data        │  │     Auth     │ │
│  │   Analyzer   │  │  Sovereignty │  │   Manager    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE (MongoDB + Redis)                 │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Prompts    │  │   Responses  │  │    Users     │ │
│  │  Collection  │  │  Collection  │  │  Collection  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL AI APIs                       │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  OpenAI  │ │Anthropic │ │  Google  │ │ Mistral  │  │
│  │   API    │ │   API    │ │   API    │ │   API    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📅 Plan de Développement par Phases

### Phase 1 : Planification et CDC ✅
**Durée** : En cours
- [x] Définition des besoins
- [x] Rédaction du CDC
- [x] Choix des technologies
- [ ] Architecture détaillée

### Phase 2 : Setup et Structure du Projet
**Objectifs** :
- Initialiser le projet frontend (React + Vite)
- Initialiser le projet backend (Node.js + Express)
- Configurer la base de données (MongoDB)
- Mettre en place Git et structure des dossiers
- Configuration de l'environnement (.env)

**Livrables** :
- Structure de projet complète
- Configuration de développement opérationnelle
- Documentation technique initiale

### Phase 3 : Backend - Core API
**Objectifs** :
- Créer les routes API REST
- Implémenter l'authentification JWT
- Configurer les connexions aux APIs IA externes
- Développer le système d'agrégation de requêtes
- Mettre en place la base de données

**Livrables** :
- API fonctionnelle pour envoi de prompts
- Intégration avec au moins 2 APIs IA
- Système d'authentification opérationnel

### Phase 4 : Backend - Scoring et Analyse
**Objectifs** :
- Développer le moteur de scoring de similarité
- Implémenter l'analyse NLP
- Créer le système de scoring de souveraineté
- Développer les algorithmes de comparaison

**Livrables** :
- Moteur de scoring opérationnel
- API d'analyse sémantique
- Documentation des algorithmes

### Phase 5 : Frontend - Interface Utilisateur
**Objectifs** :
- Développer l'interface de saisie de prompts
- Créer le tableau de comparaison des réponses
- Implémenter l'authentification côté client
- Développer la navigation et le routing

**Livrables** :
- Interface responsive et intuitive
- Formulaire de prompt fonctionnel
- Système d'authentification UI

### Phase 6 : Frontend - DataViz
**Objectifs** :
- Implémenter les graphiques comparatifs
- Créer les nuages de mots
- Développer les matrices de similarité
- Ajouter les visualisations de scores

**Livrables** :
- Tableau de bord DataViz interactif
- Graphiques dynamiques
- Visualisations responsive

### Phase 7 : Fonctionnalités Avancées
**Objectifs** :
- Développer l'historique des prompts
- Implémenter le système d'export (JSON, CSV, PDF, MD)
- Ajouter les filtres et recherche
- Optimisation des performances

**Livrables** :
- Historique fonctionnel
- Export multi-format
- Application optimisée

### Phase 8 : Tests et Démo
**Objectifs** :
- Tests unitaires et d'intégration
- Tests de charge
- Correction des bugs
- Préparation de la démo
- Documentation utilisateur

**Livrables** :
- Application testée et stable
- Documentation complète
- Présentation de démo

---

## 📊 Modèles de Données

### Prompt
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "promptText": "string",
  "aiModels": ["gpt-4", "claude-3", "gemini-pro"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Response
```json
{
  "_id": "ObjectId",
  "promptId": "ObjectId",
  "aiModel": "string",
  "responseText": "string",
  "responseTime": "number (ms)",
  "tokens": "number",
  "scores": {
    "relevance": "number (0-100)",
    "similarity": "number (0-100)",
    "sovereignty": {
      "score": "number (0-100)",
      "serverLocation": "string",
      "rgpdCompliant": "boolean",
      "cloudProvider": "string"
    }
  },
  "nlpAnalysis": {
    "keywords": ["array"],
    "sentiment": "positive|negative|neutral",
    "topics": ["array"]
  },
  "createdAt": "timestamp"
}
```

### User
```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "hashed string",
  "name": "string",
  "apiKeys": {
    "openai": "encrypted string",
    "anthropic": "encrypted string",
    "google": "encrypted string",
    "mistral": "encrypted string"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 🔐 Sécurité

### Bonnes Pratiques
- ✅ Hash des mots de passe (bcrypt)
- ✅ JWT pour l'authentification
- ✅ Chiffrement des clés API utilisateurs
- ✅ Rate limiting pour prévenir les abus
- ✅ Validation des entrées (sanitization)
- ✅ HTTPS en production
- ✅ CORS configuré correctement
- ✅ Variables d'environnement pour secrets

---

## 🌍 Indicateurs de Souveraineté Data

### Critères d'Évaluation
1. **Localisation géographique** : UE, USA, Asie, etc.
2. **Conformité RGPD** : Oui/Non/Partiel
3. **Transparence** : Politique de données claire
4. **Ownership** : Qui possède les données
5. **Retention** : Durée de conservation

### Scoring (0-100)
- 🟢 80-100 : Souverain (serveurs UE, RGPD complet)
- 🟡 50-79 : Acceptable (conformité partielle)
- 🔴 0-49 : Risqué (hors UE, non RGPD)

---

## 📈 KPIs du Projet

### Techniques
- Temps de réponse API < 5s
- Taux de disponibilité > 99%
- Support de 4+ APIs IA minimum
- Score de performance Lighthouse > 90

### Fonctionnels
- Comparaison de 2 à 6 modèles simultanément
- Historique de 100+ prompts par utilisateur
- Export en 4 formats minimum
- Visualisations interactives en temps réel

---

## 🚀 Déploiement

### Environnements
- **Développement** : Local (localhost)
- **Staging** : Serveur de test
- **Production** : Cloud (Vercel/Netlify + Railway/Render)

### CI/CD
- Tests automatisés avant merge
- Déploiement automatique sur main branch
- Monitoring des performances
- Logs centralisés

---

## 📚 Documentation

### À Produire
1. README.md (ce fichier)
2. API Documentation (Swagger)
3. Guide utilisateur
4. Guide développeur
5. Architecture technique détaillée
6. Rapport de soutenance

---

## 👥 Équipe et Rôles

_À compléter selon votre équipe_

---

## 📞 Contact

**Organisme** : Skills4Mind
**Email** : pedagogy@skills4mind.com
**Année** : 2025-2026

---

## 📝 Licence

Ce projet est confidentiel et ne doit pas être diffusé sans l'accord de Skills4Mind.

---

**Version** : 1.0
**Dernière mise à jour** : 31 Décembre 2025
