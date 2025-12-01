'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getCustomerById, updateCustomerBalance } from '@/lib/mock-data';

export default function PayPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [amountType, setAmountType] = useState<'balance' | 'other'>('balance');
    const [customAmount, setCustomAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    // Mock Payment Form State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [zip, setZip] = useState('');

    useEffect(() => {
        // Simulate auth check
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

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const paymentAmount = amountType === 'balance' ? customer.balance : parseFloat(customAmount);

        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            showToast('Please enter a valid payment amount.', 'error');
            setProcessing(false);
            return;
        }

        // Update mock data
        updateCustomerBalance(customer.id, paymentAmount);

        showToast(`Payment of $${paymentAmount.toFixed(2)} processed successfully!`, 'success');

        // Redirect back to dashboard
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-wcs-navy mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="bg-wcs-navy p-6 text-white flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Secure Payment</h1>
                            <p className="text-gray-300 text-sm mt-1">
                                Customer ID: {customer?.id}
                            </p>
                        </div>
                        <Lock className="h-8 w-8 text-wcs-gold opacity-80" />
                    </div>

                    <form onSubmit={handlePayment} className="p-8 space-y-8">
                        {/* Amount Section */}
                        <section>
                            <h2 className="text-lg font-semibold text-wcs-navy mb-4">Payment Amount</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${amountType === 'balance'
                                            ? 'border-wcs-green bg-green-50 ring-1 ring-wcs-green'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => setAmountType('balance')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">Current Balance</span>
                                        <CheckCircle className={`h-5 w-5 ${amountType === 'balance' ? 'text-wcs-green' : 'text-gray-200'}`} />
                                    </div>
                                    <p className="text-2xl font-bold text-wcs-navy mt-2">
                                        ${customer?.balance.toFixed(2)}
                                    </p>
                                </div>

                                <div
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${amountType === 'other'
                                            ? 'border-wcs-green bg-green-50 ring-1 ring-wcs-green'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => setAmountType('other')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">Other Amount</span>
                                        <CheckCircle className={`h-5 w-5 ${amountType === 'other' ? 'text-wcs-green' : 'text-gray-200'}`} />
                                    </div>
                                    <div className="mt-2 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            disabled={amountType !== 'other'}
                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method Section */}
                        <section>
                            <h2 className="text-lg font-semibold text-wcs-navy mb-4">Payment Method</h2>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                                            <input
                                                type="text"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                            <input
                                                type="text"
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                placeholder="123"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Billing Zip Code</label>
                                        <input
                                            type="text"
                                            value={zip}
                                            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                            placeholder="55350"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-wcs-gold text-wcs-navy font-bold py-4 rounded-md hover:bg-opacity-90 transition-all shadow-sm flex items-center justify-center gap-2 ${processing ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {processing ? (
                                <>
                                    <div className="h-5 w-5 border-2 border-wcs-navy border-t-transparent rounded-full animate-spin"></div>
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <Lock className="h-5 w-5" />
                                    Pay ${amountType === 'balance' ? customer?.balance.toFixed(2) : (parseFloat(customAmount) || 0).toFixed(2)}
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
                            <Lock className="h-3 w-3" />
                            Payments are processed securely via 256-bit SSL encryption.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
