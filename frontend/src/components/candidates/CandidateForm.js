// src/components/candidates/CandidateForm.js
import React from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useForm } from '../../hooks/useForm';
import { validateEmail, validatePhone } from '../../utils/validators';

const CandidateForm = ({
    candidate = null,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    // Form validation function
    const validateForm = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Name is required';
        }

        if (!values.phone) {
            errors.phone = 'Phone number is required';
        } else if (!validatePhone(values.phone)) {
            errors.phone = 'Invalid phone number format';
        }

        if (values.email && !validateEmail(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (values.current_ctc && (isNaN(values.current_ctc) || values.current_ctc < 0)) {
            errors.current_ctc = 'CTC must be a positive number';
        }

        if (values.expected_ctc && (isNaN(values.expected_ctc) || values.expected_ctc < 0)) {
            errors.expected_ctc = 'CTC must be a positive number';
        }

        if (values.notice_period && (isNaN(values.notice_period) || values.notice_period < 0)) {
            errors.notice_period = 'Notice period must be a positive number';
        }

        if (values.experience && (isNaN(values.experience) || values.experience < 0)) {
            errors.experience = 'Experience must be a positive number';
        }

        return errors;
    };

    // Initialize form with useForm hook
    const { values, errors, handleChange, handleSubmit } = useForm(
        {
            name: candidate?.name || '',
            phone: candidate?.phone || '',
            email: candidate?.email || '',
            current_ctc: candidate?.current_ctc || '',
            expected_ctc: candidate?.expected_ctc || '',
            notice_period: candidate?.notice_period || '',
            experience: candidate?.experience || '',
            status: candidate?.status || 'new',
        },
        validateForm
    );

    // Status options
    const statusOptions = [
        { value: 'new', label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'interviewed', label: 'Interviewed' },
        { value: 'hired', label: 'Hired' },
        { value: 'rejected', label: 'Rejected' },
    ];

    // Handle form submission
    const handleFormSubmit = (formValues) => {
        // Convert numeric fields to numbers
        const submissionValues = {
            ...formValues,
            current_ctc: formValues.current_ctc ? parseFloat(formValues.current_ctc) : null,
            expected_ctc: formValues.expected_ctc ? parseFloat(formValues.expected_ctc) : null,
            notice_period: formValues.notice_period ? parseInt(formValues.notice_period, 10) : null,
            experience: formValues.experience ? parseFloat(formValues.experience) : null,
        };

        onSubmit(submissionValues);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    id="name"
                    name="name"
                    label="Full Name"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="John Doe"
                    required
                />

                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+1 (555) 123-4567"
                    required
                />

                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="john.doe@example.com"
                />

                <Input
                    id="experience"
                    name="experience"
                    type="number"
                    label="Experience (years)"
                    value={values.experience}
                    onChange={handleChange}
                    error={errors.experience}
                    placeholder="5"
                    min="0"
                    step="0.5"
                />

                <Input
                    id="current_ctc"
                    name="current_ctc"
                    type="number"
                    label="Current CTC (per year)"
                    value={values.current_ctc}
                    onChange={handleChange}
                    error={errors.current_ctc}
                    placeholder="50000"
                    min="0"
                    step="1000"
                />

                <Input
                    id="expected_ctc"
                    name="expected_ctc"
                    type="number"
                    label="Expected CTC (per year)"
                    value={values.expected_ctc}
                    onChange={handleChange}
                    error={errors.expected_ctc}
                    placeholder="65000"
                    min="0"
                    step="1000"
                />

                <Input
                    id="notice_period"
                    name="notice_period"
                    type="number"
                    label="Notice Period (days)"
                    value={values.notice_period}
                    onChange={handleChange}
                    error={errors.notice_period}
                    placeholder="30"
                    min="0"
                />

                <Select
                    id="status"
                    name="status"
                    label="Status"
                    value={values.status}
                    onChange={handleChange}
                    options={statusOptions}
                />
            </div>

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                    {candidate ? 'Update Candidate' : 'Add Candidate'}
                </Button>
            </div>
        </form>
    );
};

export default CandidateForm;