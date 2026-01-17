'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBriefcase, FiArrowRight, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const roles = [
    { id: 'business', name: 'Business Owner', icon: FiBriefcase, description: 'E-commerce seller or business' },
    { id: 'accountant', name: 'CA/Tax Professional', icon: FiUser, description: 'Manage multiple clients' },
    { id: 'admin', name: 'Enterprise Admin', icon: FiUser, description: 'Large organization' },
];

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading: authLoading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('business');
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [name, setName] = useState('');
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
        return 'An error occurred during registration.';
    };

    // Password validation
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!acceptTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        if (!isPasswordValid) {
            setError('Please ensure your password meets all requirements');
            return;
        }

        setIsLoading(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const normalizedName = name.trim();
            const normalizedWhatsapp = whatsappNumber.trim();
            const normalizedPassword = password.trim();

            const response = await register({
                email: normalizedEmail,
                password: normalizedPassword,
                name: normalizedName,
                role: selectedRole,
                whatsapp_number: normalizedWhatsapp || undefined,
            });

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                setError(response.error || 'Registration failed. Please try again.');
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const buttonDisabled = isLoading || authLoading || !acceptTerms || !isPasswordValid;

    if (success) {
        return (
            <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to GSTPro!</h1>
                    <p className="text-gray-600 mb-6">Your account has been created successfully. Redirecting to dashboard...</p>
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </motion.div>
            </div>
        );
    }

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
                className="relative z-10 w-full max-w-6xl"
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
                            <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">Start fast</p>
                            <h1 className="text-3xl font-bold leading-tight mb-4">
                                Set up your GST workspace in minutes.
                            </h1>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Create a profile, invite teammates, and organize filings with ready-made templates.
                            </p>
                        </div>
                        <div className="space-y-4 text-sm">
                            {[
                                'Free trial with no credit card required',
                                'Role-based access for teams and clients',
                                'Centralized compliance calendar',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-blue-300" />
                                    <span className="text-white/90">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
                            Create Your Account
                        </h1>
                        <p className="text-gray-500 text-center mb-6">
                            Start your 14-day free trial today
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                                <FiAlertCircle className="flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I am a...
                            </label>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedRole(role.id);
                                            setError(null);
                                        }}
                                        className={`p-3 rounded-lg border-2 text-left transition-all ${selectedRole === role.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <role.icon className={`mb-2 ${selectedRole === role.id ? 'text-blue-600' : 'text-gray-400'}`} size={20} />
                                        <span className={`text-xs font-semibold block ${selectedRole === role.id ? 'text-blue-600' : 'text-gray-600'}`}>
                                            {role.name}
                                        </span>
                                        <span className="text-xs text-gray-500">{role.description}</span>
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    WhatsApp Number <span className="text-gray-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiPhone className="text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                {/* Password requirements */}
                                <div className="mt-2 space-y-1">
                                    {[
                                        { check: passwordChecks.length, text: 'At least 8 characters' },
                                        { check: passwordChecks.uppercase, text: 'One uppercase letter' },
                                        { check: passwordChecks.lowercase, text: 'One lowercase letter' },
                                        { check: passwordChecks.number, text: 'One number' },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-2 text-xs ${item.check ? 'text-green-600' : 'text-gray-400'}`}>
                                            <FiCheckCircle className={item.check ? 'text-green-500' : 'text-gray-300'} size={12} />
                                            {item.text}
                                        </div>
                                    ))}
                                </div>
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
                                disabled={buttonDisabled}
                                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-70 disabled:cursor-not-allowed"
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
                </div>
            </motion.div>
        </div>
    );
}
