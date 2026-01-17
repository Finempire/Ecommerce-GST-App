'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiFilter, FiSearch, FiLoader } from 'react-icons/fi';
import { uploadsApi, Upload } from '@/lib/api';

interface RecentUpload {
    id: string;
    file_name: string;
    platform_name: string;
    status: string;
    created_at: string;
}

interface TransactionHistoryProps {
    recentUploads?: RecentUpload[];
}

export default function TransactionHistory({ recentUploads }: TransactionHistoryProps) {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('All');

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const response = await uploadsApi.getUploads();
                if (response.success && response.data) {
                    setUploads(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch uploads:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUploads();
    }, []);

    const displayData = uploads.length > 0 ? uploads : (recentUploads || []).map(u => ({
        id: u.id,
        file_name: u.file_name,
        file_type: '.csv' as const,
        platform_name: u.platform_name,
        status: u.status as Upload['status'],
        created_at: u.created_at,
    }));

    const filteredUploads = displayData.filter((u) => {
        const matchesSearch = u.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.platform_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterPlatform === 'All' || u.platform_name === filterPlatform;
        return matchesSearch && matchesFilter;
    });

    const platforms = ['All', ...new Set(displayData.map(u => u.platform_name))];

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-800">Recent Uploads</h2>
                    <div className="flex gap-3">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-auto"
                            />
                        </div>
                        <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={filterPlatform}
                                onChange={(e) => setFilterPlatform(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                            >
                                {platforms.map((p) => (
                                    <option key={p} value={p}>{p === 'All' ? 'All Platforms' : p}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="p-8 text-center">
                    <FiLoader className="animate-spin mx-auto text-2xl text-gray-400 mb-2" />
                    <p className="text-gray-500">Loading uploads...</p>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredUploads.length === 0 && (
                <div className="p-8 text-center">
                    <p className="text-gray-500">No uploads found. Upload your first file to get started!</p>
                </div>
            )}

            {/* Table */}
            {!isLoading && filteredUploads.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    File Name
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Platform
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUploads.map((upload, index) => (
                                <motion.tr
                                    key={upload.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4 text-sm font-medium text-gray-800 max-w-xs truncate">
                                        {upload.file_name}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {formatDate(upload.created_at)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {upload.platform_name}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(upload.status)}`}>
                                            {upload.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <FiEye size={16} />
                                            </button>
                                            {upload.status === 'completed' && (
                                                <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                    <FiDownload size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredUploads.length > 0 && (
                <div className="px-5 py-4 border-t flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {filteredUploads.length} of {displayData.length} entries
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            1
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
