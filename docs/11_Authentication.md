# Ocean Sentinel OS

# Authentication Module Specification

> Version: 1.0
>
> Module: Authentication & Authorization
>
> Framework: FastAPI + JWT
>
> Frontend: React
>
> Security: Password Hashing + JWT

---

# Table of Contents

1. Overview
2. Objectives
3. User Roles
4. Authentication Flow
5. Authorization
6. Login Module
7. Logout Module
8. Protected Routes
9. JWT Token
10. Password Security
11. Session Management
12. Error Handling
13. Future Improvements

---

# 1. Overview

The Authentication Module ensures that only authorized government personnel can access Ocean Sentinel OS.

The module is responsible for:

- Login
- Logout
- Session Management
- Role-Based Access Control
- JWT Authentication

---

# 2. Objectives

The authentication system must:

- Verify user identity.
- Prevent unauthorized access.
- Secure API endpoints.
- Maintain active user sessions.
- Support role-based permissions.

---

# 3. User Roles

## Administrator

Permissions

- Full system access
- Manage users
- Manage datasets
- Manage teams
- View analytics

---

## Marine Conservation Officer

Permissions

- Dashboard
- Reef Intelligence
- Mission Planner
- Reports
- Analytics

---

## Coast Guard Officer

Permissions

- Assigned Missions
- Mission Updates
- Reports
- Reef Information

---

# 4. Authentication Flow

```
Application Starts

↓

Login Page

↓

Enter Email

↓

Enter Password

↓

POST /api/v1/auth/login

↓

Backend Validates User

↓

Password Verified

↓

Generate JWT Token

↓

Return User Information

↓

Store Token

↓

Redirect Dashboard
```

---

# 5. Authorization

Every protected API must verify:

- JWT Token
- User Role
- Token Expiration

Unauthorized users receive:

HTTP 401

Forbidden actions receive:

HTTP 403

---

# 6. Login Module

### Input

- Email
- Password

### Validation

- Email required
- Password required
- Valid email format

### Success

- Generate JWT
- Store token
- Redirect to Dashboard

### Failure

Possible Errors

- Invalid credentials
- User not found
- Account disabled
- Server unavailable

---

# 7. Logout Module

Flow

```
Click Logout

↓

Remove JWT

↓

Clear Session

↓

Redirect Login Page
```

---

# 8. Protected Routes

Protected Frontend Pages

- Dashboard
- Reef Intelligence
- Mission Planner
- Analytics
- Reports
- Team Management
- Admin Panel

Unauthenticated users are redirected to Login.

---

# 9. JWT Token

Payload

```json
{
  "user_id": 1,
  "role": "Marine Officer",
  "email": "officer@gov.in",
  "exp": 1789876543
}
```

The frontend stores the token securely and sends it with every authenticated request.

Authorization Header

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 10. Password Security

Passwords are never stored in plain text.

Use:

- bcrypt hashing
- Salted passwords

Password Rules

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

# 11. Session Management

The session remains active while the JWT token is valid.

Expired Token

```
Request

↓

Token Expired

↓

HTTP 401

↓

Frontend Redirects Login
```

Future enhancement:

- Refresh Token support

---

# 12. Error Handling

| Error | HTTP Code | Message |
|--------|-----------|---------|
| Invalid Credentials | 401 | Incorrect email or password |
| Token Expired | 401 | Please login again |
| Unauthorized | 401 | Authentication required |
| Forbidden | 403 | Access denied |
| Validation Error | 422 | Invalid request data |
| Server Error | 500 | Unexpected server error |

---

# 13. Future Improvements

- Multi-Factor Authentication (MFA)
- Single Sign-On (SSO)
- Government Identity Provider Integration
- Password Reset via Email
- Refresh Tokens
- Audit Login History
- Device Management

---

# Authentication Design Principles

- Secure by default
- Least privilege access
- Role-based authorization
- Passwords never stored in plain text
- JWT for stateless authentication
- Clear error messages without exposing sensitive information

---

# End of Document