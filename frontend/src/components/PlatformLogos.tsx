'use client';

import { motion } from 'framer-motion';

const platforms = [
    { name: 'Amazon', logo: '🛒', color: '#FF9900' },
    { name: 'Flipkart', logo: '📦', color: '#2874F0' },
    { name: 'Meesho', logo: '🛍️', color: '#F43397' },
    { name: 'Myntra', logo: '👗', color: '#FF3F6C' },
    { name: 'Glowroad', logo: '✨', color: '#FF6B6B' },
    { name: 'Jio Mart', logo: '🏪', color: '#0078AD' },
    { name: 'LimeRoad', logo: '🍋', color: '#CDDC39' },
    { name: 'Snapdeal', logo: '📱', color: '#E40046' },
    { name: 'Shop 101', logo: '🏠', color: '#6C63FF' },
    { name: 'Paytm', logo: '💳', color: '#00BAF2' },
];

export default function PlatformLogos() {
    return (
        <section className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Supports <span className="gradient-text">10+ Platforms</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Import data seamlessly from all major e-commerce marketplaces
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center items-center gap-6 md:gap-8"
                >
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="group"
                        >
                            <div
                                className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center cursor-pointer transition-all group-hover:shadow-xl"
                                style={{ borderBottom: `3px solid ${platform.color}` }}
                            >
                                <span className="text-3xl md:text-4xl mb-1">{platform.logo}</span>
                                <span className="text-xs font-medium text-gray-600 text-center px-2">
                                    {platform.name}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-gray-500 text-sm">
                        And many more... Contact us for custom platform integration
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
