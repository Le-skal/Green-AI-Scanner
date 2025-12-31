const ComparisonSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="card space-y-6">
      <h2 className="text-xl font-semibold text-ink-900 border-b border-sand-300 pb-3">
        Comparative Analysis
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-sand-300 p-4">
          <p className="text-xs text-ink-600 mb-1">Total Responses</p>
          <p className="text-3xl font-bold text-ink-900">{summary.totalResponses}</p>
          <p className="text-xs text-ink-600 mt-1">
            {summary.successfulResponses} successful
          </p>
        </div>

        <div className="border border-sand-300 p-4">
          <p className="text-xs text-ink-600 mb-1">Avg Relevance</p>
          <p className="text-3xl font-bold text-ink-900">{summary.averageRelevance}</p>
          <p className="text-xs text-ink-600 mt-1">out of 100</p>
        </div>

        <div className="border border-sand-300 p-4">
          <p className="text-xs text-ink-600 mb-1">Consensus</p>
          <p className="text-3xl font-bold text-ink-900">{summary.consensusLevel}%</p>
          <p className="text-xs text-ink-600 mt-1">similarity</p>
        </div>

        <div className="border border-sand-300 p-4">
          <p className="text-xs text-ink-600 mb-1">Avg Time</p>
          <p className="text-3xl font-bold text-ink-900">
            {(summary.averageResponseTime / 1000).toFixed(1)}s
          </p>
          <p className="text-xs text-ink-600 mt-1">response time</p>
        </div>
      </div>

      {/* Best Response */}
      {summary.bestResponse && (
        <div className="border-l-4 border-ink-900 bg-sand-50 p-4">
          <p className="text-xs font-medium text-ink-700 mb-1">BEST RESPONSE</p>
          <p className="text-lg font-semibold text-ink-900">
            {summary.bestResponse.model}
          </p>
          <p className="text-sm text-ink-600">
            Relevance score: {summary.bestResponse.relevance}/100
          </p>
        </div>
      )}

      {/* Sovereignty Distribution */}
      {summary.sovereigntyDistribution && (
        <div>
          <h3 className="text-sm font-semibold text-ink-900 mb-3">
            Data Sovereignty Distribution
          </h3>
          <div className="flex gap-3">
            {Object.entries(summary.sovereigntyDistribution).map(([location, count]) => (
              <div key={location} className="badge badge-dark">
                {location}: {count}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonSummary;
