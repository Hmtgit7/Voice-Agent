// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validators';

const ForgotPassword = () => {
    const { forgotPassword, loading } = useAuth();
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form validation function
    const validateForm = (values) => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!validateEmail(values.email)) {
            errors.email = 'Invalid email address';
        }

        return errors;
    };

    // Initialize form with useForm hook
    const { values, errors, handleChange, handleSubmit } = useForm(
        { email: '' },
        validateForm
    );

    // Handle form submission
    const onSubmit = async (formValues) => {
        setServerError('');
        setSuccess(false);

        try {
            await forgotPassword(formValues.email);
            setSuccess(true);
        } catch (error) {
            setServerError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
        }
    };

    if (success) {
        return (
            <Card>
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-success-100 p-3">
                            <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        Reset link sent!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        We've sent a password reset link to {values.email}. Please check your inbox.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                            Return to login
                        </Link>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="mt-6">
                {serverError && (
                    <div className="mb-4 p-3 rounded-md bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-200">
                        {serverError}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email address"
                        autoComplete="email"
                        required
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email}
                        leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={loading}
                    >
                        Send reset link
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default ForgotPassword;