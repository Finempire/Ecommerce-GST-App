'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare } from 'react-icons/fi';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <>
            <Header />
            <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
                <div className="container">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Get in <span className="gradient-text">Touch</span>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Have questions? Our support team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                                    <FiMail className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
                                <p className="text-gray-600 mb-2">For general inquiries</p>
                                <a href="mailto:support@gstpro.in" className="text-blue-600 font-medium">
                                    support@gstpro.in
                                </a>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                                    <FiPhone className="text-green-600 text-xl" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
                                <p className="text-gray-600 mb-2">Mon-Sat, 9AM-6PM IST</p>
                                <a href="tel:+919876543210" className="text-blue-600 font-medium">
                                    +91 98765 43210
                                </a>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                                    <FiMapPin className="text-purple-600 text-xl" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Visit Us</h3>
                                <p className="text-gray-600">
                                    123 Business Park, Andheri West,<br />
                                    Mumbai, Maharashtra 400053
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
                                    <FiMessageSquare className="text-cyan-600 text-xl" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">WhatsApp Support</h3>
                                <p className="text-gray-600 mb-2">Quick responses</p>
                                <a href="https://wa.me/919876543210" className="text-blue-600 font-medium">
                                    Chat on WhatsApp →
                                </a>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                {submitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                            <FiSend className="text-green-600 text-2xl" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h2>
                                        <p className="text-gray-600">
                                            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Your name"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="you@example.com"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Subject
                                                </label>
                                                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white">
                                                    <option value="">Select a topic</option>
                                                    <option value="sales">Sales Inquiry</option>
                                                    <option value="support">Technical Support</option>
                                                    <option value="billing">Billing Question</option>
                                                    <option value="partnership">Partnership</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                rows={5}
                                                required
                                                placeholder="How can we help you?"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <FiSend />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
