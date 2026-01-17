'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    FiFileText, FiDatabase, FiPieChart, FiDownload, FiUploadCloud,
    FiShield, FiUsers, FiClock, FiCheckCircle, FiZap
} from 'react-icons/fi';

const features = [
    {
        icon: FiUploadCloud,
        title: 'Multi-Platform Import',
        description: 'Import data from Amazon, Flipkart, Meesho, Myntra, and 10+ other e-commerce platforms with automatic format detection.',
    },
    {
        icon: FiFileText,
        title: 'GSTR-1 Generation',
        description: 'Auto-generate GSTR-1 compliant reports with Table 14 & 15 support for e-commerce operators.',
    },
    {
        icon: FiDatabase,
        title: 'Tally XML Export',
        description: 'Generate Tally Prime compatible XML files with proper voucher structure for seamless accounting integration.',
    },
    {
        icon: FiPieChart,
        title: 'Smart Analytics',
        description: 'Get HSN-wise, state-wise, and GST rate-wise summaries with visual charts and detailed breakdowns.',
    },
    {
        icon: FiDownload,
        title: 'Multiple Export Formats',
        description: 'Export to JSON (government format), CSV, Excel, and XML. All formats are GST portal compliant.',
    },
    {
        icon: FiShield,
        title: 'Bank Statement Parser',
        description: 'Upload PDF bank statements and automatically extract transactions with intelligent categorization.',
    },
    {
        icon: FiZap,
        title: 'Bulk Processing',
        description: 'Process thousands of transactions in seconds with our optimized processing engine.',
    },
    {
        icon: FiCheckCircle,
        title: 'Data Validation',
        description: 'Automatic validation of GST numbers, HSN codes, and tax calculations before filing.',
    },
    {
        icon: FiUsers,
        title: 'Multi-Client Management',
        description: 'Perfect for CAs managing multiple e-commerce clients. Organize data by client and financial year.',
    },
    {
        icon: FiClock,
        title: 'Real-time Sync',
        description: 'Stay updated with automatic sync capabilities and real-time processing status tracking.',
    },
];

export default function FeaturesPage() {
    return (
        <>
            <Header />
            <main className="pt-24 pb-16 min-h-screen">
                {/* Hero */}
                <section className="gradient-hero py-16 md:py-24">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Powerful Features for <span className="text-blue-300">GST Automation</span>
                            </h1>
                            <p className="text-white/80 text-lg mb-8">
                                Everything you need to streamline your e-commerce GST compliance workflow.
                                From data import to return filing, we&apos;ve got you covered.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-16 bg-gray-50">
                    <div className="container">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                                            <Icon className="text-white text-xl" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Workflow Section */}
                <section className="py-16">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                How It <span className="gradient-text">Works</span>
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Simple 4-step process to automate your GST compliance
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { step: '1', title: 'Upload', desc: 'Upload your e-commerce reports or bank statements' },
                                { step: '2', title: 'Process', desc: 'Our system automatically parses and categorizes data' },
                                { step: '3', title: 'Review', desc: 'Review extracted data with inline validation' },
                                { step: '4', title: 'Export', desc: 'Download in your preferred format' },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
