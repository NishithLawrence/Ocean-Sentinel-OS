# Ocean Sentinel OS

# Backend Architecture

> Version: 1.0
>
> Framework: FastAPI
>
> Language: Python 3.12+
>
> Database: SQLite (Development), PostgreSQL (Production Ready)
>
> ORM: SQLAlchemy
>
> Authentication: JWT
>
> API Style: REST API

---

# Table of Contents

1. Backend Overview
2. Technology Stack
3. Architecture
4. Folder Structure
5. API Modules
6. Business Logic
7. Service Layer
8. Error Handling
9. Security
10. Logging
11. Performance
12. Coding Standards

---

# 1. Backend Overview

The backend is responsible for:

- Authentication
- Data management
- Mission management
- Reef management
- AI integration
- Report generation
- Analytics
- User management

The backend exposes REST APIs that are consumed by the React frontend.

---

# 2. Technology Stack

Framework

- FastAPI

Language

- Python

ORM

- SQLAlchemy

Validation

- Pydantic

Authentication

- JWT

Database

- SQLite

Server

- Uvicorn

Documentation

- Swagger UI
- OpenAPI

---

# 3. Architecture

Client

↓

FastAPI Router

↓

Controller

↓

Service Layer

↓

Database

↓

Response

AI Engine is called only through the Service Layer.

---

# 4. Folder Structure

backend/

app/

├── main.py

├── config.py

├── database.py

├── models/

├── schemas/

├── routers/

├── services/

├── repositories/

├── middleware/

├── auth/

├── ai/

├── reports/

├── utils/

├── static/

└── tests/

---

# 5. API Modules

Authentication

/api/auth

Users

/api/users

Reefs

/api/reefs

Missions

/api/missions

Teams

/api/teams

Analytics

/api/analytics

Reports

/api/reports

Admin

/api/admin

---

# 6. Business Logic

Authentication Service

Responsibilities

- Login
- Logout
- Token generation
- Password verification

---

Reef Service

Responsibilities

- Load reef data
- Retrieve reef details
- Calculate AI priority
- Return recommendations

---

Mission Service

Responsibilities

- Create mission
- Update mission
- Delete mission
- Assign team

---

Analytics Service

Responsibilities

- Calculate KPIs
- Build charts
- Generate statistics

---

Report Service

Responsibilities

- Generate PDF
- Export report
- Download report

---

Admin Service

Responsibilities

- Manage users
- Manage teams
- Manage datasets

---

# 7. Repository Layer

Repositories communicate directly with the database.

Examples

UserRepository

MissionRepository

ReefRepository

TeamRepository

AnalyticsRepository

Repositories should not contain business logic.

---

# 8. Error Handling

Return proper HTTP status codes.

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

Errors should include:

- Message
- Status Code
- Timestamp

---

# 9. Security

Passwords

- Hash before storage

Authentication

- JWT

Protected APIs

- Require valid token

Authorization

- Role-based access

Input Validation

- Pydantic schemas

Prevent:

- SQL Injection
- Invalid input
- Unauthorized access

---

# 10. Logging

Log:

- Login attempts
- Mission creation
- Report generation
- Errors
- Admin actions

Do not log passwords or sensitive credentials.

---

# 11. Performance

Use:

- Pagination for large datasets
- Efficient SQL queries
- Lazy loading where appropriate

Keep API response sizes reasonable.

---

# 12. Coding Standards

File Names

snake_case

Classes

PascalCase

Functions

snake_case

Keep routers thin.

Move business logic into services.

Keep repositories responsible only for database operations.

Use dependency injection provided by FastAPI where appropriate.

---

# Request Flow Example

React Frontend

↓

POST /api/missions

↓

Mission Router

↓

Mission Service

↓

Mission Repository

↓

SQLite Database

↓

Mission Repository

↓

Mission Service

↓

JSON Response

↓

React UI

---

# Future Improvements

- PostgreSQL support
- Redis caching
- Background task queue
- Object storage for reports
- Audit logs
- Rate limiting

---

# End of Document