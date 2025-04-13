// src/components/common/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  BellIcon, 
  MoonIcon, 
  SunIcon, 
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ onSidebarToggle }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen || isNotificationsOpen) {
        setIsProfileMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen, isNotificationsOpen]);
  
  // Toggle profile menu
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationsOpen(false);
  };
  
  // Toggle notifications
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileMenuOpen(false);
  };
  
  return (
    <nav className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700 lg:hidden"
                onClick={onSidebarToggle}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              
              {/* Logo */}
              <Link to="/" className="ml-2 lg:ml-0 flex items-center">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Interview Scheduler
                </span>
              </Link>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-900"
              onClick={toggleTheme}
            >
              <span className="sr-only">
                {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              </span>
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            
            {/* Notifications */}
            <div className="relative ml-3">
              <button
                type="button"
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-900"
                onClick={toggleNotifications}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-5 w-5" aria-hidden="true" />
                
                {/* Notification badge */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-dark-800"></span>
              </button>
              
              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-dark-800 ring-1 ring-black dark:ring-dark-700 ring-opacity-5 focus:outline-none z-50"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="py-1 divide-y divide-gray-200 dark:divide-dark-700">
                    <div className="px-4 py-3">
                      <h3 className="text-sm font-medium">Notifications</h3>
                    </div>
                    
                    {/* Notification items */}
                    <div className="max-h-60 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-700 cursor-pointer">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">New interview scheduled</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">10 minutes ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-700 cursor-pointer">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Candidate John Doe confirmed</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                      </div>
                    </div>
                    
                    <div className="px-4 py-2">
                      <Link
                        to="/notifications"
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                type="button"
                className="flex items-center max-w-xs p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-900"
                onClick={toggleProfileMenu}
              >
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="h-5 w-5" aria-hidden="true" />
                <span className="ml-2 hidden md:inline">{user?.name || 'User'}</span>
              </button>
              
              {/* Profile dropdown menu */}
              {isProfileMenuOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-dark-800 ring-1 ring-black dark:ring-dark-700 ring-opacity-5 focus:outline-none z-50"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;