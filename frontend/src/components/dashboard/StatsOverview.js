// src/components/dashboard/StatsOverview.js
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
    Legend,
} from 'chart.js';
import Card from '../common/Card';
import { chartColors, chartDefaultOptions } from '../../utils/theme';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StatsOverview = ({ data, title = 'Statistics Overview', period = 'Last 30 days' }) => {
    // Prepare chart data
    const chartData = {
        labels: data?.labels || [],
        datasets: data?.datasets || [],
    };

    // Chart options
    const options = {
        ...chartDefaultOptions,
        plugins: {
            ...chartDefaultOptions.plugins,
            title: {
                display: false,
            },
        },
    };

    return (
        <Card title={title} subtitle={period}>
            <div className="h-80">
                <Line data={chartData} options={options} />
            </div>
        </Card>
    );
};

export default StatsOverview;