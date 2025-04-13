// src/components/appointments/AppointmentList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, UserIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';

const AppointmentList = ({
    appointments = [],
    loading = false,
    onEdit,
    onDelete,
}) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <Card className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No appointments found</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Schedule an interview to get started.
                </p>
                <div className="mt-6">
                    <Button onClick={() => onEdit()}>Schedule Interview</Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-dark-700 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-700">
                <thead className="bg-gray-50 dark:bg-dark-800">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                            Date & Time
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Candidate
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Job
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Status
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-700 bg-white dark:bg-dark-900">
                    {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                <Link to={`/appointments/${appointment.id}`} className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                                    {formatDate(appointment.date_time, 'MMM dd, yyyy')}
                                </Link>
                                <div className="text-gray-500 dark:text-gray-400 mt-1">
                                    {formatDate(appointment.date_time, 'HH:mm')}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                    <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                                    <Link
                                        to={`/candidates/${appointment.Candidate?.id}`}
                                        className="hover:text-primary-600 dark:hover:text-primary-400"
                                    >
                                        {appointment.Candidate?.name || 'Unknown Candidate'}
                                    </Link>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                    <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                                    <Link
                                        to={`/jobs/${appointment.Job?.id}`}
                                        className="hover:text-primary-600 dark:hover:text-primary-400"
                                    >
                                        {appointment.Job?.title || 'Unknown Job'}
                                    </Link>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${appointment.status === 'scheduled' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300' : ''}
                  ${appointment.status === 'completed' ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300' : ''}
                  ${appointment.status === 'cancelled' ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300' : ''}
                  ${appointment.status === 'rescheduled' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300' : ''}
                `}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => onEdit(appointment)}
                                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit appointment</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(appointment)}
                                        className="text-danger-600 hover:text-danger-800 dark:text-danger-400 dark:hover:text-danger-300"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        <span className="sr-only">Delete appointment</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentList;