// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
    BriefcaseIcon,
    UserGroupIcon,
    CalendarIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import StatsCard from '../components/dashboard/StatsCard';
import StatsOverview from '../components/dashboard/StatsOverview';
import AppointmentCalendar from '../components/dashboard/AppointmentCalendar';
import RecentActivity from '../components/dashboard/RecentActivity';
import { chartColors } from '../utils/theme';
import jobService from '../services/jobService';
import candidateService from '../services/candidateService';
import appointmentService from '../services/appointmentService';
import { useToast } from '../contexts/ToastContext';

const Dashboard = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        jobs: 0,
        candidates: 0,
        appointments: 0,
        completedInterviews: 0,
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    // Fetch data on component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // This would normally be a single API call to fetch dashboard data
                // For this example, we'll simulate by calling multiple endpoints

                // Fetch jobs
                const jobsResponse = await jobService.getAllJobs();
                const jobs = jobsResponse.data || [];

                // Fetch candidates
                const candidatesResponse = await candidateService.getAllCandidates();
                const candidates = candidatesResponse.data || [];

                // Fetch appointments
                const appointmentsResponse = await appointmentService.getAllAppointments();
                const appointments = appointmentsResponse.data || [];

                // Calculate stats
                const completedInterviews = appointments.filter(
                    (appointment) => appointment.status === 'completed'
                ).length;

                setStats({
                    jobs: jobs.length,
                    candidates: candidates.length,
                    appointments: appointments.length,
                    completedInterviews,
                });

                setAppointments(appointments);

                // Generate recent activities
                const activities = generateMockActivities();
                setRecentActivities(activities);

                // Generate chart data
                const chartData = generateChartData();
                setChartData(chartData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                showToast('Failed to load dashboard data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [showToast]);

    // Handle date selection in calendar
    const handleDateSelect = (date) => {
        // Find appointments on the selected date
        const appointmentsOnDate = appointments.filter(
            (appointment) => new Date(appointment.date_time).toDateString() === date.toDateString()
        );

        if (appointmentsOnDate.length > 0) {
            showToast(`${appointmentsOnDate.length} interviews scheduled on ${date.toLocaleDateString()}`, 'info');
        } else {
            showToast(`No interviews scheduled on ${date.toLocaleDateString()}`, 'info');
        }
    };

    // Generate mock recent activities
    const generateMockActivities = () => {
        return [
            {
                id: 1,
                type: 'job_created',
                data: { title: 'Senior React Developer' },
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            },
            {
                id: 2,
                type: 'candidate_added',
                data: { name: 'John Doe' },
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            },
            {
                id: 3,
                type: 'appointment_scheduled',
                data: { candidate_name: 'Sarah Smith', job_title: 'UI/UX Designer' },
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            },
            {
                id: 4,
                type: 'appointment_completed',
                data: { candidate_name: 'Michael Johnson' },
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            },
            {
                id: 5,
                type: 'appointment_cancelled',
                data: { candidate_name: 'Emily Brown' },
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            },
        ];
    };

    // Generate chart data for the past 30 days
    const generateChartData = () => {
        const labels = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 29 + i);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Interviews Scheduled',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10)),
                    borderColor: chartColors.primary,
                    backgroundColor: `${chartColors.primary}20`,
                    tension: 0.3,
                },
                {
                    label: 'Interviews Completed',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 8)),
                    borderColor: chartColors.success,
                    backgroundColor: `${chartColors.success}20`,
                    tension: 0.3,
                },
                {
                    label: 'New Candidates',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15)),
                    borderColor: chartColors.secondary,
                    backgroundColor: `${chartColors.secondary}20`,
                    tension: 0.3,
                },
            ],
        };
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Overview of your interview scheduling system
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Jobs"
                    value={stats.jobs}
                    icon={<BriefcaseIcon className="h-6 w-6" />}
                    color="primary"
                    change={8.2}
                />

                <StatsCard
                    title="Total Candidates"
                    value={stats.candidates}
                    icon={<UserGroupIcon className="h-6 w-6" />}
                    color="secondary"
                    change={12.5}
                />

                <StatsCard
                    title="Scheduled Interviews"
                    value={stats.appointments}
                    icon={<CalendarIcon className="h-6 w-6" />}
                    color="warning"
                    change={5.3}
                />

                <StatsCard
                    title="Completed Interviews"
                    value={stats.completedInterviews}
                    icon={<CheckCircleIcon className="h-6 w-6" />}
                    color="success"
                    change={-2.7}
                />
            </div>

            {/* Charts and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <StatsOverview data={chartData} title="Interview Activity" period="Last 30 days" />
                </div>

                <div>
                    <AppointmentCalendar
                        appointments={appointments}
                        onSelectDate={handleDateSelect}
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <RecentActivity activities={recentActivities} />
            </div>
        </div>
    );
};

export default Dashboard;