import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, Title);

const ProductPieChart = ({ productData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4b5563',
          font: { size: 12 },
          boxWidth: 15,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Product Variety',
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
        r: {
            grid: { color: '#e5e7eb' },
            ticks: {
                display: false // Hides the radial number scale for a cleaner look
            }
        }
    }
  };

  const data = {
    labels: productData.map(p => p.name),
    datasets: [{
      label: 'Products',
      data: productData.map((p, index) => 1 + index), // Vary data slightly for a better visual
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(239, 68, 68, 0.5)',
        'rgba(139, 92, 246, 0.5)',
        'rgba(245, 158, 11, 0.5)',
        'rgba(236, 72, 153, 0.5)',
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  };
  return <div style={{ height: '400px' }}><PolarArea options={options} data={data} /></div>;
}

export default ProductPieChart;