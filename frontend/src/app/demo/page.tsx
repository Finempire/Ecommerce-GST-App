'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
];

const demoTypes = [
    { id: 'personal', name: 'Personal Demo', duration: '30 min', desc: 'One-on-one walkthrough' },
    { id: 'team', name: 'Team Demo', duration: '45 min', desc: 'For your whole team' },
    { id: 'enterprise', name: 'Enterprise Demo', duration: '60 min', desc: 'In-depth enterprise features' },
];

export default function DemoPage() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState('personal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBooked, setIsBooked] = useState(false);

    // Generate next 14 days
    const dates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return date;
    }).filter(date => date.getDay() !== 0); // Exclude Sundays

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsBooked(true);
        }, 1500);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    return (
        <>
            <Header />
            <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
                <div className="container max-w-4xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Book a <span className="gradient-text">Demo</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            See how GSTPro can transform your GST compliance workflow
                        </p>
                    </motion.div>

                    {isBooked ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-12 shadow-lg text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                <FiCheck className="text-green-600 text-4xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Demo Scheduled!</h2>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a calendar invite to your email. Looking forward to connecting!
                            </p>
                            <div className="bg-gray-50 rounded-xl p-6 inline-block">
                                <p className="text-sm text-gray-500">Your demo is scheduled for</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {selectedDate?.toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="text-blue-600 font-medium">{selectedTime}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Progress */}
                            <div className="bg-gray-50 p-4 border-b">
                                <div className="flex items-center justify-center gap-4">
                                    {[1, 2, 3].map((s) => (
                                        <div key={s} className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                {step > s ? <FiCheck /> : s}
                                            </div>
                                            {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8">
                                {/* Step 1: Demo Type */}
                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h2 className="text-xl font-bold text-gray-800 mb-6">Select Demo Type</h2>
                                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                                            {demoTypes.map((type) => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedType === type.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="font-bold text-gray-800">{type.name}</div>
                                                    <div className="text-blue-600 text-sm font-medium">{type.duration}</div>
                                                    <div className="text-gray-500 text-sm mt-1">{type.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setStep(2)}
                                            className="btn-primary flex items-center gap-2 ml-auto"
                                        >
                                            Next <FiArrowRight />
                                        </button>
                                    </motion.div>
                                )}

                                {/* Step 2: Date & Time */}
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h2 className="text-xl font-bold text-gray-800 mb-6">Select Date & Time</h2>

                                        <div className="mb-6">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                                <FiCalendar />
                                                Choose a Date
                                            </label>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {dates.map((date) => (
                                                    <button
                                                        key={date.toISOString()}
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`flex-shrink-0 p-3 rounded-lg text-center transition-all min-w-[80px] ${selectedDate?.toDateString() === date.toDateString()
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                            }`}
                                                    >
                                                        <div className="text-xs">{date.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                                                        <div className="font-bold">{date.getDate()}</div>
                                                        <div className="text-xs">{date.toLocaleDateString('en-IN', { month: 'short' })}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                                <FiClock />
                                                Choose a Time (IST)
                                            </label>
                                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                                {timeSlots.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`p-2 rounded-lg text-sm font-medium transition-all ${selectedTime === time
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                                            >
                                                <FiArrowLeft /> Back
                                            </button>
                                            <button
                                                onClick={() => setStep(3)}
                                                disabled={!selectedDate || !selectedTime}
                                                className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                            >
                                                Next <FiArrowRight />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Contact Details */}
                                {step === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Details</h2>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <div className="relative">
                                                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Your name"
                                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <div className="relative">
                                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="email"
                                                            required
                                                            placeholder="you@example.com"
                                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                    <div className="relative">
                                                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="tel"
                                                            required
                                                            placeholder="+91 98765 43210"
                                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Your company name"
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">What would you like to discuss?</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Tell us about your requirements..."
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                                />
                                            </div>

                                            {/* Summary */}
                                            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                                <div className="font-medium text-gray-800 mb-2">Booking Summary</div>
                                                <div className="text-gray-600">
                                                    <p><strong>Type:</strong> {demoTypes.find(t => t.id === selectedType)?.name}</p>
                                                    <p><strong>Date:</strong> {selectedDate && formatDate(selectedDate)}</p>
                                                    <p><strong>Time:</strong> {selectedTime} IST</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                                                >
                                                    <FiArrowLeft /> Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="btn-primary flex items-center gap-2 disabled:opacity-70"
                                                >
                                                    {isSubmitting ? (
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <>Confirm Booking</>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
