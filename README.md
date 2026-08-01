# 🌊 Ocean Sentinel OS

> **Ocean Sentinel OS** is a full-stack AI-powered marine conservation platform designed to monitor coral reef ecosystems, manage conservation missions, coordinate field teams, generate analytical reports, and assess reef health using a deterministic AI risk engine.

---

## 📌 Project Overview

Coral reefs are among the world's most valuable ecosystems but face increasing threats from coral bleaching, marine debris, rising sea temperatures, and human activities.

Ocean Sentinel OS provides conservation organizations with a centralized platform to:

- Monitor reef conditions
- Plan conservation missions
- Manage field teams
- Generate analytical reports
- Perform AI-powered reef risk assessments
- Track conservation alerts

The platform combines geospatial reef information, mission management, analytics, reporting, and explainable AI into a single dashboard.

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Secure Login
- Protected API Routes
- Role-based Authorization

---

## 🪸 Reef Management

- Create Reef
- Update Reef
- Delete Reef
- View Reef Details
- Coral Health Monitoring
- Bleaching Alerts
- Protected Area Tracking
- Ghost Net Distance Tracking

---

## 🚢 Mission Management

- Mission Planning
- Team Assignment
- Mission Priority
- Mission Status
- Schedule Management

---

## 👥 Team Management

- Team CRUD
- Team Leader Management
- Team Status
- Member Count
- Contact Information

---

## 📊 Analytics Dashboard

- Total Reefs
- Total Missions
- Total Teams
- Active Missions
- Available Teams
- Average Coral Health

Charts

- Mission Status
- Coral Health Distribution
- Team Specialization
- Reefs by Country

---

## 📄 Report Generation

Generate professional PDF reports containing:

- Reef Details
- Mission Information
- Team Information
- Coral Health
- Mission Status
- Executive Summary

---

## 🤖 AI Risk Engine

A deterministic AI engine evaluates reef conditions using:

- Coral Health
- Sea Temperature
- Bleaching Alerts
- Ghost Net Distance

Outputs include:

- Risk Score
- Overall Risk
- Bleaching Risk
- Pollution Risk
- Conservation Priority
- Conservation Recommendations

---

## 🚨 Alerts

Automatically stores reef risk assessments as alerts for future review.

---

# 🏗 System Architecture

```
                React Frontend
                      │
                      │ REST API
                      ▼
               FastAPI Backend
                      │
      ┌───────────────┼───────────────┐
      │               │               │
      ▼               ▼               ▼
 SQLite Database  AI Risk Engine  Report Engine
```

---

# 🛠 Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Recharts

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT Authentication
- ReportLab

### AI

- Deterministic Rule Engine

### Tools

- Git
- GitHub
- Swagger UI

---

# 📂 Project Structure

```
Ocean_os/

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

## Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

Swagger:

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

Frontend:

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

> Screenshots will be added after deployment.

- Login
- Dashboard
- Reef Management
- Mission Planner
- Team Management
- Analytics
- Reports
- AI Assessment

---

# 🔮 Future Enhancements

- Real-time NOAA integration
- Allen Coral Atlas dataset import
- Marine Protected Area integration
- Weather API integration
- Drone image analysis
- Interactive GIS maps
- Predictive ML models
- Cloud deployment

---

# 👨‍💻 Author

**Nishith Lawrence**

B.Tech Student

AI & Full Stack Developer

GitHub: https://github.com/NishithLawrence

---

# 📄 License

This project is licensed under the MIT License.