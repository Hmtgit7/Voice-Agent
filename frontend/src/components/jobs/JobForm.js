// src/components/jobs/JobForm.js
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useForm } from '../../hooks/useForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getTimeSlots } from '../../utils/dateUtils';
import { TrashIcon } from '@heroicons/react/24/outline';

const JobForm = ({
    job = null,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    // State for managing time slots
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    // Form validation function
    const validateForm = (values) => {
        const errors = {};

        if (!values.title) {
            errors.title = 'Job title is required';
        }

        if (!values.description) {
            errors.description = 'Job description is required';
        }

        if (!values.requirements) {
            errors.requirements = 'Job requirements are required';
        }

        return errors;
    };

    // Initialize form with useForm hook
    const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm(
        {
            title: job?.title || '',
            description: job?.description || '',
            requirements: job?.requirements || '',
            available_slots: job?.available_slots || [],
        },
        validateForm
    );

    // Parse existing time slots if editing
    React.useEffect(() => {
        if (job?.available_slots && job.available_slots.length > 0) {
            const dates = job.available_slots.map(slot => new Date(slot));
            setSelectedDates(dates);
        }
    }, [job]);

    // Add a time slot
    const addTimeSlot = () => {
        if (selectedDates.length === 0 || !selectedTimeSlot) return;

        // Create slot combinations for each selected date
        const newSlots = selectedDates.flatMap(date => {
            const [hours, minutes] = selectedTimeSlot.split(':');
            const slotDate = new Date(date);
            slotDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            return slotDate.toISOString();
        });

        // Add new slots to existing slots (avoiding duplicates)
        const currentSlots = values.available_slots || [];
        const allSlots = [...new Set([...currentSlots, ...newSlots])];

        setFieldValue('available_slots', allSlots);
        setSelectedTimeSlot('');
    };

    // Remove a time slot
    const removeTimeSlot = (slotToRemove) => {
        const updatedSlots = values.available_slots.filter(slot => slot !== slotToRemove);
        setFieldValue('available_slots', updatedSlots);
    };

    // Handle form submission
    const handleFormSubmit = (formValues) => {
        onSubmit(formValues);
    };

    // Generate time slot options
    const timeSlotOptions = getTimeSlots(new Date(), 9, 17, 30).map(slot => ({
        value: `${slot.getHours().toString().padStart(2, '0')}:${slot.getMinutes().toString().padStart(2, '0')}`,
        label: slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Input
                id="title"
                name="title"
                label="Job Title"
                value={values.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="e.g., Senior React Developer"
                required
            />

            <div className="form-group">
                <label htmlFor="description" className="form-label">
                    Job Description <span className="text-danger-600">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    rows={5}
                    className={`form-input ${errors.description ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Describe the job role, responsibilities, etc."
                    required
                />
                {errors.description && (
                    <p className="form-error">{errors.description}</p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="requirements" className="form-label">
                    Job Requirements <span className="text-danger-600">*</span>
                </label>
                <textarea
                    id="requirements"
                    name="requirements"
                    value={values.requirements}
                    onChange={handleChange}
                    rows={5}
                    className={`form-input ${errors.requirements ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="List the skills, experience, and qualifications required"
                    required
                />
                {errors.requirements && (
                    <p className="form-error">{errors.requirements}</p>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">Interview Time Slots</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Select Date(s)
                        </label>
                        <DatePicker
                            selected={selectedDates[0]}
                            onChange={setSelectedDates}
                            minDate={new Date()}
                            dateFormat="MMMM d, yyyy"
                            selectsRange={false}
                            inline
                            highlightDates={selectedDates}
                            monthsShown={1}
                            calendarClassName="bg-white dark:bg-dark-800 rounded-md shadow"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Select Time
                        </label>
                        <select
                            value={selectedTimeSlot}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select a time</option>
                            {timeSlotOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <div className="mt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addTimeSlot}
                                disabled={selectedDates.length === 0 || !selectedTimeSlot}
                            >
                                Add Time Slot
                            </Button>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Selected Time Slots ({values.available_slots?.length || 0})
                            </label>
                            <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-dark-700 rounded-md p-2">
                                {values.available_slots?.length > 0 ? (
                                    <ul className="space-y-1">
                                        {values.available_slots.map((slot) => (
                                            <li key={slot} className="flex justify-between items-center text-sm">
                                                <span>
                                                    {new Date(slot).toLocaleDateString()} at {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTimeSlot(slot)}
                                                    className="text-danger-600 hover:text-danger-800 dark:text-danger-400 dark:hover:text-danger-300"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                    <span className="sr-only">Remove time slot</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm py-2">
                                        No time slots selected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                    {job ? 'Update Job' : 'Create Job'}
                </Button>
            </div>
        </form>
    );
};

export default JobForm;