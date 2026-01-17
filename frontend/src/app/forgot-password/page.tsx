'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">G</span>
                    </div>
                    <span className="font-bold text-2xl text-white">
                        GST<span className="text-blue-300">Pro</span>
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {isSubmitted ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <FiCheck className="text-green-600 text-2xl" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h1>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a password reset link to<br />
                                <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Didn&apos;t receive the email? Check your spam folder or try again.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                            >
                                <FiArrowLeft />
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
                                Forgot Password?
                            </h1>
                            <p className="text-gray-500 text-center mb-8">
                                No worries! Enter your email and we&apos;ll send you a reset link.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
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
                                            Send Reset Link
                                            <FiArrowRight />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-gray-600 text-sm mt-6">
                                Remember your password?{' '}
                                <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
