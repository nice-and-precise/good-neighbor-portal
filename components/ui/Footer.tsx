import React from 'react';
import Link from 'next/link';
import { Truck, Phone, MapPin, Clock, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-wcs-navy text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-wcs-green p-2 rounded-md">
                                <Truck className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                West Central Sanitation
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                            "Good Neighbors You've Come To Trust." Serving 140 Minnesota communities since 1979 with integrity and fairness.
                        </p>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-4">
                        <h3 className="text-wcs-gold font-bold text-lg mb-2">Contact Us</h3>
                        <div className="flex items-start gap-3 text-gray-300 text-sm">
                            <MapPin className="h-5 w-5 text-wcs-green shrink-0 mt-0.5" />
                            <span>4089 Abbott Drive<br />Willmar, MN 56201</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Phone className="h-5 w-5 text-wcs-green shrink-0" />
                            <a href="tel:1-800-246-7630" className="hover:text-white transition-colors">1-800-246-7630</a>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Mail className="h-5 w-5 text-wcs-green shrink-0" />
                            <a href="mailto:info@wcsanitation.com" className="hover:text-white transition-colors">info@wcsanitation.com</a>
                        </div>
                    </div>

                    {/* Hours Column */}
                    <div className="space-y-4">
                        <h3 className="text-wcs-gold font-bold text-lg mb-2">Office Hours</h3>
                        <div className="flex items-start gap-3 text-gray-300 text-sm">
                            <Clock className="h-5 w-5 text-wcs-green shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p>Monday - Friday</p>
                                <p className="font-semibold text-white">8:00 AM - 5:00 PM</p>
                                <p className="mt-2 text-xs text-gray-400">Closed Weekends & Holidays</p>
                            </div>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-4">
                        <h3 className="text-wcs-gold font-bold text-lg mb-2">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/services/residential" className="hover:text-wcs-gold transition-colors">Residential Services</Link></li>
                            <li><Link href="/services/commercial" className="hover:text-wcs-gold transition-colors">Commercial Services</Link></li>
                            <li><Link href="/services/roll-off" className="hover:text-wcs-gold transition-colors">Roll-Off Dumpsters</Link></li>
                            <li><Link href="/dashboard" className="hover:text-wcs-gold transition-colors">My Account</Link></li>
                            <li><Link href="/privacy" className="hover:text-wcs-gold transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© 2025 West Central Sanitation. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
