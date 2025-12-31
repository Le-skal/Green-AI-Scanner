import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ScoresChart = ({ responses }) => {
  if (!responses || responses.length === 0) return null;

  const modelNames = responses.map(r => {
    const names = {
      gemini: 'Gemini',
      mistral: 'Mistral',
      huggingface: 'Hugging Face',
      cohere: 'Cohere',
    };
    return names[r.aiModel] || r.aiModel;
  });

  const relevanceScores = responses.map(r => r.scores?.relevance || 0);
  const similarityScores = responses.map(r => r.scores?.similarity || 0);
  const sovereigntyScores = responses.map(r => r.scores?.sovereignty?.score || 0);

  const data = {
    labels: modelNames,
    datasets: [
      {
        label: 'Relevance',
        data: relevanceScores,
        backgroundColor: '#a89263',
        borderColor: '#8a7447',
        borderWidth: 1,
      },
      {
        label: 'Similarity',
        data: similarityScores,
        backgroundColor: '#c5b083',
        borderColor: '#a89263',
        borderWidth: 1,
      },
      {
        label: 'Sovereignty',
        data: sovereigntyScores,
        backgroundColor: '#292524',
        borderColor: '#1c1917',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1c1917',
          font: {
            family: 'Inter',
            size: 12,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'rect',
        },
      },
      title: {
        display: true,
        text: 'Comparative Scores Analysis',
        color: '#1c1917',
        font: {
          family: 'Inter',
          size: 16,
          weight: '600',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1c1917',
        titleColor: '#fdfbf7',
        bodyColor: '#f7f3eb',
        borderColor: '#8a7447',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}/100`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#ede7d7',
          drawBorder: false,
        },
        ticks: {
          color: '#57534e',
          font: {
            family: 'Inter',
            size: 11,
          },
          callback: (value) => value + '%',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#57534e',
          font: {
            family: 'Inter',
            size: 12,
            weight: '500',
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <div style={{ height: '350px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ScoresChart;
