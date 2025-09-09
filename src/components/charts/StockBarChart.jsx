import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockBarChart = ({ stockData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for custom height
    plugins: {
      legend: {
        display: false, // We don't need a legend for a single dataset
      },
      title: {
        display: false, // The title will be in the dashboard card
      },
      tooltip: {
        backgroundColor: '#1f2937', // Dark tooltip background
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 4,
        displayColors: false, // Hide the little color box
        callbacks: {
          label: function(context) {
            return `Quantity: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#6b7280' },
        grid: { color: '#e5e7eb' } // Lighter grid lines
      },
      x: {
        ticks: { color: '#6b7280' },
        grid: { display: false } // No vertical grid lines
      }
    }
  };

  const data = {
    labels: stockData.map(item => item.product_name),
    datasets: [
      {
        label: 'Quantity in Stock',
        data: stockData.map(item => item.quantity),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  return <div style={{ height: '350px' }}><Bar options={options} data={data} /></div>;
};

export default StockBarChart;