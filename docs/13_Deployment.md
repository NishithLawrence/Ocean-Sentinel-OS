# Ocean Sentinel OS

# Deployment Specification

> Version: 1.0
>
> Document Type: Deployment Guide
>
> Frontend: React + Vite
>
> Backend: FastAPI
>
> Database: SQLite (Development)
>
> Future Production Database: PostgreSQL

---

# Table of Contents

1. Overview
2. Deployment Architecture
3. Development Environment
4. Production Environment
5. Environment Variables
6. Frontend Deployment
7. Backend Deployment
8. Database Deployment
9. Deployment Checklist
10. Future Improvements

---

# 1. Overview

This document explains how Ocean Sentinel OS is deployed for development and production.

Deployment consists of:

- React Frontend
- FastAPI Backend
- SQLite Database
- PDF Report Storage

---

# 2. Deployment Architecture

```
                Internet
                     │
        ┌────────────┴────────────┐
        │                         │
Frontend (React)          Backend (FastAPI)
   Vercel                    Render
        │                         │
        └────────────┬────────────┘
                     │
               SQLite Database
                     │
               Local Report Storage
```

---

# 3. Development Environment

Requirements

- Python 3.12+
- Node.js 20+
- npm
- Git

Clone Repository

```bash
git clone <repository-url>
cd Ocean_Sentinel_OS
```

Install Frontend

```bash
cd frontend
npm install
npm run dev
```

Install Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# 4. Production Environment

Recommended Services

Frontend

- Vercel

Backend

- Render

Database

- PostgreSQL

File Storage

- Cloud Object Storage (future)

---

# 5. Environment Variables

Backend

```env
SECRET_KEY=your_secret_key
JWT_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///ocean.db
```

Frontend

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Never commit `.env` files to Git.

---

# 6. Frontend Deployment

Build

```bash
npm run build
```

Output Folder

```
dist/
```

Deploy

- Connect GitHub repository to Vercel.
- Configure environment variables.
- Trigger deployment.

---

# 7. Backend Deployment

Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Requirements

- Install Python dependencies
- Configure environment variables
- Set startup command

---

# 8. Database Deployment

Development

SQLite

Production

PostgreSQL

Migration Tool (Future)

- Alembic

---

# 9. Deployment Checklist

Frontend

- Dependencies installed
- Environment variables configured
- Build successful

Backend

- Dependencies installed
- Database connected
- APIs responding

Database

- Tables created
- Seed data loaded

Verification

- Login works
- Dashboard loads
- AI assessment works
- Mission creation works
- Report generation works

---

# 10. Future Improvements

- Docker support
- Docker Compose
- Kubernetes deployment
- CI/CD pipeline
- Automatic backups
- Monitoring and alerting

---

# Deployment Principles

- Reproducible builds
- Secure configuration
- Environment isolation
- Minimal downtime
- Easy rollback

---

# End of Document