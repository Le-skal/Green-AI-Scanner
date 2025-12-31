import { useState } from 'react';

const PromptInput = ({ onSubmit, loading }) => {
  const [promptText, setPromptText] = useState('');
  const [selectedModels, setSelectedModels] = useState(['gemini', 'mistral']);

  const aiModels = [
    { id: 'gemini', name: 'Gemini 2.5', provider: 'Google', sovereignty: 60 },
    { id: 'mistral', name: 'Mistral', provider: 'Mistral AI', sovereignty: 90 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (promptText.trim() && selectedModels.length > 0) {
      onSubmit({ promptText, aiModels: selectedModels });
    }
  };

  const toggleModel = (modelId) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Textarea */}
        <div>
          <label className="label">
            Enter your prompt
          </label>
          <textarea
            className="textarea-field"
            rows="4"
            placeholder="Ask a question to compare AI responses..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Model Selection */}
        <div>
          <label className="label">
            Select AI Models
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiModels.map(model => (
              <button
                key={model.id}
                type="button"
                onClick={() => toggleModel(model.id)}
                disabled={loading}
                className={`
                  p-3 border transition-all text-left
                  ${selectedModels.includes(model.id)
                    ? 'bg-ink-900 border-ink-900 text-sand-50'
                    : 'bg-white border-sand-400 text-ink-900 hover:border-ink-900'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{model.name}</p>
                    <p className={`text-xs ${selectedModels.includes(model.id) ? 'text-sand-400' : 'text-ink-500'}`}>
                      {model.provider}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${selectedModels.includes(model.id) ? 'text-sand-400' : 'text-ink-500'}`}>
                      Sovereignty
                    </p>
                    <p className={`text-sm font-medium ${selectedModels.includes(model.id) ? 'text-sand-100' : 'text-ink-900'}`}>
                      {model.sovereignty}/100
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-ink-600">
            {selectedModels.length} model{selectedModels.length > 1 ? 's' : ''} selected
          </p>
          <button
            type="submit"
            disabled={loading || !promptText.trim() || selectedModels.length === 0}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </span>
            ) : (
              'Aggregate Responses'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;
