// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-900 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <h1 className="text-9xl font-extrabold text-primary-600 dark:text-primary-400">404</h1>

                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
                    Page Not Found
                </h2>

                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Sorry, we couldn't find the page you're looking for.
                </p>

                <div className="mt-8">
                    <Link to="/">
                        <Button icon={<ArrowLeftIcon className="h-5 w-5" />}>
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;