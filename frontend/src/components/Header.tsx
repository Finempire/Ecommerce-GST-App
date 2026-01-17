'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Demo', href: '/demo' },
        { name: 'Support', href: '/contact' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-lg shadow-md'
                : 'bg-transparent'
            }`}>
            <div className="container">
                <nav className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <span className={`font-bold text-xl hidden sm:block ${scrolled ? 'text-gray-800' : 'text-white'
                            }`}>
                            GST<span className={scrolled ? 'gradient-text' : 'text-blue-300'}>Pro</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`font-medium transition-colors no-underline ${scrolled
                                        ? 'text-gray-600 hover:text-blue-600'
                                        : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className={`font-medium transition-colors no-underline ${scrolled
                                    ? 'text-gray-600 hover:text-blue-600'
                                    : 'text-white/80 hover:text-white'
                                }`}
                        >
                            Login
                        </Link>
                        <Link href="/register" className="btn-primary text-sm no-underline">
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2 ${scrolled ? 'text-gray-600' : 'text-white'}`}
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
                            className="md:hidden bg-white rounded-b-xl shadow-lg"
                        >
                            <div className="py-4 space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block px-4 py-3 text-gray-600 hover:bg-gray-50 no-underline"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="px-4 pt-4 border-t space-y-3">
                                    <Link
                                        href="/login"
                                        className="block text-center py-3 text-gray-600 border rounded-lg hover:bg-gray-50 no-underline"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block text-center btn-primary no-underline"
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
