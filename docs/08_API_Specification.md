# Ocean Sentinel OS

# API Specification

> Version: 1.0
>
> Architecture: REST API
>
> Framework: FastAPI
>
> Response Format: JSON
>
> Authentication: JWT Bearer Token

---

# Table of Contents

1. API Overview
2. Authentication APIs
3. User APIs
4. Reef APIs
5. Mission APIs
6. Team APIs
7. Analytics APIs
8. Report APIs
9. Admin APIs
10. Error Responses

---

# 1. API Overview

Base URL

/api/v1

Authentication

Authorization: Bearer <JWT_TOKEN>

Response Format

JSON

Content Type

application/json

---

# 2. Authentication APIs

## Login

POST

/api/v1/auth/login

Request

{
    "email": "officer@gov.in",
    "password": "password123"
}

Success Response

200 OK

{
    "access_token": "JWT_TOKEN",
    "token_type": "Bearer",
    "user": {
        "id": 1,
        "name": "John Doe",
        "role": "Marine Officer"
    }
}

Errors

401 Unauthorized

Invalid credentials

---

## Logout

POST

/api/v1/auth/logout

Response

200 OK

{
    "message":"Logged out successfully"
}

---

# 3. User APIs

## Get Current User

GET

/api/v1/users/me

Response

{
    "id":1,
    "name":"John Doe",
    "role":"Marine Officer",
    "email":"officer@gov.in",
    "organization":"Marine Authority"
}

---

# 4. Reef APIs

## Get All Reefs

GET

/api/v1/reefs

Response

[
{
"id":1,
"name":"Heron Reef",
"country":"Australia",
"priority":"HIGH"
}
]

---

## Get Reef Details

GET

/api/v1/reefs/{reef_id}

Response

{
"id":1,
"name":"Heron Reef",
"country":"Australia",
"latitude":-23.44,
"longitude":151.91,
"coral_health":76,
"temperature":29.5,
"ghost_net_distance":1.4,
"protected_area":true
}

---

## AI Risk Assessment

GET

/api/v1/reefs/{reef_id}/assessment

Response

{
"priority_score":87,
"risk_level":"HIGH",
"confidence":0.92,
"recommendation":"Immediate cleanup mission",
"explanation":[
"Coral health decreasing",
"Ghost net detected nearby",
"Protected marine area"
]
}

---

# 5. Mission APIs

## Create Mission

POST

/api/v1/missions

Request

{
"name":"Ghost Net Cleanup",
"reef_id":1,
"team_id":3,
"mission_date":"2026-08-10",
"resources":"Boat, Diving Kit",
"notes":"High priority cleanup"
}

Response

201 Created

{
"id":15,
"status":"Planned"
}

---

## Get Missions

GET

/api/v1/missions

Response

[
{
"id":15,
"name":"Ghost Net Cleanup",
"status":"Planned"
}
]

---

## Update Mission

PUT

/api/v1/missions/{mission_id}

---

## Delete Mission

DELETE

/api/v1/missions/{mission_id}

204 No Content

---

# 6. Team APIs

## Get Teams

GET

/api/v1/teams

Response

[
{
"id":1,
"name":"Coral Guardians",
"region":"Queensland",
"available":true
}
]

---

## AI Team Recommendation

GET

/api/v1/teams/recommend?reef_id=1

Response

{
"team_id":3,
"name":"Coral Guardians Alpha",
"reason":"Nearest available team with Ghost Net specialization"
}

---

# 7. Analytics APIs

## Dashboard Analytics

GET

/api/v1/analytics/dashboard

Response

{
"active_missions":17,
"critical_reefs":5,
"ghost_nets":42,
"marine_life_saved":3400
}

---

## Mission Trends

GET

/api/v1/analytics/missions

---

## Risk Distribution

GET

/api/v1/analytics/risks

---

# 8. Report APIs

## Generate Report

POST

/api/v1/reports

Request

{
"mission_id":15
}

Response

{
"report_id":5,
"download_url":"/reports/report_15.pdf"
}

---

## Download Report

GET

/api/v1/reports/{report_id}

---

# 9. Admin APIs

## Get Users

GET

/api/v1/admin/users

---

## Create User

POST

/api/v1/admin/users

---

## Update User

PUT

/api/v1/admin/users/{id}

---

## Delete User

DELETE

/api/v1/admin/users/{id}

---

## Manage Teams

GET

POST

PUT

DELETE

/api/v1/admin/teams

---

## Dataset Management

GET

POST

DELETE

/api/v1/admin/datasets

---

# 10. Standard Error Responses

400 Bad Request

{
"error":"Invalid request"
}

---

401 Unauthorized

{
"error":"Authentication required"
}

---

403 Forbidden

{
"error":"Access denied"
}

---

404 Not Found

{
"error":"Resource not found"
}

---

422 Validation Error

{
"error":"Validation failed"
}

---

500 Internal Server Error

{
"error":"Unexpected server error"
}

---

# API Design Principles

- RESTful endpoints
- Consistent JSON responses
- Proper HTTP status codes
- JWT authentication
- Versioned API (/api/v1)
- Input validation using Pydantic
- Standardized error messages
- Pagination for large datasets
- Filtering through query parameters

---

# End of Document