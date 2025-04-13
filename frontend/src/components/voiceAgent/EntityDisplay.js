// src/components/voiceAgent/EntityDisplay.js
import React from 'react';
import Card from '../common/Card';

const EntityDisplay = ({ entities = {}, loading = false }) => {
    // Check if entities object is empty
    const hasEntities = Object.keys(entities).length > 0;

    return (
        <Card title="Extracted Information">
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Loading extracted information...</p>
                </div>
            ) : !hasEntities ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                        No information extracted yet
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(entities).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <span className="text-sm text-gray-900 dark:text-white">
                                {typeof value === 'boolean'
                                    ? value ? 'Yes' : 'No'
                                    : value.toString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default EntityDisplay;