const SimilarityMatrix = ({ matrix, responses }) => {
  if (!matrix || matrix.length === 0 || !responses) return null;

  const modelNames = responses.map(r => {
    const names = {
      gemini: 'Gemini',
      mistral: 'Mistral',
      huggingface: 'HF',
      cohere: 'Cohere',
    };
    return names[r.aiModel] || r.aiModel;
  });

  const getColorClass = (value) => {
    if (value >= 80) return 'bg-ink-900 text-sand-50';
    if (value >= 60) return 'bg-ink-700 text-sand-50';
    if (value >= 40) return 'bg-sand-700 text-white';
    if (value >= 20) return 'bg-sand-400 text-ink-900';
    return 'bg-sand-200 text-ink-900';
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-ink-900 mb-4 border-b border-sand-300 pb-3">
        Similarity Matrix
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-sand-400 p-2 bg-sand-100 text-ink-900 text-sm font-medium">
                Model
              </th>
              {modelNames.map((name, i) => (
                <th
                  key={i}
                  className="border border-sand-400 p-2 bg-sand-100 text-ink-900 text-sm font-medium"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="border border-sand-400 p-2 bg-sand-100 text-ink-900 text-sm font-medium">
                  {modelNames[i]}
                </td>
                {row.map((value, j) => (
                  <td
                    key={j}
                    className={`border border-sand-400 p-2 text-center ${getColorClass(value)}`}
                  >
                    <div className="font-semibold text-lg">
                      {value}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-ink-900 border border-ink-700"></div>
          <span>High (80-100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-sand-700 border border-sand-800"></div>
          <span>Medium (40-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-sand-200 border border-sand-400"></div>
          <span>Low (0-39%)</span>
        </div>
      </div>
    </div>
  );
};

export default SimilarityMatrix;
