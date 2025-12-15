# Al-Hafiz Academy API Documentation

## Base URL
```
http://al-hafiz-academy.cloudy-digital.com/api
```

## Authentication

All endpoints (except `/login`) require Bearer Token in the header:
```
Authorization: Bearer {token}
```

---

## Response Format

### Success Response (with data)
```json
{
    "status": true,
    "message": "Success message",
    "data": {...}
}
```

### Success Response (without data)
```json
{
    "status": true,
    "number": 1,
    "message": "Success message"
}
```

### Error Response
```json
{
    "status": false,
    "number": "E001",
    "message": "Error message"
}
```

---

## 1. Authentication Endpoints (Dashboard APIs)

**Note:** These APIs are for Dashboard only. For teachers, refer to Teacher APIs section.

### 1.1 Login
**POST** `/api/login`

**Description:** Dashboard login using username and password

**Request Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "username": "admin",
    "password": "password"
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin",
            "username": "admin",
            "email": "admin@alhafiz.com",
            "teacher": {
                "id": 1,
                "name": "أحمد محمد",
                "name_ar": "أحمد محمد",
                "name_en": "Ahmed Mohamed",
                "specialization": "القرآن الكريم",
                "specialization_ar": "القرآن الكريم",
                "specialization_en": "Holy Quran",
                "experience_years": 10,
                "image": "http://domain.com/Admin/images/teachers/1234567890_abc123.jpg",
                "created_at": "2024-01-01 00:00:00"
            }
        },
        "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

**Note:** The `teacher` field may be `null` if the user is not associated with a teacher.

**Error Response (422) - Validation Error:**
```json
{
    "status": false,
    "number": "E029",
    "message": "The username field is required."
}
```

**Error Response (422) - Wrong Credentials:**
```json
{
    "status": false,
    "number": "E029",
    "message": "Invalid credentials"
}
```

---

### 1.2 Logout
**POST** `/api/logout`

**Description:** Dashboard logout and revoke current token

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Logout successful"
}
```

**Error Response (401) - Unauthorized:**
```json
{
    "status": false,
    "number": "E401",
    "message": "Unauthorized"
}
```

---

### 1.3 Get Current User
**GET** `/api/user`

**Description:** Get current user information in the dashboard

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional: ar or en)
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "User data retrieved successfully",
    "user": {
        "id": 1,
        "name": "Admin",
        "username": "admin",
        "email": "admin@alhafiz.com",
        "teacher": {
            "id": 1,
            "name": "أحمد محمد",
            "name_ar": "أحمد محمد",
            "name_en": "Ahmed Mohamed",
            "specialization": "القرآن الكريم",
            "specialization_ar": "القرآن الكريم",
            "specialization_en": "Holy Quran",
            "experience_years": 10,
            "image": "http://domain.com/Admin/images/teachers/1234567890_abc123.jpg",
            "created_at": "2024-01-01 00:00:00"
        }
    }
}
```

**Note:** The `teacher` field may be `null` if the user is not associated with a teacher.

**Error Response (401):**
```json
{
    "status": false,
    "number": "E401",
    "message": "Unauthorized"
}
```

---

## 2. Students

### 2.1 List Students
**GET** `/api/students`

**Description:** Get list of students with filtering options

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `type` (optional) - Filter by registration type: `website` or `admin`
- `package_id` (optional) - Filter by package ID
- `gender` (optional) - Filter by gender: `male` or `female`
- `teacher_id` (optional) - Filter by teacher ID
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Example Request:**
```
GET /api/students?gender=male&per_page=10&page=1
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Students retrieved successfully",
    "data": {
        "students": [
            {
                "id": 1,
                "type": "admin",
                "name": "محمد أحمد",
                "email": "mohamed@example.com",
                "phone": "01012345678",
                "age": 15,
                "gender": "male",
                "gender_label": "ذكر",
                "package": {
                    "id": 1,
                    "name": "الباقة الأساسية"
                },
                "package_id": 1,
                "teacher": {
                    "id": 1,
                    "name": "أحمد محمد",
                    "specialization": "القرآن الكريم"
                },
                "teacher_id": 1,
                "hour": "10:00",
                "monthly_sessions": 8,
                "weekly_sessions": 2,
                "weekly_days": ["saturday", "tuesday"],
                "weekly_schedule": {
                    "السبت": "17:00",
                    "الثلاثاء": "14:00"
                },
                "session_duration": 60,
                "hourly_rate": 100.00,
                "notes": "طالب مجتهد",
                "subscriptions": [],
                "subscriptions_statistics": {
                    "total_subscriptions": 12,
                    "paid_subscriptions": 3,
                    "unpaid_subscriptions": 9,
                    "first_subscription_date": "2025-05-10",
                    "last_subscription_date": "2026-05-20",
                    "monthly_sessions": 8,
                    "total_sessions_count": 96,
                    "completed_sessions_count": 40,
                    "remaining_sessions_count": 56
                },
                "created_at": "2024-01-01 00:00:00"
            }
        ],
        "pagination": {
            "total": 75,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 5
        }
    }
}
```

**Error Response (401):**
```json
{
    "status": false,
    "number": "E401",
    "message": "Unauthorized"
}
```

---

### 2.2 Create Student
**POST** `/api/students`

