# Al-Hafiz Academy API Documentation

## Base URL
```
https://al-hafiz-academy.cloudy-digital.com/api
```

## Authentication

جميع الـ endpoints (عدا `/login`) تتطلب Bearer Token في الـ header:
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

## 1. Authentication Endpoints

### 1.1 Login
**POST** `/api/login`

**Description:** تسجيل الدخول باستخدام username و password

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
    "message": "تم تسجيل الدخول بنجاح",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin",
            "username": "admin",
            "email": "admin@alhafiz.com",
            "teacher": {
                "id": 1,
                "name": "أحمد محمد",
                "specialization": "القرآن الكريم"
            }
        },
        "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

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
    "message": "بيانات الدخول غير صحيحة"
}
```

---

### 1.2 Logout
**POST** `/api/logout`

**Description:** تسجيل الخروج وإلغاء الـ token الحالي

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
    "message": "تم تسجيل الخروج بنجاح"
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

**Description:** الحصول على معلومات المستخدم الحالي

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
    "message": "تم جلب بيانات المستخدم بنجاح",
    "user": {
        "id": 1,
        "name": "Admin",
        "username": "admin",
        "email": "admin@alhafiz.com",
        "teacher": {
            "id": 1,
            "name": "أحمد محمد",
            "specialization": "القرآن الكريم"
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

## 2. Students (الطلاب)

### 2.1 List Students
**GET** `/api/students`

**Description:** الحصول على قائمة الطلاب مع إمكانية الفلترة

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
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
    "message": "تم جلب الطلاب بنجاح",
    "data": {
        "students": [
            {
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

**Description:** إضافة طالب جديد. إذا تم توفير بيانات الاشتراك، سيتم إنشاء الحصص تلقائياً.

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
    "weekly_sessions": 8,
    "weekly_days": ["saturday", "tuesday"],
    "session_duration": 60,
    "hourly_rate": 100.00,
    "notes": "طالب مجتهد"
}
```

**Field Descriptions:**
- `name` (required): اسم الطالب
- `email` (required, unique): البريد الإلكتروني
- `phone` (required): رقم الهاتف
- `age` (required): العمر (1-120)
- `gender` (required): الجنس (`male` or `female`)
- `package_id` (optional): معرف الباقة
- `teacher_id` (optional): معرف المعلم
- `hour` (optional): وقت الحصة (format: HH:mm)
- `monthly_sessions` (optional): عدد الحصص الشهرية
- `weekly_sessions` (optional): عدد الحصص الأسبوعية
- `weekly_days` (optional): أيام الأسبوع (array: ["saturday", "tuesday"] or ["السبت", "الثلاثاء"])
- `session_duration` (optional): مدة الحصة بالدقائق
- `hourly_rate` (optional): سعر الساعة الذي سيحصل عليه المعلم (numeric, min: 0)
- `notes` (optional): ملاحظات

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم إنشاء الطالب بنجاح",
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

**Description:** الحصول على تفاصيل طالب محدد

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
    "message": "تم جلب الطالب بنجاح",
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
**PUT** `/api/students/{id}`

**Description:** تحديث بيانات طالب. إذا تم تحديث بيانات الاشتراك، سيتم إعادة إنشاء الحصص المستقبلية غير المكتملة.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:** (جميع الحقول اختيارية)
```json
{
    "name": "محمد أحمد محمود",
    "age": 16,
    "teacher_id": 2,
    "hour": "14:00",
    "monthly_sessions": 12,
    "weekly_sessions": 6,
    "weekly_days": ["sunday", "wednesday"]
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم تحديث الطالب بنجاح",
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

**Description:** حذف طالب. سيتم حذف جميع الحصص المرتبطة به.

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
    "message": "تم حذف الطالب بنجاح"
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

## 3. Student Sessions (الحصص)

### 3.1 List Sessions
**GET** `/api/student-sessions`

**Description:** الحصول على قائمة الحصص مع إمكانية الفلترة

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
    "message": "تم جلب الحصص بنجاح",
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

**Description:** إنشاء حصة يدوياً (عادة ما يتم إنشاء الحصص تلقائياً عند إضافة/تحديث اشتراك الطالب)

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
- `student_id` (required): معرف الطالب
- `teacher_id` (optional): معرف المعلم
- `session_date` (required): تاريخ الحصة (YYYY-MM-DD)
- `session_time` (required): وقت الحصة (HH:mm)
- `day_of_week` (required): يوم الأسبوع (`saturday`, `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`)
- `notes` (optional): ملاحظات

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم إنشاء الحصة بنجاح",
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

**Description:** الحصول على تفاصيل حصة محددة

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم جلب الحصة بنجاح",
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
**PUT** `/api/student-sessions/{id}`

**Description:** تحديث بيانات حصة. إذا تم تحديد `is_completed` كـ `true`، سيتم تعيين `completed_at` تلقائياً.

**Request Body:** (جميع الحقول اختيارية)
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
    "message": "تم تحديث الحصة بنجاح",
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

**Description:** تسجيل إتمام الحصة. يقوم تلقائياً بتعيين `is_completed` و `completed_at`.

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
    "message": "تم تسجيل إتمام الحصة بنجاح",
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
    "message": "تم حذف الحصة بنجاح"
}
```

