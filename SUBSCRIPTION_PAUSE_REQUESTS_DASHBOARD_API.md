# API Documentation - Subscription Pause Requests (Dashboard)

## APIs خاصة بلوحة التحكم (Dashboard APIs)

---

## 1. جلب جميع طلبات إيقاف الاشتراكات (Get All Pause Requests)

### Endpoint
```
GET /api/dashboard/subscription-pause-requests
```

### Headers
```
Authorization: Bearer {token}
Accept: application/json
```

### Query Parameters (Filters)

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `status` | string | No | فلترة حسب حالة الطلب | `pending`, `approved`, `rejected` |
| `teacher_id` | integer | No | فلترة حسب معرف المعلم | `2` |
| `student_id` | integer | No | فلترة حسب معرف الطالب | `1` |
| `subscription_id` | integer | No | فلترة حسب معرف الاشتراك | `5` |
| `date_from` | date | No | فلترة حسب تاريخ بداية الإيقاف (من) | `2024-01-01` |
| `date_to` | date | No | فلترة حسب تاريخ نهاية الإيقاف (إلى) | `2024-01-31` |
| `per_page` | integer | No | عدد النتائج في الصفحة | `15` (افتراضي) |
| `page` | integer | No | رقم الصفحة | `1` |

### Example Requests

#### جلب جميع الطلبات
```
GET /api/dashboard/subscription-pause-requests
```

#### جلب الطلبات قيد الانتظار فقط
```
GET /api/dashboard/subscription-pause-requests?status=pending
```

#### جلب طلبات معلم معين
```
GET /api/dashboard/subscription-pause-requests?teacher_id=2
```

#### جلب طلبات طالب معين
```
GET /api/dashboard/subscription-pause-requests?student_id=1
```

#### جلب طلبات في فترة زمنية محددة
```
GET /api/dashboard/subscription-pause-requests?date_from=2024-01-01&date_to=2024-01-31
```

#### فلترة متعددة
```
GET /api/dashboard/subscription-pause-requests?status=pending&teacher_id=2&per_page=20&page=1
```

### Success Response (200)
```json
{
  "status": true,
  "errNum": "S000",
  "msg": "تم جلب طلبات إيقاف الاشتراكات بنجاح",
  "data": {
    "requests": [
      {
        "id": 1,
        "teacher": {
          "id": 2,
          "name": "أحمد محمد"
        },
        "student": {
          "id": 1,
          "name": "محمد علي"
        },
        "subscription": {
          "id": 5,
          "subscription_code": "SUB-1-202401-01"
        },
        "pause_from": "2024-01-15",
        "pause_to": "2024-01-20",
        "status": "pending",
        "created_at": "2024-01-10 14:30:00"
      },
      {
        "id": 2,
        "teacher": {
          "id": 3,
          "name": "سارة أحمد"
        },
        "student": {
          "id": 4,
          "name": "علي حسن"
        },
        "subscription": {
          "id": 8,
          "subscription_code": "SUB-4-202401-02"
        },
        "pause_from": "2024-01-25",
        "pause_to": "2024-01-30",
        "status": "approved",
        "created_at": "2024-01-12 10:15:00",
        "approved_by": {
          "id": 1,
          "name": "مدير النظام"
        },
        "approved_at": "2024-01-12 11:00:00"
      },
      {
        "id": 3,
        "teacher": {
          "id": 2,
          "name": "أحمد محمد"
        },
        "student": {
          "id": 5,
          "name": "فاطمة خالد"
        },
        "subscription": {
          "id": 10,
          "subscription_code": "SUB-5-202401-03"
        },
        "pause_from": "2024-02-01",
        "pause_to": "2024-02-05",
        "status": "rejected",
        "created_at": "2024-01-15 09:20:00",
        "rejected_by": {
          "id": 1,
          "name": "مدير النظام"
        },
        "rejected_at": "2024-01-15 10:00:00",
        "rejection_reason": "الاشتراك قريب من الانتهاء"
      }
    ],
    "pagination": {
      "total": 45,
      "per_page": 15,
      "current_page": 1,
      "total_pages": 3
    }
  }
}
```

### Response Fields

