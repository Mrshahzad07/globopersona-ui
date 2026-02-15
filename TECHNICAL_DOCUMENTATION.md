# Technical Documentation: GloboPersona UI

This document provides a technical deep-dive into the application's architecture, focusing on how data, state, and API interactions are handled.

---

## 🏗️ State Management Architecture

The application employs a multi-tiered state management strategy to balance performance and developer experience.

### 1. Global State (React Context)
Centralized state accessible throughout the entire component tree:
- **`AuthContext`**: Manages user session, authentication status, and login/logout logic. Persists user data to `localStorage`.
- **`ThemeContext`**: Handles the application's appearance (Light/Dark mode) by toggling data-attributes on the document root.

### 2. Feature-Level State (Wizard Pattern)
Used in complex workflows like the Campaign Creation Wizard:
- **Centralized Data Object**: A single `formData` state in `WizardContainer.jsx` acts as the "Single Source of Truth" for all 6 steps.
- **Synchronization**: An `updateData(key, value)` function is passed down to steps, ensuring seamless data flow as the user navigates between screens.

### 3. Component-Local State
- **`useState`**: Used for UI-specific logic (modals, dropdowns, tab selection).
- **`useEffect`**: Handles side effects like data fetching on mount or responding to prop changes.

---

## 🪝 Custom Hooks

Custom hooks encapsulate reusable logic and cleaner component interfaces:
- **`useAuth()`**: Provides components with easy access to the current `user`, `login`, and `logout` functions.
- **`useTheme()`**: Interface for toggling between light and dark themes.
- **`useCountUp(target, duration)`**: Custom animation hook found in Dashboards to smoothly increment numerical values (e.g., total sent emails).

---

## 🔌 API & Data Configuration

The project uses a sophisticated **Mock Service Layer** (`mockApi.js`) that simulates a real production backend.

### Persistence Engine
- **`localStorage`**: All data (campaigns, contacts, settings) is persisted in the browser's local storage, allowing the demo to maintain state across page refreshes.
- **Mock Latency**: Every service call includes a simulated `delay()` to mimic real network conditions.

### Core Services
| Service | Responsibility |
| :--- | :--- |
| **`campaignService`** | Full CRUD operations, status management, and analytics aggregation. |
| **`contactService`** | Handles CSV parsing, email regex validation, and contact storage. |
| **`aiConfigService`** | Stores AI-specific parameters like company description and product tone. |
| **`emailGenerationService`** | Simulates AI generation logic, producing personalized subjects and bodies. |
| **`dashboardService`** | Aggregates data from multiple sources to provide high-level metrics (Rates, Trends). |

---

## 📡 Interaction States & UI Transitions
- **Loading States**: Centralized `LoadingSpinner` component and `loading` flags in services ensure a cohesive "waiting" experience.
- **Error Handling**: `ErrorBoundary` components wrap critical paths (like the Wizard) to catch and gracefully handle UI failures.
- **Animation States**: CSS-based transitions combined with React state handle hover effects, active states, and entrance animations (`fadeIn`, `scaleIn`).
