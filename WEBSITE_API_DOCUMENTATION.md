# Al-Hafiz Academy Website API Documentation

## Base URL
```
https://al-hafiz-academy.cloudy-digital.com/api
```

## Overview

هذه الـ API endpoints خاصة بالموقع العام (alhafez.netlify.app) ولا تتطلب authentication. جميع الـ endpoints عامة ويمكن الوصول إليها بدون token.

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

## Language Support (دعم اللغات)

جميع الـ endpoints تدعم الترجمة العربية والإنجليزية. أرسل header التالي للتحكم في اللغة:

```
lang: ar  (العربية - افتراضي)
lang: en  (English)
```

الـ Response سيعيد البيانات حسب اللغة المحددة، مع إرجاع كلا النسختين (ar و en) في الحقول.

---

## 1. Get All Website Data

**GET** `/api/website`

**Description:** الحصول على جميع بيانات الموقع في endpoint واحد (المميزات، الباقات، المعلمين، آراء الطلاب)

**Request Headers:**
```
Accept: application/json
lang: ar (optional: ar or en)
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم جلب بيانات الموقع بنجاح",
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
        ]
    }
}
```

---

## 2. Honor Boards (لوحة الشرف)

### 2.1 List Honor Boards
**GET** `/api/honor-boards`

**Description:** الحصول على قائمة لوحة الشرف مع إمكانية الفلترة

**Request Headers:**
```
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `student_id` (optional) - Filter by student ID
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Example Request:**
```
GET /api/honor-boards?per_page=10&page=1
```

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

## 3. Teachers (معلمونا)

### 3.1 List Teachers
**GET** `/api/teachers`

**Description:** الحصول على قائمة المعلمين

**Request Headers:**
```
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Example Request:**
```
GET /api/teachers?per_page=20
```

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

## 4. Packages (الباقات)

### 4.1 List Packages
**GET** `/api/packages`

**Description:** الحصول على قائمة الباقات

**Request Headers:**
```
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `is_popular` (optional) - Filter popular packages: `true` or `false`
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Example Request:**
```
GET /api/packages?is_popular=true&per_page=10
```

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

## 5. Student Reviews (آراء الطلاب)

### 5.1 List Reviews
**GET** `/api/reviews`

**Description:** الحصول على قائمة آراء الطلاب

**Request Headers:**
```
Accept: application/json
lang: ar (optional)
```

**Query Parameters:**
- `rating` (optional) - Filter by rating: 1, 2, 3, 4, or 5
- `package_id` (optional) - Filter by package ID
- `per_page` (optional) - Results per page (default: 15)
- `page` (optional) - Page number

**Example Request:**
```
GET /api/reviews?rating=5&per_page=10
```

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

## 6. Student Registration (تسجيل طالب جديد)

### 6.1 Register New Student
**POST** `/api/register`

**Description:** تسجيل طالب جديد من الموقع العام. جميع الحقول الأخرى (teacher_id, hour, sessions, etc.) ستكون null تلقائياً.

**Request Headers:**
```
Content-Type: application/json
Accept: application/json
lang: ar (optional)
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
    "notes": "أريد البدء في أقرب وقت ممكن"
}
```

**Field Descriptions:**
- `name` (required): اسم الطالب
- `email` (required, unique): البريد الإلكتروني (يجب أن يكون فريد)
- `phone` (required): رقم الهاتف
- `age` (required): العمر (1-120)
- `gender` (required): الجنس (`male` or `female`)
- `package_id` (required): معرف الباقة (يجب أن تكون موجودة في قاعدة البيانات)
- `notes` (optional): رسالة أو ملاحظات

**Success Response (200):**
```json
{
    "status": true,
    "message": "تم تسجيل الطالب بنجاح",
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
        "teacher_id": null,
        "hour": null,
        "monthly_sessions": null,
        "weekly_sessions": null,
        "weekly_days": [],
        "session_duration": null,
        "hourly_rate": null,
        "notes": "أريد البدء في أقرب وقت ممكن",
        "created_at": "2024-01-15 10:30:00"
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

**Error Response (422) - Package Not Found:**
```json
{
    "status": false,
    "number": "E006",
    "message": "الباقة المحددة غير موجودة"
}
```

---

## Error Codes Reference

| Code | Field | Description |
|------|-------|-------------|
| E000 | - | Unknown error |
| E001 | name | Name field error |
| E002 | email | Email field error |
| E003 | phone | Phone field error |
| E006 | package_id | Package ID error |
| E030 | age | Age field error |
| E031 | gender | Gender field error |
| E401 | - | Unauthorized |
| E404 | - | Not found |
| E500 | - | Server error |

---

## Status Codes

- `200` - Success
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## Notes

1. **جميع الـ endpoints عامة** - لا تتطلب authentication أو Bearer Token
2. **دعم اللغات** - جميع الـ responses تدعم العربية والإنجليزية عبر header `lang`
3. **Pagination** - جميع الـ endpoints التي تعيد قوائم تدعم pagination مع format موحد: `{"total", "per_page", "current_page", "total_pages"}`
4. **Student Registration** - عند التسجيل، جميع الحقول الأخرى (teacher_id, hour, sessions, etc.) ستكون `null` تلقائياً
5. **Email Uniqueness** - البريد الإلكتروني يجب أن يكون فريداً في قاعدة البيانات
6. **Package Validation** - عند التسجيل، يجب أن تكون الباقة موجودة في قاعدة البيانات
7. **Date Format** - جميع التواريخ تُرجع بصيغة `Y-m-d H:i:s` (مثال: `2024-01-01 00:00:00`)

---

## Example Usage

### Get All Website Data
```bash
curl -X GET "https://al-hafiz-academy.cloudy-digital.com/api/website" \
  -H "Accept: application/json" \
  -H "lang: ar"
```

### Get Teachers
```bash
curl -X GET "https://al-hafiz-academy.cloudy-digital.com/api/teachers?per_page=10" \
  -H "Accept: application/json" \
  -H "lang: en"
```

### Get Popular Packages
```bash
curl -X GET "https://al-hafiz-academy.cloudy-digital.com/api/packages?is_popular=true" \
  -H "Accept: application/json" \
  -H "lang: ar"
```

### Register New Student
```bash
curl -X POST "https://al-hafiz-academy.cloudy-digital.com/api/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "lang: ar" \
  -d '{
    "name": "محمد أحمد",
    "email": "mohamed@example.com",
    "phone": "01012345678",
    "age": 15,
    "gender": "male",
    "package_id": 1,
    "notes": "أريد البدء في أقرب وقت ممكن"
  }'
```

---

## Contact

للمزيد من المعلومات أو الدعم الفني، يرجى التواصل مع فريق التطوير.

