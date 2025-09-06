import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockBarChart = ({ stockData }) => {
  const options = {
    indexAxis: 'y', // This makes the bar chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Current Stock Levels',
        color: '#111827',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        cornerRadius: 4,
        displayColors: false,
      }
    },
    scales: {
      y: {
        ticks: { color: '#4b5563' },
        grid: { display: false }
      },
      x: {
        ticks: { color: '#4b5563' },
        grid: { color: '#e5e7eb' }
      }
    }
  };

  const data = {
    labels: stockData.map(item => item.product_name),
    datasets: [
      {
        label: 'Quantity',
        data: stockData.map(item => item.quantity),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(79, 70, 229, 0.8)',
      },
    ],
  };

  return <div style={{ height: '400px' }}><Bar options={options} data={data} /></div>;
};

export default StockBarChart;