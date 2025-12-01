'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomerById, getTrackingInfo, Customer, TrackingInfo } from '@/lib/mock-data';
import { ArrowLeft, Clock, MapPin, Phone, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet
const TrackingMap = dynamic(() => import('@/components/TrackingMap'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
            Loading Map...
        </div>
    )
});

export default function TrackPage() {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [tracking, setTracking] = useState<TrackingInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const id = localStorage.getItem('wcs_customer_id');
        if (!id) {
            router.push('/login');
            return;
        }

        const customerData = getCustomerById(id);
        const trackingData = getTrackingInfo(id);

        if (customerData && trackingData) {
            setCustomer(customerData);
            setTracking(trackingData);
        } else {
            // Fallback or error handling
            router.push('/dashboard');
        }
        setLoading(false);
    }, [router]);

    if (loading) return <div className="p-8 text-center">Loading tracking info...</div>;
    if (!customer || !tracking) return null;

    // Mock customer location (slightly offset from truck for demo)
    const customerLocation = { lat: 45.120, lng: -95.040 };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-wcs-navy mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
                {/* Sidebar Info */}
                <div className="space-y-6 flex flex-col h-full">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h1 className="text-2xl font-bold text-wcs-navy mb-2">Live Tracking</h1>
                        <p className="text-gray-500 text-sm">Real-time updates for your service.</p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <Clock className="h-6 w-6 text-wcs-navy" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Estimated Arrival</p>
                                    <p className="text-lg font-bold text-wcs-navy">{tracking.eta}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Truck className="h-6 w-6 text-wcs-green" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
                                    <p className="text-lg font-bold text-wcs-green">{tracking.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-grow">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-wcs-gold" />
                            Current Progress
                        </h3>

                        <div className="relative pl-4 border-l-2 border-gray-200 space-y-8 ml-2">
                            {/* Steps */}
                            <div className="relative">
                                <div className="absolute -left-[21px] bg-wcs-green rounded-full p-1">
                                    <CheckCircle className="h-3 w-3 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-gray-800">Route Started</p>
                                <p className="text-xs text-gray-500">7:00 AM</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] bg-wcs-navy rounded-full p-1 border-2 border-white shadow-sm">
                                    <Truck className="h-3 w-3 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-wcs-navy">Currently at {tracking.currentStop}</p>
                                <p className="text-xs text-wcs-gold font-bold">{tracking.stopsRemaining} stops away</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] bg-gray-200 rounded-full p-1">
                                    <MapPin className="h-3 w-3 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-400">Arriving at {customer.serviceAddress.street}</p>
                                <p className="text-xs text-gray-400">Estimated {tracking.eta}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400 text-center">
                                Need help? Call Dispatch at <span className="font-bold text-wcs-navy">320-555-0123</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Map Area */}
                <div className="lg:col-span-2 bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200 relative">
                    <TrackingMap
                        truckLocation={tracking.truckLocation}
                        customerLocation={customerLocation}
                    />

                    {/* Overlay for "Live" indicator */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-200 z-[1000] flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-xs font-bold text-gray-700">LIVE GPS</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
