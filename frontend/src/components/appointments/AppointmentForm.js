// src/components/appointments/AppointmentForm.js
import React, { useState, useEffect } from 'react';
import Select from '../common/Select';
import Button from '../common/Button';
import Card from '../common/Card';
import useForm from '../../hooks/useForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '../../utils/dateUtils';
import jobService from '../../services/jobService';
import candidateService from '../../services/candidateService';

const AppointmentForm = ({
    appointment = null,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        appointment ? new Date(appointment.date_time) : new Date()
    );
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Form validation function
    const validateForm = (values) => {
        const errors = {};

        if (!values.job_id) {
            errors.job_id = 'Job is required';
        }

        if (!values.candidate_id) {
            errors.candidate_id = 'Candidate is required';
        }

        if (!values.date_time) {
            errors.date_time = 'Date and time is required';
        }

        return errors;
    };

    // Initialize form with useForm hook
    const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm(
        {
            job_id: appointment?.job_id || '',
            candidate_id: appointment?.candidate_id || '',
            date_time: appointment?.date_time || '',
            status: appointment?.status || 'scheduled',
        },
        validateForm
    );

    // Fetch jobs and candidates on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch available slots when job changes
    useEffect(() => {
        if (values.job_id) {
            fetchAvailableSlots(values.job_id);
        } else {
            setAvailableSlots([]);
        }
    }, [values.job_id]);

    // Fetch jobs and candidates data
    const fetchData = async () => {
        try {
            setLoadingData(true);

            // Fetch jobs
            const jobsResponse = await jobService.getAllJobs();
            setJobs(jobsResponse.data || []);

            // Fetch candidates
            const candidatesResponse = await candidateService.getAllCandidates();
            setCandidates(candidatesResponse.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    // Fetch available slots for selected job
    const fetchAvailableSlots = async (jobId) => {
        try {
            setLoadingData(true);

            // Fetch job details
            const jobResponse = await jobService.getJobById(jobId);
            const job = jobResponse.data;

            // Get available slots
            const slots = job.available_slots || [];

            // If editing, include the current appointment slot if not in available slots
            if (appointment && appointment.job_id === jobId) {
                const appointmentDateTime = new Date(appointment.date_time).toISOString();
                if (!slots.includes(appointmentDateTime)) {
                    slots.push(appointmentDateTime);
                }
            }

            setAvailableSlots(slots);
        } catch (error) {
            console.error('Error fetching available slots:', error);
        } finally {
            setLoadingData(false);
        }
    };

    // Handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setFieldValue('date_time', date.toISOString());
    };

    // Handle form submission
    const handleFormSubmit = (formValues) => {
        onSubmit(formValues);
    };

    // Status options
    const statusOptions = [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'rescheduled', label: 'Rescheduled' },
    ];

    // Job options for select input
    const jobOptions = [
        { value: '', label: 'Select a job', disabled: true },
        ...jobs.map((job) => ({
            value: job.id,
            label: job.title,
        })),
    ];

    // Candidate options for select input
    const candidateOptions = [
        { value: '', label: 'Select a candidate', disabled: true },
        ...candidates.map((candidate) => ({
            value: candidate.id,
            label: candidate.name,
        })),
    ];

    // Available time slots for selected date
    const timeSlots = availableSlots
        .filter((slot) => {
            const slotDate = new Date(slot);
            return (
                slotDate.getDate() === selectedDate.getDate() &&
                slotDate.getMonth() === selectedDate.getMonth() &&
                slotDate.getFullYear() === selectedDate.getFullYear()
            );
        })
        .map((slot) => ({
            value: slot,
            label: formatDate(slot, 'HH:mm'),
        }));

    // Days with available slots
    const daysWithSlots = availableSlots.map((slot) => new Date(slot));

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Select
                        id="job_id"
                        name="job_id"
                        label="Job"
                        value={values.job_id}
                        onChange={handleChange}
                        options={jobOptions}
                        error={errors.job_id}
                        disabled={loading || loadingData}
                        required
                    />
                </div>

                <div>
                    <Select
                        id="candidate_id"
                        name="candidate_id"
                        label="Candidate"
                        value={values.candidate_id}
                        onChange={handleChange}
                        options={candidateOptions}
                        error={errors.candidate_id}
                        disabled={loading || loadingData}
                        required
                    />
                </div>
            </div>

            {values.job_id && (
                <Card title="Select Interview Date & Time">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Date
                            </label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateSelect}
                                minDate={new Date()}
                                dateFormat="MMMM d, yyyy"
                                className="form-input w-full"
                                highlightDates={daysWithSlots}
                                monthsShown={1}
                                disabled={loading || loadingData || availableSlots.length === 0}
                                inline
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Available Time Slots
                            </label>

                            {timeSlots.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 dark:bg-dark-800 rounded-md">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {values.job_id
                                            ? availableSlots.length === 0
                                                ? 'No available time slots for this job'
                                                : 'No available time slots for selected date'
                                            : 'Select a job to see available time slots'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot.value}
                                            type="button"
                                            className={`px-4 py-2 text-sm rounded-md transition-colors
                        ${values.date_time === slot.value
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                                                }
                      `}
                                            onClick={() => setFieldValue('date_time', slot.value)}
                                            disabled={loading || loadingData}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {errors.date_time && (
                                <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">
                                    {errors.date_time}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {appointment && (
                <div>
                    <Select
                        id="status"
                        name="status"
                        label="Status"
                        value={values.status}
                        onChange={handleChange}
                        options={statusOptions}
                        disabled={loading || loadingData}
                    />
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                    {appointment ? 'Update Appointment' : 'Schedule Interview'}
                </Button>
            </div>
        </form>
    );
};

export default AppointmentForm;