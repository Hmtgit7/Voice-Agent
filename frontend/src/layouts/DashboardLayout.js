// src/layouts/DashboardLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
            {/* Sidebar for mobile */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isMobile={true}
            />

            {/* Sidebar for desktop */}
            <Sidebar
                isOpen={true}
                onClose={() => { }}
                isMobile={false}
            />

            {/* Main content */}
            <div className="flex flex-1 flex-col lg:pl-64">
                <Navbar onSidebarToggle={toggleSidebar} />

                {/* Main content area */}
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;