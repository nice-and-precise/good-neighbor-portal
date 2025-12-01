'use client';

import React, { useState } from 'react';
import { Truck, Check, Info, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useToast } from '@/components/ui/Toast';

type ContainerSize = '10-yard' | '20-yard' | '30-yard';

const CONTAINER_SIZES = [
    {
        id: '10-yard',
        name: '10 Yard Container',
        dimensions: '12\'L x 8\'W x 3.5\'H',
        capacity: '~4 Pickup Truck Loads',
        bestFor: ['Heavy Debris', 'Concrete/Dirt', 'Small Remodels'],
        price: '$350 est.',
    },
    {
        id: '20-yard',
        name: '20 Yard Container',
        dimensions: '22\'L x 8\'W x 4\'H',
        capacity: '~8 Pickup Truck Loads',
        bestFor: ['Roofing', 'Flooring Removal', 'Garage Cleanouts'],
        price: '$475 est.',
    },
    {
        id: '30-yard',
        name: '30 Yard Container',
        dimensions: '22\'L x 8\'W x 6\'H',
        capacity: '~12 Pickup Truck Loads',
        bestFor: ['Major Construction', 'Whole Home Cleanout', 'New Siding'],
        price: '$595 est.',
    },
];

export default function RollOffPage() {
    const { showToast } = useToast();
    const [selectedSize, setSelectedSize] = useState<ContainerSize | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        projectType: '',
        date: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast(`Request received for ${selectedSize} container! We will call you at ${formData.phone} to confirm.`, 'success');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-wcs-navy mb-4">
                            Roll-Off Dumpster Rental
                        </h1>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            Perfect for construction, renovation, or big clean-up projects.
                            Select a size and tell us when you need it. We'll handle the rest.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left Side: Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 order-2 lg:order-1">
                            <h2 className="text-xl font-bold text-wcs-navy mb-6 flex items-center gap-2">
                                <Truck className="h-5 w-5 text-wcs-gold" />
                                Request a Delivery
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-wcs-green focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-wcs-green focus:border-transparent outline-none transition-all"
                                            placeholder="(320) 555-0123"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-wcs-green focus:border-transparent outline-none transition-all"
                                        placeholder="123 Maple Ave, Willmar, MN"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                                        <select
                                            name="projectType"
                                            required
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-wcs-green focus:border-transparent outline-none transition-all bg-white"
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Project...</option>
                                            <option value="construction">New Construction</option>
                                            <option value="renovation">Home Renovation</option>
                                            <option value="roofing">Roofing</option>
                                            <option value="cleanout">House/Garage Cleanout</option>
                                            <option value="landscaping">Landscaping</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            required
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-wcs-green focus:border-transparent outline-none transition-all"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 text-sm text-yellow-800 flex gap-3">
                                    <Info className="h-5 w-5 shrink-0 text-yellow-600" />
                                    <p>
                                        <strong>Note:</strong> A signature is required upon delivery for the liability waiver.
                                        Please ensure the drop-off location is clear of vehicles and obstructions.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!selectedSize}
                                    className={clsx(
                                        "w-full py-3 px-4 rounded-md font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm",
                                        selectedSize
                                            ? "bg-wcs-green hover:bg-opacity-90 transform hover:-translate-y-0.5"
                                            : "bg-gray-300 cursor-not-allowed"
                                    )}
                                >
                                    {selectedSize ? `Request ${selectedSize.replace('-', ' ')}` : 'Select a Size Above'}
                                    {selectedSize && <ArrowRight className="h-5 w-5" />}
                                </button>
                            </form>
                        </div>

                        {/* Right Side: Info Cards */}
                        <div className="space-y-4 order-1 lg:order-2">
                            <h3 className="text-lg font-semibold text-gray-500 mb-2">Select Container Size</h3>
                            {CONTAINER_SIZES.map((size) => (
                                <div
                                    key={size.id}
                                    onClick={() => setSelectedSize(size.id as ContainerSize)}
                                    className={clsx(
                                        "bg-white rounded-xl p-6 cursor-pointer transition-all border-2 relative",
                                        selectedSize === size.id
                                            ? "border-wcs-gold shadow-md ring-1 ring-wcs-gold"
                                            : "border-transparent shadow-sm hover:border-gray-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={clsx("text-xl font-bold mb-1", selectedSize === size.id ? "text-wcs-navy" : "text-gray-800")}>
                                                {size.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-3">{size.dimensions}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {size.bestFor.map((item) => (
                                                    <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-wcs-green bg-opacity-10 text-wcs-green font-bold px-3 py-1 rounded-full text-sm inline-block mb-2">
                                                {size.capacity}
                                            </div>
                                            {selectedSize === size.id && (
                                                <div className="flex justify-end mt-2">
                                                    <div className="bg-wcs-gold rounded-full p-1">
                                                        <Check className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-6 bg-wcs-navy text-white rounded-xl p-6 shadow-lg">
                                <h4 className="font-bold text-lg mb-2 text-wcs-gold">Need help choosing?</h4>
                                <p className="text-sm text-gray-300 mb-4">
                                    Our dispatch team can help you estimate the right size for your project to avoid overage fees.
                                </p>
                                <a href="tel:1-800-246-7630" className="text-white font-semibold hover:text-wcs-gold transition-colors flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    Call Dispatch: 1-800-246-7630
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
