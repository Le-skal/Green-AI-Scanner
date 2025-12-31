const ResponseCard = ({ response, isFirst }) => {
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
        <div className={`${isFirst ? 'text-sand-100' : 'text-ink-800'} text-sm leading-relaxed`}>
          {response.responseText}
        </div>
      )}

      {/* Scores */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t ${isFirst ? 'border-ink-700' : 'border-sand-300'}">
        <div>
          <p className={`text-xs ${isFirst ? 'text-sand-400' : 'text-ink-600'} mb-1`}>Relevance</p>
          <p className={`text-2xl font-bold ${isFirst ? 'text-sand-50' : 'text-ink-900'}`}>
            {response.scores?.relevance || '-'}/100
          </p>
        </div>
        <div>
          <p className={`text-xs ${isFirst ? 'text-sand-400' : 'text-ink-600'} mb-1`}>Similarity</p>
          <p className={`text-2xl font-bold ${isFirst ? 'text-sand-50' : 'text-ink-900'}`}>
            {response.scores?.similarity || '-'}/100
          </p>
        </div>
        <div>
          <p className={`text-xs ${isFirst ? 'text-sand-400' : 'text-ink-600'} mb-1`}>Sovereignty</p>
          <p className={`text-2xl font-bold ${isFirst ? 'text-sand-50' : 'text-ink-900'}`}>
            {response.scores?.sovereignty?.score || '-'}/100
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className={`${isFirst ? 'text-sand-400' : 'text-ink-600'}`}>Location</p>
          <p className={`font-medium ${isFirst ? 'text-sand-200' : 'text-ink-800'}`}>
            {response.scores?.sovereignty?.serverLocation || '-'}
          </p>
        </div>
        <div>
          <p className={`${isFirst ? 'text-sand-400' : 'text-ink-600'}`}>Word Count</p>
          <p className={`font-medium ${isFirst ? 'text-sand-200' : 'text-ink-800'}`}>
            {response.nlpAnalysis?.wordCount || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
