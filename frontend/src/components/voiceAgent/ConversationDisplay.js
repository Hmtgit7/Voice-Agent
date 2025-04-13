// src/components/voiceAgent/ConversationDisplay.js
import React from 'react';
import Card from '../common/Card';

const ConversationDisplay = ({ conversation = [], loading = false }) => {
    return (
        <Card title="Conversation History">
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Loading conversation...</p>
                    </div>
                ) : conversation.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            Start the simulation to see the conversation history
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {conversation.map((message, index) => (
                            <li
                                key={index}
                                className={`flex ${message.type === 'system'
                                        ? 'justify-start'
                                        : 'justify-end'
                                    }`}
                            >
                                <div
                                    className={`rounded-lg px-4 py-2 max-w-3/4 ${message.type === 'system'
                                            ? 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white'
                                            : 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Card>
    );
};

export default ConversationDisplay;