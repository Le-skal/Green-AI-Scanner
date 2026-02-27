/**
 * Export Service - Handles exporting prompt results to various formats
 */
import { marked } from 'marked';
import katex from 'katex';

marked.use({ gfm: true, breaks: true });

// Same math commands as ResponseCard
const MATH_CMD_RE = /\\(?:frac|sum|pi|left|right|arctan|sqrt|cdots|approx|times|infty|int|prod|lim|partial|leq|geq|neq|quad|sin|cos|tan|log|alpha|beta|gamma|delta|theta|sigma|omega|mu|lambda|cdot|dots)/;

const preprocessMath = (text) => {
  if (!text) return text;
  let result = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  result = result.replace(/^[ \t]*\$[ \t]*$/gm, '$$$$');
  result = result
    .replace(/\\\[/g, '\n\n$$\n')
    .replace(/\\\]/g, '\n$$\n\n')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');
  const lines = result.split('\n');
  const output = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const prevOut = output.length > 0 ? output[output.length - 1].trim() : '';
    if (trimmed.startsWith('\\') && MATH_CMD_RE.test(trimmed) && prevOut !== '$$') {
      const formulaLines = [trimmed];
      i++;
      while (i < lines.length) {
        const next = lines[i].trim();
        if (next === '' || /^[#*\->`~\d]/.test(next)) break;
        if (next.startsWith('\\') || MATH_CMD_RE.test(next)) { formulaLines.push(next); i++; }
        else break;
      }
      if (output.length > 0 && output[output.length - 1].trim() !== '') output.push('');
      output.push('$$', ...formulaLines, '$$', '');
    } else { output.push(line); i++; }
  }
  return output.join('\n');
};

const katexOpts = { throwOnError: false, strict: false };

const renderMarkdown = (text) => {
  if (!text) return '';
  const clean = text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim();
  const processed = preprocessMath(clean);

  // 1. Extract display math $$...$$ with placeholders so marked doesn't touch them
  const displayBlocks = [];
  const withDisplayPH = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
    const idx = displayBlocks.length;
    try {
      displayBlocks.push(katex.renderToString(formula.trim(), { ...katexOpts, displayMode: true }));
    } catch {
      displayBlocks.push(`<code>${formula}</code>`);
    }
    return `DISPLAY_MATH_${idx}`;
  });

  // 2. Run marked on the remaining text
  let html = marked.parse(withDisplayPH);

  // 3. Restore display math blocks
  html = html.replace(/DISPLAY_MATH_(\d+)/g, (_, idx) =>
    `<div class="math-display">${displayBlocks[parseInt(idx)]}</div>`
  );

  // 4. Render remaining inline $...$
  // Note: marked HTML-escapes < > inside $...$ so we decode entities before KaTeX
  html = html.replace(/\$([^$\n]{1,300}?)\$/g, (match, formula) => {
    const decoded = formula
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
    try {
      return katex.renderToString(decoded.trim(), { ...katexOpts, displayMode: false });
    } catch {
      return match;
    }
  });

  return html;
};

/**
 * Render markdown split at --- boundaries so page breaks only occur between sections.
 * Each section is wrapped in break-inside:avoid, cuts happen at <hr> dividers.
 */
