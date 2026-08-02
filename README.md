# 🌊 Ocean Sentinel OS

> **Ocean Sentinel OS** is an AI-Assisted Marine Operations Platform that transforms environmental telemetry into actionable conservation decisions through explainable AI, intelligent mission planning, and real-time operational coordination.

---

# 📌 Project Overview

Coral reefs are among the world's most valuable ecosystems but face increasing threats from coral bleaching, rising sea temperatures, marine debris, and human activities.

Ocean Sentinel OS bridges the gap between environmental monitoring and field operations by combining environmental telemetry, explainable AI, mission planning, team coordination, analytics, and reporting into a single intelligent platform.

Instead of simply displaying reef statistics, the platform analyzes reef conditions, explains ecological risks, recommends conservation missions, suggests the most appropriate response team, and enables operators to deploy missions with a single click.

The platform follows a **Human-in-the-Loop** approach where AI provides transparent recommendations while conservation officers retain complete operational control.

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Secure Login
- Protected API Routes
- Role-based Authorization

---

## 🪸 Reef Management

- Create, Update & Delete Reefs
- Interactive Marine Map
- Reef Details Dashboard
- Coral Health Monitoring
- Sea Surface Temperature Monitoring
- Bleaching Alert Tracking
- Ghost Net Distance Monitoring
- Protected Area Tracking

---

## 🤖 AI-Assisted Decision Support

Ocean Sentinel OS analyzes environmental telemetry to generate intelligent operational recommendations.

The AI evaluates:

- Coral Health
- Sea Surface Temperature
- Bleaching Alerts
- Ghost Net Distance
- Protected Area Status

AI outputs include:

- Overall Risk Score
- Conservation Priority
- Bleaching Risk
- Pollution Risk
- Explainable Risk Contributors
- AI Confidence Score
- Human-readable Ecological Explanation
- Recommended Mission Type
- Suggested Response Team
- Estimated Mission Duration
- Expected Conservation Outcome

---

## 🧠 Explainable AI

Unlike traditional AI systems, Ocean Sentinel OS explains every recommendation.

The AI displays:

- Coral Health contribution
- Sea Temperature contribution
- Ghost Net contribution
- Protected Area impact

This enables conservation teams to understand **why** a recommendation was generated before taking action.

---

## 🚀 AI-Assisted Mission Planning

After analyzing a reef, Ocean Sentinel OS automatically recommends:

- Mission Type
- Mission Priority
- Suggested Response Team
- Estimated Duration
- Expected Operational Outcome

Operators can review the recommendation and deploy the mission directly from the dashboard with a single click.

---

## 🚢 Mission Management

- AI-Prefilled Mission Creation
- Mission Planning
- Team Assignment
- Mission Priority
- Mission Status Tracking
- Schedule Management
- Mission Timeline
- Reef-specific Mission History
- Live Dashboard Synchronization

---

## 👥 Team Management

- Team CRUD
- Team Leader Management
- Team Status
- Member Count
- Contact Information
- AI Team Recommendation

---

## 📊 Analytics Dashboard

Monitor conservation operations through a centralized dashboard featuring:

- Total Reefs
- Active Missions
- Available Teams
- Average Coral Health
- Mission Status Distribution
- Coral Health Distribution
- Team Specialization
- Reefs by Country
- Operational Overview

---

## 📄 Report Generation

Generate professional PDF reports containing:

- Reef Details
- Mission Information
- Team Information
- Coral Health
- Mission Status
- Executive Summary
- AI Assessment Summary

---

## 🚨 Alerts

Automatically generates and stores reef conservation alerts for future review and operational planning.

---

# 🔄 AI Conservation Workflow

```text
Select Reef
      │
      ▼
Analyze Environmental Telemetry
      │
      ▼
AI Risk Assessment
      │
      ▼
Explainable AI Analysis
      │
      ▼
Operational Recommendation
      │
      ▼
Deploy Mission
      │
      ▼
Dashboard Updates Instantly
```

---

# 🏗 System Architecture

```text
                    React Frontend
                           │
                           │ REST API
                           ▼
                  FastAPI Backend
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 SQLite Database   AI Recommendation     PDF Reports
                  & Explainability
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Leaflet

## Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT Authentication
- ReportLab

## AI

- Deterministic AI Risk Engine
- Explainable AI
- Mission Recommendation Engine
- Operational Decision Support

## Tools

- Git
- GitHub
- Swagger UI

---

# 📂 Project Structure

```text
Ocean-Sentinel-OS/

├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── reports/
│   │   └── static/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│
└── datasets/
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/NishithLawrence/Ocean-Sentinel-OS.git

cd Ocean-Sentinel-OS
```

---

## Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend

```
http://127.0.0.1:8000
```

Swagger

```
http://127.0.0.1:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Backend `.env`

```env
DATABASE_URL=sqlite:///./ocean_sentinel.db

SECRET_KEY=YOUR_SECRET_KEY

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Frontend `.env`

```env
VITE_API_BASE_URL=https://ocean-sentinel-api.onrender.com/api/v1
```

---

# 📡 API Modules

- Authentication
- Users
- Reefs
- Missions
- Teams
- Analytics
- Reports
- Alerts
- AI Risk Assessment

---

# 📸 Screenshots

- Login
- Dashboard
- Interactive Marine Map
- AI Conservation Recommendation
- Explainable AI
- Mission Deployment
- Mission Timeline
- Analytics Dashboard
- PDF Reports

---

# 🎯 Problem Statement

Marine conservation teams often collect vast amounts of environmental data but still rely on manual interpretation to decide where to deploy limited field resources.

Traditional dashboards visualize reef conditions but do not assist responders in determining:

- Which reef needs immediate attention?
- Why is the reef at risk?
- What mission should be deployed?
- Which response team is best suited?

Ocean Sentinel OS bridges this gap through AI-assisted operational decision support.

---

# 💡 Solution

Ocean Sentinel OS converts raw environmental telemetry into actionable conservation operations by:

- Assessing ecological risk
- Explaining AI reasoning
- Recommending conservation missions
- Suggesting response teams
- Supporting human decision-making
- Synchronizing operational dashboards in real time

---

# 🔮 Future Enhancements

- NOAA Weather API Integration
- Allen Coral Atlas Integration
- Satellite Image Analysis
- Drone-assisted Reef Inspection
- IoT Marine Sensor Integration
- Predictive Coral Bleaching Models
- AI-generated Conservation Reports
- Multi-region Deployment

---

# 👨‍💻 Author

**Nishith Lawrence**

B.Tech Student | AI & Full Stack Developer

GitHub:
https://github.com/NishithLawrence

---

# 📄 License

This project is licensed under the MIT License.