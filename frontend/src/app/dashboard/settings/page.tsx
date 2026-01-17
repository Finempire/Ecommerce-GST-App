'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { TopBar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiMail, FiLock, FiSave, FiBell, FiShield, FiCreditCard, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function SettingsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Profile form
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            updateUser({ name, email });
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsSaving(false);
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            setIsSaving(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError('Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const tabs = [
        { id: 'profile', name: 'Profile', icon: FiUser },
        { id: 'security', name: 'Security', icon: FiShield },
        { id: 'notifications', name: 'Notifications', icon: FiBell },
        { id: 'billing', name: 'Billing', icon: FiCreditCard },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64">
                <TopBar />

                <main className="p-6 space-y-6">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                        <p className="text-gray-600">Manage your account settings and preferences</p>
                    </div>

                    {/* Messages */}
                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                            <FiCheck />
                            <span>{success}</span>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                            <FiAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-3">
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-6">Profile Information</h2>
                                    <form onSubmit={handleSaveProfile} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <div className="relative">
                                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="btn-primary inline-flex items-center gap-2 disabled:opacity-70"
                                        >
                                            {isSaving ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <FiSave />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-6">Change Password</h2>
                                    <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="btn-primary inline-flex items-center gap-2 disabled:opacity-70"
                                        >
                                            {isSaving ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <FiLock />
                                                    Update Password
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-6">Notification Preferences</h2>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'Email notifications', desc: 'Receive updates via email' },
                                            { name: 'Report ready alerts', desc: 'Get notified when reports are ready' },
                                            { name: 'Processing updates', desc: 'Updates on file processing status' },
                                            { name: 'Marketing emails', desc: 'Product updates and tips' },
                                        ].map((item) => (
                                            <label key={item.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <div>
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                                </div>
                                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-6">Billing & Subscription</h2>
                                    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white mb-6">
                                        <p className="text-sm text-white/80 mb-1">Current Plan</p>
                                        <p className="text-2xl font-bold mb-2">Free Trial</p>
                                        <p className="text-sm text-white/80">14 days remaining</p>
                                    </div>
                                    <button className="btn-primary">
                                        Upgrade Plan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
