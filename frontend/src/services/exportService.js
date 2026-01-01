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
  const jsonContent = JSON.stringify(data, null, 2);
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

  // CSV Headers
  const headers = [
    'AI Model',
    'Status',
    'Response Text',
    'Response Time (ms)',
    'Relevance Score',
    'Similarity Score',
    'Sovereignty Score',
    'Location',
    'GDPR Compliant',
    'Keywords',
    'Sentiment',
    'Word Count'
  ];

  // CSV Rows
  const rows = data.responses.map(response => [
    response.aiModel || response.model || '-',
    response.status || '-',
    response.responseText ? `"${response.responseText.replace(/"/g, '""')}"` : '-',
    response.responseTime || '-',
    response.scores?.relevance || '-',
    response.scores?.similarity || '-',
    response.scores?.sovereignty?.score || response.sovereignty?.score || '-',
    response.sovereignty?.location || '-',
    response.sovereignty?.gdprCompliant ? 'Yes' : 'No',
    response.nlpAnalysis?.keywords?.map(k => typeof k === 'string' ? k : k.word).join('; ') || '-',
    response.nlpAnalysis?.sentiment || '-',
    response.nlpAnalysis?.wordCount || '-'
  ]);

  // Combine headers and rows
  const csvContent = [
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

      ${summary && Object.keys(summary).length > 0 ? `
      <h2>Summary</h2>
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

            <div class="scores">
              <div class="score-item">
                <div class="score-label">Relevance</div>
                <div class="score-value">${response.scores?.relevance || '-'}/100</div>
              </div>
              <div class="score-item">
                <div class="score-label">Similarity</div>
                <div class="score-value">${response.scores?.similarity || '-'}/100</div>
              </div>
              <div class="score-item">
                <div class="score-label">Sovereignty</div>
                <div class="score-value">${response.scores?.sovereignty?.score || response.sovereignty?.score || '-'}/100</div>
              </div>
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
