'use client';

import { motion } from 'framer-motion';
import { FiUploadCloud, FiSearch, FiCheckCircle, FiShield, FiClock, FiZap } from 'react-icons/fi';

const steps = [
    {
        step: '01',
        title: 'Upload marketplace files',
        description: 'Drop your Amazon, Flipkart, or Meesho reports and let GSTPro auto-map fields.',
        icon: FiUploadCloud,
    },
    {
        step: '02',
        title: 'Review smart summaries',
        description: 'Validate HSN, place-of-supply, and tax splits with guided checks before filing.',
        icon: FiSearch,
    },
    {
        step: '03',
        title: 'Export ready-to-file outputs',
        description: 'Download GSTR-1 JSON, Tally XML, and clean CSV files instantly.',
        icon: FiCheckCircle,
    },
];

const highlights = [
    {
        title: 'AI-assisted compliance',
        description: 'Detect mismatches and missing GSTIN details before submission.',
        icon: FiShield,
    },
    {
        title: 'Faster monthly close',
        description: 'Shrink reconciliation time with automated summaries and bulk exports.',
        icon: FiClock,
    },
    {
        title: 'Built for high volume',
        description: 'Process lakhs of invoices with optimized imports and exports.',
        icon: FiZap,
    },
];

export default function Workflow() {
    return (
        <section className="section bg-gray-50">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
                        Simple workflow
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
                        Go from raw data to GST-ready in minutes
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        A clear, guided process keeps every report clean, compliant, and ready to file.
                    </p>
                </motion.div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm mb-12">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="rounded-2xl border border-gray-100 bg-gray-50/80 p-6"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-sm font-semibold text-blue-600 bg-blue-50 rounded-full px-3 py-1">
                                            Step {step.step}
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                                            <Icon size={22} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {highlights.map((highlight, index) => {
                        const Icon = highlight.icon;
                        return (
                            <motion.div
                                key={highlight.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <span className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                                    <Icon size={20} />
                                </span>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {highlight.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {highlight.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
