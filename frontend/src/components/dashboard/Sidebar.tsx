'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome, FiUpload, FiFileText, FiPieChart, FiSettings,
    FiLogOut, FiUser, FiChevronDown, FiBell
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Upload Files', href: '/dashboard/upload', icon: FiUpload },
    { name: 'Reports', href: '/dashboard/reports', icon: FiFileText },
    { name: 'Analytics', href: '/dashboard/analytics', icon: FiPieChart },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40">
            {/* Logo */}
            <div className="p-5 border-b border-gray-800">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-xl">G</span>
                    </div>
                    <span className="font-bold text-xl">
                        GST<span className="text-blue-400">Pro</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <FiChevronDown className="text-gray-400" />
                </div>
                <button
                    onClick={logout}
                    className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                >
                    <FiLogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}

interface TopBarProps {
    userName?: string;
}

export function TopBar({ userName }: TopBarProps) {
    const { user } = useAuth();
    const displayName = userName || user?.name || 'User';

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">
            <div>
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {displayName}!</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <FiBell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        <span className="font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
