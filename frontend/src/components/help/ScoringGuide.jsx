import { useState } from 'react';

/**
 * Guide pédagogique collapsible expliquant le système de scoring scientifique
 */
const ScoringGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card mb-6">
      {/* Header cliquable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h2 className="text-lg font-semibold text-ink-900">
            How We Score AI Models Scientifically
          </h2>
          <p className="text-sm text-ink-600">
            Click to understand our validated scoring methodology
          </p>
        </div>
        <span className="text-2xl text-ink-600 font-bold">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {/* Contenu collapsible */}
      {isOpen && (
        <div className="mt-6 space-y-6 border-t border-sand-300 pt-6">
          {/* Introduction */}
          <div className="bg-sand-50 p-4 border-l-4 border-ink-900">
            <p className="text-sm text-ink-800 leading-relaxed">
              Unlike arbitrary scoring methods, our system uses <strong>scientifically validated algorithms</strong> from
              academic research in Information Retrieval and Natural Language Processing. Each metric has been proven
              through peer-reviewed studies.
            </p>
          </div>

          {/* Métriques */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* BM25 */}
            <div className="border border-sand-300 p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-ink-900">Relevance (BM25)</h3>
                <p className="text-xs text-ink-600">Weight: 45% - Most Important</p>
              </div>
              <p className="text-sm text-ink-700 mb-2">
                <strong>What it measures:</strong> How well the response matches your question
              </p>
              <p className="text-xs text-ink-600 mb-2">
                <strong>Algorithm:</strong> BM25 (Best Matching 25) - the same ranking algorithm used by Elasticsearch
              </p>
              <p className="text-xs text-ink-600">
                <strong>Reference:</strong> Robertson & Zaragoza (2009)
              </p>
            </div>

            {/* Sovereignty */}
            <div className="border border-sand-300 p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-ink-900">Data Sovereignty (Dynamic)</h3>
                <p className="text-xs text-ink-600">Weight: 25% - Privacy Matters</p>
              </div>
              <p className="text-sm text-ink-700 mb-2">
                <strong>What it measures:</strong> Data sovereignty calculated with 3 components (0-100)
              </p>
              <p className="text-xs text-ink-600 mb-2">
                <strong>Formula:</strong> Hosting (50pts) + Company (30pts) + License (20pts)
              </p>
              <p className="text-xs text-ink-600 mb-1">
                <strong>Hosting:</strong> France=50, EU=40, USA=20
              </p>
              <p className="text-xs text-ink-600 mb-1">
                <strong>Company:</strong> France=30, EU=25, USA=15
              </p>
              <p className="text-xs text-ink-600 mb-2">
                <strong>License:</strong> Open Source=20, Open Weights=15, Proprietary=5
              </p>
              <p className="text-xs text-ink-600">
                <strong>Features:</strong> RGPD compliance, Cloud Act Risk detection, recommendations
              </p>
            </div>

            {/* Green IT */}
            <div className="border border-sand-300 p-4 bg-green-50">
              <div className="mb-3">
                <h3 className="font-semibold text-ink-900">Green IT Impact (NEW)</h3>
                <p className="text-xs text-ink-600">Ecological Footprint Analysis</p>
              </div>
              <p className="text-sm text-ink-700 mb-2">
                <strong>What it measures:</strong> CO2 emissions and energy consumption per request
              </p>
              <p className="text-xs text-ink-600 mb-1">
                <strong>Energy:</strong> kWh per 1000 tokens (Mistral=0.002, Gemini=0.005)
              </p>
              <p className="text-xs text-ink-600 mb-1">
                <strong>Carbon:</strong> France=50g CO2/kWh, USA=380g CO2/kWh (IEA 2024)
              </p>
              <p className="text-xs text-ink-600 mb-2">
                <strong>Eco-Score:</strong> A to E rating (like Nutri-score)
              </p>
              <p className="text-xs text-ink-600">
                <strong>Result:</strong> Mistral (France) is 7.6x more eco-friendly than Gemini (USA)
              </p>
            </div>

            {/* Similarity */}
            <div className="border border-sand-300 p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-ink-900">Similarity (TF-IDF)</h3>
                <p className="text-xs text-ink-600">Weight: 20% - Consensus</p>
              </div>
              <p className="text-sm text-ink-700 mb-2">
                <strong>What it measures:</strong> Agreement between different AI models
              </p>
              <p className="text-xs text-ink-600 mb-2">
                <strong>Algorithm:</strong> Cosine Similarity on TF-IDF vectors
              </p>
              <p className="text-xs text-ink-600">
                <strong>Reference:</strong> Salton & McGill (1983)
              </p>
            </div>

            {/* Speed */}
            <div className="border border-sand-300 p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-ink-900">Speed</h3>
                <p className="text-xs text-ink-600">Weight: 10% - Efficiency</p>
              </div>
              <p className="text-sm text-ink-700 mb-2">
                <strong>What it measures:</strong> Response time efficiency
              </p>
              <p className="text-xs text-ink-600 mb-2">
                <strong>Scoring:</strong> Faster responses get higher scores
              </p>
              <p className="text-xs text-ink-600">
                <strong>Why:</strong> Green computing and user experience
              </p>
            </div>
          </div>

          {/* Formule Composite */}
          <div className="bg-ink-900 text-sand-50 p-4">
            <h3 className="font-semibold mb-3">
              Final Composite Score Formula
            </h3>
            <div className="font-mono text-sm bg-ink-800 p-3 rounded">
              Composite = (Relevance × 45%) + (Sovereignty × 25%) + (Similarity × 20%) + (Speed × 10%)
            </div>
            <p className="text-xs text-sand-400 mt-3">
              The model with the <strong>highest composite score</strong> is ranked first. This weighted approach ensures
              that quality (relevance) is prioritized while still considering privacy, consensus, and efficiency.
            </p>
          </div>

          {/* ROUGE (Advanced) */}
          <div className="border border-sand-300 p-4 bg-sand-50">
            <h3 className="font-semibold text-ink-900 mb-2">
              Advanced Metrics: ROUGE Scores
            </h3>
            <p className="text-sm text-ink-700 mb-2">
              ROUGE (Recall-Oriented Understudy for Gisting Evaluation) measures the quality of generated text.
            </p>
            <div className="text-xs text-ink-600 space-y-1">
              <p><strong>ROUGE-1:</strong> Unigram (single word) overlap with your question</p>
              <p><strong>ROUGE-2:</strong> Bigram (two-word phrase) overlap</p>
              <p><strong>ROUGE-L:</strong> Longest common subsequence</p>
              <p className="mt-2 italic">These metrics are used in academic NLP research to evaluate summarization quality.</p>
            </div>
          </div>

          {/* Academic References */}
          <div className="text-xs text-ink-600 bg-sand-50 p-3 border-l-4 border-sand-400">
            <p className="font-semibold mb-2">Academic References:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Robertson & Zaragoza (2009) - BM25 Framework</li>
              <li>Salton & McGill (1983) - Information Retrieval</li>
              <li>Lin (2004) - ROUGE Evaluation Metrics</li>
              <li>Manning et al. (2008) - IR Composite Scoring</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoringGuide;
