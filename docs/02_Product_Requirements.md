# Ocean Sentinel OS

# Product Requirements Document (PRD)

> Version: 1.0
>
> Status: Final
>
> Document Type: Product Requirements
>
> Related Documents:
> - 01_Project_Overview.md
> - 03_UI_UX_Design.md
> - 07_Database_Design.md
> - 08_API_Specification.md

---

# Table of Contents

1. Introduction
2. Product Goals
3. User Roles
4. Functional Requirements
5. Non-Functional Requirements
6. Business Rules
7. Validation Rules
8. MVP Scope
9. Out of Scope
10. Acceptance Criteria

---

# 1. Introduction

Ocean Sentinel OS is an AI-powered Marine Conservation Decision Intelligence Platform designed for government agencies.

The system integrates multiple marine datasets into one centralized platform that helps officers monitor coral reefs, assess environmental risks, prioritize conservation activities, create cleanup missions, assign teams, and generate reports.

The platform is designed as a decision-support system. Final operational decisions always remain under human control.

---

# 2. Product Goals

The system must:

- Centralize marine environmental information.
- Help officers quickly identify high-risk reefs.
- Reduce manual analysis.
- Support AI-assisted decision making.
- Simplify mission planning.
- Improve reporting.
- Provide enterprise-level dashboards.
- Demonstrate a complete government workflow during the hackathon.

---

# 3. User Roles

## 3.1 Admin

Admin can:

- Manage users
- Manage teams
- Manage datasets
- View all missions
- View analytics
- Configure the system

---

## 3.2 Marine Conservation Officer

Marine Officer can:

- Login
- View dashboard
- View reefs
- View AI recommendations
- Create missions
- Edit missions
- Generate reports
- View analytics

---

## 3.3 Coast Guard Officer

Coast Guard Officer can:

- Login
- View assigned missions
- Update mission status
- View reports
- View reef information

---

# 4. Functional Requirements

---

## FR-001 User Authentication

The system shall:

- Allow only authorized government users to login.
- Support secure authentication.
- Redirect authenticated users to the dashboard.
- Prevent unauthorized access.
- Allow users to logout.

---

## FR-002 Dashboard

The dashboard shall display:

- Today's Marine Risk
- Active Ghost Nets
- Active Missions
- High-Risk Coral Zones
- Mission Success Rate
- Estimated Marine Life Saved
- Estimated CO₂ Saved
- Current Weather
- Recent Alerts
- Interactive Map
- Analytics Charts

---

## FR-003 Interactive Marine Map

The map shall:

- Display coral reefs.
- Display ghost nets.
- Display marine protected areas.
- Display active missions.
- Support zooming.
- Support panning.
- Support filtering.
- Allow clicking reef markers.

---

## FR-004 Reef Intelligence

When a reef is selected, the system shall display:

- Reef Name
- Country
- Coordinates
- Coral Health
- Sea Temperature
- Bleaching Alert
- Protected Area Status
- Nearby Ghost Nets
- AI Risk Score
- AI Recommendation

---

## FR-005 AI Risk Assessment

The system shall calculate a Priority Score using:

- Coral Health
- Ghost-Net Proximity
- Protected Area
- Weather

The Priority Score shall be classified as:

- LOW
- MEDIUM
- HIGH
- CRITICAL

The AI shall always explain why the reef received that score.

---

## FR-006 Mission Planner

The system shall allow officers to:

- Create missions.
- Edit missions.
- View missions.
- Cancel missions.

Mission fields:

- Mission Name
- Reef
- Mission Date
- Priority
- Assigned Team
- Resources
- Notes

---

## FR-007 AI Team Recommendation

When creating a mission:

The AI shall recommend the most suitable team based on:

- Region
- Availability
- Specialization

The officer may:

- Accept the recommendation.
- Choose another team manually.

The AI recommendation is advisory only.

---

## FR-008 Team Management

The system shall maintain:

- Team Name
- Team Members
- Assigned Region
- Availability
- Specialization
- Current Status

---

## FR-009 Analytics

The Analytics module shall display:

- Missions Created
- Missions Completed
- Active Missions
- Coral Zones Protected
- Ghost Nets Removed
- Marine Life Saved
- Monthly Trends
- Average Risk Score

---

## FR-010 Report Generation

The system shall generate PDF reports containing:

- Reef Details
- Mission Details
- AI Risk Assessment
- Team Information
- Officer Information
- Recommendations
- Timestamp

---

## FR-011 Search

The system shall allow searching by:

- Reef Name
- Country
- Region

---

## FR-012 Filters

Users shall filter by:

- Risk Level
- Reef Health
- Mission Status
- Protected Area

---

## FR-013 Alerts

The system shall display alerts for:

- Critical Reef
- Mission Overdue
- High Bleaching Alert
- New Ghost Net

---

## FR-014 User Profile

Each user shall have:

- Employee ID
- Name
- Email
- Role
- Organization
- Assigned Region

---

## FR-015 Admin Panel

The Admin Panel shall allow:

- Managing Users
- Managing Teams
- Managing Datasets
- Viewing System Statistics

---

# 5. Non-Functional Requirements

The application shall:

- Be responsive.
- Support modern desktop browsers.
- Use secure authentication.
- Follow modular architecture.
- Be maintainable.
- Be scalable.
- Load pages efficiently using the available datasets.

---

# 6. Business Rules

BR-001

Only authenticated users can access the system.

---

BR-002

Only Admin can create users.

---

BR-003

Every mission must belong to one reef.

---

BR-004

Every mission must have an assigned team.

---

BR-005

AI recommendations do not automatically create missions.

---

BR-006

The officer always approves the final mission.

---

BR-007

Risk Scores are recalculated whenever reef data changes.

---

# 7. Validation Rules

Login

- Email is required.
- Password is required.

Mission

- Mission Name is required.
- Mission Date cannot be in the past.
- Assigned Team is required.

Reports

- Report generation requires an existing mission.

---

# 8. MVP Scope

The MVP includes:

- Government Authentication
- Dashboard
- Interactive Map
- Reef Intelligence
- AI Risk Assessment
- Mission Planner
- AI Team Recommendation
- Team Management
- Analytics
- PDF Reports
- Alerts
- Search
- Filters
- Admin Panel

---

# 9. Out of Scope

The MVP does not include:

- Mobile App
- Public Portal
- Live Satellite Integration
- IoT Devices
- Autonomous Drones
- Autonomous Boats
- Machine Learning Model Training
- Citizen Reporting Portal

---

# 10. Acceptance Criteria

The project is considered complete when:

- Government users can login successfully.
- Dashboard displays marine information.
- Interactive map functions correctly.
- Reef details are viewable.
- AI calculates and explains risk.
- Officers can create missions.
- AI recommends teams.
- Officers approve or modify recommendations.
- Reports are generated successfully.
- Analytics display mission statistics.
- The complete workflow can be demonstrated during the hackathon.

---

# End of Document