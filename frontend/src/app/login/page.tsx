'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading: authLoading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'email' | 'whatsapp'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [email, setEmail] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [password, setPassword] = useState('');

    const getErrorMessage = (err: unknown) => {
        if (typeof err === 'object' && err && 'message' in err) {
            const message = (err as { message?: unknown }).message;
            if (typeof message === 'string') {
                return message;
            }
        }
        return 'An error occurred during login.';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const normalizedWhatsapp = whatsappNumber.trim();
            const normalizedPassword = password.trim();

            const credentials = loginMethod === 'email'
                ? { email: normalizedEmail, password: normalizedPassword }
                : { whatsapp_number: normalizedWhatsapp, password: normalizedPassword };

            const response = await login(credentials);

            if (response.success) {
                router.push('/dashboard');
            } else {
                setError(response.error || 'Login failed. Please check your credentials.');
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const buttonDisabled = isLoading || authLoading;

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
                className="relative z-10 w-full max-w-5xl"
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

                <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
                    <div className="hidden lg:flex flex-col justify-between bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-8 text-white">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">Secure workspace</p>
                            <h1 className="text-3xl font-bold leading-tight mb-4">
                                Keep GST reporting organized with a unified dashboard.
                            </h1>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Log in to manage invoices, reconcile GST, and generate reports with confidence.
                            </p>
                        </div>
                        <div className="space-y-4 text-sm">
                            {[
                                'Automated GST summaries in minutes',
                                'Track filings and compliance updates',
                                'Secure storage for returns and invoices',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-blue-300" />
                                    <span className="text-white/90">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-center mb-8">
                            Sign in to continue to your dashboard
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                                <FiAlertCircle className="flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Login Method Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                            <button
                                onClick={() => {
                                    setLoginMethod('email');
                                    setError(null);
                                }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${loginMethod === 'email'
                                    ? 'bg-white text-blue-600 shadow'
                                    : 'text-gray-600'
                                    }`}
                            >
                                <FiMail className="inline mr-2" />
                                Email
                            </button>
                            <button
                                onClick={() => {
                                    setLoginMethod('whatsapp');
                                    setError(null);
                                }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${loginMethod === 'whatsapp'
                                    ? 'bg-white text-green-600 shadow'
                                    : 'text-gray-600'
                                    }`}
                            >
                                <FiPhone className="inline mr-2" />
                                WhatsApp
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email/Phone Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {loginMethod === 'email' ? 'Email Address' : 'WhatsApp Number'}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {loginMethod === 'email' ? (
                                            <FiMail className="text-gray-400" />
                                        ) : (
                                            <FiPhone className="text-gray-400" />
                                        )}
                                    </div>
                                    <input
                                        type={loginMethod === 'email' ? 'email' : 'tel'}
                                        placeholder={loginMethod === 'email' ? 'you@example.com' : '+91 98765 43210'}
                                        value={loginMethod === 'email' ? email : whatsappNumber}
                                        onChange={(e) => loginMethod === 'email'
                                            ? setEmail(e.target.value)
                                            : setWhatsappNumber(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-gray-600">Remember me</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={buttonDisabled}
                                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <FiArrowRight />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">New to GSTPro?</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <Link
                            href="/register"
                            className="block w-full text-center py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Create an Account
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white/60 text-sm mt-6">
                    By signing in, you agree to our{' '}
                    <Link href="#" className="text-white/80 hover:text-white underline">
                        Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-white/80 hover:text-white underline">
                        Privacy Policy
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
