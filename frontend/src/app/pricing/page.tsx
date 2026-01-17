'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiCheck, FiX, FiStar } from 'react-icons/fi';

const plans = [
    {
        name: 'Light',
        price: '3,900',
        period: '/year',
        assessees: '100 Assessees',
        popular: false,
        features: [
            { name: 'JSON Export', included: true },
            { name: 'Tally XML Export', included: true },
            { name: 'CSV Export', included: true },
            { name: 'GSTR-1 Generation', included: true },
            { name: '5 E-commerce Platforms', included: true },
            { name: 'Email Support', included: true },
            { name: 'Bulk Processing', included: false },
            { name: 'API Access', included: false },
            { name: 'Priority Support', included: false },
        ],
    },
    {
        name: 'Popular',
        price: '4,900',
        period: '/year',
        assessees: '250 Assessees',
        popular: true,
        features: [
            { name: 'JSON Export', included: true },
            { name: 'Tally XML Export', included: true },
            { name: 'CSV Export', included: true },
            { name: 'GSTR-1 Generation', included: true },
            { name: '10 E-commerce Platforms', included: true },
            { name: 'Email + Chat Support', included: true },
            { name: 'Bulk Processing', included: true },
            { name: 'API Access', included: false },
            { name: 'Priority Support', included: true },
        ],
    },
    {
        name: 'Professional',
        price: '8,000',
        period: '/year',
        assessees: 'Unlimited',
        popular: false,
        features: [
            { name: 'JSON Export', included: true },
            { name: 'Tally XML Export', included: true },
            { name: 'CSV Export', included: true },
            { name: 'GSTR-1 Generation', included: true },
            { name: 'All E-commerce Platforms', included: true },
            { name: '24/7 Priority Support', included: true },
            { name: 'Bulk Processing', included: true },
            { name: 'API Access', included: true },
            { name: 'White-label Options', included: true },
        ],
    },
];

export default function PricingPage() {
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
                            Simple, Transparent <span className="gradient-text">Pricing</span>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Choose the perfect plan for your business. All plans include a 14-day free trial.
                        </p>
                    </motion.div>

                    {/* Plans */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-white rounded-2xl p-8 ${plan.popular
                                        ? 'ring-2 ring-blue-500 shadow-2xl scale-105'
                                        : 'shadow-lg'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                            <FiStar size={14} />
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                                    <div className="text-4xl font-bold text-gray-900">
                                        ₹{plan.price}
                                        <span className="text-lg font-normal text-gray-500">{plan.period}</span>
                                    </div>
                                    <p className="text-blue-600 font-medium mt-2">{plan.assessees}</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <FiCheck className="text-green-500 flex-shrink-0" />
                                            ) : (
                                                <FiX className="text-gray-300 flex-shrink-0" />
                                            )}
                                            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/register"
                                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${plan.popular
                                            ? 'btn-primary'
                                            : 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
                                        }`}
                                >
                                    Start Free Trial
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 text-center"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Have Questions?</h2>
                        <p className="text-gray-600 mb-6">
                            Contact our sales team for custom enterprise solutions or any queries.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                        >
                            Contact Sales →
                        </Link>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