const renderMarkdownSectioned = (text) => {
  if (!text) return '';
  const clean = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  // Split on --- / *** / ___ horizontal rule markers
  const sections = clean.split(/\n[ \t]*(?:---|\*\*\*|___)[ \t]*\n/);
  if (sections.length === 1) {
    // No --- found — wrap the whole thing as one section
    return `<div class="prose-section">${renderMarkdown(clean)}</div>`;
  }
  return sections
    .map((s, idx) =>
      `<div class="prose-section">${idx > 0 ? '<hr class="section-break">' : ''}${renderMarkdown(s.trim())}</div>`
    )
    .join('');
};

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

  // Wait for all resources (KaTeX CSS from CDN) to load before printing
  printWindow.onload = () => {
    printWindow.focus();
    // Small delay to ensure CDN stylesheet is applied
    setTimeout(() => printWindow.print(), 400);
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
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <style>
        /* KaTeX display block centering */
        .math-display { margin: 14px 0; text-align: center; overflow-x: auto; }
        .katex-display { overflow-x: auto; overflow-y: hidden; }
        /* ── Force background colors in print for ALL elements ── */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Georgia', serif;
          font-size: 13px;
          line-height: 1.65;
          color: #1c1917;
          background: #fff;
          padding: 32px 40px;
          max-width: 900px;
          margin: 0 auto;
        }

        /* ── Typography ── */
        h1 { font-size: 22px; font-weight: 700; border-bottom: 3px solid #d4c5a3; padding-bottom: 10px; margin-bottom: 20px; }
        h2 { font-size: 16px; font-weight: 700; color: #1c1917; border-bottom: 1.5px solid #ede7d7; padding-bottom: 6px; margin: 28px 0 14px; }
        h3 { font-size: 14px; font-weight: 700; margin: 14px 0 6px; }

        /* ── Blocks ── */
        .meta-block {
          background: #fdfbf7;
          border: 1px solid #d4c5a3;
          padding: 14px 18px;
          margin-bottom: 24px;
        }
        .meta-row { display: flex; gap: 8px; margin: 5px 0; font-size: 12px; }
        .meta-label { font-weight: 700; color: #57534e; min-width: 110px; }

        /* ── Winner Banner ── */
        .winner-banner {
          background: #1c1917;
          color: #fdfbf7;
          padding: 20px;
          text-align: center;
          margin-bottom: 10px;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .winner-banner .label { font-size: 10px; letter-spacing: 2px; color: #a89263; margin-bottom: 6px; }
        .winner-banner .name { font-size: 26px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .winner-banner .score { font-size: 42px; font-weight: 700; color: #d4c5a3; }
        .winner-banner .score span { font-size: 20px; }

        /* ── Score breakdown bars ── */
        .breakdown { background: #fdfbf7; border: 1px solid #d4c5a3; padding: 16px 18px; margin-bottom: 24px; }
        .bar-row { display: flex; align-items: center; gap: 10px; margin: 8px 0; }
        .bar-label { width: 90px; font-size: 11px; color: #57534e; }
        .bar-track { flex: 1; background: #ede7d7; height: 14px; border: 1px solid #d4c5a3; }
        .bar-fill { height: 100%; background: #1c1917; }
        .bar-value { width: 140px; text-align: right; font-size: 11px; color: #57534e; }
        .formula-box {
          background: #fff;
          border: 1px solid #d4c5a3;
          padding: 10px 14px;
          font-family: monospace;
          font-size: 12px;
          margin: 12px 0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1c1917;
          color: #fdfbf7;
          padding: 10px 14px;
          margin-top: 12px;
          font-weight: 700;
          font-size: 15px;
        }

        /* ── Summary grid ── */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .summary-cell {
          background: #fdfbf7;
          border: 1px solid #d4c5a3;
          padding: 12px;
          text-align: center;
        }
        .summary-cell .val { font-size: 22px; font-weight: 700; color: #1c1917; }
        .summary-cell .lbl { font-size: 10px; color: #57534e; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }

        /* ── Response card ── */
        .response {
          border: 1.5px solid #d4c5a3;
          margin-bottom: 28px;
          /* no break-inside here — we let breaks happen at --- section dividers */
        }
        .response-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1c1917;
          color: #fdfbf7;
          padding: 10px 16px;
          break-inside: avoid;
          page-break-inside: avoid;
          break-after: avoid;
          page-break-after: avoid;
        }
        .response-head .model { font-size: 15px; font-weight: 700; text-transform: capitalize; }
        .response-head .time { font-size: 11px; color: #a89263; }
        .response-body { padding: 16px; }

        /* ── Prose sections (break-points at ---) ── */
        .prose-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        hr.section-break {
          border: none;
          border-top: 1px solid #d4c5a3;
          margin: 10px 0;
        }

        /* ── Markdown prose ── */
        .prose { font-size: 12.5px; line-height: 1.7; color: #292524; }
        .prose p { margin: 8px 0; }
        .prose h1, .prose h2, .prose h3, .prose h4 { margin: 12px 0 6px; font-weight: 700; }
        .prose h1 { font-size: 16px; }
        .prose h2 { font-size: 14px; border: none; }
        .prose h3 { font-size: 13px; }
        .prose ul, .prose ol { padding-left: 20px; margin: 6px 0; }
        .prose li { margin: 3px 0; }
        .prose strong { font-weight: 700; color: #1c1917; }
        .prose em { font-style: italic; }
        .prose code { background: #f5f1e8; padding: 1px 5px; font-family: monospace; font-size: 11.5px; border: 1px solid #ede7d7; }
        .prose pre { background: #f5f1e8; border: 1px solid #ede7d7; padding: 10px; margin: 8px 0; overflow: hidden; font-size: 11px; }
        .prose pre code { background: none; border: none; padding: 0; }
        .prose blockquote { border-left: 3px solid #d4c5a3; padding-left: 12px; color: #57534e; margin: 8px 0; }
        .prose table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 11.5px; }
        .prose th, .prose td { border: 1px solid #d4c5a3; padding: 5px 8px; }
        .prose th { background: #f5f1e8; font-weight: 700; }

        /* ── Score strip ── */
        .score-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid #ede7d7;
          margin-top: 14px;
        }
        .score-cell {
          text-align: center;
          padding: 10px 6px;
          border-right: 1px solid #ede7d7;
        }
        .score-cell:last-child { border-right: none; }
        .score-cell .s-lbl { font-size: 10px; color: #57534e; text-transform: uppercase; letter-spacing: 0.5px; }
        .score-cell .s-val { font-size: 18px; font-weight: 700; color: #1c1917; }
        /* Scores block: stays together, breaks cleanly before composite if needed */
        .scores-block {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-top: 14px;
        }
        .composite-strip {
          background: #1c1917;
          color: #fdfbf7;
          text-align: center;
          padding: 10px;
        }
        .score-strip {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .composite-strip .cs-lbl { font-size: 10px; color: #a89263; margin-bottom: 3px; }
        .composite-strip .cs-val { font-size: 28px; font-weight: 700; }

        /* ── Green IT ── */
        .green-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          background: #fdfbf7;
          border: 1px solid #ede7d7;
          padding: 10px;
          margin-top: 10px;
          font-size: 11px;
        }
        .eco-badge {
          display: inline-block;
          background: #1c1917;
          color: #fdfbf7;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        /* ── Keywords ── */
        .kw-tag {
          display: inline-block;
          background: #ede7d7;
          color: #1c1917;
          padding: 2px 8px;
          margin: 2px;
          border: 1px solid #d4c5a3;
          font-size: 11px;
        }

        /* ── Footer ── */
        .footer {
          margin-top: 36px;
          padding-top: 14px;
          border-top: 1.5px solid #d4c5a3;
          text-align: center;
          color: #57534e;
          font-size: 11px;
        }

        /* ── Print ── */
        @media print {
          body { padding: 16px 20px; }
          h2 { break-after: avoid; page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>AI Response Aggregator — Export Report</h1>

      <!-- Meta block -->
      <div class="meta-block">
        <div class="meta-row"><span class="meta-label">Prompt</span><span>${prompt.promptText || 'N/A'}</span></div>
        <div class="meta-row"><span class="meta-label">Date</span><span>${new Date(prompt.createdAt || Date.now()).toLocaleString()}</span></div>
        <div class="meta-row"><span class="meta-label">Models</span><span>${prompt.aiModels?.join(', ') || 'N/A'}</span></div>
        ${metadata.processingTime ? `<div class="meta-row"><span class="meta-label">Processing time</span><span>${(metadata.processingTime / 1000).toFixed(2)}s</span></div>` : ''}
      </div>

      ${(() => {
        if (!responses.length) return '';
        const winner = responses.reduce((best, cur) =>
          (cur.scores?.composite || 0) > (best.scores?.composite || 0) ? cur : best, responses[0]);
        const rel  = winner.scores?.relevance || 0;
        const sov  = winner.scores?.sovereignty?.score || 0;
        const sim  = winner.scores?.similarity || 0;
        const spd  = winner.scores?.speed || 0;
        return `
        <h2>Winner</h2>
        <div class="winner-banner">
          <div class="label">BEST MODEL</div>
          <div class="name">${winner.aiModel || 'Unknown'}</div>
          <div class="score">${winner.scores?.composite || 0}<span>/100</span></div>
        </div>

        <h2>Score Breakdown</h2>
        <div class="breakdown">
          <div class="formula-box">Composite = (Relevance × 45%) + (Sovereignty × 25%) + (Similarity × 20%) + (Speed × 10%)</div>
          <div class="bar-row">
            <span class="bar-label">Relevance</span>
            <div class="bar-track"><div class="bar-fill" style="width:${rel}%"></div></div>
            <span class="bar-value">${rel} × 45% = ${(rel * 0.45).toFixed(1)}</span>
          </div>
          <div class="bar-row">
            <span class="bar-label">Sovereignty</span>
            <div class="bar-track"><div class="bar-fill" style="width:${sov}%; background:#a89263"></div></div>
            <span class="bar-value">${sov} × 25% = ${(sov * 0.25).toFixed(1)}</span>
          </div>
          <div class="bar-row">
            <span class="bar-label">Similarity</span>
            <div class="bar-track"><div class="bar-fill" style="width:${sim}%; background:#574a2e"></div></div>
            <span class="bar-value">${sim} × 20% = ${(sim * 0.2).toFixed(1)}</span>
          </div>
          <div class="bar-row">
            <span class="bar-label">Speed</span>
            <div class="bar-track"><div class="bar-fill" style="width:${spd}%; background:#8a7447"></div></div>
            <span class="bar-value">${spd} × 10% = ${(spd * 0.1).toFixed(1)}</span>
          </div>
          <div class="total-row">
            <span>Final Composite Score</span>
            <span>${winner.scores?.composite || 0} / 100</span>
          </div>
        </div>`;
      })()}

      ${summary && Object.keys(summary).length > 0 ? `
      <h2>Summary Statistics</h2>
      <div class="summary-grid">
        ${summary.averageRelevance !== undefined ? `<div class="summary-cell"><div class="val">${summary.averageRelevance.toFixed(1)}</div><div class="lbl">Avg Relevance</div></div>` : ''}
        ${summary.averageSimilarity !== undefined ? `<div class="summary-cell"><div class="val">${summary.averageSimilarity.toFixed(1)}</div><div class="lbl">Avg Similarity</div></div>` : ''}
        ${summary.consensusLevel !== undefined ? `<div class="summary-cell"><div class="val">${summary.consensusLevel.toFixed(1)}%</div><div class="lbl">Consensus</div></div>` : ''}
        ${summary.averageSovereignty !== undefined ? `<div class="summary-cell"><div class="val">${summary.averageSovereignty.toFixed(1)}</div><div class="lbl">Avg Sovereignty</div></div>` : ''}
      </div>` : ''}

      <h2>AI Responses (${responses.length})</h2>

      ${responses.map((response) => `
        <div class="response">
          <div class="response-head">
            <span class="model">${response.aiModel || response.model || 'Unknown'}</span>
            <span class="time">${response.responseTime || 0}ms</span>
          </div>
          <div class="response-body">
            ${response.status === 'success' ? `
              <div class="prose">${renderMarkdownSectioned(response.responseText)}</div>

              <div class="scores-block">
                <div class="composite-strip">
                  <div class="cs-lbl">COMPOSITE SCORE</div>
                  <div class="cs-val">${response.scores?.composite || '-'}<span style="font-size:16px;color:#a89263"> /100</span></div>
                </div>

                <div class="score-strip">
                  <div class="score-cell"><div class="s-lbl">Relevance</div><div class="s-val">${response.scores?.relevance || '-'}</div></div>
                  <div class="score-cell"><div class="s-lbl">Sovereignty</div><div class="s-val">${response.scores?.sovereignty?.score || '-'}</div></div>
                  <div class="score-cell"><div class="s-lbl">Similarity</div><div class="s-val">${response.scores?.similarity || '-'}</div></div>
                  <div class="score-cell"><div class="s-lbl">Speed</div><div class="s-val">${response.scores?.speed || '-'}</div></div>
                </div>

                ${response.greenIT?.ecoScore && response.greenIT.ecoScore !== 'N/A' ? `
                <div class="green-row">
                  <div><span class="eco-badge">ECO ${response.greenIT.ecoScore}</span><br>${response.greenIT.carbon.location}</div>
                  <div><strong>CO₂</strong><br>${response.greenIT.carbon.impactGrams.toFixed(4)} g</div>
                  <div><strong>Energy</strong><br>${response.greenIT.energy.consumedKwh.toFixed(6)} kWh</div>
                </div>` : ''}

                ${response.nlpAnalysis?.keywords?.length ? `
                <div style="margin-top:10px;font-size:11px;color:#57534e;margin-bottom:4px;">Keywords</div>
                <div>${response.nlpAnalysis.keywords.slice(0, 12).map(k =>
                  `<span class="kw-tag">${typeof k === 'string' ? k : k.word}</span>`).join('')}</div>` : ''}
              </div>
            ` : `<p style="color:#7c2d12;font-size:12px;">Error: ${response.error || 'Request failed'}</p>`}
          </div>
        </div>
      `).join('')}

      <div class="footer">
        <p>AI Response Aggregator — IT for Green &amp; Data Sovereignty</p>
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
