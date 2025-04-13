// src/pages/Settings.js
import React, { useState } from 'react';
import {
    Cog6ToothIcon,
    PaintBrushIcon,
    BellIcon,
    GlobeAltIcon,
    LockClosedIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Toggle from '../components/common/Toggle';
import Select from '../components/common/Select';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const Settings = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { showToast } = useToast();

    // Settings state
    const [settings, setSettings] = useState({
        // Appearance
        theme: isDarkMode ? 'dark' : 'light',
        animationsEnabled: true,

        // Notifications
        emailNotifications: true,
        appointmentReminders: true,
        candidateUpdates: true,

        // Privacy
        shareUsageData: true,

        // Voice Agent
        defaultVoice: 'en-US-Standard-C',
        voiceSpeed: 1.0,
        autoPlay: true,

        // Data Management
        autoBackup: false,
        backupFrequency: 'weekly',
    });

    // Handle setting changes
    const handleSettingChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value,
        });

        // Apply changes immediately for certain settings
        if (name === 'theme') {
            if ((value === 'dark' && !isDarkMode) || (value === 'light' && isDarkMode)) {
                toggleTheme();
            }
        }

        // Show toast notification for feedback
        showToast('Setting updated successfully', 'success');
    };

    // Theme options
    const themeOptions = [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'system', label: 'System Default' },
    ];

    // Voice options
    const voiceOptions = [
        { value: 'en-US-Standard-A', label: 'English (US) - Female' },
        { value: 'en-US-Standard-B', label: 'English (US) - Male' },
        { value: 'en-US-Standard-C', label: 'English (US) - Female 2' },
        { value: 'en-US-Standard-D', label: 'English (US) - Male 2' },
        { value: 'en-GB-Standard-A', label: 'English (UK) - Female' },
        { value: 'en-GB-Standard-B', label: 'English (UK) - Male' },
    ];

    // Backup frequency options
    const backupFrequencyOptions = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
    ];

    // Handle settings export
    const handleExportSettings = () => {
        // Create a JSON file with settings
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

        // Create download link and click it
        const exportFileDefaultName = 'voice-agent-settings.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        showToast('Settings exported successfully', 'success');
    };

    // Handle reset settings
    const handleResetSettings = () => {
        // Reset to default settings
        setSettings({
            theme: 'light',
            animationsEnabled: true,
            emailNotifications: true,
            appointmentReminders: true,
            candidateUpdates: true,
            shareUsageData: true,
            defaultVoice: 'en-US-Standard-C',
            voiceSpeed: 1.0,
            autoPlay: true,
            autoBackup: false,
            backupFrequency: 'weekly',
        });

        // Reset theme if needed
        if (isDarkMode) {
            toggleTheme();
        }

        showToast('Settings reset to defaults', 'success');
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage application settings and preferences
            </p>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appearance Settings */}
                <Card
                    title="Appearance"
                    icon={<PaintBrushIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
                >
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Theme
                            </label>
                            <Select
                                id="theme"
                                name="theme"
                                value={settings.theme}
                                onChange={handleSettingChange}
                                options={themeOptions}
                            />
                        </div>

                        <div>
                            <Toggle
                                id="animationsEnabled"
                                name="animationsEnabled"
                                label="Enable animations"
                                checked={settings.animationsEnabled}
                                onChange={handleSettingChange}
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Help us improve by sharing anonymous usage data
                            </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-700">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Data Retention
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Voice recordings and transcripts are stored for 30 days before being automatically deleted.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Data Management Settings */}
                <Card
                    title="Data Management"
                    icon={<ArchiveBoxIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
                    className="lg:col-span-2"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="space-y-4">
                                <div>
                                    <Toggle
                                        id="autoBackup"
                                        name="autoBackup"
                                        label="Automatic backups"
                                        checked={settings.autoBackup}
                                        onChange={handleSettingChange}
                                    />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Regularly backup your data
                                    </p>
                                </div>

                                {settings.autoBackup && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Backup Frequency
                                        </label>
                                        <Select
                                            id="backupFrequency"
                                            name="backupFrequency"
                                            value={settings.backupFrequency}
                                            onChange={handleSettingChange}
                                            options={backupFrequencyOptions}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Button
                                    onClick={handleExportSettings}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Export Settings
                                </Button>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Download your settings as a JSON file
                                </p>
                            </div>

                            <div>
                                <Button
                                    onClick={handleResetSettings}
                                    variant="danger"
                                    className="w-full"
                                >
                                    Reset to Defaults
                                </Button>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Reset all settings to their default values
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;