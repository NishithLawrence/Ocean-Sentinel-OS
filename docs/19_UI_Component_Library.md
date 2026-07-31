# Ocean Sentinel OS

# UI Component Library

> Version: 1.0
>
> Framework: React + Tailwind CSS
>
> Icon Library: Lucide React

---

# Table of Contents

1. Overview
2. Design System
3. Buttons
4. Cards
5. Forms
6. Tables
7. Navigation
8. Modals
9. Alerts
10. Charts
11. Map Components
12. Loaders
13. Empty States
14. Icons
15. Component Naming

---

# 1. Overview

This document defines every reusable UI component used throughout Ocean Sentinel OS.

Goals

- Consistent design
- Reusable code
- Easy maintenance
- Faster development

---

# 2. Design System

Border Radius

Medium

Spacing

8px Grid System

Shadow

Soft Shadow

Transitions

200ms

Typography

Professional Sans-serif

Icons

Lucide React

---

# 3. Buttons

## Primary Button

Purpose

Main actions.

Examples

- Login
- Save Mission
- Generate Report

Appearance

- Filled
- Primary Color

---

## Secondary Button

Purpose

Alternative actions.

Examples

- Cancel
- Back
- View Details

---

## Danger Button

Purpose

Delete actions.

Examples

- Delete User
- Delete Mission

---

## Icon Button

Purpose

Small actions.

Examples

- Search
- Refresh
- Download

---

# 4. Cards

## KPI Card

Displays

- Active Missions
- High Risk Reefs
- Ghost Nets
- Marine Life Saved

---

## Reef Card

Displays

- Reef Name
- Country
- Health
- Priority

---

## AI Assessment Card

Displays

- Priority Score
- Risk Level
- Explanation
- Recommendation

---

## Team Card

Displays

- Team Name
- Region
- Availability

---

## Report Card

Displays

- Report Title
- Date
- Download Button

---

# 5. Forms

Reusable Components

Text Input

Password Input

Date Picker

Dropdown

Checkbox

Textarea

Search Box

Validation Message

Required Indicator

---

# 6. Tables

Reusable Table

Supports

- Pagination
- Search
- Sorting
- Filters

Tables

Mission Table

User Table

Reports Table

Teams Table

Alerts Table

---

# 7. Navigation

Navbar

Contains

- Logo
- User Menu
- Notifications

Sidebar

Contains

- Dashboard
- Reef Intelligence
- Missions
- Analytics
- Reports
- Teams
- Admin
- Profile
- Logout

Breadcrumb

Example

Dashboard

>

Reef Details

>

Mission Planner

---

# 8. Modals

Reusable Modal

Examples

Delete Confirmation

Mission Details

Team Details

Report Preview

---

# 9. Alerts

Success

Green

Example

Mission Saved Successfully

---

Warning

Orange

Example

Mission Deadline Approaching

---

Error

Red

Example

Login Failed

---

Information

Blue

Example

Dataset Updated

---

# 10. Charts

Use Recharts.

Components

Line Chart

Bar Chart

Pie Chart

Area Chart

Dashboard Cards

Analytics Page

---

# 11. Map Components

React Leaflet

Components

Map Container

Reef Marker

Ghost Net Marker

Protected Area Layer

Popup

Legend

Filters

Zoom Controls

---

# 12. Loaders

Loading Spinner

Skeleton Card

Skeleton Table

Skeleton Chart

Skeleton Map

Display during API calls.

---

# 13. Empty States

Examples

No Missions

No Reports

No Teams

No Alerts

Each empty state should include:

- Illustration/Icon
- Friendly message
- Action button

---

# 14. Icons

Use Lucide React.

Examples

Home

Map

Ship

Users

Alert Triangle

File Text

Bar Chart

Settings

Log Out

Search

Download

---

# 15. Component Naming

Examples

Button.jsx

Card.jsx

Navbar.jsx

Sidebar.jsx

MissionTable.jsx

ReefCard.jsx

AIAssessmentCard.jsx

AnalyticsChart.jsx

ReportModal.jsx

LoadingSpinner.jsx

EmptyState.jsx

ConfirmationDialog.jsx

---

# Component Principles

Every component should:

- Have a single responsibility.
- Accept props.
- Avoid business logic.
- Be reusable.
- Be responsive.
- Be accessible.

---

# End of Document