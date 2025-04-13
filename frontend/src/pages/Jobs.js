// src/pages/Jobs.js
import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import JobList from '../components/jobs/JobList';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import JobForm from '../components/jobs/JobForm';
import jobService from '../services/jobService';
import { useToast } from '../contexts/ToastContext';

const Jobs = () => {
    const { showToast } = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    // Fetch jobs on component mount
    useEffect(() => {
        fetchJobs();
    }, []);

    // Fetch jobs from API
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await jobService.getAllJobs();
            setJobs(response.data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            showToast('Failed to fetch jobs', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filter jobs by search term
    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Open job form modal
    const openJobModal = (job = null) => {
        setCurrentJob(job);
        setIsModalOpen(true);
    };

    // Close job form modal
    const closeJobModal = () => {
        setCurrentJob(null);
        setIsModalOpen(false);
    };

    // Handle job form submission
    const handleJobSubmit = async (formData) => {
        try {
            setIsSubmitting(true);

            if (currentJob) {
                // Update existing job
                await jobService.updateJob(currentJob.id, formData);
                showToast('Job updated successfully', 'success');
            } else {
                // Create new job
                await jobService.createJob(formData);
                showToast('Job created successfully', 'success');
            }

            // Refresh jobs list
            await fetchJobs();
            closeJobModal();
        } catch (error) {
            console.error('Error saving job:', error);
            showToast(
                `Failed to ${currentJob ? 'update' : 'create'} job. Please try again.`,
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open delete confirmation modal
    const openDeleteModal = (job) => {
        setJobToDelete(job);
        setIsDeleteModalOpen(true);
    };

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setJobToDelete(null);
        setIsDeleteModalOpen(false);
    };

    // Handle job deletion
    const handleJobDelete = async () => {
        if (!jobToDelete) return;

        try {
            setIsSubmitting(true);
            await jobService.deleteJob(jobToDelete.id);
            showToast('Job deleted successfully', 'success');

            // Refresh jobs list
            await fetchJobs();
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting job:', error);
            showToast('Failed to delete job. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jobs</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Manage job postings and interview time slots
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button
                        onClick={() => openJobModal()}
                        icon={<PlusIcon className="h-5 w-5" />}
                    >
                        Add Job
                    </Button>
                </div>
            </div>

            <div className="mt-6">
                <Input
                    type="search"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                    className="max-w-md mb-6"
                />

                <JobList
                    jobs={filteredJobs}
                    loading={loading}
                    onEdit={openJobModal}
                    onDelete={openDeleteModal}
                />
            </div>

            {/* Job Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeJobModal}
                title={currentJob ? 'Edit Job' : 'Create New Job'}
                size="2xl"
            >
                <JobForm
                    job={currentJob}
                    onSubmit={handleJobSubmit}
                    onCancel={closeJobModal}
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
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">{jobToDelete?.title}</span>?
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

export default Jobs;