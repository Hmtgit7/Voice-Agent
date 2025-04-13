// src/components/candidates/CandidateList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/dateUtils';
import { formatPhoneNumber } from '../../utils/formatters';
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';

const CandidateList = ({
    candidates = [],
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

    if (candidates.length === 0) {
        return (
            <Card className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No candidates found</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Get started by adding a new candidate.
                </p>
                <div className="mt-6">
                    <Button onClick={() => onEdit()}>Add Candidate</Button>
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
                            Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Contact
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Notice Period
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Experience
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-700 bg-white dark:bg-dark-900">
                    {candidates.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <Link to={`/candidates/${candidate.id}`} className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                                    {candidate.name}
                                </Link>
                                <div className="text-gray-500 dark:text-gray-400 mt-1">
                                    Added on {formatDate(candidate.created_at)}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center mb-1">
                                    <PhoneIcon className="h-4 w-4 mr-1" />
                                    <a href={`tel:${candidate.phone}`} className="hover:text-gray-700 dark:hover:text-gray-300">
                                        {formatPhoneNumber(candidate.phone)}
                                    </a>
                                </div>
                                {candidate.email && (
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                                        <a href={`mailto:${candidate.email}`} className="hover:text-gray-700 dark:hover:text-gray-300">
                                            {candidate.email}
                                        </a>
                                    </div>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${candidate.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' : ''}
                  ${candidate.status === 'contacted' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300' : ''}
                  ${candidate.status === 'scheduled' ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300' : ''}
                  ${candidate.status === 'interviewed' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300' : ''}
                  ${candidate.status === 'hired' ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300' : ''}
                  ${candidate.status === 'rejected' ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300' : ''}
                `}>
                                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {candidate.notice_period ? `${candidate.notice_period} days` : '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {candidate.experience ? `${candidate.experience} years` : '-'}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => onEdit(candidate)}
                                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit {candidate.name}</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(candidate)}
                                        className="text-danger-600 hover:text-danger-800 dark:text-danger-400 dark:hover:text-danger-300"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        <span className="sr-only">Delete {candidate.name}</span>
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

export default CandidateList;