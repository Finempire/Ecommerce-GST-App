'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBriefcase, FiArrowRight } from 'react-icons/fi';

const roles = [
    { id: 'business', name: 'Business Owner', icon: FiBriefcase, description: 'E-commerce seller or business' },
    { id: 'ca', name: 'CA/Tax Professional', icon: FiUser, description: 'Manage multiple clients' },
    { id: 'admin', name: 'Enterprise Admin', icon: FiUser, description: 'Large organization' },
];

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('business');
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptTerms) {
            alert('Please accept the terms and conditions');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            window.location.href = '/dashboard';
        }, 1500);
    };

    return (
        <div className="min-h-screen gradient-hero flex items-center justify-center p-4 py-12">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-lg"
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

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-500 text-center mb-6">
                        Start your 14-day free trial today
                    </p>

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            I am a...
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`p-3 rounded-lg border-2 text-center transition-all ${selectedRole === role.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <role.icon className={`mx-auto mb-1 ${selectedRole === role.id ? 'text-blue-600' : 'text-gray-400'}`} size={20} />
                                    <span className={`text-xs font-medium ${selectedRole === role.id ? 'text-blue-600' : 'text-gray-600'}`}>
                                        {role.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
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
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                WhatsApp Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiPhone className="text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
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
                                    placeholder="Create a strong password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 text-sm">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                            />
                            <span className="text-gray-600">
                                I agree to the{' '}
                                <Link href="#" className="text-blue-600 hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="#" className="text-blue-600 hover:underline">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading || !acceptTerms}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Start Free Trial
                                    <FiArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-600 text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
