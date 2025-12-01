'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ContactPage() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast('Message sent! We will get back to you shortly.', 'success');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-wcs-navy mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-600">
                        Have questions? We're here to help. Reach out to our team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-wcs-navy text-white rounded-xl p-8 shadow-lg">
                        <h2 className="text-xl font-bold mb-6">Get in Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <Phone className="h-6 w-6 text-wcs-gold mr-4 mt-1" />
                                <div>
                                    <h3 className="font-medium mb-1">Phone</h3>
                                    <p className="text-gray-300">1-800-246-7630</p>
                                    <p className="text-sm text-gray-400 mt-1">Mon-Fri: 8am - 5pm</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Mail className="h-6 w-6 text-wcs-gold mr-4 mt-1" />
                                <div>
                                    <h3 className="font-medium mb-1">Email</h3>
                                    <p className="text-gray-300">info@wcsanitation.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <MapPin className="h-6 w-6 text-wcs-gold mr-4 mt-1" />
                                <div>
                                    <h3 className="font-medium mb-1">Main Office</h3>
                                    <p className="text-gray-300">
                                        4089 Abbott Drive<br />
                                        Willmar, MN 56201
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-wcs-navy mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wcs-green focus:border-wcs-green"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-wcs-green text-white py-2 px-4 rounded-md font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                            >
                                Send Message
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
