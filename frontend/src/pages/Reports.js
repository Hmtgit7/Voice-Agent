// src/pages/Reports.js
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import Spinner from '../components/common/Spinner';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { chartColors, chartDefaultOptions } from '../utils/theme';
import { formatDate } from '../utils/dateUtils';
import appointmentService from '../services/appointmentService';
import candidateService from '../services/candidateService';
import jobService from '../services/jobService';
import { useToast } from '../contexts/ToastContext';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Reports = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30');
    const [chartData, setChartData] = useState({
        interviews: {
            labels: [],
            datasets: []
        },
        candidates: {
            labels: [],
            datasets: []
        },
        appointments: {
            labels: [],
            datasets: []
        }
    });

    // Fetch data on component mount and when time range changes
    useEffect(() => {
        fetchReportData();
    }, [timeRange]);

    // Fetch report data from API
    const fetchReportData = async () => {
        try {
            setLoading(true);

            // Fetch all data
            const [appointmentsRes, candidatesRes, jobsRes] = await Promise.all([
                appointmentService.getAllAppointments(),
                candidateService.getAllCandidates(),
                jobService.getAllJobs()
            ]);

            // Process appointments data
            const appointments = appointmentsRes.data || [];
            const candidates = candidatesRes.data || [];
            const jobs = jobsRes.data || [];

            // Generate report data
            generateInterviewChart(appointments);
            generateCandidateStatusChart(candidates);
            generateAppointmentStatusChart(appointments);

        } catch (error) {
            console.error('Error fetching report data:', error);
            showToast('Failed to fetch report data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Generate interview timeline chart
    const generateInterviewChart = (appointments) => {
        const days = parseInt(timeRange);
        const labels = [];
        const scheduledData = [];
        const completedData = [];
        const cancelledData = [];

        // Create labels for the last N days
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(formatDate(date, 'MMM dd'));

            // Count appointments for this day
            const dayAppointments = appointments.filter(a => {
                const appDate = new Date(a.date_time);
                return appDate.toDateString() === date.toDateString();
            });

            scheduledData.push(dayAppointments.filter(a => a.status === 'scheduled').length);
            completedData.push(dayAppointments.filter(a => a.status === 'completed').length);
            cancelledData.push(dayAppointments.filter(a => a.status === 'cancelled').length);
        }

        // Set chart data
        setChartData(prev => ({
            ...prev,
            interviews: {
                labels,
                datasets: [
                    {
                        label: 'Scheduled',
                        data: scheduledData,
                        borderColor: chartColors.primary,
                        backgroundColor: `${chartColors.primary}20`,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Completed',
                        data: completedData,
                        borderColor: chartColors.success,
                        backgroundColor: `${chartColors.success}20`,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Cancelled',
                        data: cancelledData,
                        borderColor: chartColors.danger,
                        backgroundColor: `${chartColors.danger}20`,
                        tension: 0.3,
                        fill: true
                    }
                ]
            }
        }));
    };

    // Generate candidate status chart
    const generateCandidateStatusChart = (candidates) => {
        // Count candidates by status
        const statusCounts = {
            new: 0,
            contacted: 0,
            scheduled: 0,
            interviewed: 0,
            hired: 0,
            rejected: 0
        };

        candidates.forEach(candidate => {
            if (statusCounts.hasOwnProperty(candidate.status)) {
                statusCounts[candidate.status]++;
            }
        });

        // Set chart data
        setChartData(prev => ({
            ...prev,
            candidates: {
                labels: Object.keys(statusCounts).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
                datasets: [
                    {
                        data: Object.values(statusCounts),
                        backgroundColor: [
                            chartColors.info,
                            chartColors.primary,
                            chartColors.secondary,
                            chartColors.warning,
                            chartColors.success,
                            chartColors.danger
                        ],
                        borderWidth: 1
                    }
                ]
            }
        }));
    };

    // Generate appointment status chart
    const generateAppointmentStatusChart = (appointments) => {
        // Count appointments by status
        const statusCount = appointments.reduce((acc, appointment) => {
            acc[appointment.status] = (acc[appointment.status] || 0) + 1;
            return acc;
        }, {});

        // Create dataset
        const labels = Object.keys(statusCount).map(
            status => status.charAt(0).toUpperCase() + status.slice(1)
        );

        const data = Object.values(statusCount);

        const backgroundColors = [
            chartColors.primary,
            chartColors.success,
            chartColors.danger,
            chartColors.warning
        ];

        // Set chart data
        setChartData(prev => ({
            ...prev,
            appointments: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: backgroundColors.slice(0, data.length),
                        borderWidth: 1
                    }
                ]
            }
        }));
    };

    // Handle time range change
    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
    };

    // Time range options
    const timeRangeOptions = [
        { value: '7', label: 'Last 7 days' },
        { value: '30', label: 'Last 30 days' },
        { value: '90', label: 'Last 90 days' }
    ];

    // If data is loading, show spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        View analytics and insights about your interview scheduling
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Select
                        id="time-range"
                        name="timeRange"
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                        options={timeRangeOptions}
                        className="w-48"
                    />
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interview Timeline Chart */}
                <Card title="Interview Timeline" className="lg:col-span-2">
                    <div className="h-80">
                        <Line
                            data={chartData.interviews}
                            options={{
                                ...chartDefaultOptions,
                                scales: {
                                    ...chartDefaultOptions.scales,
                                    y: {
                                        ...chartDefaultOptions.scales.y,
                                        beginAtZero: true,
                                        ticks: {
                                            ...chartDefaultOptions.scales.y.ticks,
                                            precision: 0
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </Card>

                {/* Candidate Status Chart */}
                <Card title="Candidate Status Distribution">
                    <div className="h-80 flex justify-center items-center">
                        <div className="w-3/4">
                            <Doughnut
                                data={chartData.candidates}
                                options={{
                                    ...chartDefaultOptions,
                                    plugins: {
                                        ...chartDefaultOptions.plugins,
                                        legend: {
                                            ...chartDefaultOptions.plugins.legend,
                                            position: 'right'
                                        }
                                    },
                                    cutout: '60%'
                                }}
                            />
                        </div>
                    </div>
                </Card>

                {/* Appointment Status Chart */}
                <Card title="Appointment Status Distribution">
                    <div className="h-80">
                        <Bar
                            data={chartData.appointments}
                            options={{
                                ...chartDefaultOptions,
                                scales: {
                                    ...chartDefaultOptions.scales,
                                    y: {
                                        ...chartDefaultOptions.scales.y,
                                        beginAtZero: true,
                                        ticks: {
                                            ...chartDefaultOptions.scales.y.ticks,
                                            precision: 0
                                        }
                                    }
                                },
                                indexAxis: 'y'
                            }}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Reports;