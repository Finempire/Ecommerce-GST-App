'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from 'recharts';
import { reportsApi } from '@/lib/api';

// Sample data - will be replaced with API data
const monthlyData = [
    { month: 'Jan', sales: 45000, gst: 8100, transactions: 120 },
    { month: 'Feb', sales: 52000, gst: 9360, transactions: 145 },
    { month: 'Mar', sales: 48000, gst: 8640, transactions: 132 },
    { month: 'Apr', sales: 61000, gst: 10980, transactions: 178 },
    { month: 'May', sales: 55000, gst: 9900, transactions: 156 },
    { month: 'Jun', sales: 67000, gst: 12060, transactions: 195 },
    { month: 'Jul', sales: 72000, gst: 12960, transactions: 210 },
    { month: 'Aug', sales: 69000, gst: 12420, transactions: 198 },
    { month: 'Sep', sales: 78000, gst: 14040, transactions: 225 },
    { month: 'Oct', sales: 82000, gst: 14760, transactions: 240 },
    { month: 'Nov', sales: 91000, gst: 16380, transactions: 268 },
    { month: 'Dec', sales: 98000, gst: 17640, transactions: 295 },
];

const platformData = [
    { name: 'Amazon', value: 45, color: '#FF9900' },
    { name: 'Flipkart', value: 30, color: '#047BD5' },
    { name: 'Meesho', value: 15, color: '#F43397' },
    { name: 'Others', value: 10, color: '#6B7280' },
];

const gstBreakdown = [
    { category: 'CGST', amount: 52500, percentage: 25 },
    { category: 'SGST', amount: 52500, percentage: 25 },
    { category: 'IGST', amount: 105000, percentage: 50 },
];

const topProducts = [
    { name: 'Electronics', sales: 125000, gst: 22500 },
    { name: 'Clothing', sales: 89000, gst: 4450 },
    { name: 'Home Decor', sales: 67000, gst: 12060 },
    { name: 'Beauty', sales: 45000, gst: 8100 },
    { name: 'Books', sales: 23000, gst: 0 },
];

export default function AnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('year');
    const [stats, setStats] = useState({
        totalSales: 0,
        totalGst: 0,
        totalTransactions: 0,
        avgOrderValue: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await reportsApi.getDashboardStats();
                if (response.success && response.data) {
                    setStats({
                        totalSales: response.data.total_taxable_value || 818000,
                        totalGst: response.data.total_gst || 147240,
                        totalTransactions: response.data.total_transactions || 2362,
                        avgOrderValue: response.data.total_taxable_value && response.data.total_transactions
                            ? Math.round(response.data.total_taxable_value / response.data.total_transactions)
                            : 346,
                    });
                }
            } catch (error) {
                // Use sample data on error
                setStats({
                    totalSales: 818000,
                    totalGst: 147240,
                    totalTransactions: 2362,
                    avgOrderValue: 346,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your GST performance and sales insights</p>
                </div>
                <div className="flex gap-2">
                    {['month', 'quarter', 'year'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedPeriod === period
                                ? 'bg-violet-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Sales', value: stats.totalSales, icon: '💰', color: 'from-green-500 to-emerald-600' },
                    { label: 'Total GST', value: stats.totalGst, icon: '📊', color: 'from-violet-500 to-purple-600' },
                    { label: 'Transactions', value: stats.totalTransactions, icon: '📦', color: 'from-blue-500 to-indigo-600', isCurrency: false },
                    { label: 'Avg Order Value', value: stats.avgOrderValue, icon: '📈', color: 'from-orange-500 to-red-600' },
                ].map((card, index) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{card.icon}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${card.color} text-white`}>
                                +12.5%
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium">{card.label}</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {card.isCurrency === false ? card.value.toLocaleString() : formatCurrency(card.value)}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales & GST Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gstGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `₹${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value) => formatCurrency(Number(value) || 0)}
                            />
                            <Area type="monotone" dataKey="sales" stroke="#8B5CF6" fill="url(#salesGradient)" strokeWidth={2} name="Sales" />
                            <Area type="monotone" dataKey="gst" stroke="#10B981" fill="url(#gstGradient)" strokeWidth={2} name="GST" />
                            <Legend />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Platform Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={platformData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {platformData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${Number(value) || 0}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {platformData.map((platform) => (
                            <div key={platform.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                                <span className="text-sm text-gray-600">{platform.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* GST Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">GST Breakdown</h3>
                    <div className="space-y-4">
                        {gstBreakdown.map((item) => (
                            <div key={item.category}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600 font-medium">{item.category}</span>
                                    <span className="text-gray-800 font-semibold">{formatCurrency(item.amount)}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-3 rounded-full ${item.category === 'CGST' ? 'bg-violet-500' :
                                            item.category === 'SGST' ? 'bg-indigo-500' : 'bg-purple-500'
                                            }`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Total GST Liability</span>
                            <span className="text-xl font-bold text-violet-600">{formatCurrency(210000)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Top Products by GST */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Categories by Sales</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={topProducts} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis type="number" tickFormatter={(value) => `₹${value / 1000}k`} stroke="#6B7280" fontSize={12} />
                            <YAxis type="category" dataKey="name" width={80} stroke="#6B7280" fontSize={12} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value) => formatCurrency(Number(value) || 0)}
                            />
                            <Bar dataKey="sales" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Sales" />
                            <Bar dataKey="gst" fill="#10B981" radius={[0, 4, 4, 0]} name="GST" />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Ready to file your GST returns?</h3>
                        <p className="text-violet-100 mt-1">Generate GSTR-1 and export to Tally with one click</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Generate GSTR-1
                        </button>
                        <button className="px-6 py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-400 transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export to Tally
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
