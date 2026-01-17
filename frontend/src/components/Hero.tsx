'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 pt-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <span className="text-white/90 text-sm">🚀 Trusted by 5000+ CAs & Businesses</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            GST Software for{' '}
                            <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                                E-commerce Sellers
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                            Automate your GST compliance with our AI-powered platform.
                            Generate Tally XML, GSTR-1 reports, and accounting summaries in seconds.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/register"
                                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 animate-pulse-glow"
                            >
                                Start Free Trial
                                <FiArrowRight />
                            </Link>
                            <Link
                                href="/demo"
                                className="inline-flex items-center justify-center gap-2 text-white border-2 border-white/30 hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all"
                            >
                                <FiPlay />
                                Book Demo
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
                            <div>
                                <div className="text-3xl font-bold text-white">10+</div>
                                <div className="text-white/70 text-sm">E-commerce Platforms</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">1M+</div>
                                <div className="text-white/70 text-sm">Invoices Processed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">99%</div>
                                <div className="text-white/70 text-sm">Accuracy Rate</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-3" />
                            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
                                {/* Mock Dashboard */}
                                <div className="bg-gray-900 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-white/70">Amazon Sales Report</span>
                                            <span className="text-green-400 text-sm">✓ Processed</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-white/70">GSTR-1 Generated</span>
                                            <span className="text-blue-400 text-sm">Ready to download</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-white/70">Tally XML</span>
                                            <span className="text-purple-400 text-sm">256 entries</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