---

## 4. Teachers (المعلمين)

### 4.1 List Teachers
**GET** `/api/teachers`

**Description:** الحصول على قائمة المعلمين

**Query Parameters:**
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم جلب المعلمين بنجاح",
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
    "experience_years": 10
}
```

**Field Descriptions:**
- `name` (required): الاسم بالعربية
- `name_en` (optional): الاسم بالإنجليزية
- `specialization` (required): التخصص بالعربية
- `specialization_en` (optional): التخصص بالإنجليزية
- `experience_years` (required): سنوات الخبرة (min: 0)

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم إنشاء المعلم بنجاح",
    "data": {
        "id": 1,
        "name": "أحمد محمد",
        "name_ar": "أحمد محمد",
        "name_en": "Ahmed Mohamed",
        "specialization": "القرآن الكريم",
        "specialization_ar": "القرآن الكريم",
        "specialization_en": "Holy Quran",
        "experience_years": 10,
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
    "message": "تم جلب المعلم بنجاح",
    "data": {
        "id": 1,
        "name": "أحمد محمد",
        "name_ar": "أحمد محمد",
        "name_en": "Ahmed Mohamed",
        "specialization": "القرآن الكريم",
        "specialization_ar": "القرآن الكريم",
        "specialization_en": "Holy Quran",
        "experience_years": 10,
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 4.4 Update Teacher
**PUT** `/api/teachers/{id}`

**Request Body:** (جميع الحقول اختيارية)
```json
{
    "name": "أحمد محمد محمود",
    "specialization": "القرآن الكريم والتجويد",
    "experience_years": 12
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم تحديث المعلم بنجاح",
    "data": {
        "id": 1,
        "name": "أحمد محمد محمود",
        "name_ar": "أحمد محمد محمود",
        "name_en": "Ahmed Mohamed",
        "specialization": "القرآن الكريم والتجويد",
        "specialization_ar": "القرآن الكريم والتجويد",
        "specialization_en": "Holy Quran",
        "experience_years": 12,
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
    "message": "تم حذف المعلم بنجاح"
}
```

---

## 5. Packages (الباقات)

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
    "message": "تم جلب الباقات بنجاح",
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
- `name` (required): اسم الباقة بالعربية
- `name_en` (optional): اسم الباقة بالإنجليزية
- `price` (required): السعر (numeric, min: 0)
- `price_ar` (optional): السعر بالعربية (نص، مثال: "500 جنيه")
- `price_en` (optional): السعر بالإنجليزية (نص، مثال: "500 EGP")
- `features` (required): قائمة المميزات بالعربية (array)
- `features_en` (optional): قائمة المميزات بالإنجليزية (array)
- `is_popular` (optional): هل الباقة شائعة (boolean, default: false)

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم إنشاء الباقة بنجاح",
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
    "message": "تم جلب الباقة بنجاح",
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
**PUT** `/api/packages/{id}`

**Request Body:** (جميع الحقول اختيارية)
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
    "message": "تم تحديث الباقة بنجاح",
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
    "message": "تم حذف الباقة بنجاح"
}
```

---

## 6. Student Reviews (آراء الطلاب)

### 6.1 List Reviews
**GET** `/api/reviews`

**Query Parameters:**
- `rating` (optional) - Filter by rating: 1, 2, 3, 4, or 5
- `package_id` (optional) - Filter by package ID
- `student_id` (optional) - Filter by student ID
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم جلب الآراء بنجاح",
    "data": {
        "reviews": [
            {
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

**Request Body:**
```json
{
    "student_id": 1,
    "package_id": 1,
    "rating": 5,
    "review": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
    "review_en": "Great experience, professional teachers and excellent curriculum"
}
```

**Field Descriptions:**
- `student_id` (required): معرف الطالب
- `package_id` (optional): معرف الباقة
- `rating` (required): التقييم من 1 إلى 5
- `review` (required): الرأي بالعربية
- `review_en` (optional): الرأي بالإنجليزية

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم إنشاء الرأي بنجاح",
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
    "message": "تم جلب الرأي بنجاح",
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
        "created_at": "2024-01-01 00:00:00"
    }
}
```

---

### 6.4 Update Review
**PUT** `/api/reviews/{id}`

**Request Body:** (جميع الحقول اختيارية)
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
    "message": "تم تحديث الرأي بنجاح",
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
    "message": "تم حذف الرأي بنجاح"
}
```

---

## 7. Teacher Salary & Payments (حسابات المعلمين)

### 7.1 Get Teacher Salary Calculation
**GET** `/api/teachers/{teacher}/salary`

**Description:** الحصول على حساب راتب المعلم لشهر معين. يعرض جميع الطلاب المسجلين للمعلم مع عدد الحصص المكتملة لكل طالب والقيمة المالية، بالإضافة إلى المجموع الكلي.

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `month` (required) - الشهر بصيغة YYYY-MM (مثال: 2024-01)

**Example Request:**
```
GET /api/teachers/1/salary?month=2024-01
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم جلب حساب الراتب بنجاح",
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

**Note:** إذا لم يتم تسجيل السداد بعد، `payment` سيكون `null`.

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

**Description:** تسجيل سداد راتب المعلم لشهر معين. يتم حساب المبلغ تلقائياً إذا لم يكن محدداً.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "month": "2024-01",
    "payment_proof_image": "https://example.com/payment-proof.jpg",
    "notes": "تم التحويل بنجاح"
}
```

**Field Descriptions:**
- `month` (required): الشهر بصيغة YYYY-MM
- `payment_proof_image` (required): رابط صورة إثبات الدفع (URL)
- `notes` (optional): ملاحظات

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم تسجيل السداد بنجاح",
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

**Description:** الحصول على سجل جميع المدفوعات للمعلم مع pagination.

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
    "message": "تم جلب سجل المدفوعات بنجاح",
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

## 8. Honor Boards (لوحة الشرف)

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
    "message": "تم جلب لوحة الشرف بنجاح",
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

**Request Body:**
```json
{
    "student_id": 1,
    "level": "المستوى المتقدم",
    "level_en": "Advanced Level",
    "achievement": "إتمام حفظ القرآن الكريم كاملاً",
    "achievement_en": "Complete memorization of the Holy Quran",
    "certificate_images": [
        "https://example.com/certificates/cert1.jpg",
        "https://example.com/certificates/cert2.jpg"
    ]
}
```

**Field Descriptions:**
- `student_id` (required): معرف الطالب
- `level` (required): المستوى بالعربية
- `level_en` (optional): المستوى بالإنجليزية
- `achievement` (required): الإنجاز بالعربية
- `achievement_en` (optional): الإنجاز بالإنجليزية
- `certificate_images` (required): قائمة روابط صور الشهادات (array of URLs)

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم إنشاء سجل لوحة الشرف بنجاح",
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
    "message": "تم جلب سجل لوحة الشرف بنجاح",
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
**PUT** `/api/honor-boards/{id}`

**Request Body:** (جميع الحقول اختيارية)
```json
{
    "level": "المستوى المتقدم جداً",
    "achievement": "حفظ 20 جزء من القرآن الكريم"
}
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم تحديث سجل لوحة الشرف بنجاح",
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
    "message": "تم حذف سجل لوحة الشرف بنجاح"
}
```

---

## 9. Features (المميزات)

### 9.1 List Features
**GET** `/api/features`

**Description:** الحصول على قائمة المميزات

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
    "message": "تم جلب المميزات بنجاح",
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

### 9.2 Create Feature
**POST** `/api/features`

**Description:** إضافة ميزة جديدة

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
- `title` (required): العنوان بالعربية
- `title_en` (optional): العنوان بالإنجليزية
- `description` (required): الوصف بالعربية
- `description_en` (optional): الوصف بالإنجليزية
- `icon` (optional): اسم الأيقونة
- `order` (optional): ترتيب العرض (integer, min: 0, default: 0)
- `is_active` (optional): هل الميزة نشطة (boolean, default: true)

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم إنشاء الميزة بنجاح",
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

### 9.3 Get Feature
**GET** `/api/features/{id}`

**Description:** الحصول على تفاصيل ميزة محددة

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
    "message": "تم جلب بيانات الميزة بنجاح",
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

### 9.4 Update Feature
**PUT** `/api/features/{id}`

**Description:** تحديث بيانات ميزة

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:** (جميع الحقول اختيارية)
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
    "message": "تم تحديث بيانات الميزة بنجاح",
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

### 9.5 Delete Feature
**DELETE** `/api/features/{id}`

**Description:** حذف ميزة

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
    "message": "تم حذف الميزة بنجاح"
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

## Language Support (دعم اللغات)

جميع الـ endpoints تدعم الترجمة العربية والإنجليزية. أرسل header التالي للتحكم في اللغة:

```
lang: ar  (العربية - افتراضي)
lang: en  (English)
```

الـ Response سيعيد البيانات حسب اللغة المحددة، مع إرجاع كلا النسختين (ar و en) في الحقول.

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

1. جميع الـ endpoints (عدا `/login`) تتطلب Bearer Token
2. جميع الـ responses موحدة باستخدام GeneralTrait
3. أخطاء التحقق تُعالج تلقائياً وتُرجع بشكل موحد
4. الحصص تُنشأ تلقائياً عند إضافة/تحديث اشتراك الطالب
5. دعم كامل للغتين العربية والإنجليزية
6. جميع التواريخ تُرجع بصيغة `Y-m-d H:i:s` (مثال: `2024-01-01 00:00:00`)
7. Pagination format موحد في جميع الـ endpoints: `{"total", "per_page", "current_page", "total_pages"}`
