'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getCustomerById, getServiceHistory, ServiceHistoryItem } from '@/lib/mock-data';

export default function HistoryPage() {
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [history, setHistory] = useState<ServiceHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem('wcs_customer_id');
        if (!id) {
            router.push('/login');
            return;
        }

        const data = getCustomerById(id);
        if (data) {
            setCustomer(data);
            setHistory(getServiceHistory(id));
        } else {
            router.push('/login');
        }
        setLoading(false);
    }, [router]);

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
            <div className="max-w-4xl mx-auto">
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
                            <h1 className="text-2xl font-bold">Service History</h1>
                            <p className="text-gray-300 text-sm mt-1">
                                Recent activity for {customer?.name}
                            </p>
                        </div>
                        <FileText className="h-8 w-8 text-wcs-gold opacity-80" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {history.length > 0 ? (
                                    history.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                {item.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.description}
                                                <span className="block text-xs text-gray-500">{item.type}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {item.status === 'Completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                    {item.status === 'Scheduled' && <Clock className="h-3 w-3 mr-1" />}
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                                ${item.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <AlertCircle className="h-8 w-8 text-gray-300 mb-2" />
                                                <p>No service history found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
