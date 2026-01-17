'use client';

import Sidebar, { TopBar } from '@/components/dashboard/Sidebar';
import StatCards from '@/components/dashboard/StatCards';
import FileUpload from '@/components/dashboard/FileUpload';
import TransactionHistory from '@/components/dashboard/TransactionHistory';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64">
                <TopBar />

                <main className="p-6 space-y-6">
                    {/* Stats */}
                    <StatCards />

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* File Upload */}
                        <div className="lg:col-span-1">
                            <FileUpload />
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
                                    />
                                    <QuickActionCard
                                        title="Export to Tally"
                                        icon="📁"
                                        color="bg-purple-100"
                                    />
                                    <QuickActionCard
                                        title="Download JSON"
                                        icon="📋"
                                        color="bg-green-100"
                                    />
                                    <QuickActionCard
                                        title="View Reports"
                                        icon="📈"
                                        color="bg-orange-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <TransactionHistory />
                </main>
            </div>
        </div>
    );
}

function QuickActionCard({ title, icon, color }: { title: string; icon: string; color: string }) {
    return (
        <button className={`${color} rounded-xl p-4 text-center hover:opacity-80 transition-opacity`}>
            <span className="text-3xl mb-2 block">{icon}</span>
            <span className="text-sm font-medium text-gray-700">{title}</span>
        </button>
    );
}
