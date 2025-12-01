# Architectural Decisions

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Maps:** Leaflet (via React-Leaflet)

## Key Decisions

### 1. Mock Data Strategy
- **Decision:** Use a centralized `mock-data.ts` file for all data simulation.
- **Reasoning:** Allows for rapid prototyping without a backend. Easy to swap with real API calls later.

### 2. Client-Side State Management
- **Decision:** Use React `useState` and `useEffect` with `localStorage` for session management.
- **Reasoning:** Simple and sufficient for a proof-of-concept. Avoids complexity of Redux/Zustand for now.

### 3. Map Implementation
- **Decision:** Use `react-leaflet` with dynamic imports.
- **Reasoning:** Leaflet is lightweight and free. Dynamic import is required to avoid Server-Side Rendering (SSR) issues common with mapping libraries in Next.js.

### 4. Component Design
- **Decision:** Modular components (e.g., `TrackingMap`, `Header`) with Tailwind utility classes.
- **Reasoning:** Promotes reusability and consistent styling.

### 5. "Turbo Mode" Execution
- **Decision:** Auto-approve and auto-execute to maximize speed.
- **Reasoning:** User requested rapid development for a demo/POC.
