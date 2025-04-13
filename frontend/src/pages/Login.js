// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validators';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading } = useAuth();
    const [serverError, setServerError] = useState('');

    // Get redirect URL from location state or default to dashboard
    const from = location.state?.from?.pathname || '/';

    // Form validation function
    const validateForm = (values) => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!validateEmail(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (!values.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };

    // Initialize form with useForm hook
    const { values, errors, handleChange, handleSubmit } = useForm(
        { email: '', password: '' },
        validateForm
    );

    // Handle form submission
    const onSubmit = async (formValues) => {
        setServerError('');

        try {
            await login(formValues);
            navigate(from, { replace: true });
        } catch (error) {
            setServerError(error.response?.data?.message || 'Failed to login. Please try again.');
        }
    };

    return (
        <Card>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                    Sign in to your account
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
                        autoComplete="current-password"
                        required
                        value={values.password}
                        onChange={handleChange}
                        error={errors.password}
                        leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                name="remember_me"
                                type="checkbox"
                                className="form-checkbox"
                            />
                            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={loading}
                    >
                        Sign in
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">
                                Or
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            to="/register"
                            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Login;