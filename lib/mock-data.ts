export type ServiceType = 'Residential' | 'Commercial' | 'Roll-Off';

export interface Customer {
    id: string; // 12-digit ID
    name: string;
    email: string;
    phone: string;
    serviceAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    serviceType: ServiceType;
    routeDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    recyclingSchedule: 'Weekly' | 'Bi-Weekly';
    nextPickupDate: string; // ISO Date
    balanceDue: number;
    lastPaymentDate: string; // ISO Date
}

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: '123456789012',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '320-555-0123',
        serviceAddress: {
            street: '123 Maple Ave',
            city: 'Willmar',
            state: 'MN',
            zip: '56201',
        },
        serviceType: 'Residential',
        routeDay: 'Tuesday',
        recyclingSchedule: 'Bi-Weekly',
        nextPickupDate: '2025-12-02', // Assuming current date is Dec 1, 2025
        balanceDue: 45.00,
        lastPaymentDate: '2025-11-01',
    },
    {
        id: '987654321098',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '320-555-0987',
        serviceAddress: {
            street: '456 Oak St',
            city: 'New London',
            state: 'MN',
            zip: '56273',
        },
        serviceType: 'Commercial',
        routeDay: 'Wednesday',
        recyclingSchedule: 'Weekly',
        nextPickupDate: '2025-12-03',
        balanceDue: 120.50,
        lastPaymentDate: '2025-11-15',
    },
];

export const getCustomerById = (id: string) => {
    return MOCK_CUSTOMERS.find(c => c.id === id);
};

export const updateCustomerBalance = (id: string, paymentAmount: number) => {
    const customer = MOCK_CUSTOMERS.find(c => c.id === id);
    if (customer) {
        customer.balanceDue = Math.max(0, customer.balanceDue - paymentAmount);
    }
};

export interface ServiceHistoryItem {
    id: string;
    date: string;
    type: ServiceType;
    status: 'Completed' | 'Scheduled' | 'Pending';
    amount: number;
    description: string;
}

export const MOCK_SERVICE_HISTORY: Record<string, ServiceHistoryItem[]> = {
    '123456789012': [
        { id: 'S001', date: '2025-11-25', type: 'Residential', status: 'Completed', amount: 45.00, description: 'Weekly Trash Pickup' },
        { id: 'S002', date: '2025-11-18', type: 'Residential', status: 'Completed', amount: 45.00, description: 'Weekly Trash Pickup' },
        { id: 'S003', date: '2025-11-11', type: 'Residential', status: 'Completed', amount: 45.00, description: 'Weekly Trash Pickup' },
        { id: 'S004', date: '2025-12-02', type: 'Residential', status: 'Scheduled', amount: 45.00, description: 'Weekly Trash Pickup' },
    ]
};

export const getServiceHistory = (customerId: string) => {
    return MOCK_SERVICE_HISTORY[customerId] || [];
};

export interface TrackingInfo {
    customerId: string;
    truckLocation: { lat: number; lng: number };
    eta: string; // e.g., "10:30 AM - 12:30 PM"
    status: 'En Route' | 'Collecting' | 'Completed' | 'Delayed';
    currentStop: string;
    stopsRemaining: number;
}

export const MOCK_TRACKING_INFO: Record<string, TrackingInfo> = {
    '123456789012': {
        customerId: '123456789012',
        truckLocation: { lat: 45.118, lng: -95.045 }, // Near Willmar, MN
        eta: '10:30 AM - 12:30 PM',
        status: 'En Route',
        currentStop: 'Main St & 4th Ave',
        stopsRemaining: 4
    }
};

export const getTrackingInfo = (customerId: string) => {
    return MOCK_TRACKING_INFO[customerId];
};
