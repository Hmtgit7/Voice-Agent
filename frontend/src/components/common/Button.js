// src/components/common/Button.js
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    isLoading = false,
    icon = null,
    iconPosition = 'left',
    href = null,
    to = null,
    onClick = () => { },
    ...props
}) => {
    // Button size classes
    const sizeClasses = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
        xl: 'px-6 py-3 text-lg',
    };

    // Button variant classes
    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white',
        secondary: 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 text-white',
        success: 'bg-success-600 hover:bg-success-700 focus:ring-success-500 text-white',
        danger: 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 text-white',
        warning: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500 text-white',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
        outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
        link: 'bg-transparent hover:underline text-primary-600 dark:text-primary-400 p-0',
    };

    // Button disabled classes
    const disabledClasses = 'opacity-50 cursor-not-allowed';

    // Button base classes
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-900';

    // Combine all classes
    const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${disabled || isLoading ? disabledClasses : ''}
    ${className}
  `;

    // Loading spinner
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    // Icon element
    const IconElement = icon ? (
        <span className={`inline-block ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
            {icon}
        </span>
    ) : null;

    // If the button is a link
    if (href) {
        return (
            <a
                href={href}
                className={buttonClasses}
                disabled={disabled || isLoading}
                onClick={onClick}
                {...props}
            >
                {isLoading && <LoadingSpinner />}
                {icon && iconPosition === 'left' && IconElement}
                {children}
                {icon && iconPosition === 'right' && IconElement}
            </a>
        );
    }

    // If the button is a router link
    if (to) {
        return (
            <Link
                to={to}
                className={buttonClasses}
                onClick={onClick}
                {...props}
            >
                {isLoading && <LoadingSpinner />}
                {icon && iconPosition === 'left' && IconElement}
                {children}
                {icon && iconPosition === 'right' && IconElement}
            </Link>
        );
    }

    // Regular button
    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading && <LoadingSpinner />}
            {icon && iconPosition === 'left' && IconElement}
            {children}
            {icon && iconPosition === 'right' && IconElement}
        </button>
    );
};

export default Button;

