// src/components/common/Toggle.js
import React, { forwardRef } from 'react';
import { Switch } from '@headlessui/react';

const Toggle = forwardRef(({
    id,
    name,
    label,
    checked = false,
    onChange = () => { },
    disabled = false,
    className = '',
    labelClassName = '',
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const toggleId = id || `toggle-${name}-${Math.random().toString(36).substring(2, 9)}`;

    // Handle onChange
    const handleChange = (isChecked) => {
        onChange({
            target: {
                name,
                checked: isChecked,
                type: 'checkbox',
            },
        });
    };

    return (
        <Switch.Group as="div" className={`flex items-center ${className}`}>
            <Switch
                id={toggleId}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                ref={ref}
                className={`
          ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-900
        `}
                {...props}
            >
                <span
                    aria-hidden="true"
                    className={`
            ${checked ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          `}
                />
            </Switch>

            {label && (
                <Switch.Label as="span" className={`ml-3 ${labelClassName}`}>
                    {label}
                </Switch.Label>
            )}
        </Switch.Group>
    );
});

export default Toggle;