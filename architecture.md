# System Architecture

## Overview
The Good Neighbor Portal is a Next.js web application designed for West Central Sanitation customers to manage their accounts, view service history, and track service trucks.

## Directory Structure
- `/app`: App Router pages and layouts.
    - `/dashboard`: Main user hub.
    - `/track`: Live tracking page.
    - `/profile`: User profile management.
    - `/services`: Service information and contact.
- `/components`: Reusable UI components.
    - `Header.tsx`: Navigation and authentication state.
    - `TrackingMap.tsx`: Leaflet map integration.
- `/lib`: Utilities and data.
    - `mock-data.ts`: Centralized mock data repository.

## Data Flow
1.  **Authentication:** User logs in -> ID stored in `localStorage`.
2.  **Data Retrieval:** Pages/Components read ID from `localStorage` -> Fetch data from `mock-data.ts`.
3.  **Updates:** User actions (e.g., Profile Update) -> Update in-memory mock data (non-persistent across reloads, but sufficient for demo session).

## Integration Points
- **Maps:** OpenStreetMap tiles via Leaflet.
- **Icons:** Lucide React library.
