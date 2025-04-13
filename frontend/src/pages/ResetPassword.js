// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword, loading } = useAuth();
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form validation function
    const validateForm = (values) => {
        const errors = {};

        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    // Initialize form with useForm hook
    const { values, errors, handleChange, handleSubmit } = useForm(
        { password: '', confirmPassword: '' },
        validateForm
    );

    // Handle form submission
    const onSubmit = async (formValues) => {
        setServerError('');
        setSuccess(false);

        try {
            await resetPassword(token, formValues.password);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 3000);
        } catch (error) {
            setServerError(error.response?.data?.message || 'Failed to reset password. Please try again.');
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
                        Password reset successful!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Your password has been reset successfully. You'll be redirected to the login page shortly.
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
                    Enter your new password below.
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
                        id="password"
                        name="password"
                        type="password"
                        label="New password"
                        autoComplete="new-password"
                        required
                        value={values.password}
                        onChange={handleChange}
                        error={errors.password}
                        leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm new password"
                        autoComplete="new-password"
                        required
                        value={values.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={loading}
                    >
                        Reset password
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

export default ResetPassword;