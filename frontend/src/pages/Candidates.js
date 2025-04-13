// src/pages/Candidates.js
import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CandidateList from '../components/candidates/CandidateList';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import CandidateForm from '../components/candidates/CandidateForm';
import candidateService from '../services/candidateService';
import { useToast } from '../contexts/ToastContext';

const Candidates = () => {
    const { showToast } = useToast();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCandidate, setCurrentCandidate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);

    // Fetch candidates on component mount
    useEffect(() => {
        fetchCandidates();
    }, []);

    // Fetch candidates from API
    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const response = await candidateService.getAllCandidates();
            setCandidates(response.data || []);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            showToast('Failed to fetch candidates', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filter candidates by search term
    const filteredCandidates = candidates.filter((candidate) =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidate.email && candidate.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidate.phone.includes(searchTerm)
    );

    // Open candidate form modal
    const openCandidateModal = (candidate = null) => {
        setCurrentCandidate(candidate);
        setIsModalOpen(true);
    };

    // Close candidate form modal
    const closeCandidateModal = () => {
        setCurrentCandidate(null);
        setIsModalOpen(false);
    };

    // Handle candidate form submission
    const handleCandidateSubmit = async (formData) => {
        try {
            setIsSubmitting(true);

            if (currentCandidate) {
                // Update existing candidate
                await candidateService.updateCandidate(currentCandidate.id, formData);
                showToast('Candidate updated successfully', 'success');
            } else {
                // Create new candidate
                await candidateService.createCandidate(formData);
                showToast('Candidate added successfully', 'success');
            }

            // Refresh candidates list
            await fetchCandidates();
            closeCandidateModal();
        } catch (error) {
            console.error('Error saving candidate:', error);
            showToast(
                `Failed to ${currentCandidate ? 'update' : 'add'} candidate. Please try again.`,
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open delete confirmation modal
    const openDeleteModal = (candidate) => {
        setCandidateToDelete(candidate);
        setIsDeleteModalOpen(true);
    };

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setCandidateToDelete(null);
        setIsDeleteModalOpen(false);
    };

    // Handle candidate deletion
    const handleCandidateDelete = async () => {
        if (!candidateToDelete) return;

        try {
            setIsSubmitting(true);
            await candidateService.deleteCandidate(candidateToDelete.id);
            showToast('Candidate deleted successfully', 'success');

            // Refresh candidates list
            await fetchCandidates();
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting candidate:', error);
            showToast('Failed to delete candidate. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Manage candidate profiles and interview status
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button
                        onClick={() => openCandidateModal()}
                        icon={<PlusIcon className="h-5 w-5" />}
                    >
                        Add Candidate
                    </Button>
                </div>
            </div>

            <div className="mt-6">
                <Input
                    type="search"
                    placeholder="Search candidates by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                    className="max-w-md mb-6"
                />

                <CandidateList
                    candidates={filteredCandidates}
                    loading={loading}
                    onEdit={openCandidateModal}
                    onDelete={openDeleteModal}
                />
            </div>

            {/* Candidate Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeCandidateModal}
                title={currentCandidate ? 'Edit Candidate' : 'Add Candidate'}
                size="2xl"
            >
                <CandidateForm
                    candidate={currentCandidate}
                    onSubmit={handleCandidateSubmit}
                    onCancel={closeCandidateModal}
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
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">{candidateToDelete?.name}</span>?
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

export default Candidates;