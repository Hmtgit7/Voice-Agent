// src/components/common/Input.js
import React, { forwardRef } from 'react';

const Input = forwardRef(({
    id,
    name,
    label,
    type = 'text',
    placeholder = '',
    value = '',
    onChange = () => { },
    onBlur = () => { },
    error = null,
    helpText = null,
    required = false,
    disabled = false,
    readOnly = false,
    className = '',
    inputClassName = '',
    labelClassName = '',
    errorClassName = '',
    helpTextClassName = '',
    leftIcon = null,
    rightIcon = null,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${name}-${Math.random().toString(36).substring(2, 9)}`;

    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={`form-label ${labelClassName}`}
                >
                    {label} {required && <span className="text-danger-600">*</span>}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    ref={ref}
                    className={`
            form-input
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}
            ${inputClassName}
          `}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className={`form-error ${errorClassName}`}>
                    {error}
                </p>
            )}

            {helpText && !error && (
                <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${helpTextClassName}`}>
                    {helpText}
                </p>
            )}
        </div>
    );
});

export default Input;