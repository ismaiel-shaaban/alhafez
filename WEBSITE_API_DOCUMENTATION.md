# Al-Hafiz Academy Website API Documentation

## Base URL
```
http://al-hafiz-academy.cloudy-digital.com/api
```

## Overview

These API endpoints are for the public website (alhafez.netlify.app) and do not require authentication. All endpoints are public and can be accessed without a token.

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

## Language Support

All endpoints support Arabic and English translation. Send the following header to control the language:

```
lang: ar  (Arabic - default)
lang: en  (English)
```

The Response will return data according to the specified language, with both versions (ar and en) returned in the fields.

---

## 1. Get All Website Data

**GET** `/api/website`

**Description:** Get all website data in a single endpoint (features, packages, teachers, student reviews)

**Request Headers:**
```
Accept: application/json
lang: ar (optional: ar or en)
```

**Success Response (200):**
```json
{
    "status": true,
    "message": "Website data retrieved successfully",
    "data": {
        "features": [
            {
                "id": 1,
                "title": "Qualified Teachers",
                "title_ar": "معلمون مؤهلون",
                "title_en": "Qualified Teachers",
                "description": "Our teachers are highly qualified and experienced in teaching the Holy Quran",
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
                "name": "Basic Package",
                "name_ar": "الباقة الأساسية",
                "name_en": "Basic Package",
                "price": 500.00,
                "price_ar": "500 EGP",
                "price_en": "500 EGP",
                "price_label": "500 EGP",
                "features": [
                    "3 sessions per week",
                    "Regular follow-up",
                    "Completion certificate"
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
                "name": "Ahmed Mohamed",
                "name_ar": "أحمد محمد",
                "name_en": "Ahmed Mohamed",
                "specialization": "Holy Quran",
                "specialization_ar": "القرآن الكريم",
                "specialization_en": "Holy Quran",
                "experience_years": 10,
                "image": "http://domain.com/Admin/images/teachers/1234567890_abc123.jpg",
                "created_at": "2024-01-01 00:00:00"
            }
        ],
        "reviews": [
            {
                "id": 1,
                "type": "review",
                "student": {
                    "id": 1,
                    "name": "Mohamed Ahmed"
                },
                "student_id": 1,
                "package": {
                    "id": 1,
                    "name": "Basic Package"
                },
                "package_id": 1,
                "rating": 5,
                "review": "Great experience, professional teachers and excellent curriculum",
                "review_ar": "تجربة رائعة، المعلمون محترفون والمنهج ممتاز",
                "review_en": "Great experience, professional teachers and excellent curriculum",
                "media_file": "http://domain.com/Admin/images/review-media/1234567890_abc123.jpg",
                "created_at": "2024-01-01 00:00:00"
            }
        ]
    }
}
```

---

## 2. Honor Boards

### 2.1 List Honor Boards
**GET** `/api/honor-boards`

