# Guide des APIs IA Gratuites

## 🆓 APIs IA 100% Gratuites pour le Projet

### 1. Google Gemini API ⭐ (RECOMMANDÉ)

**Avantages** :
- Complètement gratuit
- Quotas généreux (60 requêtes/minute)
- Modèle puissant (Gemini Pro)
- Support multimodal (texte + images)

**Comment obtenir la clé** :
1. Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Se connecter avec un compte Google
3. Cliquer sur "Get API Key"
4. Copier la clé

**Documentation** : https://ai.google.dev/docs

**Limite gratuite** :
- 60 requêtes/minute
- 1 million tokens/jour

---

### 2. Mistral AI API

**Avantages** :
- Gratuit avec crédit initial
- Modèle open source français
- Bonne performance
- Souveraineté européenne (serveurs en Europe)

**Comment obtenir la clé** :
1. Aller sur [Mistral AI Console](https://console.mistral.ai/)
2. Créer un compte
3. Obtenir une clé API gratuite

**Documentation** : https://docs.mistral.ai/

**Limite gratuite** :
- Crédit de départ gratuit
- Modèle "mistral-tiny" gratuit

---

### 3. Hugging Face Inference API

**Avantages** :
- Accès à des milliers de modèles open source
- Llama 2, Falcon, Mistral, etc.
- Complètement gratuit
- Communauté très active

**Comment obtenir la clé** :
1. Créer un compte sur [Hugging Face](https://huggingface.co/join)
2. Aller dans Settings → Access Tokens
3. Créer un nouveau token (Read access suffit)

**Documentation** : https://huggingface.co/docs/api-inference/

**Modèles recommandés** :
- `meta-llama/Llama-2-7b-chat-hf`
- `mistralai/Mistral-7B-Instruct-v0.2`
- `tiiuae/falcon-7b-instruct`
- `google/flan-t5-large`

**Limite gratuite** :
- Illimité (avec rate limiting)
- Peut être lent aux heures de pointe

---

### 4. Cohere API

**Avantages** :
- Tier gratuit généreux
- Spécialisé dans le NLP
- Bonne performance pour l'analyse sémantique
- API simple

**Comment obtenir la clé** :
1. S'inscrire sur [Cohere](https://cohere.com/)
2. Obtenir la clé API gratuite

**Documentation** : https://docs.cohere.com/

**Limite gratuite** :
- 5 000 requêtes/mois (Production Trial Key)
- 100 requêtes/minute

---

### 5. Anthropic Claude (Limited Free Tier)

**Note** : Tier gratuit limité mais intéressant pour comparaison

**Comment obtenir** :
1. S'inscrire sur [Anthropic Console](https://console.anthropic.com/)
2. $5 de crédit gratuit

---

## 🎯 Configuration Recommandée pour le Projet

### Stack d'APIs Gratuites

```
1. Google Gemini      → API principale (rapide, puissante, gratuite)
2. Mistral AI         → Alternative européenne (souveraineté)
3. Hugging Face       → Accès à plusieurs modèles open source
4. Cohere             → Analyse sémantique et NLP
```

### Fichier .env

```env
# APIs Gratuites
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here
COHERE_API_KEY=your_cohere_api_key_here
```

---

## 📊 Comparaison des APIs Gratuites

| API | Gratuit | Limite | Vitesse | Qualité | Souveraineté |
|-----|---------|--------|---------|---------|--------------|
| **Gemini** | ✅ Oui | 60/min | ⚡⚡⚡ Rapide | 🌟🌟🌟 Excellent | 🇺🇸 USA |
| **Mistral** | ✅ Oui (crédit) | Variable | ⚡⚡ Moyen | 🌟🌟 Bon | 🇪🇺 EU |
| **Hugging Face** | ✅ Oui | Rate limit | ⚡ Lent | 🌟🌟 Variable | 🌍 Divers |
| **Cohere** | ✅ Oui (5k/mois) | 5000/mois | ⚡⚡ Moyen | 🌟🌟 Bon | 🇺🇸 USA |

---

## 🔐 Scoring de Souveraineté Data

### Gemini (Google)
- **Localisation** : USA (datacenters mondiaux)
- **RGPD** : Conformité partielle
- **Score** : 60/100
- **Remarque** : Gratuit mais données aux USA

### Mistral AI
- **Localisation** : Europe (France)
- **RGPD** : Conformité totale
- **Score** : 90/100
- **Remarque** : Solution souveraine européenne ⭐

### Hugging Face
- **Localisation** : USA/EU (variable selon le modèle)
- **RGPD** : Dépend de l'hébergement
- **Score** : 70/100
- **Remarque** : Open source, données flexibles

### Cohere
- **Localisation** : USA/Canada
- **RGPD** : Conformité partielle
- **Score** : 55/100

---

## 💡 Conseils d'Utilisation

### Pour maximiser les quotas gratuits :

1. **Cache les réponses** : Éviter de refaire les mêmes requêtes
2. **Rate limiting côté backend** : Limiter les requêtes utilisateur
3. **Rotation des APIs** : Utiliser différentes APIs selon la charge
4. **Fallback système** : Si une API est saturée, utiliser une autre

### Exemple de stratégie :

```javascript
// Ordre de priorité
1. Gemini (rapide, généreux)
2. Mistral (si Gemini rate limit)
3. Hugging Face (backup)
4. Cohere (pour NLP spécifique)
```

---

## 🚀 Installation Rapide

### Gemini

```bash
npm install @google/generative-ai
```

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent("Hello!");
console.log(result.response.text());
```

### Mistral

```bash
npm install @mistralai/mistralai
```

```javascript
import MistralClient from '@mistralai/mistralai';

const client = new MistralClient(process.env.MISTRAL_API_KEY);
const response = await client.chat({
  model: 'mistral-tiny',
  messages: [{role: 'user', content: 'Hello!'}],
});
```

### Hugging Face

```bash
npm install @huggingface/inference
```

```javascript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const result = await hf.textGeneration({
  model: 'mistralai/Mistral-7B-Instruct-v0.2',
  inputs: 'Hello!',
});
```

### Cohere

```bash
npm install cohere-ai
```

```javascript
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const response = await cohere.generate({
  prompt: "Hello!",
  model: "command",
});
```

---

## ⚠️ Limitations à Connaître

### Rate Limiting
- Implémenter un système de queue
- Afficher un loader à l'utilisateur
- Message d'erreur clair si quota dépassé

### Qualité Variable
- Les modèles gratuits peuvent être moins performants
- Compenser par l'agrégation de plusieurs réponses
- Le scoring de similarité devient encore plus important

### Temps de Réponse
- Hugging Face peut être lent (modèles sur serveurs partagés)
- Utiliser des timeouts appropriés
- Interface responsive avec feedback utilisateur

---

## 📈 Métriques à Suivre

Pour le projet, tracker :
- Nombre de requêtes par API
- Temps de réponse moyen
- Taux d'erreur/quota dépassé
- Coût théorique si c'était payant

---

**Dernière mise à jour** : 31 Décembre 2025
