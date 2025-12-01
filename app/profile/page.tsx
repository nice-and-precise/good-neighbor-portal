'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Edit2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getCustomerById, Customer } from '@/lib/mock-data';

export default function ProfilePage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [customer, setCustomer] = useState<Customer | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: ''
    });

    useEffect(() => {
        const id = localStorage.getItem('wcs_customer_id');
        if (!id) {
            router.push('/login');
            return;
        }

        const data = getCustomerById(id);
        if (data) {
            setCustomer(data);
            setFormData({
                email: data.email || '',
                phone: data.phone || ''
            });
        } else {
            router.push('/login');
        }
        setLoading(false);
    }, [router]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would make an API call
        // For now, we just update local state to simulate
        if (customer) {
            setCustomer({
                ...customer,
                email: formData.email,
                phone: formData.phone
            });
        }
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
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
                            <h1 className="text-2xl font-bold">My Profile</h1>
                            <p className="text-gray-300 text-sm mt-1">
                                Manage your account details
                            </p>
                        </div>
                        <User className="h-8 w-8 text-wcs-gold opacity-80" />
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-lg font-semibold text-wcs-navy">Contact Information</h2>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-sm text-wcs-gold hover:text-yellow-600 font-medium flex items-center"
                                >
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Edit Details
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                                    <div className="text-gray-900 font-medium text-lg">{customer?.name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Customer ID</label>
                                    <div className="text-gray-900 font-mono">{customer?.id}</div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-gray-900">
                                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                            {customer?.email}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-gray-900">
                                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                            {customer?.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-wcs-green text-white rounded-md hover:bg-opacity-90 font-medium flex items-center"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h2 className="text-lg font-semibold text-wcs-navy mb-4">Service Address</h2>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                                <MapPin className="h-5 w-5 text-wcs-gold mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-900 font-medium">{customer?.serviceAddress.street}</p>
                                    <p className="text-gray-600">{customer?.serviceAddress.city}, {customer?.serviceAddress.state} {customer?.serviceAddress.zip}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
