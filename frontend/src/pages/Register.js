// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validators';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    const [serverError, setServerError] = useState('');

    // Form validation function
    const validateForm = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Name is required';
        }

        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!validateEmail(values.email)) {
            errors.email = 'Invalid email address';
        }

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
        { name: '', email: '', password: '', confirmPassword: '' },
        validateForm
    );

    // Handle form submission
    const onSubmit = async (formValues) => {
        setServerError('');

        try {
            await register(formValues);
            navigate('/', { replace: true });
        } catch (error) {
            setServerError(error.response?.data?.message || 'Failed to register. Please try again.');
        }
    };

    return (
        <Card>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                    Create a new account
                </h2>
            </div>

            <div className="mt-6">
                {serverError && (
                    <div className="mb-4 p-3 rounded-md bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-200">
                        {serverError}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        label="Full name"
                        autoComplete="name"
                        required
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name}
                        leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
                    />

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

                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
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
                        label="Confirm password"
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
                        Sign up
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default Register;