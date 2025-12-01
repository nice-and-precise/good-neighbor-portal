'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, Globe, ChevronDown, Menu, X, User, LogOut, LayoutDashboard, History, Settings } from 'lucide-react';

export function Header() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        // Check auth state on mount and when storage changes
        const checkAuth = () => {
            const id = localStorage.getItem('wcs_customer_id');
            setIsLoggedIn(!!id && id.length === 12);
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);

        // Custom event for immediate UI updates within the same tab
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('wcs_customer_id');
        setIsLoggedIn(false);
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-wcs-green p-2 rounded-md group-hover:bg-opacity-90 transition-colors">
                        <Truck className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-wcs-green tracking-tight">
                        West Central Sanitation
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {['Residential', 'Commercial', 'Roll-Off', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            href={`/services/${item.toLowerCase().replace(' ', '-')}`}
                            className="text-gray-700 hover:text-wcs-green font-medium transition-colors hover:underline decoration-wcs-gold decoration-2 underline-offset-4"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* Utilities */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-wcs-green">
                            <Globe className="h-4 w-4" />
                            <span>EN</span>
                            <ChevronDown className="h-3 w-3" />
                        </button>
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-100 hidden group-hover:block py-1">
                            {['English', 'Spanish', 'Somali', 'Swahili'].map((lang) => (
                                <button
                                    key={lang}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-wcs-green"
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Auth Button / Profile Menu */}
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-2 bg-gray-50 text-wcs-navy px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                            >
                                <User className="h-4 w-4" />
                                <span>My Account</span>
                                <ChevronDown className="h-3 w-3" />
                            </button>

                            {isProfileMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-100 py-1 z-20">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Account</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-wcs-green"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="h-4 w-4 mr-2" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/history"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-wcs-green"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <History className="h-4 w-4 mr-2" />
                                            Service History
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-wcs-green"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Profile Settings
                                        </Link>
                                        <div className="border-t border-gray-50 mt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-wcs-gold text-wcs-navy px-5 py-2.5 rounded-md font-bold text-sm shadow-sm hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5"
                        >
                            Pay Bill
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg">
                    <nav className="flex flex-col gap-4">
                        {['Residential', 'Commercial', 'Roll-Off', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href={`/services/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-lg font-medium text-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <hr className="border-gray-100" />

                        {isLoggedIn ? (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase">My Account</p>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center py-2 text-gray-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/history"
                                    className="flex items-center py-2 text-gray-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <History className="h-4 w-4 mr-2" />
                                    Service History
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center py-2 text-gray-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Profile Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center py-2 text-red-600 w-full text-left"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-wcs-gold text-wcs-navy text-center py-3 rounded-md font-bold shadow-sm block"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Pay Bill
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
