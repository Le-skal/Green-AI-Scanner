import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ScoreExplanationModal from '../modals/ScoreExplanationModal';

const ResponseCard = ({ response, isFirst, promptText }) => {
  const [modalState, setModalState] = useState({ isOpen: false, metricType: null });

  const openModal = (metricType) => {
    setModalState({ isOpen: true, metricType });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, metricType: null });
  };

  const getModelInfo = (modelId) => {
    const models = {
      gemini: { name: 'Gemini 2.5', provider: 'Google', color: 'sand' },
      mistral: { name: 'Mistral', provider: 'Mistral AI', color: 'ink' },
    };
    return models[modelId] || { name: modelId, provider: 'Unknown', color: 'sand' };
  };

  const modelInfo = getModelInfo(response.aiModel);

  return (
    <div className={`${isFirst ? 'card-dark' : 'card'} space-y-4`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${isFirst ? 'text-sand-50' : 'text-ink-900'}`}>
            {modelInfo.name}
          </h3>
          <p className={`text-sm ${isFirst ? 'text-sand-400' : 'text-ink-600'}`}>
            {modelInfo.provider} · {response.responseTime}ms
          </p>
        </div>
        <span className={`badge ${response.status === 'success' ? 'badge-success' : 'badge-warning'}`}>
          {response.status}
        </span>
      </div>

      {/* Response Text */}
      {response.responseText && (
        <div className={`${isFirst ? 'text-sand-100' : 'text-ink-800'} text-sm leading-relaxed prose prose-sm ${isFirst ? 'prose-invert' : ''} max-w-none`}>
          <ReactMarkdown>{response.responseText}</ReactMarkdown>
        </div>
      )}

      {/* Overall Composite Score - Hero Section */}
      <div className={`pt-4 border-t-2 ${isFirst ? 'border-sand-400' : 'border-ink-900'}`}>
        <div className={`${isFirst ? 'bg-ink-800' : 'bg-ink-900'} text-sand-50 p-4 rounded-lg text-center`}>
          <p className="text-xs font-medium text-sand-400 mb-2">COMPOSITE SCORE</p>
          <p className="text-5xl font-bold mb-1">
            {response.scores?.composite || '-'}
            <span className="text-2xl text-sand-400">/100</span>
          </p>
          <p className="text-xs text-sand-400">
            BM25 (45%) + Sovereignty (25%) + TF-IDF (20%) + Speed (10%)
          </p>
        </div>
      </div>

      {/* Main Metrics - Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Relevance Card */}
        <button
          onClick={() => openModal('relevance')}
          className={`border-2 ${isFirst ? 'border-sand-400 bg-ink-800 hover:bg-ink-700' : 'border-sand-300 bg-sand-50 hover:bg-sand-100'} p-4 rounded-lg transition-colors cursor-pointer text-left`}
        >
          <div className="mb-2">
            <p className={`text-xs font-medium ${isFirst ? 'text-sand-400' : 'text-ink-600'}`}>Relevance</p>
            <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-500'}`}>BM25 Algorithm</p>
          </div>
          <p className={`text-3xl font-bold ${isFirst ? 'text-sand-50' : 'text-ink-900'}`}>
            {response.scores?.relevance || '-'}
            {response.scores?.relevance && <span className="text-lg text-ink-500">/100</span>}
          </p>
        </button>

        {/* Sovereignty Card */}
        <button
          onClick={() => openModal('sovereignty')}
          className={`border-2 ${isFirst ? 'border-sand-400 bg-ink-800 hover:bg-ink-700' : 'border-sand-300 bg-sand-50 hover:bg-sand-100'} p-4 rounded-lg transition-colors cursor-pointer text-left`}
        >
          <div className="mb-2">
            <p className={`text-xs font-medium ${isFirst ? 'text-sand-400' : 'text-ink-600'}`}>Sovereignty</p>
            <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-500'}`}>
              {response.scores?.sovereignty?.serverLocation || 'N/A'}
            </p>
          </div>
          <p className={`text-3xl font-bold ${isFirst ? 'text-sand-50' : 'text-ink-900'}`}>
            {response.scores?.sovereignty?.score || '-'}
            {response.scores?.sovereignty?.score && <span className="text-lg text-ink-500">/100</span>}
          </p>
        </button>

        {/* Similarity Card */}
        <button
          onClick={() => openModal('similarity')}
          className={`border-2 ${isFirst ? 'border-sand-400 bg-ink-800 hover:bg-ink-700' : 'border-sand-300 bg-sand-50 hover:bg-sand-100'} p-4 rounded-lg transition-colors cursor-pointer text-left`}
        >
          <div className="mb-2">
            <p className={`text-xs font-medium ${isFirst ? 'text-sand-400' : 'text-ink-600'}`}>Similarity</p>
            <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-500'}`}>TF-IDF Cosine</p>
          </div>
          <p className={`text-3xl font-bold ${isFirst ? 'text-sand-50' : 'text-ink-900'}`}>
            {response.scores?.similarity || '-'}
            {response.scores?.similarity && <span className="text-lg text-ink-500">/100</span>}
          </p>
        </button>

        {/* Speed Card */}
        <button
          onClick={() => openModal('speed')}
          className={`border-2 ${isFirst ? 'border-sand-400 bg-ink-800 hover:bg-ink-700' : 'border-sand-300 bg-sand-50 hover:bg-sand-100'} p-4 rounded-lg transition-colors cursor-pointer text-left`}
        >
          <div className="mb-2">
            <p className={`text-xs font-medium ${isFirst ? 'text-sand-400' : 'text-ink-600'}`}>Speed</p>
            <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-500'}`}>{response.responseTime}ms</p>
          </div>
          <p className={`text-3xl font-bold ${isFirst ? 'text-sand-50' : 'text-ink-900'}`}>
            {response.scores?.speed || '-'}
            {response.scores?.speed && <span className="text-lg text-ink-500">/100</span>}
          </p>
        </button>
      </div>

      {/* ROUGE & Additional Metrics - Compact Section */}
      {response.scores?.rouge && (
        <button
          onClick={() => openModal('rouge')}
          className={`border ${isFirst ? 'border-ink-700 bg-ink-800 hover:bg-ink-700' : 'border-sand-300 bg-sand-50 hover:bg-sand-100'} p-4 rounded-lg transition-colors cursor-pointer text-left w-full`}
        >
          <p className={`text-xs font-semibold ${isFirst ? 'text-sand-400' : 'text-ink-700'} mb-3`}>
            ROUGE Quality Scores
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-600'} mb-1`}>ROUGE-1</p>
              <p className={`text-sm font-bold ${isFirst ? 'text-sand-200' : 'text-ink-900'}`}>
                {(response.scores.rouge.rouge1 * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-600'} mb-1`}>ROUGE-2</p>
              <p className={`text-sm font-bold ${isFirst ? 'text-sand-200' : 'text-ink-900'}`}>
                {(response.scores.rouge.rouge2 * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-600'} mb-1`}>ROUGE-L</p>
              <p className={`text-sm font-bold ${isFirst ? 'text-sand-200' : 'text-ink-900'}`}>
                {(response.scores.rouge.rougeL * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Green IT - Ecological Impact */}
      {response.greenIT && response.greenIT.ecoScore !== 'N/A' && (
        <div className={`border ${isFirst ? 'border-ink-700 bg-ink-800' : 'border-sand-300 bg-sand-50'} p-4 rounded-lg`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-semibold ${isFirst ? 'text-sand-400' : 'text-ink-700'}`}>
              Ecological Impact (Green IT)
            </p>
            {/* Eco-Score Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              response.greenIT.ecoScore === 'A' ? 'bg-ink-900 text-sand-50' :
              response.greenIT.ecoScore === 'B' ? 'bg-ink-800 text-sand-50' :
              response.greenIT.ecoScore === 'C' ? 'bg-sand-500 text-ink-900' :
              response.greenIT.ecoScore === 'D' ? 'bg-sand-600 text-sand-50' :
              'bg-sand-700 text-sand-50'
            }`}>
              ECO-SCORE: {response.greenIT.ecoScore}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* CO2 Impact */}
            <div className="text-center">
              <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-600'} mb-1`}>CO₂ Impact</p>
              <p className={`text-sm font-bold ${isFirst ? 'text-sand-200' : 'text-ink-900'}`}>
                {response.greenIT.carbon.impactGrams.toFixed(4)}g
              </p>
            </div>

            {/* Energy */}
            <div className="text-center">
              <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-600'} mb-1`}>Energy</p>
              <p className={`text-sm font-bold ${isFirst ? 'text-sand-200' : 'text-ink-900'}`}>
                {response.greenIT.energy.consumedKwh.toFixed(6)} kWh
              </p>
            </div>

            {/* Location */}
            <div className="text-center">
              <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-600'} mb-1`}>Location</p>
              <p className={`text-sm font-bold ${isFirst ? 'text-sand-200' : 'text-ink-900'}`}>
                {response.greenIT.carbon.location}
              </p>
            </div>
          </div>

          {/* Equivalences */}
          <div className={`pt-3 border-t ${isFirst ? 'border-ink-700' : 'border-sand-300'}`}>
            <p className={`text-[10px] ${isFirst ? 'text-sand-500' : 'text-ink-600'} mb-2`}>Equivalences:</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className={`${isFirst ? 'text-sand-300' : 'text-ink-700'}`}>
                {response.greenIT.equivalences.carKm.toFixed(4)} km car
              </div>
              <div className={`${isFirst ? 'text-sand-300' : 'text-ink-700'}`}>
                {response.greenIT.equivalences.smartphoneCharges.toFixed(4)} phone charges
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sovereignty Details - Breakdown */}
      {response.scores?.sovereignty?.breakdown && (
        <div className={`border ${isFirst ? 'border-ink-700 bg-ink-800' : 'border-sand-300 bg-sand-50'} p-4 rounded-lg`}>
          <p className={`text-xs font-semibold ${isFirst ? 'text-sand-400' : 'text-ink-700'} mb-3`}>
            Sovereignty Breakdown
          </p>

          <div className="space-y-2">
            {/* Hosting */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={`${isFirst ? 'text-sand-300' : 'text-ink-600'}`}>
                  Hosting ({response.scores.sovereignty.breakdown.hosting.location})
                </span>
                <span className={`font-semibold ${isFirst ? 'text-sand-100' : 'text-ink-900'}`}>
                  {response.scores.sovereignty.breakdown.hosting.score}/{response.scores.sovereignty.breakdown.hosting.maxScore}
                </span>
              </div>
              <div className="w-full bg-sand-200 rounded-full h-2">
                <div
                  className="bg-sand-500 h-2 rounded-full"
                  style={{width: `${response.scores.sovereignty.breakdown.hosting.percentage}%`}}
                ></div>
              </div>
            </div>

            {/* Company */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={`${isFirst ? 'text-sand-300' : 'text-ink-600'}`}>
                  Company ({response.scores.sovereignty.breakdown.company.nationality})
                </span>
                <span className={`font-semibold ${isFirst ? 'text-sand-100' : 'text-ink-900'}`}>
                  {response.scores.sovereignty.breakdown.company.score}/{response.scores.sovereignty.breakdown.company.maxScore}
                </span>
              </div>
              <div className="w-full bg-sand-200 rounded-full h-2">
                <div
                  className="bg-sand-500 h-2 rounded-full"
                  style={{width: `${response.scores.sovereignty.breakdown.company.percentage}%`}}
                ></div>
              </div>
            </div>

            {/* License */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={`${isFirst ? 'text-sand-300' : 'text-ink-600'}`}>
                  License ({response.scores.sovereignty.breakdown.license.type})
                </span>
                <span className={`font-semibold ${isFirst ? 'text-sand-100' : 'text-ink-900'}`}>
                  {response.scores.sovereignty.breakdown.license.score}/{response.scores.sovereignty.breakdown.license.maxScore}
                </span>
              </div>
              <div className="w-full bg-sand-200 rounded-full h-2">
                <div
                  className="bg-sand-500 h-2 rounded-full"
                  style={{width: `${response.scores.sovereignty.breakdown.license.percentage}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* RGPD & Cloud Act */}
          <div className={`mt-3 pt-3 border-t ${isFirst ? 'border-ink-700' : 'border-sand-300'} flex items-center justify-between flex-wrap gap-2`}>
            {/* RGPD Badge */}
            <span className={`px-2 py-1 rounded text-[10px] font-semibold ${
              response.scores.sovereignty.rgpd?.compliant && response.scores.sovereignty.rgpd?.location === 'France' ?
                'bg-ink-900 text-sand-50' :
              response.scores.sovereignty.rgpd?.compliant ?
                'bg-ink-800 text-sand-50' :
                'bg-sand-700 text-sand-50'
            }`}>
              {response.scores.sovereignty.rgpd?.status || 'Unknown RGPD'}
            </span>

            {/* Cloud Act Risk Badge */}
            {response.scores.sovereignty.cloudActRisk && (
              <span className="px-2 py-1 rounded text-[10px] font-semibold bg-sand-700 text-sand-50">
                Cloud Act Risk
              </span>
            )}

            {/* Sovereignty Level */}
            <span className={`px-2 py-1 rounded text-[10px] font-semibold ${
              response.scores.sovereignty.sovereigntyLevel === 'Excellent' ? 'bg-ink-900 text-sand-50' :
              response.scores.sovereignty.sovereigntyLevel === 'Good' ? 'bg-ink-800 text-sand-50' :
              response.scores.sovereignty.sovereigntyLevel === 'Medium' ? 'bg-sand-500 text-ink-900' :
              'bg-sand-600 text-sand-50'
            }`}>
              {response.scores.sovereignty.sovereigntyLevel}
            </span>
          </div>
        </div>
      )}

      {/* Sovereignty Recommendations */}
      {response.scores?.sovereignty?.recommendations && response.scores.sovereignty.recommendations.length > 0 && (
        <div className={`border ${isFirst ? 'border-ink-700 bg-ink-800' : 'border-sand-300 bg-sand-50'} p-4 rounded-lg`}>
          <p className={`text-xs font-semibold ${isFirst ? 'text-sand-400' : 'text-ink-700'} mb-3`}>
            Security Recommendations
          </p>

          <div className="space-y-2">
            {response.scores.sovereignty.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border-l-4 ${
                  rec.priority === 'High' ? 'border-ink-900 bg-ink-50' :
                  rec.priority === 'Medium' ? 'border-ink-800 bg-sand-50' :
                  rec.priority === 'Low' ? 'border-sand-600 bg-sand-100' :
                  'border-sand-500 bg-sand-50'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded ${
                    rec.priority === 'High' ? 'bg-ink-900 text-sand-50' :
                    rec.priority === 'Medium' ? 'bg-ink-800 text-sand-50' :
                    rec.priority === 'Low' ? 'bg-sand-600 text-sand-50' :
                    'bg-sand-500 text-ink-900'
                  }`}>
                    {rec.type} - {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-ink-800 mb-1">{rec.message}</p>
                <p className="text-[10px] text-ink-600 italic">→ {rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Word Count & Location */}
      <div className="flex items-center justify-between text-xs">
        <div className={`${isFirst ? 'text-sand-400' : 'text-ink-600'}`}>
          {response.nlpAnalysis?.wordCount || 0} words
        </div>
        {response.scores?.sovereignty?.serverLocation && (
          <div className={`px-3 py-1 rounded-full ${isFirst ? 'bg-ink-700 text-sand-300' : 'bg-sand-200 text-ink-800'} text-xs font-medium`}>
            {response.scores.sovereignty.serverLocation}
          </div>
        )}
      </div>

      {/* Score Explanation Modal */}
      <ScoreExplanationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        metricType={modalState.metricType}
        score={
          modalState.metricType === 'relevance' ? response.scores?.relevance :
          modalState.metricType === 'similarity' ? response.scores?.similarity :
          modalState.metricType === 'sovereignty' ? response.scores?.sovereignty?.score :
          modalState.metricType === 'speed' ? response.scores?.speed :
          null
        }
        responseData={response}
        promptText={promptText}
      />
    </div>
  );
};

export default ResponseCard;
