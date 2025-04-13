// src/components/common/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ArrowLeftOnRectangleIcon,
    CalendarIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    HomeIcon,
    MicrophoneIcon,
    UserCircleIcon,
    UserGroupIcon,
    XMarkIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose, isMobile = false }) => {
    const location = useLocation();
    const { logout } = useAuth();

    // Navigation items
    const navigation = [
        { name: 'Dashboard', to: '/', icon: HomeIcon },
        { name: 'Jobs', to: '/jobs', icon: BriefcaseIcon },
        { name: 'Candidates', to: '/candidates', icon: UserGroupIcon },
        { name: 'Appointments', to: '/appointments', icon: CalendarIcon },
        { name: 'Voice Test', to: '/voice-test', icon: MicrophoneIcon },
        { name: 'Reports', to: '/reports', icon: ChartBarIcon },
    ];

    // User navigation
    const userNavigation = [
        { name: 'Profile', to: '/profile', icon: UserCircleIcon },
        { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
    ];

    // Check if a route is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Mobile sidebar backdrop
    const MobileSidebarBackdrop = () => (
        <div
            className="fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
        ></div>
    );

    // Create navigation item
    const NavItem = ({ item }) => (
        <Link
            to={item.to}
            className={`
        flex items-center px-4 py-2 text-sm font-medium rounded-md
        ${isActive(item.to)
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700'
                }
      `}
            onClick={isMobile ? onClose : undefined}
        >
            <item.icon
                className={`
          mr-3 h-5 w-5 flex-shrink-0
          ${isActive(item.to)
                        ? 'text-primary-700 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }
        `}
                aria-hidden="true"
            />
            {item.name}
        </Link>
    );

    const sidebarContent = (
        <div className="flex h-full flex-col bg-white dark:bg-dark-800 shadow-lg">
            <div className="flex flex-col h-0 flex-1 overflow-y-auto pt-5 pb-4">
                <div className="flex items-center justify-between flex-shrink-0 px-4">
                    <Link to="/" className="flex items-center" onClick={isMobile ? onClose : undefined}>
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            Interview Scheduler
                        </span>
                    </Link>

                    {isMobile && (
                        <button
                            type="button"
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                        </button>
                    )}
                </div>

                <nav className="mt-5 flex-1 space-y-1 px-2">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <NavItem key={item.name} item={item} />
                        ))}
                    </div>

                    {/* User Navigation */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                        <div className="space-y-1">
                            {userNavigation.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Sign Out Button */}
            <div className="flex flex-shrink-0 border-t border-gray-200 dark:border-dark-700 p-4">
                <button
                    onClick={logout}
                    className="group flex w-full items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
                >
                    <ArrowLeftOnRectangleIcon
                        className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                    />
                    Sign out
                </button>
            </div>
        </div>
    );

    // Mobile sidebar
    if (isMobile) {
        return (
            <>
                {isOpen && <MobileSidebarBackdrop />}

                <div
                    className={`
            fixed inset-y-0 left-0 z-30 w-64 transform transition duration-300 ease-in-out lg:hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
                >
                    {sidebarContent}
                </div>
            </>
        );
    }

    // Desktop sidebar
    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            {sidebarContent}
        </div>
    );
};

export default Sidebar;