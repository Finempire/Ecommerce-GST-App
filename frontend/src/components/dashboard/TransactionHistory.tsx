'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiFilter, FiSearch } from 'react-icons/fi';

const transactions = [
    {
        id: 'TXN001',
        date: '2026-01-15',
        platform: 'Amazon',
        type: 'Sales',
        invoices: 45,
        amount: '₹1,23,456',
        status: 'Processed',
        exports: ['XML', 'JSON', 'CSV'],
    },
    {
        id: 'TXN002',
        date: '2026-01-14',
        platform: 'Flipkart',
        type: 'Sales',
        invoices: 32,
        amount: '₹89,234',
        status: 'Processed',
        exports: ['XML', 'JSON'],
    },
    {
        id: 'TXN003',
        date: '2026-01-13',
        platform: 'Meesho',
        type: 'Sales',
        invoices: 78,
        amount: '₹2,34,567',
        status: 'Processing',
        exports: [],
    },
    {
        id: 'TXN004',
        date: '2026-01-12',
        platform: 'Bank Statement',
        type: 'Bank',
        invoices: 156,
        amount: '₹8,45,000',
        status: 'Processed',
        exports: ['XML'],
    },
    {
        id: 'TXN005',
        date: '2026-01-11',
        platform: 'Myntra',
        type: 'Sales',
        invoices: 23,
        amount: '₹56,789',
        status: 'Processed',
        exports: ['XML', 'JSON', 'CSV'],
    },
];

export default function TransactionHistory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('All');

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.platform.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterPlatform === 'All' || t.platform === filterPlatform;
        return matchesSearch && matchesFilter;
    });

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
                                <option value="All">All Platforms</option>
                                <option value="Amazon">Amazon</option>
                                <option value="Flipkart">Flipkart</option>
                                <option value="Meesho">Meesho</option>
                                <option value="Myntra">Myntra</option>
                                <option value="Bank Statement">Bank Statement</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Platform
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Invoices
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Amount
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
                        {filteredTransactions.map((txn, index) => (
                            <motion.tr
                                key={txn.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                    {txn.id}
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-600">{txn.date}</td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {txn.platform}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-600">{txn.invoices}</td>
                                <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                    {txn.amount}
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${txn.status === 'Processed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <FiEye size={16} />
                                        </button>
                                        {txn.exports.length > 0 && (
                                            <div className="flex gap-1">
                                                {txn.exports.map((format) => (
                                                    <button
                                                        key={format}
                                                        className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                                                    >
                                                        {format}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {filteredTransactions.length} of {transactions.length} entries
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
        </div>
    );
}
