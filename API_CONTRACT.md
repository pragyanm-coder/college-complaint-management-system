

# College Complaint Management System — API Contract

## Base URL
http://localhost:5001

All request and response bodies use JSON.

## 1. Authentication APIs

### Register
POST /api/auth/register

Request:
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "password": "password123"
}

### Login
POST /api/auth/login

Request:
{
  "email": "rahul@gmail.com",
  "password": "password123"
}

Authentication-protected requests must include:

Authorization: Bearer <JWT_TOKEN>

## 2. Student APIs

### Submit Complaint
POST /api/complaints

Access: Student

Request:
{
  "title": "Broken classroom fan",
  "description": "The fan in classroom 201 is not working.",
  "category": "Infrastructure",
  "location": "Block A, Room 201"
}

### View Own Complaints
GET /api/complaints/my

Access: Student

### View Complaint Details
GET /api/complaints/:id

Access: Authenticated users

## 3. Admin APIs

### View All Complaints
GET /api/admin/complaints

Access: Admin

### Assign Complaint to Staff
PATCH /api/admin/complaints/:id/assign

Access: Admin

Request:
{
  "staffId": "STAFF_USER_ID"
}

### Update Complaint Status
PATCH /api/admin/complaints/:id/status

Access: Admin

Request:
{
  "status": "In Progress"
}

## 4. Staff APIs

### View Assigned Complaints
GET /api/staff/complaints

Access: Staff

### Update Complaint Status
PATCH /api/staff/complaints/:id/status

Access: Staff

Request:
{
  "status": "Resolved",
  "resolutionDetails": "The classroom fan has been repaired."
}

## 5. Authentication and Authorization

Available roles:
- student
- admin
- staff

Protected endpoints require a valid JWT.

HTTP Status Codes:

- 200 — Successful request
- 201 — Resource created
- 400 — Invalid request data
- 401 — Not authenticated or invalid token
- 403 — Insufficient permissions
- 404 — Resource or endpoint not found
- 500 — Internal server error

## 6. Important Notes

1. Passwords must be hashed using bcrypt before storing.
2. JWT tokens are used for authentication.
3. Admin accounts must be created through a controlled process.
4. Students should only access their own complaints.
5. Staff should only access complaints assigned to them.
6. Admins can view and assign all complaints.

Note: This is the initial API contract. Request fields, response formats,
status values and role permissions will be finalized jointly with
the frontend and database teams before integration.
