'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomerById, Customer } from '@/lib/mock-data';
import { Trash2, Recycle, CreditCard, Calendar, MapPin, AlertTriangle, CheckCircle, ExternalLink, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function DashboardPage() {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        const id = localStorage.getItem('wcs_customer_id');
        if (!id) {
            router.push('/login');
            return;
        }

        const data = getCustomerById(id);
        if (data) {
            setCustomer(data);
        } else {
            router.push('/login');
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
                <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-48 bg-gray-200 rounded-xl"></div>
                            <div className="h-48 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-64 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!customer) return null;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-wcs-navy">Welcome back, {customer.name.split(' ')[0]}!</h1>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-wcs-green" />
                        {customer.serviceAddress.street}, {customer.serviceAddress.city}
                    </p>
                </div>
                <div className="bg-green-50 text-wcs-green px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Account Active
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Service Status Cards */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-bold text-wcs-navy flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-wcs-gold" />
                            Service Schedule
                        </h2>
                        <button
                            onClick={() => router.push('/track')}
                            className="bg-wcs-navy text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90 transition-all flex items-center gap-2"
                        >
                            <Truck className="h-4 w-4" />
                            Track My Truck
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Trash Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-wcs-navy"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-wcs-navy p-3 rounded-lg">
                                    <Trash2 className="h-6 w-6 text-white" />
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase">
                                    {customer.routeDay}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Trash Service</h3>
                            <p className="text-gray-500 text-sm mb-4">96 Gallon Cart</p>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm text-gray-500">Next Pickup</p>
                                <p className="text-xl font-bold text-wcs-green">{customer.nextPickupDate}</p>
                                <p className="text-xs text-gray-400 mt-1">Please have out by 7:00 AM</p>
                            </div>
                        </div>

                        {/* Recycling Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-wcs-tan"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-wcs-tan p-3 rounded-lg">
                                    <Recycle className="h-6 w-6 text-white" />
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase">
                                    {customer.recyclingSchedule}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Recycling</h3>
                            <p className="text-gray-500 text-sm mb-4">Single Sort</p>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm text-gray-500">Next Pickup</p>
                                <p className="text-xl font-bold text-wcs-green">{customer.nextPickupDate}</p>
                                <p className="text-xs text-gray-400 mt-1">Check calendar for holiday changes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Community News */}
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 mt-8">
                    <h3 className="text-lg font-bold text-wcs-navy mb-2">Community News</h3>
                    <p className="text-gray-700 text-sm mb-4">
                        West Central Sanitation is proud to sponsor the upcoming Willmar Winter Festival!
                        Join us downtown this Saturday for hot cocoa and a parade.
                    </p>
                    <button className="text-wcs-green font-semibold text-sm hover:underline">
                        Read more on our blog &rarr;
                    </button>
                </div>
            </div>

            {/* Bill Pay Module */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-wcs-navy flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-wcs-gold" />
                    Billing
                </h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center mb-6">
                        <p className="text-gray-500 text-sm mb-1">Current Balance</p>
                        <p className="text-4xl font-bold text-wcs-navy">
                            ${customer.balanceDue.toFixed(2)}
                        </p>
                        <p className="text-xs text-alert-red mt-2 flex items-center justify-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Due upon receipt
                        </p>
                    </div>

                    <button
                        className="w-full bg-wcs-gold text-wcs-navy font-bold py-3 rounded-md hover:bg-opacity-90 transition-colors shadow-sm mb-4 flex items-center justify-center gap-2"
                        onClick={() => showToast('Redirecting to secure payment portal...', 'info')}
                    >
                        Pay Now
                        <ExternalLink className="h-4 w-4" />
                    </button>

                    <div className="border-t border-gray-100 pt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Last Payment</span>
                            <span className="font-medium text-gray-800">{customer.lastPaymentDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Invoice #</span>
                            <span className="font-medium text-gray-800">INV-2025-001</span>
                        </div>
                        <button className="w-full text-center text-wcs-green text-sm font-semibold hover:underline mt-2">
                            View Payment History
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}
