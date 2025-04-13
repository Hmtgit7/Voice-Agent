// src/components/common/Spinner.js
import React from 'react';

const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
    // Spinner size classes
    const sizeClasses = {
        xs: 'h-4 w-4',
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    // Spinner color classes
    const colorClasses = {
        primary: 'text-primary-600 dark:text-primary-500',
        secondary: 'text-secondary-600 dark:text-secondary-500',
        success: 'text-success-600 dark:text-success-500',
        danger: 'text-danger-600 dark:text-danger-500',
        warning: 'text-warning-600 dark:text-warning-500',
        info: 'text-blue-600 dark:text-blue-500',
        white: 'text-white',
        gray: 'text-gray-600 dark:text-gray-400',
    };

    return (
        <svg
            className={`animate-spin ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
};

export default Spinner;