**Description:** Add a new student. If subscription data is provided, sessions will be created automatically.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "name": "محمد أحمد",
    "email": "mohamed@example.com",
    "phone": "01012345678",
    "age": 15,
    "gender": "male",
    "package_id": 1,
    "teacher_id": 1,
    "hour": "10:00",
    "monthly_sessions": 8,
    "weekly_sessions": 2,
    "weekly_days": ["saturday", "tuesday"],
    "weekly_schedule": {
        "السبت": "17:00",
        "الثلاثاء": "14:00"
    },
    "session_duration": 60,
    "hourly_rate": 100.00,
    "notes": "طالب مجتهد",
    "password": "password123",
    "past_months_count": 7,
    "paid_months_count": 5,
    "subscription_start_date": "2025-05-10"
}
```

**Field Descriptions:**
- `name` (required): Student name
- `email` (optional, unique): Email address
- `phone` (required): Phone number
- `age` (optional): Age (1-120)
- `gender` (required): Gender (`male` or `female`)
- `package_id` (optional): Package ID
- `teacher_id` (optional): Teacher ID
- `hour` (optional): Default session time (format: HH:mm) - used if `weekly_schedule` is not provided
- `monthly_sessions` (optional): Number of monthly sessions
- `weekly_sessions` (optional): Number of weekly sessions
- `weekly_days` (optional): Days of the week (array: ["saturday", "tuesday"]) - used if `weekly_schedule` is not provided
- `weekly_schedule` (optional): Weekly schedule with specific times per day (JSON object: `{"السبت": "17:00", "الثلاثاء": "14:00"}`). Each day can have a specific time. This takes precedence over `hour` and `weekly_days`.
- `session_duration` (optional): Session duration in minutes
- `hourly_rate` (optional): Hourly rate for the teacher (numeric, min: 0)
- `notes` (optional): Notes
- `password` (optional): Password for student login (min: 6 characters). Password will be automatically hashed.
- `past_months_count` (optional): Number of past months to create subscriptions for (integer, min: 0, max: 120). If provided along with `subscription_start_date`, past subscriptions will be created with all sessions marked as completed but subscriptions marked as unpaid.
- `paid_months_count` (optional): Number of paid months (integer, min: 0, max: 120). The first N subscriptions (including past ones if applicable) will be marked as paid.
- `subscription_start_date` (optional): Subscription start date (YYYY-MM-DD). Required if `past_months_count` is provided. Used to calculate past subscriptions.

**Note:** 
- When a student is created from the dashboard, the `type` is automatically set to `admin`. If a student registered from the website is later modified by the administration, their `type` changes to `admin`.
- If `monthly_sessions` and `weekly_schedule` (or `weekly_days`) are provided, 12 subscriptions will be automatically created for a full year.
- If `past_months_count` and `subscription_start_date` are provided, past subscriptions will be created with all sessions marked as completed. These subscriptions will be marked as unpaid unless covered by `paid_months_count`.

**Success Response (200):**
```json
{
    "status": true,
    "message": "Student created successfully",
    "data": {
        "id": 1,
        "name": "محمد أحمد",
        "email": "mohamed@example.com",
        "phone": "01012345678",
        "age": 15,
        "gender": "male",
        "gender_label": "ذكر",
        "package": {
            "id": 1,
            "name": "الباقة الأساسية"
        },
        "package_id": 1,
        "teacher": {
            "id": 1,
            "name": "أحمد محمد",
            "specialization": "القرآن الكريم"
        },
        "teacher_id": 1,
        "hour": "10:00",
        "monthly_sessions": 8,
        "weekly_sessions": 8,
        "weekly_days": ["saturday", "tuesday"],
        "session_duration": 60,
        "hourly_rate": 100.00,
        "notes": "طالب مجتهد",
        "subscriptions": [],
        "subscriptions_statistics": {
            "total_subscriptions": 0,
            "paid_subscriptions": 0,
            "unpaid_subscriptions": 0
        },
        "created_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (422) - Validation Error:**
```json
{
    "status": false,
    "number": "E001",
    "message": "The name field is required."
}
```

**Error Response (422) - Email Already Exists:**
```json
{
    "status": false,
    "number": "E002",
    "message": "The email has already been taken."
}
```

---

### 2.3 Get Student
**GET** `/api/students/{id}`

**Description:** Get details of a specific student

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Student retrieved successfully",
    "data": {
        "id": 1,
        "name": "محمد أحمد",
        "email": "mohamed@example.com",
        "phone": "01012345678",
        "age": 15,
        "gender": "male",
        "gender_label": "ذكر",
        "package": {
            "id": 1,
            "name": "الباقة الأساسية"
        },
        "package_id": 1,
        "teacher": {
            "id": 1,
            "name": "أحمد محمد",
            "specialization": "القرآن الكريم"
        },
        "teacher_id": 1,
        "hour": "10:00",
        "monthly_sessions": 8,
        "weekly_sessions": 8,
        "weekly_days": ["saturday", "tuesday"],
        "session_duration": 60,
        "hourly_rate": 100.00,
        "notes": "طالب مجتهد",
        "subscriptions": [],
        "subscriptions_statistics": {
            "total_subscriptions": 19,
            "paid_subscriptions": 5,
            "unpaid_subscriptions": 14,
            "first_subscription_date": "2025-05-10",
            "last_subscription_date": "2026-05-20",
            "monthly_sessions": 8,
            "total_sessions_count": 152,
            "completed_sessions_count": 40,
            "remaining_sessions_count": 112
        },
        "created_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (404):**
```json
{
    "status": false,
    "number": "E404",
    "message": "Resource not found"
}
```

---

### 2.4 Update Student
**POST** `/api/students/{id}`

**Description:** Update student data. If subscription data is updated, incomplete future sessions will be recreated.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:** (all fields are optional)
```json
{
    "name": "محمد أحمد محمود",
    "age": 16,
    "teacher_id": 2,
    "hour": "14:00",
    "monthly_sessions": 12,
    "weekly_sessions": 6,
    "weekly_days": ["sunday", "wednesday"],
    "password": "newpassword123",
    "paid_subscriptions_count": 10
}
```

**Field Descriptions:**
- All fields from Create Student are available
- `password` (optional): New password for student login (min: 6 characters). Password will be automatically hashed.
- `paid_subscriptions_count` (optional): Number of paid subscriptions (integer, min: 0). When provided, the first N subscriptions (ordered by start_date, oldest first) will be marked as paid (`is_paid = true`), and the remaining subscriptions will be marked as unpaid (`is_paid = false`). This allows you to update payment status for multiple subscriptions at once.

**Success Response (200):**
```json
{
    "status": true,
    "message": "Student updated successfully",
    "data": {
        "id": 1,
        "name": "محمد أحمد محمود",
        "email": "mohamed@example.com",
        "phone": "01012345678",
        "age": 16,
        "gender": "male",
        "gender_label": "ذكر",
        "package": {
            "id": 1,
            "name": "الباقة الأساسية"
        },
        "package_id": 1,
        "teacher": {
            "id": 2,
            "name": "فاطمة علي",
            "specialization": "اللغة العربية"
        },
        "teacher_id": 2,
        "hour": "14:00",
        "monthly_sessions": 12,
        "weekly_sessions": 6,
        "weekly_days": ["sunday", "wednesday"],
        "session_duration": 60,
        "hourly_rate": 100.00,
        "notes": "طالب مجتهد",
        "subscriptions": [],
        "subscriptions_statistics": {
            "total_subscriptions": 19,
            "paid_subscriptions": 10,
            "unpaid_subscriptions": 9,
            "first_subscription_date": "2025-05-10",
            "last_subscription_date": "2026-05-20",
            "monthly_sessions": 12,
            "total_sessions_count": 228,
            "completed_sessions_count": 40,
            "remaining_sessions_count": 188
        },
        "created_at": "2024-01-01 00:00:00"
    }
}
```

**Note:** When `paid_subscriptions_count` is provided, the `subscriptions_statistics` in the response will reflect the updated payment status.

**Error Response (404):**
```json
{
    "status": false,
    "number": "E404",
    "message": "Resource not found"
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E030",
    "message": "The age must be at least 1."
}
```

---

### 2.5 Delete Student
**DELETE** `/api/students/{id}`

**Description:** Delete a student. All associated sessions will be deleted.

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Student deleted successfully"
}
```

**Error Response (404):**
```json
{
    "status": false,
    "number": "E404",
    "message": "Resource not found"
}
```

---

## 3. Student Sessions

### 3.1 List Sessions
**GET** `/api/student-sessions`

**Description:** Get list of sessions with filtering options

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `student_id` (optional) - Filter by student ID
- `teacher_id` (optional) - Filter by teacher ID
- `is_completed` (optional) - Filter by completion status: `true` or `false`
- `date_from` (optional) - Filter from date (YYYY-MM-DD)
- `date_to` (optional) - Filter to date (YYYY-MM-DD)
- `day_of_week` (optional) - Filter by day: `saturday`, `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Example Request:**
```
GET /api/student-sessions?student_id=1&is_completed=false&date_from=2024-01-01
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Sessions retrieved successfully",
    "data": {
        "sessions": [
            {
                "id": 1,
                "student": {
                    "id": 1,
                    "name": "محمد أحمد"
                },
                "student_id": 1,
                "teacher": {
                    "id": 1,
                    "name": "أحمد محمد"
                },
                "teacher_id": 1,
                "session_date": "2024-01-06",
                "session_time": "10:00",
                "day_of_week": "saturday",
                "day_of_week_label": "السبت",
                "is_completed": false,
                "completed_at": null,
                "notes": null,
                "created_at": "2024-01-01 00:00:00"
            }
        ],
        "pagination": {
            "total": 50,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 4
        }
    }
}
```

---

### 3.2 Create Session
**POST** `/api/student-sessions`

**Description:** Create a session manually (sessions are usually created automatically when adding/updating student subscription)

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "student_id": 1,
    "teacher_id": 1,
    "session_date": "2024-01-15",
    "session_time": "10:00",
    "day_of_week": "saturday",
    "notes": "حصة إضافية"
}
```

**Field Descriptions:**
- `student_id` (required): Student ID
- `teacher_id` (optional): Teacher ID
- `session_date` (required): Session date (YYYY-MM-DD)
- `session_time` (required): Session time (HH:mm)
- `day_of_week` (required): Day of the week (`saturday`, `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`)
- `notes` (optional): Notes

**Success Response (200):**
```json
{
    "status": true,
    "message": "Session created successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "teacher": {
            "id": 1,
            "name": "أحمد محمد"
        },
        "teacher_id": 1,
        "session_date": "2024-01-15",
        "session_time": "10:00",
        "day_of_week": "saturday",
        "day_of_week_label": "السبت",
        "is_completed": false,
        "completed_at": null,
        "notes": "حصة إضافية",
        "created_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E033",
    "message": "The student id field is required."
}
```

---

### 3.3 Get Session
**GET** `/api/student-sessions/{id}`

**Description:** Get details of a specific session

**Success Response (200):**
```json
{
    "status": true,
    "message": "Session retrieved successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "teacher": {
            "id": 1,
            "name": "أحمد محمد"
        },
        "teacher_id": 1,
        "session_date": "2024-01-15",
        "session_time": "10:00",
        "day_of_week": "saturday",
        "day_of_week_label": "السبت",
        "is_completed": false,
        "completed_at": null,
        "notes": null,
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 3.4 Update Session
**POST** `/api/student-sessions/{id}`

