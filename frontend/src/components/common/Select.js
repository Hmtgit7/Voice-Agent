// src/components/common/Select.js
import React, { forwardRef } from 'react';

const Select = forwardRef(({
    id,
    name,
    label,
    options = [],
    value = '',
    onChange = () => { },
    onBlur = () => { },
    error = null,
    helpText = null,
    required = false,
    disabled = false,
    placeholder = 'Select an option',
    className = '',
    selectClassName = '',
    labelClassName = '',
    errorClassName = '',
    helpTextClassName = '',
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const selectId = id || `select-${name}-${Math.random().toString(36).substring(2, 9)}`;

    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={`form-label ${labelClassName}`}
                >
                    {label} {required && <span className="text-danger-600">*</span>}
                </label>
            )}

            <select
                id={selectId}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                required={required}
                ref={ref}
                className={`
          form-select
          ${error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}
          ${selectClassName}
        `}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}

                {options.map(option => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

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

export default Select;