# Guide de Démarrage Rapide

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (local ou Atlas)
- Git
- Un éditeur de code (VS Code recommandé)

---

## 🚀 Étapes d'Installation

### 1. Backend

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env à partir de .env.example
cp .env.example .env

# Éditer le fichier .env avec vos configurations
# - Ajouter vos clés API
# - Configurer l'URI MongoDB
# - Définir le JWT_SECRET

# Démarrer le serveur en mode développement
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

---

### 2. Frontend

```bash
# Naviguer vers le dossier frontend (depuis la racine du projet)
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

---

## 🔧 Configuration MongoDB

### Option 1 : MongoDB Local

1. Installer MongoDB Community Edition
2. Démarrer MongoDB :
   ```bash
   mongod
   ```
3. Dans `.env`, utiliser :
   ```
   MONGODB_URI=mongodb://localhost:27017/ai-aggregator
   ```

### Option 2 : MongoDB Atlas (Cloud)

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Obtenir l'URI de connexion
4. Dans `.env`, utiliser :
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-aggregator
   ```

---

## 🔑 Obtenir les Clés API (100% GRATUIT)

> 📌 **Ce projet utilise uniquement des APIs GRATUITES !**
>
> Consultez `FREE_AI_APIS.md` pour le guide complet

### 🌟 Google Gemini (RECOMMANDÉ - Gratuit)
1. Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Se connecter avec un compte Google
3. Cliquer sur "Get API Key"
4. Ajouter dans `.env` : `GOOGLE_GEMINI_API_KEY=...`

**Limite** : 60 requêtes/minute - Gratuit

### 🇪🇺 Mistral AI (Gratuit - Souverain EU)
1. S'inscrire sur [Mistral AI Console](https://console.mistral.ai/)
2. Créer une clé API gratuite
3. Ajouter dans `.env` : `MISTRAL_API_KEY=...`

**Limite** : Crédit gratuit - Serveurs en Europe

### 🤗 Hugging Face (Gratuit - Open Source)
1. Créer un compte sur [Hugging Face](https://huggingface.co/join)
2. Settings → Access Tokens → Créer un token
3. Ajouter dans `.env` : `HUGGINGFACE_API_KEY=...`

**Limite** : Illimité (avec rate limiting)

### 🔵 Cohere (Gratuit - 5000 req/mois)
1. S'inscrire sur [Cohere](https://cohere.com/)
2. Obtenir la clé API gratuite
3. Ajouter dans `.env` : `COHERE_API_KEY=...`

**Limite** : 5 000 requêtes/mois

---

## ✅ Vérification de l'Installation

### Backend
```bash
# Tester que le serveur répond
curl http://localhost:5000
# ou ouvrir dans le navigateur
```

Réponse attendue :
```json
{
  "message": "API Agrégateur IA - Backend",
  "version": "1.0.0",
  "status": "running"
}
```

### Frontend
Ouvrir `http://localhost:5173` dans le navigateur

---

## 📁 Structure Actuelle du Projet

```
ProjetFinale3/
├── README.md              # Cahier des charges complet
├── STRUCTURE.md           # Explication de la structure
├── QUICK_START.md         # Ce guide
├── .gitignore
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.js       ✅ Serveur configuré
│   ├── package.json        ✅ Dépendances définies
│   └── .env.example        ✅ Template de configuration
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── hooks/
    │   ├── contexts/
    │   ├── utils/
    │   ├── assets/
    │   ├── App.jsx          ✅ App principale
    │   └── main.jsx         ✅ Point d'entrée
    ├── index.html           ✅ Template HTML
    ├── package.json         ✅ Dépendances définies
    ├── vite.config.js       ✅ Configuration Vite
    ├── tailwind.config.js   ✅ Configuration Tailwind
    └── postcss.config.js    ✅ Configuration PostCSS
```

---

## 🎯 Prochaines Étapes

1. ✅ Installer les dépendances (backend + frontend)
2. ✅ Configurer le fichier `.env`
3. ✅ Tester que les serveurs démarrent correctement
4. 🔄 Configurer la connexion MongoDB
5. 🔄 Créer les modèles de données (User, Prompt, Response)
6. 🔄 Développer les routes API
7. 🔄 Créer les composants frontend
8. 🔄 Intégrer les APIs IA

---

## 🆘 Troubleshooting

### Erreur : "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Port already in use"
```bash
# Backend (port 5000)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Erreur MongoDB connexion
- Vérifier que MongoDB est démarré
- Vérifier l'URI dans `.env`
- Vérifier les whitelist IP sur MongoDB Atlas

---

## 📝 Commandes Utiles

### Backend
```bash
npm run dev      # Démarrage en mode développement (avec nodemon)
npm start        # Démarrage en mode production
npm test         # Lancer les tests
```

### Frontend
```bash
npm run dev      # Démarrage serveur de développement
npm run build    # Build pour production
npm run preview  # Prévisualiser le build de production
```

---

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Dernière mise à jour** : 31 Décembre 2025
