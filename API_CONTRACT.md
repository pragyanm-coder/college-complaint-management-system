# College Complaint Management System — API Contract

## Base URL

`http://localhost:5001`

All request and response bodies use JSON.

## 1. Authentication APIs

### Register

**POST** `/api/auth/register`

Access: Public

Request:

```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "password": "password123",
  "rollNumber": "123456",
  "department": "Information Technology",
  "year": "2nd Year",
  "phone": "9876543210"
}
```

Validation:
- Full name: 3–100 characters.
- Valid email address required.
- Password: 8–128 characters, containing letters and numbers.
- Roll number is required.
- Academic year must be one of: `1st Year`, `2nd Year`, `3rd Year`, `4th Year`.
- Phone number must contain exactly 10 digits.

Expected success response (planned):

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "fullName": "Rahul Sharma",
      "email": "rahul@gmail.com",
      "role": "student"
    },
    "token": "JWT_TOKEN"
  }
}
```

### Login

**POST** `/api/auth/login`

Access: Public

Request:

```json
{
  "email": "rahul@gmail.com",
  "password": "password123"
}
```

Expected success response (planned):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "fullName": "Rahul Sharma",
      "email": "rahul@gmail.com",
      "role": "student"
    },
    "token": "JWT_TOKEN"
  }
}
```

Available roles:
- `student`
- `admin`
- `staff`

Admin and staff accounts must be created through a controlled process.

## 2. Authentication Header

All protected endpoints require a valid JWT.

```http
Authorization: Bearer <JWT_TOKEN>
```

The frontend should store the token after successful login and attach it to protected API requests.

## 3. Student APIs

### Submit Complaint

**POST** `/api/complaints`

Access: Student

Request:

```json
{
  "title": "Broken classroom fan",
  "description": "The fan in classroom 201 has stopped working.",
  "category": "Classroom and Infrastructure",
  "location": "Block A, Room 201"
}
```

Allowed complaint categories:
- Hostel
- Classroom and Infrastructure
- Library
- Canteen
- Academics
- Transport
- IT and Wi-Fi
- Other

Validation:
- Title: 5–120 characters.
- Description: 20–2000 characters.
- Location: required, maximum 150 characters.
- Category must match one of the allowed values.

The backend will assign default values:
- Status: `Pending`
- Priority: `Medium`

Students cannot directly assign staff or modify complaint status.

### View Own Complaints

**GET** `/api/complaints/my`

Access: Student

Returns complaints submitted by the authenticated student.

### View Complaint Details

**GET** `/api/complaints/:id`

Access: Authenticated users

Students can access only their own complaints. Admins can view all complaints. Staff can view complaints assigned to them.

## 4. Admin APIs

### View All Complaints

**GET** `/api/admin/complaints`

Access: Admin

Returns all complaints submitted through the system.

### Assign Complaint to Staff

**PATCH** `/api/admin/complaints/:id/assign`

Access: Admin

Request:

```json
{
  "staffId": "STAFF_USER_ID"
}
```

The backend must verify that the staff ID belongs to an existing staff account.

### Update Complaint Status

**PATCH** `/api/admin/complaints/:id/status`

Access: Admin

Request:

```json
{
  "status": "In Progress"
}
```

Allowed statuses:
- `Pending`
- `In Progress`
- `Resolved`

## 5. Staff APIs

### View Assigned Complaints

**GET** `/api/staff/complaints`

Access: Staff

Returns only complaints assigned to the authenticated staff member.

### Update Complaint Status

**PATCH** `/api/staff/complaints/:id/status`

Access: Staff

Request:

```json
{
  "status": "Resolved",
  "resolutionDetails": "The classroom fan has been repaired successfully."
}
```

Allowed statuses:
- `Pending`
- `In Progress`
- `Resolved`

When status is `Resolved`, resolution details are required and must contain 10–1000 characters.

Staff can update only complaints assigned to them.

## 6. Complaint Data Structure

The planned complaint object will contain:

```json
{
  "id": "COMPLAINT_ID",
  "title": "Broken classroom fan",
  "description": "The fan in classroom 201 has stopped working.",
  "category": "Classroom and Infrastructure",
  "location": "Block A, Room 201",
  "priority": "Medium",
  "status": "Pending",
  "student": "STUDENT_USER_ID",
  "assignedStaff": null,
  "createdAt": "2026-11-24T10:00:00.000Z",
  "resolutionDetails": null
}
```

Note: This is the planned data structure. The final database model and response fields will be aligned during implementation.

## 7. Complaint Handling Departments

Complaint-handling departments are separate from students' academic departments.

Available handling departments:
- Maintenance Department
- IT Support
- Library Office
- Hostel Administration
- Canteen Management
- Academic Office
- Transport Office

## 8. Standard Response Format

Successful responses should follow:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error responses should follow:

```json
{
  "success": false,
  "message": "Error description"
}
```

## 9. HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request data |
| 401 | Not authenticated or invalid token |
| 403 | Insufficient permissions |
| 404 | Resource or endpoint not found |
| 500 | Internal server error |
| 501 | Functionality not implemented yet |

## 10. Important Notes

1. Passwords must be hashed using bcrypt before storing.
2. JWT tokens are used for authentication.
3. Students should only access their own complaints.
4. Staff should only access complaints assigned to them.
5. Admins can view and assign all complaints.
6. Complaint priority and initial status are assigned by the backend.
7. All protected routes must verify authentication and role permissions.
8. The frontend should follow the request field names and endpoint paths defined in this document.

**Implementation note:** This contract defines the agreed API interface. Some controllers are still awaiting database integration, so the documented success responses are expected formats, not yet verified live responses.