#### Request Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | معرف الطلب |
| `teacher.id` | integer | معرف المعلم |
| `teacher.name` | string | اسم المعلم |
| `student.id` | integer | معرف الطالب |
| `student.name` | string | اسم الطالب |
| `subscription.id` | integer | معرف الاشتراك |
| `subscription.subscription_code` | string | كود الاشتراك |
| `pause_from` | date | تاريخ بداية الإيقاف (Y-m-d) |
| `pause_to` | date | تاريخ نهاية الإيقاف (Y-m-d) |
| `status` | string | حالة الطلب: `pending`, `approved`, `rejected` |
| `created_at` | datetime | تاريخ إنشاء الطلب (Y-m-d H:i:s) |
| `approved_by` | object | معلومات الموافق (يظهر فقط إذا كان `status = approved`) |
| `approved_by.id` | integer | معرف الموافق |
| `approved_by.name` | string | اسم الموافق |
| `approved_at` | datetime | تاريخ الموافقة (Y-m-d H:i:s) |
| `rejected_by` | object | معلومات الرافض (يظهر فقط إذا كان `status = rejected`) |
| `rejected_by.id` | integer | معرف الرافض |
| `rejected_by.name` | string | اسم الرافض |
| `rejected_at` | datetime | تاريخ الرفض (Y-m-d H:i:s) |
| `rejection_reason` | string | سبب الرفض (يظهر فقط إذا كان `status = rejected`) |

#### Pagination Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | integer | إجمالي عدد الطلبات |
| `per_page` | integer | عدد النتائج في الصفحة |
| `current_page` | integer | الصفحة الحالية |
| `total_pages` | integer | إجمالي عدد الصفحات |

### Error Responses

#### 403 - Unauthorized
```json
{
  "status": false,
  "errNum": "E403",
  "msg": "غير مصرح لك"
}
```

---

## 2. الموافقة على طلب إيقاف الاشتراك (Approve Pause Request)

### Endpoint
```
POST /api/dashboard/subscription-pause-requests/{pauseRequest}/approve
```

### Headers
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pauseRequest` | integer | Yes | معرف طلب الإيقاف |

### Request Body
```json
{}
```
**ملاحظة**: لا يوجد حقول مطلوبة في الـ Request Body

### Success Response (200)
```json
{
  "status": true,
  "errNum": "S000",
  "msg": "تم الموافقة على طلب إيقاف الاشتراك بنجاح",
  "data": {
    "id": 1,
    "teacher": {
      "id": 2,
      "name": "أحمد محمد"
    },
    "student": {
      "id": 1,
      "name": "محمد علي"
    },
    "subscription": {
      "id": 5,
      "subscription_code": "SUB-1-202401-01"
    },
    "pause_from": "2024-01-15",
    "pause_to": "2024-01-20",
    "status": "approved",
    "created_at": "2024-01-10 14:30:00",
    "approved_by": {
      "id": 1,
      "name": "مدير النظام"
    },
    "approved_at": "2024-01-12 11:00:00"
  }
}
```

### ما يحدث عند الموافقة:
1. يتم تحديث حالة الطلب إلى `approved`
2. يتم حفظ معلومات الموافق (`approved_by`, `approved_at`)
3. يتم إيقاف الاشتراك (`status = paused`)
4. يتم حفظ عدد الحصص المتبقية عند الإيقاف
5. يتم حذف الحصص غير المكتملة في فترة الإيقاف
6. يتم إرسال إشعار Firebase للطالب والمعلم

### Error Responses

#### 400 - Request Already Processed
```json
{
  "status": false,
  "errNum": "E400",
  "msg": "تم معالجة هذا الطلب مسبقاً"
}
```

#### 404 - Request Not Found
```json
{
  "status": false,
  "errNum": "E404",
  "msg": "الطلب غير موجود"
}
```

---

## 3. رفض طلب إيقاف الاشتراك (Reject Pause Request)

### Endpoint
```
POST /api/dashboard/subscription-pause-requests/{pauseRequest}/reject
```

### Headers
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pauseRequest` | integer | Yes | معرف طلب الإيقاف |

### Request Body
```json
{
  "rejection_reason": "الاشتراك قريب من الانتهاء ولا يمكن إيقافه"
}
```

### Request Fields
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `rejection_reason` | string | No | سبب الرفض | الحد الأقصى 500 حرف |

### Success Response (200)
```json
{
  "status": true,
  "errNum": "S000",
  "msg": "تم رفض طلب إيقاف الاشتراك بنجاح",
  "data": {
    "id": 1,
    "teacher": {
      "id": 2,
      "name": "أحمد محمد"
    },
    "student": {
      "id": 1,
      "name": "محمد علي"
    },
    "subscription": {
      "id": 5,
      "subscription_code": "SUB-1-202401-01"
    },
    "pause_from": "2024-01-15",
    "pause_to": "2024-01-20",
    "status": "rejected",
    "created_at": "2024-01-10 14:30:00",
    "rejected_by": {
      "id": 1,
      "name": "مدير النظام"
    },
    "rejected_at": "2024-01-12 11:00:00",
    "rejection_reason": "الاشتراك قريب من الانتهاء ولا يمكن إيقافه"
  }
}
```

