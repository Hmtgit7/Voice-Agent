// src/components/dashboard/RecentActivity.js
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import Card from '../common/Card';

const RecentActivity = ({ activities = [] }) => {
    // Activity type icon mapping
    const getActivityIcon = (type) => {
        switch (type) {
            case 'job_created':
                return (
                    <div className="rounded-full bg-success-100 dark:bg-success-900/20 p-2">
                        <svg className="h-4 w-4 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                );
            case 'candidate_added':
                return (
                    <div className="rounded-full bg-primary-100 dark:bg-primary-900/20 p-2">
                        <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                );
            case 'appointment_scheduled':
                return (
                    <div className="rounded-full bg-secondary-100 dark:bg-secondary-900/20 p-2">
                        <svg className="h-4 w-4 text-secondary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                );
            case 'appointment_completed':
                return (
                    <div className="rounded-full bg-success-100 dark:bg-success-900/20 p-2">
                        <svg className="h-4 w-4 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'appointment_cancelled':
                return (
                    <div className="rounded-full bg-danger-100 dark:bg-danger-900/20 p-2">
                        <svg className="h-4 w-4 text-danger-600 dark:text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
                        <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    // Activity type label mapping
    const getActivityLabel = (activity) => {
        switch (activity.type) {
            case 'job_created':
                return `New job posted: ${activity.data.title}`;
            case 'candidate_added':
                return `New candidate added: ${activity.data.name}`;
            case 'appointment_scheduled':
                return `Interview scheduled with ${activity.data.candidate_name} for ${activity.data.job_title}`;
            case 'appointment_completed':
                return `Interview completed with ${activity.data.candidate_name}`;
            case 'appointment_cancelled':
                return `Interview cancelled with ${activity.data.candidate_name}`;
            default:
                return activity.description || 'Activity recorded';
        }
    };

    // Format date for display
    const formatActivityDate = (date) => {
        const activityDate = new Date(date);
        return formatDistanceToNow(activityDate, { addSuffix: true });
    };

    return (
        <Card title="Recent Activity">
            <div className="flow-root">
                {activities.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No recent activities
                    </p>
                ) : (
                    <ul className="-mb-8">
                        {activities.map((activity, index) => (
                            <li key={activity.id || index}>
                                <div className="relative pb-8">
                                    {index !== activities.length - 1 && (
                                        <span
                                            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-dark-700"
                                            aria-hidden="true"
                                        />
                                    )}

                                    <div className="relative flex items-start space-x-3">
                                        <div className="relative">
                                            {getActivityIcon(activity.type)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div>
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {getActivityLabel(activity)}
                                                </div>
                                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    {formatActivityDate(activity.timestamp || activity.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {activities.length > 0 && (
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        View all activity
                    </button>
                </div>
            )}
        </Card>
    );
};

export default RecentActivity;