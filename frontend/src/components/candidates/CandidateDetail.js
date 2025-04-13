// src/pages/CandidateDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    PhoneIcon,
    EnvelopeIcon,
    CurrencyDollarIcon,
    ClockIcon,
    CalendarIcon,
    BriefcaseIcon,
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import CandidateForm from '../candidates/CandidateForm';
import candidateService from '../../services/candidateService';
import appointmentService from '../../services/appointmentService';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/dateUtils';
import { formatPhoneNumber, formatCurrency } from '../../utils/formatters';

const CandidateDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [candidate, setCandidate] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch candidate details on component mount
    useEffect(() => {
        fetchCandidateDetails();
    }, [id]);

    // Fetch candidate details from API
    const fetchCandidateDetails = async () => {
        try {
            setLoading(true);

            // Fetch candidate details
            const candidateResponse = await candidateService.getCandidateById(id);
            setCandidate(candidateResponse.data);

            // Set conversations from the response if available
            if (candidateResponse.data.Conversations) {
                setConversations(candidateResponse.data.Conversations);
            }

            // Fetch appointments for this candidate
            // In a real implementation, this would be a single API call or included in the candidate details
            const appointmentsResponse = await appointmentService.getAllAppointments();
            const candidateAppointments = appointmentsResponse.data.filter(
                (appointment) => appointment.candidate_id === id
            );
            setAppointments(candidateAppointments);
        } catch (error) {
            console.error('Error fetching candidate details:', error);
            showToast('Failed to fetch candidate details', 'error');

            // Navigate back to candidates list on error
            navigate('/candidates');
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

    // Handle candidate update
    const handleCandidateUpdate = async (formData) => {
        try {
            setIsSubmitting(true);
            await candidateService.updateCandidate(id, formData);
            showToast('Candidate updated successfully', 'success');

            // Refresh candidate details
            await fetchCandidateDetails();
            closeEditModal();
        } catch (error) {
            console.error('Error updating candidate:', error);
            showToast('Failed to update candidate. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle candidate deletion
    const handleCandidateDelete = async () => {
        try {
            setIsSubmitting(true);
            await candidateService.deleteCandidate(id);
            showToast('Candidate deleted successfully', 'success');

            // Navigate back to candidates list
            navigate('/candidates');
        } catch (error) {
            console.error('Error deleting candidate:', error);
            showToast('Failed to delete candidate. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Go back to candidates list
    const goBack = () => {
        navigate('/candidates');
    };

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    // If candidate not found, show error
    if (!candidate) {
        return (
            <Card className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Candidate not found</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    The candidate you're looking for doesn't exist or has been removed.
                </p>
                <div className="mt-6">
                    <Button onClick={goBack} icon={<ArrowLeftIcon className="h-5 w-5" />}>
                        Back to Candidates
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
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
                    {/* Appointments */}
                    <Card
                        title="Scheduled Interviews"
                        subtitle={`${appointments.length} interviews scheduled`}
                    >
                        {appointments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No interviews scheduled
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="py-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                                                    {appointment.Job?.title || 'Interview'}
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

                    {/* Conversations */}
                    <Card
                        title="Conversation History"
                        subtitle={`${conversations.length} recorded conversations`}
                    >
                        {conversations.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No conversations recorded
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {conversations.map((conversation) => (
                                    <div key={conversation.id} className="py-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                                    <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Voice Agent Conversation
                                                    </h4>
                                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(conversation.created_at)}
                                                    </span>
                                                </div>

                                                <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                                    {conversation.transcript ? (
                                                        conversation.transcript
                                                    ) : (
                                                        <p className="italic text-gray-500 dark:text-gray-400">
                                                            Transcript not available
                                                        </p>
                                                    )}
                                                </div>

                                                {conversation.entities_extracted && Object.keys(conversation.entities_extracted).length > 0 && (
                                                    <div className="mt-3 bg-gray-50 dark:bg-dark-800 p-3 rounded-md">
                                                        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Extracted Information
                                                        </h5>
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            {Object.entries(conversation.entities_extracted).map(([key, value]) => (
                                                                <div key={key} className="flex justify-between">
                                                                    <span className="text-gray-600 dark:text-gray-400">
                                                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                                    </span>
                                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                                                            key.includes('date') || key.includes('time') || key.includes('slot') ? formatDate(value) :
                                                                                value.toString()}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Candidate Info */}
                    <Card title="Candidate Information">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <PhoneIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Phone</span>
                                </div>
                                <a
                                    href={`tel:${candidate.phone}`}
                                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    {formatPhoneNumber(candidate.phone)}
                                </a>
                            </div>

                            {candidate.email && (
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                            <EnvelopeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                        </span>
                                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Email</span>
                                    </div>
                                    <a
                                        href={`mailto:${candidate.email}`}
                                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                                    >
                                        {candidate.email}
                                    </a>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <ClockIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Notice Period</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {candidate.notice_period ? `${candidate.notice_period} days` : 'Not specified'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <BriefcaseIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Experience</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {candidate.experience ? `${candidate.experience} years` : 'Not specified'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <CalendarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Added On</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatDate(candidate.created_at)}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Compensation */}
                    <Card title="Compensation Details">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <CurrencyDollarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Current CTC</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {candidate.current_ctc ? formatCurrency(candidate.current_ctc) : 'Not specified'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                        <CurrencyDollarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </span>
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Expected CTC</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {candidate.expected_ctc ? formatCurrency(candidate.expected_ctc) : 'Not specified'}
                                </span>
                            </div>

                            {candidate.expected_ctc && candidate.current_ctc && (
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20">
                                            <CurrencyDollarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                        </span>
                                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Increase</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {Math.round((candidate.expected_ctc - candidate.current_ctc) / candidate.current_ctc * 100)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Status */}
                    <Card title="Current Status">
                        <div className="flex justify-center py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${candidate.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' : ''}
                ${candidate.status === 'contacted' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300' : ''}
                ${candidate.status === 'scheduled' ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300' : ''}
                ${candidate.status === 'interviewed' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300' : ''}
                ${candidate.status === 'hired' ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300' : ''}
                ${candidate.status === 'rejected' ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300' : ''}
              `}>
                                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                            </span>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Edit Candidate Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title="Edit Candidate"
                size="2xl"
            >
                <CandidateForm
                    candidate={candidate}
                    onSubmit={handleCandidateUpdate}
                    onCancel={closeEditModal}
                    loading={isSubmitting}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="Delete Candidate"
                size="md"
            >
                <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete <span className="font-semibold">{candidate.name}</span>?
                        This action cannot be undone and will remove all associated appointments and conversation history.
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
                            onClick={handleCandidateDelete}
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

export default CandidateDetail;