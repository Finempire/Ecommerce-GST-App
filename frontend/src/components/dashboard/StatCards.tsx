'use client';

import { motion } from 'framer-motion';
import { FiTrendingUp, FiFileText, FiDollarSign, FiPackage } from 'react-icons/fi';
import { DashboardStats } from '@/lib/api';

interface StatCardsProps {
    stats?: DashboardStats | null;
    isLoading?: boolean;
}

export default function StatCards({ stats, isLoading }: StatCardsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-IN').format(value);
    };

    const statItems = [
        {
            title: 'Total Taxable Value',
            value: stats ? formatCurrency(stats.total_taxable_value) : '₹0',
            icon: FiDollarSign,
            color: 'bg-blue-500',
        },
        {
            title: 'Total GST',
            value: stats ? formatCurrency(stats.total_gst) : '₹0',
            icon: FiTrendingUp,
            color: 'bg-purple-500',
        },
        {
            title: 'Transactions',
            value: stats ? formatNumber(stats.total_transactions) : '0',
            icon: FiFileText,
            color: 'bg-green-500',
        },
        {
            title: 'Uploads',
            value: stats ? formatNumber(stats.total_uploads) : '0',
            icon: FiPackage,
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-5 shadow-lg"
                    >
                        {isLoading ? (
                            <div className="animate-pulse">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-lg ${stat.color} opacity-50`} />
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-20" />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                        <Icon className="text-white" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                            </>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
