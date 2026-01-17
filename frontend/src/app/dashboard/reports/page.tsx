'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { TopBar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { reportsApi, Report, REPORT_TYPES } from '@/lib/api';
import { FiDownload, FiFileText, FiCalendar, FiLoader, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ReportsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await reportsApi.getReports();
                if (response.success && response.data) {
                    setReports(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch reports:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchReports();
        }
    }, [isAuthenticated]);

    const handleGenerateReport = async (type: string) => {
        setGenerating(true);
        setError(null);
        try {
            const response = await reportsApi.generateReport({
                report_type: type,
                upload_ids: [], // Will generate for all uploads
            });

            if (response.success) {
                // Refresh reports list
                const reportsResponse = await reportsApi.getReports();
                if (reportsResponse.success && reportsResponse.data) {
                    setReports(reportsResponse.data);
                }
            } else {
                setError(response.error || 'Failed to generate report');
            }
        } catch (err) {
            setError('An error occurred while generating the report');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async (reportId: string, fileName: string) => {
        try {
            await reportsApi.downloadReport(reportId, fileName);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getReportTypeLabel = (type: string) => {
        const reportType = REPORT_TYPES.find(r => r.id === type);
        return reportType?.name || type;
    };

    const getReportTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            'gstr1': '📊',
            'tally_xml': '📁',
            'excel': '📗',
            'csv': '📋',
            'hsn_summary': '📑',
            'state_summary': '🗺️',
        };
        return icons[type] || '📄';
    };

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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
                            <p className="text-gray-600">Generate and download your GST reports</p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                            <FiAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Generate Reports */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Generate New Report</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {REPORT_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleGenerateReport(type.id)}
                                    disabled={generating}
                                    className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center disabled:opacity-50"
                                >
                                    <span className="text-2xl mb-2 block">{type.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{type.name}</span>
                                </button>
                            ))}
                        </div>
                        {generating && (
                            <div className="mt-4 flex items-center gap-2 text-blue-600">
                                <FiLoader className="animate-spin" />
                                <span>Generating report...</span>
                            </div>
                        )}
                    </div>

                    {/* Reports List */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-5 border-b">
                            <h2 className="text-lg font-bold text-gray-800">Generated Reports</h2>
                        </div>

                        {isLoading ? (
                            <div className="p-8 text-center">
                                <FiLoader className="animate-spin mx-auto text-2xl text-gray-400 mb-2" />
                                <p className="text-gray-500">Loading reports...</p>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="p-8 text-center">
                                <FiFileText className="mx-auto text-4xl text-gray-300 mb-3" />
                                <p className="text-gray-500">No reports generated yet</p>
                                <p className="text-gray-400 text-sm">Generate your first report above</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Report
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Type
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Generated
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {reports.map((report, index) => (
                                            <motion.tr
                                                key={report.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">
                                                            {getReportTypeIcon(report.report_type)}
                                                        </span>
                                                        <span className="font-medium text-gray-800">
                                                            {report.file_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {getReportTypeLabel(report.report_type)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <FiCalendar size={14} />
                                                        {formatDate(report.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <button
                                                        onClick={() => handleDownload(report.id, report.file_name)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                    >
                                                        <FiDownload size={16} />
                                                        Download
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
