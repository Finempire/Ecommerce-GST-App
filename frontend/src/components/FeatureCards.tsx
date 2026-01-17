'use client';

import { motion } from 'framer-motion';
import { FiFileText, FiDatabase, FiPieChart, FiDownload } from 'react-icons/fi';

const features = [
    {
        icon: FiFileText,
        title: 'JSON File',
        description: 'Generate government-compliant JSON files for GSTR-1 filing directly from your e-commerce data.',
        color: 'from-blue-500 to-blue-600',
    },
    {
        icon: FiDatabase,
        title: 'Tally XML',
        description: 'Export data in Tally-compatible XML format for seamless import into Tally Prime.',
        color: 'from-purple-500 to-purple-600',
    },
    {
        icon: FiPieChart,
        title: 'Accounting Summary',
        description: 'Get comprehensive HSN-wise, state-wise, and GST rate-wise summaries instantly.',
        color: 'from-indigo-500 to-indigo-600',
    },
    {
        icon: FiDownload,
        title: 'CSV File',
        description: 'Download standardized CSV files compatible with government portals and Excel.',
        color: 'from-cyan-500 to-cyan-600',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export default function FeatureCards() {
    return (
        <section className="section bg-gray-50">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Export in Multiple{' '}
                        <span className="gradient-text">Formats</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Generate GST-compliant files in various formats, ready for government filing or import into accounting software.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                className="card group cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-white text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
