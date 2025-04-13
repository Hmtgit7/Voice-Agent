// src/pages/AppointmentDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    ClockIcon,
    CalendarIcon,
    UserIcon,
    BriefcaseIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import AppointmentForm from '../appointments/AppointmentForm';
import appointmentService from '../../services/appointmentService';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/dateUtils';

const AppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch appointment details on component mount
    useEffect(() => {
        fetchAppointmentDetails();
    }, [id]);

    // Fetch appointment details from API
    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);

            // Fetch appointment details
            const appointmentResponse = await appointmentService.getAppointmentById(id);
            setAppointment(appointmentResponse.data);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            showToast('Failed to fetch appointment details', 'error');

            // Navigate back to appointments list on error
            navigate('/appointments');
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

    // Handle appointment update
    const handleAppointmentUpdate = async (formData) => {
        try {
            setIsSubmitting(true);
            await appointmentService.updateAppointment(id, formData);
            showToast('Appointment updated successfully', 'success');

            // Refresh appointment details
            await fetchAppointmentDetails();
            closeEditModal();
        } catch (error) {
            console.error('Error updating appointment:', error);
            showToast('Failed to update appointment. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle appointment deletion
    const handleAppointmentDelete = async () => {
        try {
            setIsSubmitting(true);
            await appointmentService.deleteAppointment(id);
            showToast('Appointment deleted successfully', 'success');

            // Navigate back to appointments list
            navigate('/appointments');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            showToast('Failed to delete appointment. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle status update
    const handleStatusUpdate = async (status) => {
        try {
            setIsSubmitting(true);
            await appointmentService.updateAppointment(id, { status });
            showToast(`Appointment marked as ${status}`, 'success');

            // Refresh appointment details
            await fetchAppointmentDetails();
        } catch (error) {
            console.error('Error updating appointment status:', error);
            showToast('Failed to update appointment status. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Go back to appointments list
    const goBack = () => {
        navigate('/appointments');
    };

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    // If appointment not found, show error
    if (!appointment) {
        return (
            <Card className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appointment not found</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    The appointment you're looking for doesn't exist or has been removed.
                </p>
                <div className="mt-6">
                    <Button onClick={goBack} icon={<ArrowLeftIcon className="h-5 w-5" />}>
                        Back to Appointments
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Interview Details
                    </h1>
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
                    {/* Appointment Details */}
                    <Card title="Appointment Details">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-dark-700">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <CalendarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Date</span>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {formatDate(appointment.date_time, 'MMMM dd, yyyy')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-dark-700">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <ClockIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Time</span>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {formatDate(appointment.date_time, 'HH:mm')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-dark-700">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <UserIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Candidate</span>
                                </div>
                                <Link
                                    to={`/candidates/${appointment.Candidate?.id}`}
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                >
                                    {appointment.Candidate?.name || 'Unknown Candidate'}
                                </Link>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-dark-700">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <BriefcaseIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Job</span>
                                </div>
                                <Link
                                    to={`/jobs/${appointment.Job?.id}`}
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                >
                                    {appointment.Job?.title || 'Unknown Job'}
                                </Link>
                            </div>

                            <div className="flex justify-between items-center py-3">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <CalendarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Status</span>
                                </div>
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
                    </Card>

                    {/* Status Actions */}
                    <Card title="Actions">
                        <div className="flex flex-wrap gap-4">
                            {appointment.status !== 'completed' && (
                                <Button
                                    variant="success"
                                    icon={<CheckCircleIcon className="h-5 w-5" />}
                                    onClick={() => handleStatusUpdate('completed')}
                                    disabled={isSubmitting}
                                >
                                    Mark as Completed
                                </Button>
                            )}

                            {appointment.status !== 'cancelled' && (
                                <Button
                                    variant="danger"
                                    icon={<XCircleIcon className="h-5 w-5" />}
                                    onClick={() => handleStatusUpdate('cancelled')}
                                    disabled={isSubmitting}
                                >
                                    Mark as Cancelled
                                </Button>
                            )}

                            {appointment.status === 'cancelled' && (
                                <Button
                                    variant="primary"
                                    onClick={() => handleStatusUpdate('scheduled')}
                                    disabled={isSubmitting}
                                >
                                    Reschedule
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Candidate Info */}
                    {appointment.Candidate && (
                        <Card title="Candidate Information">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Name</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {appointment.Candidate.name}
                                    </span>
                                </div>

                                {appointment.Candidate.email && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                                        <a
                                            href={`mailto:${appointment.Candidate.email}`}
                                            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                        >
                                            {appointment.Candidate.email}
                                        </a>
                                    </div>
                                )}

                                {appointment.Candidate.phone && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Phone</span>
                                        <a
                                            href={`tel:${appointment.Candidate.phone}`}
                                            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                        >
                                            {appointment.Candidate.phone}
                                        </a>
                                    </div>
                                )}

                                {appointment.Candidate.current_ctc && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Current CTC</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${appointment.Candidate.current_ctc}
                                        </span>
                                    </div>
                                )}

                                {appointment.Candidate.expected_ctc && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Expected CTC</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${appointment.Candidate.expected_ctc}
                                        </span>
                                    </div>
                                )}

                                {appointment.Candidate.notice_period && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Notice Period</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {appointment.Candidate.notice_period} days
                                        </span>
                                    </div>
                                )}

                                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-dark-700">
                                    <Link
                                        to={`/candidates/${appointment.Candidate.id}`}
                                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                    >
                                        View Full Profile
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Job Info */}
                    {appointment.Job && (
                        <Card title="Job Information">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Title</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {appointment.Job.title}
                                    </span>
                                </div>

                                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-dark-700">
                                    <Link
                                        to={`/jobs/${appointment.Job.id}`}
                                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                    >
                                        View Job Details
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Edit Appointment Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title="Edit Appointment"
                size="2xl"
            >
                <AppointmentForm
                    appointment={appointment}
                    onSubmit={handleAppointmentUpdate}
                    onCancel={closeEditModal}
                    loading={isSubmitting}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="Delete Appointment"
                size="md"
            >
                <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete this appointment
                        {appointment.Candidate?.name && ` with ${appointment.Candidate.name}`}?
                        This action cannot be undone.
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
                            onClick={handleAppointmentDelete}
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

export default AppointmentDetail;