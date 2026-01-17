'use client';

import { useState } from 'react';
import Sidebar, { TopBar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                aria-hidden={!isSidebarOpen}
            >
                <div
                    className={`absolute inset-0 bg-black/40 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeSidebar}
                />
                <div
                    className={`absolute left-0 top-0 h-full w-64 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <Sidebar onNavigate={closeSidebar} className="h-full" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
