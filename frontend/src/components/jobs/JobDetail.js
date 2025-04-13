// src/pages/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    CalendarIcon,
    UserGroupIcon,
    ClockIcon,
    CheckBadgeIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import JobForm from '../jobs/JobForm';
import jobService from '../../services/jobService';
import appointmentService from '../../services/appointmentService';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/dateUtils';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [job, setJob] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch job details on component mount
    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    // Fetch job details from API
    const fetchJobDetails = async () => {
        try {
            setLoading(true);

            // Fetch job details
            const jobResponse = await jobService.getJobById(id);
            setJob(jobResponse.data);

            // Fetch appointments for this job
            // In a real implementation, this would be a single API call or included in the job details
            const appointmentsResponse = await appointmentService.getAllAppointments();
            const jobAppointments = appointmentsResponse.data.filter(
                (appointment) => appointment.job_id === id
            );
            setAppointments(jobAppointments);
        } catch (error) {
            console.error('Error fetching job details:', error);
            showToast('Failed to fetch job details', 'error');

            // Navigate back to jobs list on error
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    // Close edit modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    // Open delete modal
    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    // Close delete modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // Handle job update
    const handleJobUpdate = async (formData) => {
        try {
            setIsSubmitting(true);
            await jobService.updateJob(id, formData);
            showToast('Job updated successfully', 'success');

            // Refresh job details
            await fetchJobDetails();
            closeEditModal();
        } catch (error) {
            console.error('Error updating job:', error);
            showToast('Failed to update job. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle job deletion
    const handleJobDelete = async () => {
        try {
            setIsSubmitting(true);
            await jobService.deleteJob(id);
            showToast('Job deleted successfully', 'success');

            // Navigate back to jobs list
            navigate('/jobs');
        } catch (error) {
            console.error('Error deleting job:', error);
            showToast('Failed to delete job. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Go back to jobs list
    const goBack = () => {
        navigate('/jobs');
    };

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    // If job not found, show error
    if (!job) {
        return (
            <Card className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Job not found</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    The job you're looking for doesn't exist or has been removed.
                </p>
                <div className="mt-6">
                    <Button onClick={goBack} icon={<ArrowLeftIcon className="h-5 w-5" />}>
                        Back to Jobs
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="mr-4"
                        onClick={goBack}
                        icon={<ArrowLeftIcon className="h-5 w-5" />}
                    >
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={openEditModal}
                        icon={<PencilIcon className="h-5 w-5" />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={openDeleteModal}
                        icon={<TrashIcon className="h-5 w-5" />}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Job Details */}
                    <Card title="Job Details">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
                                <div className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                    {job.description}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Requirements</h3>
                                <div className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                    {job.requirements}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Appointments */}
                    <Card
                        title="Scheduled Interviews"
                        subtitle={`${appointments.length} interviews scheduled`}
                    >
                        {appointments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No interviews scheduled yet
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="py-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                                                    {appointment.Candidate?.name || 'Candidate'}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(appointment.date_time, 'MMMM dd, yyyy HH:mm')}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${appointment.status === 'scheduled' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300' : ''}
                          ${appointment.status === 'completed' ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300' : ''}
                          ${appointment.status === 'cancelled' ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300' : ''}
                          ${appointment.status === 'rescheduled' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300' : ''}
                        `}>
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Job Stats */}
                    <Card title="Job Overview">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Posted on</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatDate(job.created_at)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Candidates</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {appointments.length}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Available slots</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {job.available_slots?.length || 0}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <CheckBadgeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Completed interviews</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {appointments.filter(a => a.status === 'completed').length}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Available Slots */}
                    <Card
                        title="Available Time Slots"
                        subtitle={`${job.available_slots?.length || 0} slots available`}
                        footer={
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={openEditModal}
                                icon={<ArrowPathIcon className="h-5 w-5" />}
                            >
                                Update Slots
                            </Button>
                        }
                    >
                        {!job.available_slots || job.available_slots.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No available time slots
                                </p>
                            </div>
                        ) : (
                            <div className="max-h-80 overflow-y-auto">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {job.available_slots.map((slot, index) => (
                                        <li key={index} className="py-3">
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {formatDate(slot, 'MMMM dd, yyyy')} at {formatDate(slot, 'HH:mm')}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Edit Job Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title="Edit Job"
                size="2xl"
            >
                <JobForm
                    job={job}
                    onSubmit={handleJobUpdate}
                    onCancel={closeEditModal}
                    loading={isSubmitting}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="Delete Job"
                size="md"
            >
                <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete <span className="font-semibold">{job.title}</span>?
                        This action cannot be undone and will remove all associated appointments.
                    </p>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDeleteModal}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleJobDelete}
                            isLoading={isSubmitting}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default JobDetail;