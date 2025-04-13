// src/components/jobs/JobList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';

const JobList = ({
    jobs = [],
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

    if (jobs.length === 0) {
        return (
            <Card className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Get started by creating a new job posting.
                </p>
                <div className="mt-6">
                    <Button onClick={() => onEdit()}>Create New Job</Button>
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
                            Job Title
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Created
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Available Slots
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Candidates
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-700 bg-white dark:bg-dark-900">
                    {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <Link to={`/jobs/${job.id}`} className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                                    {job.title}
                                </Link>
                                <div className="text-gray-500 dark:text-gray-400 mt-1 truncate max-w-md">
                                    {job.description.substring(0, 100)}
                                    {job.description.length > 100 ? '...' : ''}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(job.created_at)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 mr-1 text-gray-400" />
                                    {job.available_slots?.length || 0}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                    <UserGroupIcon className="h-5 w-5 mr-1 text-gray-400" />
                                    {job.candidates?.length || 0}
                                </div>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => onEdit(job)}
                                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit {job.title}</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(job)}
                                        className="text-danger-600 hover:text-danger-800 dark:text-danger-400 dark:hover:text-danger-300"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        <span className="sr-only">Delete {job.title}</span>
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

export default JobList;