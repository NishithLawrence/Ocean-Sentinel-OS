# Ocean Sentinel OS

# Frontend Architecture

> Version: 1.0
>
> Framework: React + Vite
>
> Language: JavaScript
>
> Styling: Tailwind CSS
>
> Icons: Lucide React
>
> Charts: Recharts
>
> Maps: React Leaflet
>
> Routing: React Router DOM

---

# Table of Contents

1. Frontend Overview
2. Technology Stack
3. Folder Structure
4. Routing
5. Pages
6. Components
7. State Management
8. API Layer
9. Styling
10. Error Handling
11. Loading Strategy
12. Coding Standards

---

# 1. Frontend Overview

The frontend is a responsive web application for government officers.

Responsibilities:

- Display marine information
- Visualize maps
- Display AI recommendations
- Create and manage missions
- Generate reports
- Show analytics
- Manage users (Admin)

The frontend should remain independent of AI logic and database implementation. It communicates only through backend APIs.

---

# 2. Technology Stack

Framework:
- React (Vite)

Styling:
- Tailwind CSS

Routing:
- React Router DOM

Maps:
- React Leaflet

Charts:
- Recharts

Icons:
- Lucide React

HTTP Client:
- Axios

Notifications:
- React Hot Toast

---

# 3. Folder Structure

frontend/

src/

├── assets/

├── components/

│   ├── common/

│   ├── dashboard/

│   ├── map/

│   ├── mission/

│   ├── analytics/

│   ├── reports/

│   └── admin/

├── pages/

│   ├── Login.jsx

│   ├── Dashboard.jsx

│   ├── ReefDetails.jsx

│   ├── MissionPlanner.jsx

│   ├── Analytics.jsx

│   ├── Reports.jsx

│   ├── TeamManagement.jsx

│   ├── Profile.jsx

│   └── Admin.jsx

├── layouts/

├── hooks/

├── services/

├── utils/

├── context/

├── routes/

├── App.jsx

└── main.jsx

---

# 4. Routing

Routes

/

→ Login

/dashboard

→ Dashboard

/reef/:id

→ Reef Details

/missions

→ Mission Planner

/analytics

→ Analytics

/reports

→ Reports

/teams

→ Team Management

/profile

→ User Profile

/admin

→ Admin Panel

Unknown routes

↓

404 Page

---

# 5. Pages

## Login

Purpose

Authenticate user.

Components

- Login Form
- Logo
- Submit Button

---

## Dashboard

Components

- KPI Cards
- Alerts
- Weather Card
- Charts
- Interactive Map

---

## Reef Details

Components

- Reef Card
- Coral Health
- Ghost Nets
- AI Risk
- AI Recommendation
- Create Mission Button

---

## Mission Planner

Components

- Mission Form
- AI Recommendation Card
- Team Selector
- Notes
- Save Button

---

## Analytics

Components

- Charts
- Filters
- Summary Cards

---

## Reports

Components

- Report Table
- Download Button

---

## Team Management

Components

- Team Table
- Member List
- Status Badge

---

## Profile

Components

- User Information
- Edit Profile
- Change Password

---

## Admin

Components

- User Management
- Team Management
- Dataset Management

---

# 6. Reusable Components

Common Components

Button

Card

Modal

Table

Search Bar

Filter

Badge

Toast

Loading Spinner

Confirmation Dialog

Pagination

Sidebar

Navbar

Footer

Protected Route

---

# 7. State Management

Use React Context for:

- Logged-in User
- Authentication State
- Theme (if added later)

Use local component state for:

- Forms
- Filters
- Dialog visibility
- Table sorting

Avoid unnecessary global state.

---

# 8. API Layer

All API requests must be centralized.

Example services:

authService.js

reefService.js

missionService.js

analyticsService.js

reportService.js

teamService.js

adminService.js

No component should directly call Axios.

---

# 9. Styling

Use Tailwind CSS.

Rules:

- Consistent spacing
- Responsive layout
- Rounded cards
- Professional colors
- Accessible contrast

Avoid inline CSS unless necessary.

---

# 10. Error Handling

Handle:

- API failures
- Network issues
- Unauthorized access
- Missing data

Display user-friendly messages.

---

# 11. Loading Strategy

Display loading indicators for:

- Login
- Dashboard
- Maps
- Analytics
- Report generation
- Mission creation

Avoid blank screens while data is loading.

---

# 12. Coding Standards

Component Naming:

PascalCase

Example:

DashboardCard.jsx

Hooks:

camelCase

Example:

useAuth.js

Services:

camelCase

Example:

missionService.js

Constants:

UPPER_CASE

Keep components focused on a single responsibility.

Reuse components whenever possible.

---

# End of Document