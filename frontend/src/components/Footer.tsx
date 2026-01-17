'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiLinkedin, FiYoutube, FiInstagram } from 'react-icons/fi';

const footerLinks = {
    product: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Demo', href: '/demo' },
        { name: 'Changelog', href: '#' },
    ],
    company: [
        { name: 'About Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Press', href: '#' },
    ],
    support: [
        { name: 'Help Center', href: '/contact' },
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Status', href: '#' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Refund Policy', href: '#' },
        { name: 'Cookie Policy', href: '#' },
    ],
};

const socialLinks = [
    { icon: FiTwitter, href: '#', name: 'Twitter' },
    { icon: FiLinkedin, href: '#', name: 'LinkedIn' },
    { icon: FiYoutube, href: '#', name: 'YouTube' },
    { icon: FiInstagram, href: '#', name: 'Instagram' },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {/* CTA Section */}
            <div className="gradient-primary py-16">
                <div className="container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Automate Your GST Compliance?
                    </h2>
                    <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of businesses and CAs who trust GSTPro for their e-commerce GST needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/demo"
                            className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            Schedule Demo
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="py-16">
                <div className="container">
                    <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">G</span>
                                </div>
                                <span className="font-bold text-xl">
                                    GST<span className="text-blue-400">Pro</span>
                                </span>
                            </Link>
                            <p className="text-gray-400 mb-6 max-w-xs">
                                India&apos;s leading GST automation platform for e-commerce sellers and CA professionals.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-center gap-3">
                                    <FiMail size={16} />
                                    <span>support@gstpro.in</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FiPhone size={16} />
                                    <span>+91 98765 43210</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FiMapPin size={16} />
                                    <span>Mumbai, India</span>
                                </div>
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-white mb-4">Support</h3>
                            <ul className="space-y-3">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 py-6">
                <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2026 GSTPro. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                                    aria-label={social.name}
                                >
                                    <Icon size={18} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}
