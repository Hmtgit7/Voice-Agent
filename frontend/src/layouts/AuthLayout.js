// src/layouts/AuthLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const AuthLayout = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
            {/* Theme toggle button */}
            <button
                type="button"
                className="fixed top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-900"
                onClick={toggleTheme}
            >
                <span className="sr-only">
                    {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                </span>
                {isDarkMode ? (
                    <SunIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                    <MoonIcon className="h-5 w-5" aria-hidden="true" />
                )}
            </button>

            {/* Main content */}
            <div className="flex flex-1 flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Interview Scheduler
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Voice Agent for Interview Scheduling
                        </p>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;