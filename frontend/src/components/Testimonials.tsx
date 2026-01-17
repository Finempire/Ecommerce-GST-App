'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const testimonials = [
    {
        name: 'CA Rajesh Kumar',
        role: 'Chartered Accountant',
        company: 'Kumar & Associates',
        image: '👨‍💼',
        rating: 5,
        text: 'GSTPro has transformed how we handle e-commerce client data. What used to take hours now takes minutes. The Tally XML export is perfectly formatted.',
    },
    {
        name: 'Priya Sharma',
        role: 'Business Owner',
        company: 'Fashion Hub (Meesho Seller)',
        image: '👩‍💼',
        rating: 5,
        text: 'As a Meesho seller with 500+ orders/month, GST compliance was a nightmare. This software made it effortless. Highly recommend!',
    },
    {
        name: 'CA Arun Mehta',
        role: 'Senior CA Partner',
        company: 'Mehta Tax Consultants',
        image: '👨‍⚖️',
        rating: 5,
        text: "Managing 100+ e-commerce clients is now seamless. The bulk processing feature and accurate HSN mapping save us countless hours every month.",
    },
    {
        name: 'Deepak Verma',
        role: 'Amazon FBA Seller',
        company: 'TechGadgets India',
        image: '👨‍💻',
        rating: 5,
        text: 'The automatic GSTR-1 generation is spot-on. No more manual entry errors. Best investment I made for my e-commerce business.',
    },
    {
        name: 'CA Sunita Reddy',
        role: 'Tax Consultant',
        company: 'Reddy & Co.',
        image: '👩‍⚖️',
        rating: 5,
        text: 'TCS calculations, state-wise summaries, HSN reports - everything is automated. My team productivity has increased by 300%.',
    },
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const next = () => {
        setIsAutoPlaying(false);
        setCurrent((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setIsAutoPlaying(false);
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="section bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Trusted by <span className="text-blue-300">Professionals</span>
                    </h2>
                    <p className="text-white/70 text-lg">
                        See what CAs and business owners say about us
                    </p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation Arrows */}
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <FiChevronLeft size={20} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <FiChevronRight size={20} />
                    </button>

                    {/* Testimonial Card */}
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 justify-center mb-6">
                                    {[...Array(testimonials[current].rating)].map((_, i) => (
                                        <FiStar key={i} className="text-yellow-400 fill-current" size={20} />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-white/90 text-lg md:text-xl text-center leading-relaxed mb-8">
                                    &ldquo;{testimonials[current].text}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                                        {testimonials[current].image}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-semibold">
                                            {testimonials[current].name}
                                        </div>
                                        <div className="text-white/60 text-sm">
                                            {testimonials[current].role}, {testimonials[current].company}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsAutoPlaying(false);
                                    setCurrent(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${index === current
                                        ? 'w-8 bg-white'
                                        : 'bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