### ما يحدث عند الرفض:
1. يتم تحديث حالة الطلب إلى `rejected`
2. يتم حفظ معلومات الرافض (`rejected_by`, `rejected_at`)
3. يتم حفظ سبب الرفض (`rejection_reason`)
4. يتم إرسال إشعار Firebase للمعلم فقط

### Error Responses

#### 400 - Request Already Processed
```json
{
  "status": false,
  "errNum": "E400",
  "msg": "تم معالجة هذا الطلب مسبقاً"
}
```

#### 404 - Request Not Found
```json
{
  "status": false,
  "errNum": "E404",
  "msg": "الطلب غير موجود"
}
```

#### 422 - Validation Error
```json
{
  "status": false,
  "errNum": "E000",
  "msg": "البيانات المرسلة غير صحيحة",
  "errors": {
    "rejection_reason": ["حقل سبب الرفض يجب ألا يتجاوز 500 حرف"]
  }
}
```

---

## ملاحظات مهمة

1. **المصادقة**: جميع الـ APIs تتطلب مصادقة (Bearer Token) من لوحة التحكم
2. **الصلاحيات**: هذه APIs خاصة بالإدارة فقط
3. **الترتيب**: النتائج مرتبة حسب تاريخ الإنشاء (الأحدث أولاً)
4. **الحالات**: 
   - `pending`: قيد الانتظار (يمكن الموافقة أو الرفض)
   - `approved`: تمت الموافقة (لا يمكن التعديل)
   - `rejected`: تم الرفض (لا يمكن التعديل)
5. **التواريخ**: جميع التواريخ بصيغة `Y-m-d` (مثل: 2024-01-15)
6. **الإشعارات**: 
   - عند الموافقة: يتم إرسال إشعار للطالب والمعلم
   - عند الرفض: يتم إرسال إشعار للمعلم فقط
7. **تأثير الموافقة**:
   - يتم إيقاف الاشتراك تلقائياً
   - يتم حذف الحصص غير المكتملة في فترة الإيقاف
   - يتم حفظ عدد الحصص المتبقية لإعادة تفعيلها لاحقاً

---

## أمثلة استخدام

### مثال 1: جلب جميع الطلبات قيد الانتظار
```bash
curl -X GET "https://api.example.com/api/dashboard/subscription-pause-requests?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### مثال 2: جلب طلبات معلم معين في فترة زمنية
```bash
curl -X GET "https://api.example.com/api/dashboard/subscription-pause-requests?teacher_id=2&date_from=2024-01-01&date_to=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### مثال 3: الموافقة على طلب
```bash
curl -X POST "https://api.example.com/api/dashboard/subscription-pause-requests/1/approve" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### مثال 4: رفض طلب مع سبب
```bash
curl -X POST "https://api.example.com/api/dashboard/subscription-pause-requests/1/reject" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rejection_reason": "الاشتراك قريب من الانتهاء ولا يمكن إيقافه"
  }'
```

### مثال 5: فلترة متعددة مع Pagination
```bash
curl -X GET "https://api.example.com/api/dashboard/subscription-pause-requests?status=approved&teacher_id=2&per_page=20&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## حالات الاستخدام الشائعة

### 1. عرض لوحة الطلبات
```
GET /api/dashboard/subscription-pause-requests?status=pending&per_page=10
```
لعرض الطلبات قيد الانتظار في الصفحة الرئيسية

### 2. فلترة حسب المعلم
```
GET /api/dashboard/subscription-pause-requests?teacher_id=2&status=pending
```
لعرض طلبات معلم معين قيد الانتظار

### 3. فلترة حسب الطالب
```
GET /api/dashboard/subscription-pause-requests?student_id=1
```
لعرض جميع طلبات طالب معين

### 4. فلترة حسب الفترة الزمنية
```
GET /api/dashboard/subscription-pause-requests?date_from=2024-01-01&date_to=2024-01-31
```
لعرض الطلبات في شهر معين

### 5. الموافقة السريعة
```
POST /api/dashboard/subscription-pause-requests/{id}/approve
```
للموافقة على طلب بدون إدخال بيانات إضافية

### 6. الرفض مع السبب
```
POST /api/dashboard/subscription-pause-requests/{id}/reject
{
  "rejection_reason": "سبب الرفض"
}
```
لرفض طلب مع توضيح السبب

