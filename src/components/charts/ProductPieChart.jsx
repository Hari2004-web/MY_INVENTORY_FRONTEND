import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ProductPieChart = ({ productData }) => {
    const totalProducts = productData.length;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { 
                color: '#4b5563', 
                font: { size: 12 },
                padding: 15,
                boxWidth: 12,
            }
          },
          title: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#1f2937',
            cornerRadius: 4,
            displayColors: false,
          }
        },
        cutout: '70%', // Makes the doughnut hole larger for a modern look
      };

    const data = {
        labels: productData.map(p => p.name),
        datasets: [{
            label: 'Products',
            data: productData.map(() => 1), // Each product is one slice
            backgroundColor: [
                '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
                '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
            ],
            borderColor: '#ffffff', // White border between slices
            borderWidth: 3,
            hoverOffset: 8,
        }]
    };

    // Custom plugin to draw text in the middle of the doughnut chart
    const centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart) => {
            let ctx = chart.ctx;
            ctx.save();
            let centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            let centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // "Total" text
            ctx.font = '16px sans-serif';
            ctx.fillStyle = '#6b7280';
            ctx.fillText('Total', centerX, centerY - 12);
            
            // The actual count
            ctx.font = 'bold 32px sans-serif';
            ctx.fillStyle = '#1f2937';
            ctx.fillText(totalProducts, centerX, centerY + 16);
            ctx.restore();
        }
    }

    return <div style={{ height: '350px' }}><Doughnut options={options} data={data} plugins={[centerTextPlugin]} /></div>;
}

export default ProductPieChart;