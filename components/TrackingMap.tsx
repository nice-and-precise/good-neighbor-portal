'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, MapPin } from 'lucide-react';

// Fix for default marker icon in Next.js
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Truck icon
const truckIcon = L.divIcon({
    className: 'custom-truck-icon',
    html: `<div style="background-color: #1B365D; border-radius: 50%; padding: 8px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

interface TrackingMapProps {
    truckLocation: { lat: number; lng: number };
    customerLocation: { lat: number; lng: number };
}

function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
}

export default function TrackingMap({ truckLocation, customerLocation }: TrackingMapProps) {
    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 z-0 relative">
            <MapContainer
                center={truckLocation}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={truckLocation} />

                {/* Truck Marker */}
                <Marker position={truckLocation} icon={truckIcon}>
                    <Popup>
                        <div className="text-center">
                            <p className="font-bold text-wcs-navy">WCS Truck #42</p>
                            <p className="text-xs text-gray-500">En Route</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Customer Marker */}
                <Marker position={customerLocation} icon={icon}>
                    <Popup>
                        <p className="font-bold">Your Location</p>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
