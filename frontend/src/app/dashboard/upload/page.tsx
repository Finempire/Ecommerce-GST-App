'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { TopBar } from '@/components/dashboard/Sidebar';
import FileUpload from '@/components/dashboard/FileUpload';
import { useAuth } from '@/context/AuthContext';
import { FiUpload, FiInfo } from 'react-icons/fi';

export default function UploadPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64">
                <TopBar />

                <main className="p-6 space-y-6">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Upload Files</h1>
                        <p className="text-gray-600">Upload your e-commerce sales data for processing</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* File Upload */}
                        <div className="lg:col-span-2">
                            <FileUpload />
                        </div>

                        {/* Help Section */}
                        <div className="space-y-6">
                            {/* Supported Formats */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiUpload className="text-blue-600" />
                                    Supported Formats
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        PDF (Bank Statements)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        CSV (Sales Reports)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Excel (.xlsx, .xls)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        JSON
                                    </li>
                                </ul>
                            </div>

                            {/* Supported Platforms */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiInfo className="text-blue-600" />
                                    Supported Platforms
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        'Amazon', 'Flipkart', 'Meesho', 'Myntra',
                                        'Glowroad', 'Jio Mart', 'Snapdeal', 'Paytm',
                                        'LimeRoad', 'Shop 101', 'Bank Statement'
                                    ].map((platform) => (
                                        <div
                                            key={platform}
                                            className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700"
                                        >
                                            {platform}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                                <h3 className="font-bold mb-3">💡 Pro Tips</h3>
                                <ul className="space-y-2 text-sm text-white/90">
                                    <li>• Select the correct platform before uploading</li>
                                    <li>• Use the original file from the platform</li>
                                    <li>• Bank PDFs work best with clean scans</li>
                                    <li>• Max file size: 10MB</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
