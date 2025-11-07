import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const IncomeChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Earnings',
        data: [4000, 3000, 5000, 2780, 1890, 2390, 3490, 4200, 3800, 4500, 5200, 6000],
        fill: true,
        backgroundColor: 'rgba(13, 110, 253, 0.2)', 
        borderColor: 'rgba(13, 110, 253, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(13, 110, 253, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(13, 110, 253, 1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return 'LKR ' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">Income Overview</h6>
        <div className="dropdown no-arrow">
          <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
          </a>
          <ul className="dropdown-menu dropdown-menu-end shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
            <li><h6 className="dropdown-header">Options:</h6></li>
            <li><a className="dropdown-item" href="#">Download Report</a></li>
            <li><a className="dropdown-item" href="#">View Details</a></li>
            <li><hr className="dropdown-divider"/></li>
            <li><a className="dropdown-item" href="#">Export Data</a></li>
          </ul>
        </div>
      </div>
      <div className="card-body">
        <div style={{ height: '300px' }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default IncomeChart;