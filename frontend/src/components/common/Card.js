// src/components/common/Card.js
import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    footer,
    className = '',
    headerClassName = '',
    bodyClassName = '',
    footerClassName = '',
    noPadding = false,
    ...props
}) => {
    return (
        <div
            className={`bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden ${className}`}
            {...props}
        >
            {(title || subtitle) && (
                <div className={`border-b border-gray-200 dark:border-dark-700 px-6 py-4 ${headerClassName}`}>
                    {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
                    {subtitle && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
                </div>
            )}

            <div className={`${noPadding ? '' : 'p-6'} ${bodyClassName}`}>
                {children}
            </div>

            {footer && (
                <div className={`border-t border-gray-200 dark:border-dark-700 px-6 py-4 ${footerClassName}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;