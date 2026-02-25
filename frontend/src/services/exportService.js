/**
 * Export Service - Handles exporting prompt results to various formats
 */

/**
 * Download a file with the given content
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data as JSON
 */
export const exportToJSON = (data, filename = 'prompt-results') => {
  // Find winner (highest composite score)
  const winner = data.responses?.reduce((best, current) => {
    const currentScore = current.scores?.composite || 0;
    const bestScore = best?.scores?.composite || 0;
    return currentScore > bestScore ? current : best;
  }, data.responses[0]);

  // Enhanced data with winner analysis
  const enhancedData = {
    ...data,
    comparativeAnalysis: {
      winner: {
        model: winner?.aiModel || 'Unknown',
        compositeScore: winner?.scores?.composite || 0,
        breakdown: {
          relevance: {
            score: winner?.scores?.relevance || 0,
            weight: 0.45,
            contribution: ((winner?.scores?.relevance || 0) * 0.45).toFixed(1)
          },
          sovereignty: {
            score: winner?.scores?.sovereignty?.score || 0,
            weight: 0.25,
            contribution: ((winner?.scores?.sovereignty?.score || 0) * 0.25).toFixed(1)
          },
          similarity: {
            score: winner?.scores?.similarity || 0,
            weight: 0.20,
            contribution: ((winner?.scores?.similarity || 0) * 0.2).toFixed(1)
          },
          speed: {
            score: winner?.scores?.speed || 0,
            weight: 0.10,
            contribution: ((winner?.scores?.speed || 0) * 0.1).toFixed(1)
          }
        },
        formula: 'Composite = (Relevance × 45%) + (Sovereignty × 25%) + (Similarity × 20%) + (Speed × 10%)'
      },
      exportedAt: new Date().toISOString()
    }
  };

  const jsonContent = JSON.stringify(enhancedData, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
};

/**
 * Export data as CSV
 */
export const exportToCSV = (data, filename = 'prompt-results') => {
  if (!data.responses || data.responses.length === 0) {
    alert('No data to export');
    return;
  }

  // Find winner (highest composite score)
  const winner = data.responses.reduce((best, current) => {
    const currentScore = current.scores?.composite || 0;
    const bestScore = best?.scores?.composite || 0;
    return currentScore > bestScore ? current : best;
  }, data.responses[0]);

  // Summary section
  const summarySection = [
    '=== COMPARATIVE ANALYSIS ===',
    `Winner: ${winner.aiModel}`,
    `Winning Score: ${winner.scores?.composite || 0}/100`,
    '',
    '=== SCORE BREAKDOWN ===',
    `Relevance: ${winner.scores?.relevance || 0} × 45% = ${((winner.scores?.relevance || 0) * 0.45).toFixed(1)}`,
    `Sovereignty: ${winner.scores?.sovereignty?.score || 0} × 25% = ${((winner.scores?.sovereignty?.score || 0) * 0.25).toFixed(1)}`,
    `Similarity: ${winner.scores?.similarity || 0} × 20% = ${((winner.scores?.similarity || 0) * 0.2).toFixed(1)}`,
    `Speed: ${winner.scores?.speed || 0} × 10% = ${((winner.scores?.speed || 0) * 0.1).toFixed(1)}`,
    '',
    '=== INDIVIDUAL RESPONSES ==='
  ];

  // CSV Headers
  const headers = [
    'AI Model',
    'Composite Score',
    'Status',
    'Response Time (ms)',
    'Relevance Score',
    'Similarity Score',
    'Sovereignty Score',
    'Speed Score',
    'Location',
    'GDPR Compliant',
    'Eco-Score',
    'CO2 Impact (g)',
    'Response Text (truncated)'
  ];

  // CSV Rows
  const rows = data.responses.map(response => [
    response.aiModel || response.model || '-',
    response.scores?.composite || '-',
    response.status || '-',
    response.responseTime || '-',
    response.scores?.relevance || '-',
    response.scores?.similarity || '-',
    response.scores?.sovereignty?.score || response.sovereignty?.score || '-',
    response.scores?.speed || '-',
    response.scores?.sovereignty?.metadata?.serverLocation || '-',
    response.scores?.sovereignty?.rgpd?.compliant ? 'Yes' : 'No',
    response.greenIT?.ecoScore || '-',
    response.greenIT?.carbon?.impactGrams || '-',
    response.responseText ? `"${response.responseText.substring(0, 200).replace(/"/g, '""')}..."` : '-'
  ]);

  // Combine all sections
  const csvContent = [
    ...summarySection,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Export data as PDF
 */
export const exportToPDF = (data, filename = 'prompt-results') => {
  // Create HTML content for PDF
  const htmlContent = generatePDFHTML(data);

  // Create a temporary window to print
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

/**
 * Generate HTML for PDF export
 */
const generatePDFHTML = (data) => {
  const prompt = data.prompt || {};
  const responses = data.responses || [];
  const summary = data.summary || {};
  const metadata = data.metadata || {};

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>AI Aggregator - Prompt Results</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          color: #1a1a1a;
        }
        h1 {
          color: #1a1a1a;
          border-bottom: 3px solid #d4c5a9;
          padding-bottom: 10px;
        }
        h2 {
          color: #1a1a1a;
          margin-top: 30px;
          border-bottom: 2px solid #e8dcc4;
          padding-bottom: 8px;
        }
        .metadata {
          background: #f5f1e8;
          border: 1px solid #d4c5a9;
          padding: 15px;
          margin: 20px 0;
        }
        .metadata-item {
          margin: 8px 0;
        }
        .metadata-label {
          font-weight: bold;
          color: #666;
        }
        .summary {
          background: #f5f1e8;
          border: 1px solid #d4c5a9;
          padding: 15px;
          margin: 20px 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-value {
          font-size: 24px;
          font-weight: bold;
          color: #1a1a1a;
        }
        .summary-label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        .response {
          border: 1px solid #d4c5a9;
          padding: 20px;
          margin: 20px 0;
          page-break-inside: avoid;
        }
        .response-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .model-name {
          font-size: 18px;
          font-weight: bold;
          text-transform: capitalize;
        }
        .status {
          padding: 4px 12px;
          border: 1px solid;
          font-size: 12px;
        }
        .status-success {
          background: #d1f4e0;
          color: #1e7e34;
          border-color: #86d4a8;
        }
        .status-failed {
          background: #f8d7da;
          color: #721c24;
          border-color: #f5c6cb;
        }
        .response-text {
          margin: 15px 0;
          line-height: 1.6;
        }
        .scores {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e8dcc4;
        }
        .score-item {
          text-align: center;
        }
        .score-label {
          font-size: 12px;
          color: #666;
        }
        .score-value {
          font-size: 18px;
          font-weight: bold;
          color: #1a1a1a;
        }
        .keywords {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e8dcc4;
        }
        .keyword-tag {
          display: inline-block;
          background: #e8dcc4;
          color: #1a1a1a;
          padding: 4px 10px;
          margin: 4px;
          border: 1px solid #d4c5a9;
          font-size: 12px;
        }
        @media print {
          body {
            padding: 10px;
          }
          .response {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <h1>AI Response Aggregator - Export Report</h1>

      <div class="metadata">
        <div class="metadata-item">
          <span class="metadata-label">Prompt:</span> ${prompt.promptText || 'N/A'}
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Date:</span> ${new Date(prompt.createdAt || Date.now()).toLocaleString()}
        </div>
        <div class="metadata-item">
          <span class="metadata-label">AI Models:</span> ${prompt.aiModels?.join(', ') || 'N/A'}
        </div>
        ${metadata.processingTime ? `
        <div class="metadata-item">
          <span class="metadata-label">Processing Time:</span> ${(metadata.processingTime / 1000).toFixed(2)}s
        </div>
        ` : ''}
      </div>

      ${(() => {
        // Find winner (highest composite score)
        const winner = responses.reduce((best, current) => {
          const currentScore = current.scores?.composite || 0;
          const bestScore = best?.scores?.composite || 0;
          return currentScore > bestScore ? current : best;
        }, responses[0]);

        return `
        <h2>Comparative Analysis - Winner</h2>
        <div style="background: #1a1a1a; color: #f5f1e8; padding: 20px; margin: 20px 0; border: 3px solid #d4c5a9;">
          <div style="text-align: center;">
            <div style="font-size: 14px; color: #d4c5a9; margin-bottom: 10px;">BEST MODEL</div>
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">
              ${winner.aiModel || 'Unknown'}
            </div>
            <div style="font-size: 48px; font-weight: bold; color: #d4c5a9;">
              ${winner.scores?.composite || 0}<span style="font-size: 24px;">/100</span>
            </div>
          </div>
        </div>

        <h2>Why This Model Won - Score Breakdown</h2>
        <div style="background: #f5f1e8; border: 1px solid #d4c5a9; padding: 20px; margin: 20px 0;">
          <p style="margin-bottom: 15px;">
            The composite score is calculated using a weighted formula that prioritizes relevance
            while considering privacy, consensus, and efficiency:
          </p>

          <div style="background: white; border: 1px solid #d4c5a9; padding: 15px; margin: 15px 0; font-family: monospace; font-size: 13px;">
            <strong>Composite Score Formula:</strong><br>
            = (Relevance × <strong>45%</strong>) + (Sovereignty × <strong>25%</strong>) +
            (Similarity × <strong>20%</strong>) + (Speed × <strong>10%</strong>)
          </div>

          <div style="margin-top: 20px;">
            <strong style="margin-bottom: 10px; display: block;">Calculation for ${winner.aiModel}:</strong>

            <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="width: 100px;">Relevance:</span>
              <div style="flex: 1; background: #e8dcc4; height: 20px; position: relative; border: 1px solid #d4c5a9;">
                <div style="background: #1a1a1a; height: 100%; width: ${winner.scores?.relevance || 0}%;"></div>
              </div>
              <span style="width: 150px; text-align: right; font-size: 12px;">
                ${winner.scores?.relevance || 0} × 45% = ${((winner.scores?.relevance || 0) * 0.45).toFixed(1)}
              </span>
            </div>

            <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="width: 100px;">Sovereignty:</span>
              <div style="flex: 1; background: #e8dcc4; height: 20px; position: relative; border: 1px solid #d4c5a9;">
                <div style="background: #a89263; height: 100%; width: ${winner.scores?.sovereignty?.score || 0}%;"></div>
              </div>
              <span style="width: 150px; text-align: right; font-size: 12px;">
                ${winner.scores?.sovereignty?.score || 0} × 25% = ${((winner.scores?.sovereignty?.score || 0) * 0.25).toFixed(1)}
              </span>
            </div>

            <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="width: 100px;">Similarity:</span>
              <div style="flex: 1; background: #e8dcc4; height: 20px; position: relative; border: 1px solid #d4c5a9;">
                <div style="background: #c5b083; height: 100%; width: ${winner.scores?.similarity || 0}%;"></div>
              </div>
              <span style="width: 150px; text-align: right; font-size: 12px;">
                ${winner.scores?.similarity || 0} × 20% = ${((winner.scores?.similarity || 0) * 0.2).toFixed(1)}
              </span>
            </div>

            <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="width: 100px;">Speed:</span>
              <div style="flex: 1; background: #e8dcc4; height: 20px; position: relative; border: 1px solid #d4c5a9;">
                <div style="background: #d4c5a3; height: 100%; width: ${winner.scores?.speed || 0}%;"></div>
              </div>
              <span style="width: 150px; text-align: right; font-size: 12px;">
                ${winner.scores?.speed || 0} × 10% = ${((winner.scores?.speed || 0) * 0.1).toFixed(1)}
              </span>
            </div>

            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #d4c5a9; display: flex; justify-content: space-between; align-items: center; background: #1a1a1a; color: #f5f1e8; padding: 15px;">
              <span style="font-weight: bold;">Final Composite Score:</span>
              <span style="font-size: 28px; font-weight: bold;">${winner.scores?.composite || 0}/100</span>
            </div>
          </div>

          <div style="background: #f5f1e8; border-left: 4px solid #1a1a1a; padding: 10px; margin-top: 15px; font-size: 12px;">
            <strong>Why these weights?</strong> Relevance (45%) is most important because answer quality matters most.
            Sovereignty (25%) ensures data privacy. Similarity (20%) validates consensus. Speed (10%) improves user
            experience. These weights are based on academic research in Information Retrieval.
          </div>
        </div>
        `;
      })()}

      ${summary && Object.keys(summary).length > 0 ? `
      <h2>Summary Statistics</h2>
      <div class="summary">
        ${summary.averageRelevance !== undefined ? `
        <div class="summary-item">
          <div class="summary-value">${summary.averageRelevance.toFixed(2)}</div>
          <div class="summary-label">Average Relevance</div>
        </div>
        ` : ''}
        ${summary.averageSimilarity !== undefined ? `
        <div class="summary-item">
          <div class="summary-value">${summary.averageSimilarity.toFixed(2)}</div>
          <div class="summary-label">Average Similarity</div>
        </div>
        ` : ''}
        ${summary.consensusLevel !== undefined ? `
        <div class="summary-item">
          <div class="summary-value">${summary.consensusLevel.toFixed(2)}%</div>
          <div class="summary-label">Consensus Level</div>
        </div>
        ` : ''}
        ${summary.averageSovereignty !== undefined ? `
        <div class="summary-item">
          <div class="summary-value">${summary.averageSovereignty.toFixed(2)}</div>
          <div class="summary-label">Average Sovereignty</div>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <h2>AI Responses (${responses.length})</h2>

      ${responses.map((response, index) => `
        <div class="response">
          <div class="response-header">
            <span class="model-name">${response.aiModel || response.model || 'Unknown Model'}</span>
            <span class="status ${response.status === 'success' ? 'status-success' : 'status-failed'}">
              ${response.status || 'unknown'}
            </span>
          </div>

          ${response.status === 'success' ? `
            <div class="response-text">
              ${response.responseText || 'No response text'}
            </div>

            <div style="background: #1a1a1a; color: #f5f1e8; padding: 15px; margin: 15px 0; text-align: center;">
              <div style="font-size: 12px; color: #d4c5a9; margin-bottom: 5px;">COMPOSITE SCORE</div>
              <div style="font-size: 36px; font-weight: bold;">
                ${response.scores?.composite || '-'}<span style="font-size: 18px; color: #d4c5a9;">/100</span>
              </div>
            </div>

            <div class="scores">
              <div class="score-item">
                <div class="score-label">Relevance (BM25)</div>
                <div class="score-value">${response.scores?.relevance || '-'}/100</div>
              </div>
              <div class="score-item">
                <div class="score-label">Similarity (TF-IDF)</div>
                <div class="score-value">${response.scores?.similarity || '-'}/100</div>
              </div>
              <div class="score-item">
                <div class="score-label">Sovereignty</div>
                <div class="score-value">${response.scores?.sovereignty?.score || response.sovereignty?.score || '-'}/100</div>
              </div>
              <div class="score-item">
                <div class="score-label">Speed</div>
                <div class="score-value">${response.scores?.speed || '-'}/100</div>
              </div>
              ${response.greenIT?.ecoScore && response.greenIT.ecoScore !== 'N/A' ? `
              <div class="score-item">
                <div class="score-label">Eco-Score</div>
                <div class="score-value">${response.greenIT.ecoScore}</div>
              </div>
              <div class="score-item">
                <div class="score-label">CO₂ Impact</div>
                <div class="score-value">${response.greenIT.carbon.impactGrams.toFixed(4)}g</div>
              </div>
              ` : ''}
            </div>

            ${response.nlpAnalysis?.keywords && response.nlpAnalysis.keywords.length > 0 ? `
            <div class="keywords">
              <strong>Keywords:</strong><br>
              ${response.nlpAnalysis.keywords.map(k => {
                const word = typeof k === 'string' ? k : k.word;
                return `<span class="keyword-tag">${word}</span>`;
              }).join('')}
            </div>
            ` : ''}
          ` : `
            <div class="response-text" style="color: #721c24;">
              Error: ${response.error || 'Request failed'}
            </div>
          `}

          <div style="margin-top: 15px; font-size: 12px; color: #666;">
            Response time: ${response.responseTime}ms |
            Location: ${response.sovereignty?.location || 'Unknown'} |
            GDPR: ${response.sovereignty?.gdprCompliant ? 'Yes' : 'No'}
          </div>
        </div>
      `).join('')}

      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #d4c5a9; text-align: center; color: #666; font-size: 12px;">
        <p>Generated by AI Response Aggregator - IT for Green & Data Sovereignty</p>
        <p>${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
};

export default {
  exportToJSON,
  exportToCSV,
  exportToPDF
};