**Description:** Update session data. If `is_completed` is set to `true`, `completed_at` will be set automatically.

**Request Body:** (all fields are optional)
```json
{
    "session_date": "2024-01-16",
    "session_time": "11:00",
    "is_completed": true,
    "notes": "تمت الحصة بنجاح"
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Session updated successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "teacher": {
            "id": 1,
            "name": "أحمد محمد"
        },
        "teacher_id": 1,
        "session_date": "2024-01-16",
        "session_time": "11:00",
        "day_of_week": "saturday",
        "day_of_week_label": "السبت",
        "is_completed": true,
        "completed_at": "2024-01-16 11:30:00",
        "notes": "تمت الحصة بنجاح",
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 3.5 Mark Session as Completed
**POST** `/api/student-sessions/{session}/complete`

**Description:** Mark session as completed. Automatically sets `is_completed` and `completed_at`.

**Request Body:**
```json
{
    "notes": "حصة ممتازة"
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Session marked as completed successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "teacher": {
            "id": 1,
            "name": "أحمد محمد"
        },
        "teacher_id": 1,
        "session_date": "2024-01-15",
        "session_time": "10:00",
        "day_of_week": "saturday",
        "day_of_week_label": "السبت",
        "is_completed": true,
        "completed_at": "2024-01-15 10:30:00",
        "notes": "حصة ممتازة",
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 3.6 Delete Session
**DELETE** `/api/student-sessions/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Session deleted successfully"
}
```

---

## 4. Teachers

### 4.1 List Teachers
**GET** `/api/teachers`

**Description:** Get list of teachers

**Query Parameters:**
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Success Response (200):**
```json
{
    "status": true,
    "message": "Teachers retrieved successfully",
    "data": {
        "teachers": [
            {
                "id": 1,
                "name": "أحمد محمد",
                "name_ar": "أحمد محمد",
                "name_en": "Ahmed Mohamed",
                "specialization": "القرآن الكريم",
                "specialization_ar": "القرآن الكريم",
                "specialization_en": "Holy Quran",
                "experience_years": 10,
                "image": "http://domain.com/Admin/images/teachers/1234567890_abc123.jpg",
                "created_at": "2024-01-01 00:00:00"
            }
        ],
        "pagination": {
            "total": 20,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 2
        }
    }
}
```

---

### 4.2 Create Teacher
**POST** `/api/teachers`

**Request Body:**
```json
{
    "name": "أحمد محمد",
    "name_en": "Ahmed Mohamed",
    "specialization": "القرآن الكريم",
    "specialization_en": "Holy Quran",
    "experience_years": 10,
    "image": "file",
    "phone": "01012345678",
    "email": "ahmed@example.com",
    "password": "password123"
}
```

**Request Type:** `multipart/form-data` (for image upload)

**Field Descriptions:**
- `name` (required): Name in Arabic
- `name_en` (optional): Name in English
- `specialization` (required): Specialization in Arabic
- `specialization_en` (optional): Specialization in English
- `experience_years` (required): Years of experience (min: 0)
- `image` (optional): Teacher profile image (image file: jpeg, png, jpg, gif, max: 5MB)
- `phone` (optional): Phone number for teacher login
- `email` (optional): Email address for teacher account
- `password` (optional): Password for teacher login (min: 6 characters). If provided along with `phone` or `email`, a User account will be automatically created/updated for the teacher. Password will be automatically hashed.

**Success Response (200):**
```json
{
    "status": true,
    "message": "Teacher created successfully",
    "data": {
        "id": 1,
        "name": "أحمد محمد",
        "name_ar": "أحمد محمد",
        "name_en": "Ahmed Mohamed",
        "specialization": "القرآن الكريم",
        "specialization_ar": "القرآن الكريم",
        "specialization_en": "Holy Quran",
        "experience_years": 10,
        "image": "http://domain.com/Admin/images/teachers/1234567890_abc123.jpg",
        "created_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E001",
    "message": "The name field is required."
}
```

---

### 4.3 Get Teacher
**GET** `/api/teachers/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "message": "Teacher retrieved successfully",
    "data": {
        "id": 1,
        "name": "أحمد محمد",
        "name_ar": "أحمد محمد",
        "name_en": "Ahmed Mohamed",
        "specialization": "القرآن الكريم",
        "specialization_ar": "القرآن الكريم",
        "specialization_en": "Holy Quran",
        "experience_years": 10,
        "image": "http://domain.com/Admin/images/teachers/1234567890_abc123.jpg",
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 4.4 Update Teacher
**POST** `/api/teachers/{id}`

**Request Body:** (all fields are optional)
```json
{
    "name": "أحمد محمد محمود",
    "specialization": "القرآن الكريم والتجويد",
    "experience_years": 12,
    "image": "file",
    "phone": "01012345678",
    "email": "ahmed@example.com",
    "password": "newpassword123"
}
```

**Request Type:** `multipart/form-data` (for image upload)

**Field Descriptions:**
- `name` (optional): Name in Arabic
- `name_en` (optional): Name in English
- `specialization` (optional): Specialization in Arabic
- `specialization_en` (optional): Specialization in English
- `experience_years` (optional): Years of experience (min: 0)
- `image` (optional): Teacher profile image (image file: jpeg, png, jpg, gif, max: 5MB)
- `phone` (optional): Phone number for teacher login. If provided, the associated User account will be updated or created.
- `email` (optional): Email address for teacher account. If provided, the associated User account will be updated or created.
- `password` (optional): New password for teacher login (min: 6 characters). If provided along with `phone` or `email`, the associated User account will be updated or created. Password will be automatically hashed.

**Success Response (200):**
```json
{
    "status": true,
    "message": "Teacher updated successfully",
    "data": {
        "id": 1,
        "name": "أحمد محمد محمود",
        "name_ar": "أحمد محمد محمود",
        "name_en": "Ahmed Mohamed",
        "specialization": "القرآن الكريم والتجويد",
        "specialization_ar": "القرآن الكريم والتجويد",
        "specialization_en": "Holy Quran",
        "experience_years": 12,
        "image": "http://domain.com/Admin/images/teachers/1234567890_abc123.jpg",
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 4.5 Delete Teacher
**DELETE** `/api/teachers/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Teacher deleted successfully"
}
```

---

## 5. Packages

### 5.1 List Packages
**GET** `/api/packages`

**Query Parameters:**
- `is_popular` (optional) - Filter popular packages: `true` or `false`
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Success Response (200):**
```json
{
    "status": true,
    "message": "Packages retrieved successfully",
    "data": {
        "packages": [
            {
                "id": 1,
                "name": "الباقة الأساسية",
                "name_ar": "الباقة الأساسية",
                "name_en": "Basic Package",
                "price": 500.00,
                "price_ar": "500 جنيه",
                "price_en": "500 EGP",
                "price_label": "500 جنيه",
                "features": [
                    "3 حصص أسبوعياً",
                    "متابعة دورية",
                    "شهادة إتمام"
                ],
                "features_ar": [
                    "3 حصص أسبوعياً",
                    "متابعة دورية",
                    "شهادة إتمام"
                ],
                "features_en": [
                    "3 sessions per week",
                    "Regular follow-up",
                    "Completion certificate"
                ],
                "is_popular": false,
                "students_count": 5,
                "created_at": "2024-01-01 00:00:00"
            }
        ],
        "pagination": {
            "total": 10,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 1
        }
    }
}
```

---

### 5.2 Create Package
**POST** `/api/packages`

**Request Body:**
```json
{
    "name": "الباقة الأساسية",
    "name_en": "Basic Package",
    "price": 500.00,
    "price_ar": "500 جنيه",
    "price_en": "500 EGP",
    "features": [
        "3 حصص أسبوعياً",
        "متابعة دورية",
        "شهادة إتمام"
    ],
    "features_en": [
        "3 sessions per week",
        "Regular follow-up",
        "Completion certificate"
    ],
    "is_popular": false
}
```

**Field Descriptions:**
- `name` (required): Package name in Arabic
- `name_en` (optional): Package name in English
- `price` (required): Price (numeric, min: 0)
- `price_ar` (optional): Price in Arabic (text, example: "500 EGP")
- `price_en` (optional): Price in English (text, example: "500 EGP")
- `features` (required): List of features in Arabic (array)
- `features_en` (optional): List of features in English (array)
- `is_popular` (optional): Is package popular (boolean, default: false)

**Success Response (200):**
```json
{
    "status": true,
    "message": "Package created successfully",
    "data": {
        "id": 1,
        "name": "الباقة الأساسية",
        "name_ar": "الباقة الأساسية",
        "name_en": "Basic Package",
        "price": 500.00,
        "price_ar": "500 جنيه",
        "price_en": "500 EGP",
        "price_label": "500 جنيه",
        "features": [
            "3 حصص أسبوعياً",
            "متابعة دورية",
            "شهادة إتمام"
        ],
        "features_ar": [
            "3 حصص أسبوعياً",
            "متابعة دورية",
            "شهادة إتمام"
        ],
        "features_en": [
            "3 sessions per week",
            "Regular follow-up",
            "Completion certificate"
        ],
        "is_popular": false,
        "students_count": null,
        "created_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E044",
    "message": "The price field is required."
}
```

---

### 5.3 Get Package
**GET** `/api/packages/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "message": "Package retrieved successfully",
    "data": {
        "id": 1,
        "name": "الباقة الأساسية",
        "name_ar": "الباقة الأساسية",
        "name_en": "Basic Package",
        "price": 500.00,
        "price_ar": "500 جنيه",
        "price_en": "500 EGP",
        "price_label": "500 جنيه",
        "features": [
            "3 حصص أسبوعياً",
            "متابعة دورية",
            "شهادة إتمام"
        ],
        "features_ar": [
            "3 حصص أسبوعياً",
            "متابعة دورية",
            "شهادة إتمام"
        ],
        "features_en": [
            "3 sessions per week",
            "Regular follow-up",
            "Completion certificate"
        ],
        "is_popular": false,
        "students_count": 5,
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 5.4 Update Package
**POST** `/api/packages/{id}`

**Request Body:** (all fields are optional)
```json
{
    "price": 600.00,
    "is_popular": true
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Package updated successfully",
    "data": {
        "id": 1,
        "name": "الباقة الأساسية",
        "name_ar": "الباقة الأساسية",
        "name_en": "Basic Package",
        "price": 600.00,
        "price_ar": "600 جنيه",
        "price_en": "600 EGP",
        "price_label": "600 جنيه",
        "features": [
            "3 حصص أسبوعياً",
            "متابعة دورية",
            "شهادة إتمام"
        ],
        "features_ar": [...],
        "features_en": [...],
        "is_popular": true,
        "students_count": 5,
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 5.5 Delete Package
**DELETE** `/api/packages/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Package deleted successfully"
}
```

---

## 6. Student Reviews

### 6.1 List Reviews
**GET** `/api/reviews`

**Query Parameters:**
- `type` (optional) - Filter by type: `review` or `rating`
- `rating` (optional) - Filter by rating: 1, 2, 3, 4, or 5
- `package_id` (optional) - Filter by package ID
- `student_id` (optional) - Filter by student ID
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Success Response (200):**
```json
{
    "status": true,
    "message": "Reviews retrieved successfully",
    "data": {
        "reviews": [
            {
                "id": 1,
                "type": "review",
                "student": {
                    "id": 1,
                    "name": "محمد أحمد"
                },
                "student_id": 1,
                "package": {
                    "id": 1,
                    "name": "الباقة الأساسية"
                },
                "package_id": 1,
                "rating": 5,
                "review": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
                "review_ar": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
                "review_en": "Great experience, professional teachers and excellent curriculum",
                "media_file": "http://domain.com/Admin/images/review-media/1234567890_abc123.jpg",
                "created_at": "2024-01-01 00:00:00"
            }
        ],
        "pagination": {
            "total": 30,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 2
        }
    }
}
```

---

### 6.2 Create Review
**POST** `/api/reviews`

**Request Type:** `multipart/form-data` (for media file upload)

**Request Body:**
```json
{
    "type": "review",
    "student_id": 1,
    "package_id": 1,
    "rating": 5,
    "review": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
    "review_en": "Great experience, professional teachers and excellent curriculum",
    "media_file": "file"
}
```

**Field Descriptions:**
- `type` (optional): Type of entry - `review` (default) or `rating`
- `student_id` (optional): Student ID (nullable for public ratings)
- `package_id` (optional): Package ID (nullable)
- `rating` (required): Rating from 1 to 5
- `review` (required): Review in Arabic
- `review_en` (optional): Review in English
- `media_file` (optional): Media file (image or video) - file upload (jpeg, png, jpg, gif, mp4, mov, max: 10MB)

**Success Response (200):**
```json
{
    "status": true,
    "message": "Review created successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "package": {
            "id": 1,
            "name": "الباقة الأساسية"
        },
        "package_id": 1,
        "rating": 5,
        "review": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
        "review_ar": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
        "review_en": "Great experience, professional teachers and excellent curriculum",
        "media_file": "http://domain.com/Admin/images/review-media/1234567890_abc123.jpg",
        "created_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E034",
    "message": "The rating must be between 1 and 5."
}
```

---

### 6.3 Get Review
**GET** `/api/reviews/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "message": "Review retrieved successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "package": {
            "id": 1,
            "name": "الباقة الأساسية"
        },
                "package_id": 1,
                "rating": 5,
                "review": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
                "review_ar": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
                "review_en": "Great experience, professional teachers and excellent curriculum",
                "media_file": "http://domain.com/Admin/images/review-media/1234567890_abc123.jpg",
                "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 6.4 Update Review
**POST** `/api/reviews/{id}`

**Request Body:** (all fields are optional)
```json
{
    "rating": 4,
    "review": "تجربة جيدة"
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Review updated successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "package": {
            "id": 1,
            "name": "الباقة الأساسية"
        },
        "package_id": 1,
        "rating": 4,
        "review": "تجربة جيدة",
        "review_ar": "تجربة جيدة",
        "review_en": "Great experience, professional teachers and excellent curriculum",
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 6.5 Delete Review
**DELETE** `/api/reviews/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Review deleted successfully"
}
```

---

## 7. Teacher Salary & Payments

### 7.1 Get Teacher Salary Calculation
**GET** `/api/teachers/{teacher}/salary`

**Description:** Get teacher salary calculation for a specific month. Displays all students assigned to the teacher with completed sessions count and financial value for each student, plus the total.

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `month` (required) - Month in YYYY-MM format (example: 2024-01)

**Example Request:**
```
GET /api/teachers/1/salary?month=2024-01
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Salary calculation retrieved successfully",
    "data": {
        "teacher": {
            "id": 1,
            "name": "أحمد محمد",
            "name_en": "Ahmed Mohamed",
            "specialization": "القرآن الكريم"
        },
        "month": "2024-01",
        "students": [
            {
                "id": 1,
                "name": "محمد أحمد",
                "email": "mohamed@example.com",
                "phone": "01012345678",
                "sessions_count": 8,
                "total_hours": 8.0,
                "hourly_rate": 100.00,
                "total_amount": 800.00
            },
            {
                "id": 2,
                "name": "سارة محمود",
                "email": "sara@example.com",
                "phone": "01087654321",
                "sessions_count": 6,
                "total_hours": 4.5,
                "hourly_rate": 120.00,
                "total_amount": 540.00
            }
        ],
        "summary": {
            "total_students": 2,
            "total_sessions": 14,
            "total_hours": 12.5,
            "total_amount": 1340.00
        },
        "payment": {
            "id": 1,
            "teacher_id": 1,
            "month": "2024-01",
            "total_amount": 1340.00,
            "is_paid": true,
            "payment_proof_image": "https://example.com/payment-proof.jpg",
            "paid_at": "2024-01-15T10:30:00.000000Z",
            "notes": "تم التحويل بنجاح",
            "created_at": "2024-01-15 10:30:00"
        }
    }
}
```

**Note:** If payment has not been recorded yet, `payment` will be `null`.

**Error Response (422):**
```json
{
    "status": false,
    "number": "E052",
    "message": "The month field is required."
}
```

---

### 7.2 Mark Payment as Paid
**POST** `/api/teachers/{teacher}/salary/pay`

**Description:** Record teacher salary payment for a specific month. Amount is calculated automatically if not specified.

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Request Type:** `multipart/form-data` (for payment proof image upload)

**Request Body:**
```json
{
    "month": "2024-01",
    "payment_proof_image": "file",
    "notes": "تم التحويل بنجاح"
}
```

**Field Descriptions:**
- `month` (required): Month in YYYY-MM format
- `payment_proof_image` (required): Payment proof image file (image file: jpeg, png, jpg, gif, max: 5MB)
- `notes` (optional): Notes

**Success Response (200):**
```json
{
    "status": true,
    "message": "Payment recorded successfully",
    "data": {
        "id": 1,
        "teacher": {
            "id": 1,
            "name": "أحمد محمد",
            "name_en": "Ahmed Mohamed"
        },
        "teacher_id": 1,
        "month": "2024-01",
        "total_amount": 1340.00,
        "is_paid": true,
        "payment_proof_image": "https://example.com/payment-proof.jpg",
        "paid_at": "2024-01-15T10:30:00.000000Z",
        "notes": "تم التحويل بنجاح",
        "created_at": "2024-01-15 10:30:00"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E053",
    "message": "The payment proof image field is required."
}
```

---

### 7.3 Get Teacher Payments History
**GET** `/api/teachers/{teacher}/payments`

**Description:** Get all payment records for a teacher with pagination.

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Success Response (200):**
```json
{
    "status": true,
    "message": "Payment history retrieved successfully",
    "data": {
        "payments": [
            {
                "id": 1,
                "teacher": {
                    "id": 1,
                    "name": "أحمد محمد",
                    "name_en": "Ahmed Mohamed"
                },
                "teacher_id": 1,
                "month": "2024-01",
                "total_amount": 1340.00,
                "is_paid": true,
                "payment_proof_image": "https://example.com/payment-proof.jpg",
                "paid_at": "2024-01-15T10:30:00.000000Z",
                "notes": "تم التحويل بنجاح",
                "created_at": "2024-01-15 10:30:00"
            }
        ],
        "pagination": {
            "total": 5,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 1
        }
    }
}
```

---

## 8. Honor Boards

### 8.1 List Honor Boards
**GET** `/api/honor-boards`

**Query Parameters:**
- `student_id` (optional) - Filter by student ID
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Success Response (200):**
```json
{
    "status": true,
    "message": "Honor boards retrieved successfully",
    "data": {
        "honor_boards": [
            {
                "id": 1,
                "student": {
                    "id": 1,
                    "name": "محمد أحمد"
                },
                "student_id": 1,
                "level": "المستوى المتقدم",
                "level_ar": "المستوى المتقدم",
                "level_en": "Advanced Level",
                "achievement": "إتمام حفظ القرآن الكريم كاملاً",
                "achievement_ar": "إتمام حفظ القرآن الكريم كاملاً",
                "achievement_en": "Complete memorization of the Holy Quran",
                "certificate_images": [
                    "https://example.com/certificates/cert1.jpg",
                    "https://example.com/certificates/cert2.jpg"
                ],
                "created_at": "2024-01-01 00:00:00"
            }
        ],
        "pagination": {
            "total": 25,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 2
        }
    }
}
```

---

### 8.2 Create Honor Board Entry
**POST** `/api/honor-boards`

**Request Type:** `multipart/form-data` (for certificate images upload)

**Request Body:**
```json
{
    "student_id": 1,
    "level": "المستوى المتقدم",
    "level_en": "Advanced Level",
    "achievement": "إتمام حفظ القرآن الكريم كاملاً",
    "achievement_en": "Complete memorization of the Holy Quran",
    "certificate_images": ["file1", "file2"]
}
```

**Field Descriptions:**
- `student_id` (required): Student ID
- `level` (required): Level in Arabic
- `level_en` (optional): Level in English
- `achievement` (required): Achievement in Arabic
- `achievement_en` (optional): Achievement in English
- `certificate_images` (required): Array of certificate image files (image files: jpeg, png, jpg, gif, max: 5MB each)

**Success Response (200):**
```json
{
    "status": true,
    "message": "Honor board entry created successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "level": "المستوى المتقدم",
        "level_ar": "المستوى المتقدم",
        "level_en": "Advanced Level",
        "achievement": "إتمام حفظ القرآن الكريم كاملاً",
        "achievement_ar": "إتمام حفظ القرآن الكريم كاملاً",
        "achievement_en": "Complete memorization of the Holy Quran",
        "certificate_images": [
            "https://example.com/certificates/cert1.jpg",
            "https://example.com/certificates/cert2.jpg"
        ],
        "created_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E041",
    "message": "The certificate images field is required."
}
```

---

### 8.3 Get Honor Board Entry
**GET** `/api/honor-boards/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "message": "Honor board entry retrieved successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "level": "المستوى المتقدم",
        "level_ar": "المستوى المتقدم",
        "level_en": "Advanced Level",
        "achievement": "إتمام حفظ القرآن الكريم كاملاً",
        "achievement_ar": "إتمام حفظ القرآن الكريم كاملاً",
        "achievement_en": "Complete memorization of the Holy Quran",
        "certificate_images": [
            "https://example.com/certificates/cert1.jpg",
            "https://example.com/certificates/cert2.jpg"
        ],
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 8.4 Update Honor Board Entry
**POST** `/api/honor-boards/{id}`

**Request Type:** `multipart/form-data` (for certificate images upload)

**Request Body:** (all fields are optional)
```json
{
    "level": "المستوى المتقدم جداً",
    "achievement": "حفظ 20 جزء من القرآن الكريم",
    "certificate_images": ["file1", "file2"]
}
```

**Field Descriptions:**
- `level` (optional): Level in Arabic
- `level_en` (optional): Level in English
- `achievement` (optional): Achievement in Arabic
- `achievement_en` (optional): Achievement in English
- `certificate_images` (optional): Array of certificate image files (image files: jpeg, png, jpg, gif, max: 5MB each)

**Success Response (200):**
```json
{
    "status": true,
    "message": "Honor board entry updated successfully",
    "data": {
        "id": 1,
        "student": {
            "id": 1,
            "name": "محمد أحمد"
        },
        "student_id": 1,
        "level": "المستوى المتقدم جداً",
        "level_ar": "المستوى المتقدم جداً",
        "level_en": "Advanced Level",
        "achievement": "حفظ 20 جزء من القرآن الكريم",
        "achievement_ar": "حفظ 20 جزء من القرآن الكريم",
        "achievement_en": "Complete memorization of the Holy Quran",
        "certificate_images": [
            "https://example.com/certificates/cert1.jpg",
            "https://example.com/certificates/cert2.jpg"
        ],
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 8.5 Delete Honor Board Entry
**DELETE** `/api/honor-boards/{id}`

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Honor board entry deleted successfully"
}
```

---

## 9. Student Subscriptions

### 9.1 Get Student Subscriptions
**GET** `/api/students/{student}/subscriptions`

**Description:** Get all subscriptions for a specific student with statistics

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Subscriptions retrieved successfully",
    "data": {
        "subscriptions": [
            {
                "id": 1,
                "student_id": 1,
                "subscription_code": "SUB-1-202401-01",
                "start_date": "2024-01-01",
                "end_date": "2024-02-05",
                "sessions_per_week": 2,
                "total_sessions": 8,
                "completed_sessions_count": 8,
                "remaining_sessions_count": 0,
                "is_paid": true,
                "payment_receipt_image": "http://domain.com/Admin/images/subscription-receipts/1234567890_abc123.jpg",
                "is_active": false,
                "is_upcoming": false,
                "is_expired": true,
                "notification_sent": true,
                "notification_sent_at": "2024-02-01 10:30:00",
                "created_at": "2024-01-01 00:00:00",
                "updated_at": "2024-01-01 00:00:00"
            }
        ],
        "statistics": {
            "total": 12,
            "expired_unpaid": 2,
            "expired_paid": 1,
            "upcoming_count": 9
        },
        "upcoming": [
            {
                "id": 2,
                "student_id": 1,
                "subscription_code": "SUB-1-202402-02",
                "start_date": "2024-02-05",
                "end_date": "2024-03-12",
                "sessions_per_week": 2,
                "total_sessions": 8,
                "completed_sessions_count": 0,
                "remaining_sessions_count": 8,
                "is_paid": false,
                "payment_receipt_image": null,
                "is_active": false,
                "is_upcoming": true,
                "is_expired": false,
                "notification_sent": false,
                "notification_sent_at": null,
                "created_at": "2024-01-01 00:00:00",
                "updated_at": "2024-01-01 00:00:00"
            }
        ]
    }
}
```

---

### 9.2 Get Subscription Details
**GET** `/api/student-subscriptions/{subscription}/details`

**Description:** Get details of a specific subscription including all associated sessions

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Subscription details retrieved successfully",
    "data": {
        "subscription": {
            "id": 1,
            "student_id": 1,
            "subscription_code": "SUB-1-202401-01",
            "start_date": "2024-01-01",
            "end_date": "2024-02-05",
            "sessions_per_week": 2,
            "total_sessions": 8,
            "completed_sessions_count": 6,
            "remaining_sessions_count": 2,
            "is_paid": true,
            "payment_receipt_image": "http://domain.com/Admin/images/subscription-receipts/1234567890_abc123.jpg",
            "is_active": false,
            "is_upcoming": false,
            "is_expired": false,
            "notification_sent": false,
            "notification_sent_at": null,
            "created_at": "2024-01-01 00:00:00",
            "updated_at": "2024-01-01 00:00:00"
        },
        "sessions": [
            {
                "id": 1,
                "student_id": 1,
                "teacher_id": 1,
                "session_date": "2024-01-06",
                "session_time": "17:00",
                "day_of_week": "saturday",
                "day_of_week_label": "السبت",
                "is_completed": true,
                "completed_at": "2024-01-06 17:30:00",
                "status": "completed",
                "status_label": "مكتملة",
                "new_date": null,
                "new_time": null,
                "reason": null,
                "notes": null,
                "created_at": "2024-01-01 00:00:00"
            }
        ],
        "statistics": {
            "total_sessions": 8,
            "completed_sessions": 6,
            "pending_sessions": 1,
            "canceled_sessions": 0,
            "postponed_sessions": 1
        }
    }
}
```

---

### 9.3 Create Student Subscription
**POST** `/api/student-subscriptions`

**Description:** Create a subscription for a student. This will automatically create 12 subscriptions (for a year) for the same student. Each subscription contains a number of sessions equal to the student's `monthly_sessions`. The subscription end date is calculated dynamically based on the number of sessions and sessions per week. Sessions are automatically generated based on the student's weekly schedule. The `sessions_per_week` is derived from the student's `weekly_schedule` or `weekly_days` and `hour` fields.

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Request Type:** `multipart/form-data` (for payment receipt image upload)

**Request Body:**
```json
{
    "student_id": 1,
    "start_date": "2024-01-01",
    "is_paid": true,
    "payment_receipt_image": "file"
}
```

**Field Descriptions:**
- `student_id` (required): Student ID
- `start_date` (required): Subscription start date (YYYY-MM-DD, must be today or later)
- `is_paid` (optional): Payment status (boolean, default: false)
- `payment_receipt_image` (optional): Payment receipt image file (image file: jpeg, png, jpg, gif, max: 5MB)

**Note:** 
- Subscriptions are based on the number of sessions, not fixed calendar months
- Each subscription contains `monthly_sessions` number of sessions (e.g., 8 sessions)
- The subscription `end_date` is calculated dynamically: `start_date + (total_sessions / sessions_per_week) weeks + buffer`
- When a subscription is created, 12 future subscriptions are automatically created for the same student
- All future subscriptions are initially marked as unpaid
- Sessions are generated automatically for the first paid subscription based on the student's weekly schedule
- The `sessions_per_week` is automatically calculated from the student's `weekly_schedule` or `weekly_days` and `hour` fields
- A subscription expires when all its sessions are completed (not based on end date)
- When a subscription expires (all sessions completed), a notification is automatically sent to the student

**Success Response (200):**
```json
{
    "status": true,
    "message": "Subscriptions created successfully",
    "data": {
        "subscriptions": [
            {
                "id": 1,
                "student_id": 1,
                "subscription_code": "SUB-1-202401-01",
                "start_date": "2024-01-01",
                "end_date": "2024-02-05",
                "sessions_per_week": 2,
                "total_sessions": 8,
                "completed_sessions_count": 0,
                "remaining_sessions_count": 8,
                "is_paid": true,
                "payment_receipt_image": "http://domain.com/Admin/images/subscription-receipts/1234567890_abc123.jpg",
                "is_active": true,
                "is_upcoming": false,
                "is_expired": false,
                "notification_sent": false,
                "notification_sent_at": null,
                "created_at": "2024-01-01 00:00:00",
                "updated_at": "2024-01-01 00:00:00"
            }
        ],
        "message": "تم إنشاء 12 اشتراك شهري بنجاح"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E400",
    "message": "Student has no weekly schedule defined"
}
```

---

### 9.4 Update Student Subscription
**POST** `/api/student-subscriptions/{id}`

**Description:** Update a student subscription. If the subscription is marked as paid and sessions haven't been generated yet, they will be created automatically.

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Request Type:** `multipart/form-data` (for payment receipt image upload)

**Request Body:** (all fields are optional)
```json
{
    "start_date": "2024-01-05",
    "is_paid": true,
    "payment_receipt_image": "file"
}
```

**Field Descriptions:**
- `start_date` (optional): Subscription start date (YYYY-MM-DD). If updated, the `end_date` will be recalculated automatically based on `total_sessions` and `sessions_per_week`.
- `is_paid` (optional): Payment status (boolean). When set to `true`, if sessions haven't been generated yet for this subscription, they will be created automatically based on the student's weekly schedule.
- `payment_receipt_image` (optional): Payment receipt image file (image file: jpeg, png, jpg, gif, max: 5MB)

**Note:** This endpoint allows you to update individual subscription payment status. To update payment status for multiple subscriptions at once, use the Update Student endpoint with `paid_subscriptions_count` field.

**Success Response (200):**
```json
{
    "status": true,
    "message": "Subscription updated successfully",
    "data": {
        "id": 1,
        "student_id": 1,
        "subscription_code": "SUB-1-202401-01",
        "start_date": "2024-01-05",
        "end_date": "2024-02-09",
        "sessions_per_week": 2,
        "total_sessions": 8,
        "completed_sessions_count": 0,
        "remaining_sessions_count": 8,
        "is_paid": true,
        "payment_receipt_image": "http://domain.com/Admin/images/subscription-receipts/1234567890_abc123.jpg",
        "is_active": true,
        "is_upcoming": false,
        "is_expired": false,
        "notification_sent": false,
        "notification_sent_at": null,
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-05 10:30:00"
    }
}
```

---

### 9.5 Delete Student Subscription
**DELETE** `/api/student-subscriptions/{id}`

**Description:** Delete a student subscription

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Subscription deleted successfully"
}
```

---

## 10. Features

### 10.1 List Features
**GET** `/api/features`

**Description:** Get list of features

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `is_active` (optional) - Filter by active status: `true` or `false`
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Example Request:**
```
GET /api/features?is_active=true&per_page=10
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Features retrieved successfully",
    "data": {
        "features": [
            {
                "id": 1,
                "title": "معلمون مؤهلون",
                "title_ar": "معلمون مؤهلون",
                "title_en": "Qualified Teachers",
                "description": "معلمونا مؤهلون وذوو خبرة في تدريس القرآن الكريم",
                "description_ar": "معلمونا مؤهلون وذوو خبرة في تدريس القرآن الكريم",
                "description_en": "Our teachers are highly qualified and experienced in teaching the Holy Quran",
                "icon": "teacher",
                "order": 1,
                "is_active": true,
                "created_at": "2024-01-01 00:00:00",
                "updated_at": "2024-01-01 00:00:00"
            }
        ],
        "pagination": {
            "total": 6,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 1
        }
    }
}
```

**Error Response (401):**
```json
{
    "status": false,
    "number": "E401",
    "message": "Unauthorized"
}
```

---

### 10.2 Create Feature
**POST** `/api/features`

**Description:** Add a new feature

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "title": "معلمون مؤهلون",
    "title_en": "Qualified Teachers",
    "description": "معلمونا مؤهلون وذوو خبرة في تدريس القرآن الكريم",
    "description_en": "Our teachers are highly qualified and experienced in teaching the Holy Quran",
    "icon": "teacher",
    "order": 1,
    "is_active": true
}
```

**Field Descriptions:**
- `title` (required): Title in Arabic
- `title_en` (optional): Title in English
- `description` (required): Description in Arabic
- `description_en` (optional): Description in English
- `icon` (optional): Icon name
- `order` (optional): Display order (integer, min: 0, default: 0)
- `is_active` (optional): Is feature active (boolean, default: true)

**Success Response (200):**
```json
{
    "status": true,
    "message": "Feature created successfully",
    "data": {
        "id": 1,
        "title": "معلمون مؤهلون",
        "title_ar": "معلمون مؤهلون",
        "title_en": "Qualified Teachers",
        "description": "معلمونا مؤهلون وذوو خبرة في تدريس القرآن الكريم",
        "description_ar": "معلمونا مؤهلون وذوو خبرة في تدريس القرآن الكريم",
        "description_en": "Our teachers are highly qualified and experienced in teaching the Holy Quran",
        "icon": "teacher",
        "order": 1,
        "is_active": true,
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E001",
    "message": "The title field is required."
}
```

---

### 10.3 Get Feature
**GET** `/api/features/{id}`

**Description:** Get details of a specific feature

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Feature data retrieved successfully",
    "data": {
        "id": 1,
        "title": "معلمون مؤهلون",
        "title_ar": "معلمون مؤهلون",
        "title_en": "Qualified Teachers",
        "description": "معلمونا مؤهلون وذوو خبرة في تدريس القرآن الكريم",
        "description_ar": "معلمونا مؤهلون وذوو خبرة في تدريس القرآن الكريم",
        "description_en": "Our teachers are highly qualified and experienced in teaching the Holy Quran",
        "icon": "teacher",
        "order": 1,
        "is_active": true,
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (404):**
```json
{
    "status": false,
    "number": "E404",
    "message": "Resource not found"
}
```

---

### 10.4 Update Feature
**POST** `/api/features/{id}`

**Description:** Update feature data

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:** (all fields are optional)
```json
{
    "title": "معلمون مؤهلون ومحترفون",
    "description": "معلمونا مؤهلون وذوو خبرة عالية في تدريس القرآن الكريم",
    "order": 2,
    "is_active": true
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Feature data updated successfully",
    "data": {
        "id": 1,
        "title": "معلمون مؤهلون ومحترفون",
        "title_ar": "معلمون مؤهلون ومحترفون",
        "title_en": "Qualified Teachers",
        "description": "معلمونا مؤهلون وذوو خبرة عالية في تدريس القرآن الكريم",
        "description_ar": "معلمونا مؤهلون وذوو خبرة عالية في تدريس القرآن الكريم",
        "description_en": "Our teachers are highly qualified and experienced in teaching the Holy Quran",
        "icon": "teacher",
        "order": 2,
        "is_active": true,
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-15 10:30:00"
    }
}
```

**Error Response (404):**
```json
{
    "status": false,
    "number": "E404",
    "message": "Resource not found"
}
```

---

### 10.5 Delete Feature
**DELETE** `/api/features/{id}`

**Description:** Delete a feature

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Feature deleted successfully"
}
```

**Error Response (404):**
```json
{
    "status": false,
    "number": "E404",
    "message": "Resource not found"
}
```

---

## 11. Lessons (جزء من حصصنا / دروسنا)

### 11.1 List Lessons
**GET** `/api/dashboard/lessons`

**Description:** Get list of lessons with pagination

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Example Request:**
```
GET /api/dashboard/lessons?per_page=10&page=1
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Lessons retrieved successfully",
    "data": {
        "lessons": [
            {
                "id": 1,
                "title": "درس في التجويد",
                "title_ar": "درس في التجويد",
                "title_en": "Tajweed Lesson",
                "localized_title": "درس في التجويد",
                "description": "شرح مفصل لأحكام التجويد",
                "description_ar": "شرح مفصل لأحكام التجويد",
                "description_en": "Detailed explanation of Tajweed rules",
                "localized_description": "شرح مفصل لأحكام التجويد",
                "video": "http://domain.com/Admin/images/lessons/1234567890_abc123.mp4",
                "created_at": "2024-01-01 00:00:00",
                "updated_at": "2024-01-01 00:00:00"
            }
        ],
        "pagination": {
            "total": 20,
            "per_page": 15,
            "current_page": 1,
            "total_pages": 2
        }
    }
}
```

---

### 11.2 Create Lesson
**POST** `/api/dashboard/lessons`

**Description:** Create a new lesson

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Request Type:** `multipart/form-data` (for video upload)

**Request Body:**
```json
{
    "title": "درس في التجويد",
    "title_en": "Tajweed Lesson",
    "description": "شرح مفصل لأحكام التجويد",
    "description_en": "Detailed explanation of Tajweed rules",
    "video": "file"
}
```

**Field Descriptions:**
- `title` (required): Lesson title in Arabic
- `title_en` (optional): Lesson title in English
- `description` (required): Lesson description in Arabic
- `description_en` (optional): Lesson description in English
- `video` (required): Video file (mp4, avi, mov, wmv, flv, webm, max: 50MB)

**Success Response (200):**
```json
{
    "status": true,
    "message": "Lesson created successfully",
    "data": {
        "id": 1,
        "title": "درس في التجويد",
        "title_ar": "درس في التجويد",
        "title_en": "Tajweed Lesson",
        "localized_title": "درس في التجويد",
        "description": "شرح مفصل لأحكام التجويد",
        "description_ar": "شرح مفصل لأحكام التجويد",
        "description_en": "Detailed explanation of Tajweed rules",
        "localized_description": "شرح مفصل لأحكام التجويد",
        "video": "http://domain.com/Admin/images/lessons/1234567890_abc123.mp4",
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (422):**
```json
{
    "status": false,
    "number": "E001",
    "message": "The title field is required."
}
```

---

### 11.3 Get Lesson
**GET** `/api/dashboard/lessons/{id}`

**Description:** Get details of a specific lesson

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Lesson retrieved successfully",
    "data": {
        "id": 1,
        "title": "درس في التجويد",
        "title_ar": "درس في التجويد",
        "title_en": "Tajweed Lesson",
        "localized_title": "درس في التجويد",
        "description": "شرح مفصل لأحكام التجويد",
        "description_ar": "شرح مفصل لأحكام التجويد",
        "description_en": "Detailed explanation of Tajweed rules",
        "localized_description": "شرح مفصل لأحكام التجويد",
        "video": "http://domain.com/Admin/images/lessons/1234567890_abc123.mp4",
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00"
    }
}
```

**Error Response (404):**
```json
{
    "status": false,
    "number": "E404",
    "message": "Resource not found"
}
```

---

### 11.4 Update Lesson
**POST** `/api/dashboard/lessons/{id}`

**Description:** Update lesson data

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Request Type:** `multipart/form-data` (for video upload)

**Request Body:** (all fields are optional)
```json
{
    "title": "درس متقدم في التجويد",
    "title_en": "Advanced Tajweed Lesson",
    "description": "شرح متقدم ومفصل لأحكام التجويد",
    "description_en": "Advanced and detailed explanation of Tajweed rules",
    "video": "file"
}
```

**Field Descriptions:**
- `title` (optional): Lesson title in Arabic
- `title_en` (optional): Lesson title in English
- `description` (optional): Lesson description in Arabic
- `description_en` (optional): Lesson description in English
- `video` (optional): Video file (mp4, avi, mov, wmv, flv, webm, max: 50MB). If provided, the old video will be deleted and replaced with the new one.

**Success Response (200):**
```json
{
    "status": true,
    "message": "Lesson updated successfully",
    "data": {
        "id": 1,
        "title": "درس متقدم في التجويد",
        "title_ar": "درس متقدم في التجويد",
        "title_en": "Advanced Tajweed Lesson",
        "localized_title": "درس متقدم في التجويد",
        "description": "شرح متقدم ومفصل لأحكام التجويد",
        "description_ar": "شرح متقدم ومفصل لأحكام التجويد",
        "description_en": "Advanced and detailed explanation of Tajweed rules",
        "localized_description": "شرح متقدم ومفصل لأحكام التجويد",
        "video": "http://domain.com/Admin/images/lessons/9876543210_xyz789.mp4",
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-15 10:30:00"
    }
}
```

---

### 11.5 Delete Lesson
**DELETE** `/api/dashboard/lessons/{id}`

**Description:** Delete a lesson. The associated video file will also be deleted.

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Lesson deleted successfully"
}
```

**Error Response (404):**
```json
{
    "status": false,
    "number": "E404",
    "message": "Resource not found"
}
```

---

## Language Support

All endpoints support Arabic and English translation. Send the following header to control the language:

```
lang: ar  (Arabic - default)
lang: en  (English)
```

The Response will return data according to the specified language, with both versions (ar and en) returned in the fields.

---

## Error Codes Reference

| Code | Field | Description |
|------|-------|-------------|
| E000 | - | Unknown error |
| E001 | name | Name field error |
| E002 | email | Email field error |
| E003 | phone | Phone field error |
| E004 | password | Password field error |
| E006 | package_id | Package ID error |
| E029 | username | Username field error |
| E030 | age | Age field error |
| E031 | gender | Gender field error |
| E032 | teacher_id | Teacher ID error |
| E033 | student_id | Student ID error |
| E034 | rating | Rating field error |
| E035 | review | Review field error |
| E036 | session_date | Session date error |
| E037 | session_time | Session time error |
| E038 | day_of_week | Day of week error |
| E039 | level | Level field error |
| E040 | achievement | Achievement field error |
| E041 | certificate_images | Certificate images error |
| E042 | specialization | Specialization error |
| E043 | experience_years | Experience years error |
| E044 | price | Price field error |
| E045 | features | Features error |
| E046 | hour | Hour field error |
| E047 | monthly_sessions | Monthly sessions error |
| E048 | weekly_sessions | Weekly sessions error |
| E049 | weekly_days | Weekly days error |
| E050 | session_duration | Session duration error |
| E051 | hourly_rate | Hourly rate error |
| E052 | month | Month field error |
| E053 | payment_proof_image | Payment proof image error |
| E054 | start_date | Start date error |
| E055 | payment_receipt_image | Payment receipt image error |
| E056 | paid_subscriptions_count | Paid subscriptions count error |
| E400 | - | Bad request |
| E401 | - | Unauthorized |
| E404 | - | Not found |
| E500 | - | Server error |

---

## Status Codes

- `200` - Success
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## Notes

1. All endpoints (except `/login`) require Bearer Token
2. All responses are standardized using GeneralTrait
3. Validation errors are handled automatically and returned in a standardized format
4. Sessions are created automatically when adding/updating student subscription
5. Full support for Arabic and English languages
6. All dates are returned in `Y-m-d H:i:s` format (example: `2024-01-01 00:00:00`)
7. Pagination format is standardized across all endpoints: `{"total", "per_page", "current_page", "total_pages"}`
8. Student subscriptions are based on the number of sessions, not fixed calendar months. Each subscription contains `monthly_sessions` number of sessions. The subscription end date is calculated dynamically based on sessions count and sessions per week. When creating a subscription, 12 subscriptions (for a year) are automatically created. A subscription expires when all its sessions are completed, and a notification is automatically sent to the student.
9. Student `weekly_schedule` allows each day to have a specific time (e.g., Saturday at 17:00, Tuesday at 14:00)
10. Student `email` and `age` fields are optional
11. Student `type` field distinguishes between `website` (registered from website) and `admin` (added/modified by admin)
12. Student reviews support `type` field (`review` or `rating`) and optional `media_file` (image/video)
13. Honor board certificates are uploaded as files, not URLs
14. Teacher profile images are uploaded as files
15. Payment proof images (teacher salary and student subscriptions) are uploaded as files
16. Student `password` field is optional when creating/updating from dashboard. If provided, it will be automatically hashed and allows the student to login using phone and password.
17. Teacher `password`, `phone`, and `email` fields are optional when creating/updating from dashboard. If `password` is provided along with `phone` or `email`, a User account will be automatically created/updated for the teacher to enable login functionality. The password will be automatically hashed.
18. When creating a student, you can specify `past_months_count`, `paid_months_count`, and `subscription_start_date` to create past subscriptions with completed sessions. Past subscriptions are marked as unpaid unless covered by `paid_months_count`.
19. Student resource includes `subscriptions_statistics` with comprehensive subscription data:
    - `total_subscriptions`: Total number of subscriptions
    - `paid_subscriptions`: Number of paid subscriptions
    - `unpaid_subscriptions`: Number of unpaid subscriptions
    - `first_subscription_date`: Date of first subscription start (YYYY-MM-DD)
    - `last_subscription_date`: Date of last subscription end (YYYY-MM-DD)
    - `monthly_sessions`: Number of monthly sessions from student profile
    - `total_sessions_count`: Total sessions across all subscriptions
    - `completed_sessions_count`: Total completed sessions across all subscriptions
    - `remaining_sessions_count`: Total remaining sessions across all subscriptions
    These statistics are automatically updated when subscriptions are created or payment status changes.
20. Student subscription resource includes `total_sessions`, `completed_sessions_count`, `remaining_sessions_count`, `notification_sent`, and `notification_sent_at` fields to track subscription progress and expiry notifications.
21. Lessons (جزء من حصصنا / دروسنا) - CRUD operations available for managing lesson content with bilingual support (Arabic/English) and video upload functionality.
22. When updating a student, you can use `paid_subscriptions_count` field to update payment status for multiple subscriptions at once. The system will mark the first N subscriptions (ordered by start_date, oldest first) as paid, and the remaining subscriptions as unpaid. This is useful when you want to update payment status for multiple subscriptions in a single operation.
23. To update payment status for a single subscription, use the Update Student Subscription endpoint (`POST /api/student-subscriptions/{id}`) with the `is_paid` field.
