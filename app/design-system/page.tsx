'use client';

import React from 'react';
import { useToast } from '@/components/ui/Toast';

export default function DesignSystemPage() {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-wcs-navy">Design System Verification</h1>

            <section>
                <h2 className="text-xl font-semibold mb-4">Brand Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-wcs-green rounded-md shadow-sm"></div>
                        <p className="font-medium">WCS Green</p>
                        <p className="text-sm text-gray-500">#026937</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-wcs-gold rounded-md shadow-sm"></div>
                        <p className="font-medium">WCS Gold</p>
                        <p className="text-sm text-gray-500">#EDAA00</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-wcs-navy rounded-md shadow-sm"></div>
                        <p className="font-medium">WCS Navy</p>
                        <p className="text-sm text-gray-500">#20263e</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-wcs-tan rounded-md shadow-sm"></div>
                        <p className="font-medium">WCS Tan</p>
                        <p className="text-sm text-gray-500">#D2B48C</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-alert-red rounded-md shadow-sm"></div>
                        <p className="font-medium">Alert Red</p>
                        <p className="text-sm text-gray-500">#DC2626</p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Typography (Open Sans)</h2>
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">Heading 1: Good Neighbors You've Come To Trust</h1>
                    <h2 className="text-3xl font-semibold">Heading 2: Residential Services</h2>
                    <h3 className="text-2xl font-medium">Heading 3: Weekly Pickup</h3>
                    <p className="text-base">
                        Body Text: West Central Sanitation was founded in 1979 by Don Williamson with a single truck
                        and a commitment to integrity and fairness. We serve 140 Minnesota communities.
                    </p>
                    <p className="text-sm text-gray-500">Small Text: Copyright © 2025 West Central Sanitation</p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Buttons</h2>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-wcs-green text-white rounded-md font-semibold hover:bg-opacity-90">
                        Primary Action
                    </button>
                    <button className="px-4 py-2 bg-wcs-gold text-wcs-navy rounded-md font-semibold hover:bg-opacity-90">
                        Secondary Action
                    </button>
                    <button className="px-4 py-2 border border-wcs-navy text-wcs-navy rounded-md font-semibold hover:bg-gray-50">
                        Outline Action
                    </button>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
                <ToastDemo />
            </section>
        </div>
    );
}

function ToastDemo() {
    const { showToast } = useToast();
    return (
        <div className="flex gap-4">
            <button
                onClick={() => showToast('Operation successful!', 'success')}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium hover:bg-green-200"
            >
                Success Toast
            </button>
            <button
                onClick={() => showToast('Something went wrong.', 'error')}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-md font-medium hover:bg-red-200"
            >
                Error Toast
            </button>
            <button
                onClick={() => showToast('Here is some information.', 'info')}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-medium hover:bg-blue-200"
            >
                Info Toast
            </button>
        </div>
    );
}
