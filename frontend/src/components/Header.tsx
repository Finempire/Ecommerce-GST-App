'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Demo', href: '/demo' },
        { name: 'Support', href: '/contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="container">
                <nav className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <span className="font-bold text-xl text-gray-800 hidden sm:block">
                            GST<span className="gradient-text">Pro</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                        >
                            Login
                        </Link>
                        <Link href="/register" className="btn-primary text-sm">
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t"
                        >
                            <div className="py-4 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="px-4 pt-4 border-t space-y-3">
                                    <Link
                                        href="/login"
                                        className="block text-center py-2 text-gray-600 border rounded-lg"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block text-center btn-primary"
                                    >
                                        Start Free Trial
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
