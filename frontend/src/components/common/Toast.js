// src/components/common/Toast.js
import React from 'react';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Toast = ({
    type = 'info',
    title,
    message,
    onClose = () => { },
    autoClose = true,
    autoCloseDelay = 5000,
    className = '',
    ...props
}) => {
    // Toast type configuration
    const toastConfig = {
        info: {
            icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
        },
        success: {
            icon: <CheckCircleIcon className="h-6 w-6 text-success-500" />,
            bgColor: 'bg-success-50 dark:bg-success-900/20',
            borderColor: 'border-success-200 dark:border-success-800',
        },
        warning: {
            icon: <ExclamationCircleIcon className="h-6 w-6 text-warning-500" />,
            bgColor: 'bg-warning-50 dark:bg-warning-900/20',
            borderColor: 'border-warning-200 dark:border-warning-800',
        },
        error: {
            icon: <XCircleIcon className="h-6 w-6 text-danger-500" />,
            bgColor: 'bg-danger-50 dark:bg-danger-900/20',
            borderColor: 'border-danger-200 dark:border-danger-800',
        },
    };

    // Set auto close timer
    React.useEffect(() => {
        let timer;

        if (autoClose) {
            timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [autoClose, autoCloseDelay, onClose]);

    const config = toastConfig[type] || toastConfig.info;

    return (
        <div
            className={`
        rounded-lg border p-4 shadow-md animate-fade-in
        ${config.bgColor}
        ${config.borderColor}
        ${className}
      `}
            role="alert"
            {...props}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {config.icon}
                </div>

                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    )}

                    {message && (
                        <div className={`text-sm text-gray-700 dark:text-gray-300 ${title ? 'mt-1' : ''}`}>
                            {message}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-900"
                    onClick={onClose}
                >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};

export default Toast;