**Description:** Get list of honor boards with filtering options

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
    "message": "Honor boards retrieved successfully",
    "data": {
        "honor_boards": [
            {
                "id": 1,
                "student": {
                    "id": 1,
                    "name": "Mohamed Ahmed"
                },
                "student_id": 1,
                "level": "Advanced Level",
                "level_ar": "المستوى المتقدم",
                "level_en": "Advanced Level",
                "achievement": "Complete memorization of the Holy Quran",
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

## 3. Teachers

### 3.1 List Teachers
**GET** `/api/teachers`

**Description:** Get list of teachers

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
    "message": "Teachers retrieved successfully",
    "data": {
        "teachers": [
            {
                "id": 1,
                "name": "Ahmed Mohamed",
                "name_ar": "أحمد محمد",
                "name_en": "Ahmed Mohamed",
                "specialization": "Holy Quran",
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

## 4. Packages

### 4.1 List Packages
**GET** `/api/packages`

**Description:** Get list of packages

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
    "message": "Packages retrieved successfully",
    "data": {
        "packages": [
            {
                "id": 1,
                "name": "Basic Package",
                "name_ar": "الباقة الأساسية",
                "name_en": "Basic Package",
                "price": 500.00,
                "price_ar": "500 EGP",
                "price_en": "500 EGP",
                "price_label": "500 EGP",
                "features": [
                    "3 sessions per week",
                    "Regular follow-up",
                    "Completion certificate"
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

## 5. Student Reviews

### 5.1 List Reviews
**GET** `/api/reviews`

**Description:** Get list of student reviews

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
    "message": "Reviews retrieved successfully",
    "data": {
        "reviews": [
            {
                "id": 1,
                "student": {
                    "id": 1,
                    "name": "Mohamed Ahmed"
                },
                "student_id": 1,
                "package": {
                    "id": 1,
                    "name": "Basic Package"
                },
                "package_id": 1,
                "rating": 5,
                "review": "Great experience, professional teachers and excellent curriculum",
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

## 6. Student Registration

### 6.1 Register New Student
**POST** `/api/register`

**Description:** Register a new student from the public website. All other fields (teacher_id, hour, sessions, etc.) will be null automatically.

**Request Headers:**
```
Content-Type: application/json
Accept: application/json
lang: ar (optional)
```

**Request Body:**
```json
{
    "name": "Mohamed Ahmed",
    "email": "mohamed@example.com",
    "phone": "01012345678",
    "age": 15,
    "gender": "male",
    "package_id": 1,
    "notes": "I want to start as soon as possible"
}
```

**Field Descriptions:**
- `name` (required): Student name
- `email` (optional, unique): Email address (must be unique if provided)
- `phone` (required): Phone number
- `age` (optional): Age (1-120)
- `gender` (required): Gender (`male` or `female`)
- `package_id` (required): Package ID (must exist in database)
- `notes` (optional): Message or notes

**Note:** When a student registers from the website, the `type` is automatically set to `website`. If the student is later modified by the administration, their `type` changes to `admin`.

**Success Response (200):**
```json
{
    "status": true,
    "message": "Student registered successfully",
    "data": {
        "id": 1,
        "type": "website",
        "name": "Mohamed Ahmed",
        "email": "mohamed@example.com",
        "phone": "01012345678",
        "age": 15,
        "gender": "male",
        "gender_label": "Male",
        "package": {
            "id": 1,
            "name": "Basic Package"
        },
        "package_id": 1,
        "teacher_id": null,
        "hour": null,
        "monthly_sessions": null,
        "weekly_sessions": null,
        "weekly_days": [],
        "weekly_schedule": [],
        "session_duration": null,
        "hourly_rate": null,
        "notes": "I want to start as soon as possible",
        "subscriptions": [],
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
    "message": "The selected package does not exist"
}
```

---

## 7. Submit Rating

### 7.1 Submit Public Rating
**POST** `/api/submit-rating`

**Description:** Submit a public rating/review from the website. This creates a rating entry with `type` set to `rating` and no associated student or package.

**Request Headers:**
```
Content-Type: multipart/form-data
Accept: application/json
lang: ar (optional)
```

**Request Body:**
```json
{
    "name": "Ahmed Ali",
    "rating": 5,
    "review": "تجربة رائعة جداً",
    "review_en": "Excellent experience",
    "media_file": "file"
}
```

**Field Descriptions:**
- `name` (required): Name of the person submitting the rating
- `rating` (required): Rating from 1 to 5
- `review` (required): Review text in Arabic
- `review_en` (optional): Review text in English
- `media_file` (optional): Media file (image or video) - file upload (jpeg, png, jpg, gif, mp4, avi, mov, wmv, flv, webm, max: 20MB)

**Success Response (200):**
```json
{
    "status": true,
    "number": 1,
    "message": "Rating submitted successfully"
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

1. **All endpoints are public** - Do not require authentication or Bearer Token
2. **Language Support** - All responses support Arabic and English via `lang` header
3. **Pagination** - All endpoints that return lists support pagination with standardized format: `{"total", "per_page", "current_page", "total_pages"}`
4. **Student Registration** - When registering, all other fields (teacher_id, hour, sessions, etc.) will be `null` automatically. The `type` is automatically set to `website`.
5. **Email and Age** - Both `email` and `age` fields are optional when registering a student
6. **Email Uniqueness** - Email address must be unique in the database (if provided)
7. **Package Validation** - When registering, the package must exist in the database
8. **Student Reviews** - Reviews support `type` field (`review` or `rating`) and optional `media_file` (image/video)
9. **Teacher Images** - Teachers may have profile images
10. **Honor Board Certificates** - Certificate images are returned as full URLs
11. **Date Format** - All dates are returned in `Y-m-d H:i:s` format (example: `2024-01-01 00:00:00`)
12. **Student Password** - When registering from the website, password is not required. The password can be set later by the admin from the dashboard to enable student login functionality.

---

## Example Usage

### Get All Website Data
```bash
curl -X GET "http://al-hafiz-academy.cloudy-digital.com/api/website" \
  -H "Accept: application/json" \
  -H "lang: ar"
```

### Get Teachers
```bash
curl -X GET "http://al-hafiz-academy.cloudy-digital.com/api/teachers?per_page=10" \
  -H "Accept: application/json" \
  -H "lang: en"
```

### Get Popular Packages
```bash
curl -X GET "http://al-hafiz-academy.cloudy-digital.com/api/packages?is_popular=true" \
  -H "Accept: application/json" \
  -H "lang: ar"
```

### Register New Student
```bash
curl -X POST "http://al-hafiz-academy.cloudy-digital.com/api/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "lang: ar" \
  -d '{
    "name": "Mohamed Ahmed",
    "email": "mohamed@example.com",
    "phone": "01012345678",
    "age": 15,
    "gender": "male",
    "package_id": 1,
    "notes": "I want to start as soon as possible"
  }'
```

### Submit Rating
```bash
curl -X POST "http://al-hafiz-academy.cloudy-digital.com/api/submit-rating" \
  -H "Accept: application/json" \
  -H "lang: ar" \
  -F "name=Ahmed Ali" \
  -F "rating=5" \
  -F "review=تجربة رائعة جداً" \
  -F "review_en=Excellent experience" \
  -F "media_file=@/path/to/image.jpg"
```

---

## Contact

For more information or technical support, please contact the development team.

