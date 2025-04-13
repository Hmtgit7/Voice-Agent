// src/components/dashboard/StatsCard.js
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import Card from '../common/Card';

const StatsCard = ({
    title,
    value,
    icon,
    change = null,
    changeLabel = 'from last month',
    color = 'primary',
    className = '',
}) => {
    // Color classes
    const colorClasses = {
        primary: 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/20',
        secondary: 'text-secondary-600 bg-secondary-100 dark:text-secondary-400 dark:bg-secondary-900/20',
        success: 'text-success-600 bg-success-100 dark:text-success-400 dark:bg-success-900/20',
        danger: 'text-danger-600 bg-danger-100 dark:text-danger-400 dark:bg-danger-900/20',
        warning: 'text-warning-600 bg-warning-100 dark:text-warning-400 dark:bg-warning-900/20',
        info: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    };

    // Determine change color
    const isPositive = change && change > 0;
    const changeColor = isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400';

    return (
        <Card className={`overflow-hidden ${className}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${colorClasses[color] || colorClasses.primary}`}>
                        {icon}
                    </div>
                </div>

                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            {title}
                        </dt>
                        <dd>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {value}
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>

            {change !== null && (
                <div className="mt-4 flex items-center">
                    {isPositive ? (
                        <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center text-success-500 dark:text-success-400" aria-hidden="true" />
                    ) : (
                        <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center text-danger-500 dark:text-danger-400" aria-hidden="true" />
                    )}

                    <div className={`text-sm ${changeColor}`}>
                        <span className="font-medium">{Math.abs(change)}%</span>{' '}
                        <span className="text-gray-500 dark:text-gray-400">{changeLabel}</span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default StatsCard;