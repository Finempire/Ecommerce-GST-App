'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { TopBar } from '@/components/dashboard/Sidebar';
import StatCards from '@/components/dashboard/StatCards';
import FileUpload from '@/components/dashboard/FileUpload';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import { useAuth } from '@/context/AuthContext';
import { reportsApi, DashboardStats } from '@/lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Auth protection
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await reportsApi.getDashboardStats();
                if (response.success && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchStats();
        }
    }, [isAuthenticated]);

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64">
                <TopBar userName={user?.name} />

                <main className="p-6 space-y-6">
                    {/* Welcome banner */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
                        <p className="text-indigo-100">
                            Upload your e-commerce data to generate GST reports and Tally XML files.
                        </p>
                    </div>

                    {/* Stats */}
                    <StatCards stats={stats} isLoading={isLoading} />

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* File Upload */}
                        <div className="lg:col-span-1">
                            <FileUpload onUploadComplete={() => {
                                // Refresh stats when upload completes
                                reportsApi.getDashboardStats().then(response => {
                                    if (response.success && response.data) {
                                        setStats(response.data);
                                    }
                                });
                            }} />
                        </div>

                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <QuickActionCard
                                        title="Generate GSTR-1"
                                        icon="📊"
                                        color="bg-blue-100"
                                        onClick={() => router.push('/dashboard/reports?type=gstr1')}
                                    />
                                    <QuickActionCard
                                        title="Export to Tally"
                                        icon="📁"
                                        color="bg-purple-100"
                                        onClick={() => router.push('/dashboard/reports?type=tally')}
                                    />
                                    <QuickActionCard
                                        title="Download JSON"
                                        icon="📋"
                                        color="bg-green-100"
                                        onClick={() => router.push('/dashboard/reports?type=json')}
                                    />
                                    <QuickActionCard
                                        title="View Reports"
                                        icon="📈"
                                        color="bg-orange-100"
                                        onClick={() => router.push('/dashboard/reports')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <TransactionHistory recentUploads={stats?.recent_uploads} />
                </main>
            </div>
        </div>
    );
}

function QuickActionCard({
    title,
    icon,
    color,
    onClick
}: {
    title: string;
    icon: string;
    color: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`${color} rounded-xl p-4 text-center hover:opacity-80 transition-opacity cursor-pointer`}
        >
            <span className="text-3xl mb-2 block">{icon}</span>
            <span className="text-sm font-medium text-gray-700">{title}</span>
        </button>
    );
}
