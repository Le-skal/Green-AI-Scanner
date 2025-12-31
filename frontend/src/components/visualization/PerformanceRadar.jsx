import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PerformanceRadar = ({ responses }) => {
  if (!responses || responses.length === 0) return null;

  // Préparer les datasets pour chaque modèle
  const datasets = responses.map((response, index) => {
    const modelNames = {
      gemini: 'Gemini',
      mistral: 'Mistral',
      huggingface: 'Hugging Face',
      cohere: 'Cohere',
    };

    const colors = [
      { bg: 'rgba(168, 146, 99, 0.2)', border: '#a89263' },   // sand-600
      { bg: 'rgba(28, 25, 23, 0.2)', border: '#1c1917' },     // ink-900
      { bg: 'rgba(197, 176, 131, 0.2)', border: '#c5b083' },  // sand-500
      { bg: 'rgba(87, 83, 78, 0.2)', border: '#57534e' },     // ink-500
    ];

    const color = colors[index] || colors[0];

    return {
      label: modelNames[response.aiModel] || response.aiModel,
      data: [
        response.scores?.relevance || 0,
        response.scores?.similarity || 0,
        response.scores?.sovereignty?.score || 0,
        Math.min(100, (1000 / response.responseTime) * 100), // Speed score (inverse)
        Math.min(100, (response.nlpAnalysis?.wordCount || 0) / 5), // Completeness
      ],
      backgroundColor: color.bg,
      borderColor: color.border,
      borderWidth: 2,
      pointBackgroundColor: color.border,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: color.border,
    };
  });

  const data = {
    labels: ['Relevance', 'Similarity', 'Sovereignty', 'Speed', 'Completeness'],
    datasets,
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
        },
      },
      title: {
        display: true,
        text: 'Performance Radar',
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
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#57534e',
          backdropColor: 'transparent',
          font: {
            family: 'Inter',
            size: 10,
          },
        },
        grid: {
          color: '#ede7d7',
        },
        angleLines: {
          color: '#d4c5a3',
        },
        pointLabels: {
          color: '#1c1917',
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
      <div style={{ height: '400px' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default PerformanceRadar;
