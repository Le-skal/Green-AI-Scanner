const WordCloud = ({ responses }) => {
  if (!responses || responses.length === 0) return null;

  // Aggregate keywords from all responses
  const keywordMap = {};

  responses.forEach((response) => {
    const keywords = response.nlpAnalysis?.keywords || [];
    keywords.forEach(keyword => {
      if (keywordMap[keyword]) {
        keywordMap[keyword]++;
      } else {
        keywordMap[keyword] = 1;
      }
    });
  });

  // Sort keywords by frequency
  const sortedKeywords = Object.entries(keywordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30); // Top 30 keywords

  if (sortedKeywords.length === 0) return null;

  // Calculate font sizes based on frequency
  const maxFreq = Math.max(...sortedKeywords.map(k => k[1]));
  const minFreq = Math.min(...sortedKeywords.map(k => k[1]));

  const getFontSize = (freq) => {
    const minSize = 12;
    const maxSize = 32;
    if (maxFreq === minFreq) return maxSize;
    return minSize + ((freq - minFreq) / (maxFreq - minFreq)) * (maxSize - minSize);
  };

  const getColor = (index) => {
    const colors = ['#a89263', '#c5b083', '#8a7447', '#292524', '#57534e'];
    return colors[index % colors.length];
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-ink-900 mb-4 border-b border-sand-300 pb-3">
        Keyword Cloud
      </h3>

      <div className="flex flex-wrap gap-3 items-center justify-center min-h-[250px] p-6">
        {sortedKeywords.map(([keyword, frequency], index) => (
          <div
            key={keyword}
            className="inline-block transition-transform hover:scale-110"
            style={{
              fontSize: `${getFontSize(frequency)}px`,
              color: getColor(index),
              fontWeight: frequency > maxFreq * 0.7 ? '600' : '500',
              lineHeight: '1.5',
            }}
          >
            {keyword}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-sand-300">
        <div className="flex items-center justify-between text-xs text-ink-600">
          <span>
            Total unique keywords: <span className="font-semibold text-ink-900">{sortedKeywords.length}</span>
          </span>
          <span>
            Most frequent: <span className="font-semibold text-ink-900">{sortedKeywords[0]?.[0]}</span> ({sortedKeywords[0]?.[1]}x)
          </span>
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
