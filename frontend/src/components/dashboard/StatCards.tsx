'use client';

import { motion } from 'framer-motion';
import { FiTrendingUp, FiFileText, FiDollarSign, FiPackage, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const stats = [
    {
        title: 'Total Sales',
        value: '₹12,45,890',
        change: '+12.5%',
        isPositive: true,
        icon: FiDollarSign,
        color: 'bg-blue-500',
    },
    {
        title: 'Tax Liability',
        value: '₹2,24,260',
        change: '+8.2%',
        isPositive: false,
        icon: FiTrendingUp,
        color: 'bg-purple-500',
    },
    {
        title: 'Invoices',
        value: '1,234',
        change: '+15.3%',
        isPositive: true,
        icon: FiFileText,
        color: 'bg-green-500',
    },
    {
        title: 'Orders',
        value: '856',
        change: '+5.8%',
        isPositive: true,
        icon: FiPackage,
        color: 'bg-orange-500',
    },
];

export default function StatCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-5 shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                <Icon className="text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.isPositive ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-gray-500 text-sm">{stat.title}</p>
                    </motion.div>
                );
            })}
        </div>
    );
}
