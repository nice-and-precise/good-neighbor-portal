'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ArrowRight, AlertCircle } from 'lucide-react';
import { getCustomerById } from '@/lib/mock-data';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
    const [customerId, setCustomerId] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { showToast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numbers and limit to 12 digits
        const value = e.target.value.replace(/\D/g, '').slice(0, 12);
        setCustomerId(value);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (customerId.length !== 12) {
            const msg = 'Please enter a valid 12-digit Customer ID.';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        const customer = getCustomerById(customerId);

        if (customer) {
            localStorage.setItem('wcs_customer_id', customerId);
            showToast('Login successful! Redirecting...', 'success');
            router.push('/dashboard');
        } else {
            const msg = 'We couldn\'t find that account—please check your 12-digit ID.';
            setError(msg);
            showToast(msg, 'error');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-wcs-green p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
                        <Truck className="h-8 w-8 text-wcs-green" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome Neighbor!</h1>
                    <p className="text-wcs-green-100 mt-2 text-sm text-opacity-90 text-white">
                        Access your account to pay bills and view schedules.
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                                12-Digit Customer ID
                            </label>
                            <input
                                type="text"
                                id="customerId"
                                value={customerId}
                                onChange={handleInputChange}
                                placeholder="000000000000"
                                className={`w-full px-4 py-3 rounded-md border ${error ? 'border-alert-red focus:ring-alert-red' : 'border-gray-300 focus:ring-wcs-green'
                                    } focus:outline-none focus:ring-2 focus:border-transparent transition-all font-mono text-lg tracking-widest`}
                            />
                            {error && (
                                <div className="flex items-center gap-2 mt-2 text-alert-red text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                You can find this on your monthly invoice statement.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-wcs-gold text-wcs-navy font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            Access Account
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            New to West Central Sanitation?{' '}
                            <a href="/contact" className="text-wcs-green font-semibold hover:underline">
                                Contact us to start service
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
