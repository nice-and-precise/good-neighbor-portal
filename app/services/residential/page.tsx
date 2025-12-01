import React from 'react';
import { Home } from 'lucide-react';

export default function ResidentialPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-wcs-green/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Home className="h-10 w-10 text-wcs-green" />
                    </div>
                    <h1 className="text-3xl font-bold text-wcs-navy mb-4">Residential Services</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Reliable weekly trash and recycling pickup for your home.
                        This page is currently under construction.
                    </p>
                </div>
            </div>
        </div>
    );
}
