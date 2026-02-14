# توثيق APIs للمبرمج الفرونت إند
## Frontend API Documentation

---

## 1. API إرسال الإشعارات من الداشبورد

### Endpoint:
```
POST /api/dashboard/notifications/send
```

### Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body:
```json
{
  "title": "عنوان الإشعار",
  "description": "وصف الإشعار",
  "recipient_type": "all"  // "all" | "students" | "teachers"
}
```

### Response:
```json
{
  "status": true,
  "message": "تم إرسال الإشعار بنجاح",
  "data": {
    "notifications_created": 50,
    "notifications_sent": 48,
    "notifications_failed": 2,
    "recipient_type": "all"
  }
}
```

### Validation:
- `title`: مطلوب، نص، أقصى 255 حرف
- `description`: مطلوب، نص
- `recipient_type`: مطلوب، يجب أن يكون: `all` أو `students` أو `teachers`

---

## 2. API مدة الحصة التجريبية للمعلمين

### 2.1. إضافة/تحديث معلم بمدة الحصة التجريبية

#### Endpoint:
```
POST /api/dashboard/teachers
POST /api/dashboard/teachers/{teacher_id}
```

#### Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:
```json
{
  "name": "أحمد محمد",
  "specialization": "القرآن الكريم",
  "experience_years": 5,
  "trial_lesson_price": 50.00,
  "trial_session_duration": 60,  // مدة الحصة التجريبية بالدقائق
  "session_link": "https://meet.google.com/abc-defg-hij"  // رابط الحلقة (اختياري)
}
```

#### Response:
```json
{
  "status": true,
  "message": "تم الحفظ بنجاح",
  "data": {
    "id": 1,
    "name": "أحمد محمد",
    "trial_lesson_price": 50.00,
    "trial_session_duration": 60,
    "session_link": "https://meet.google.com/abc-defg-hij",
    // ... باقي البيانات
  }
}
```

### 2.2. جلب بيانات المعلم

#### Endpoint:
```
GET /api/dashboard/teachers/{teacher_id}
```

#### Response:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "أحمد محمد",
    "trial_lesson_price": 50.00,
    "trial_session_duration": 60,  // ✅ موجود في الـ response
    "session_link": "https://meet.google.com/abc-defg-hij",  // ✅ رابط الحلقة
    // ... باقي البيانات
  }
}
```

---

## 3. APIs المكافآت والخصومات للمعلمين

### 3.1. قائمة المكافآت والخصومات

#### Endpoint:
```
GET /api/dashboard/teachers/{teacher_id}/rewards-deductions
```

#### Query Parameters:
- `type` (optional): `reward` | `deduction` - فلترة حسب النوع
- `month` (optional): `2026-02` - فلترة حسب الشهر (Y-m)
- `search` (optional): نص - بحث في العنوان والوصف
- `per_page` (optional): رقم - عدد النتائج في الصفحة (افتراضي: 15)

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم جلب البيانات بنجاح",
  "data": {
    "rewards_deductions": [
      {
        "id": 1,
        "teacher_id": 1,
        "type": "reward",
        "type_label": "مكافأة",
        "title": "مكافأة الأداء المتميز",
        "description": "مكافأة لتحقيق نتائج ممتازة",
        "amount": 500.00,
        "month": "2026-02",
        "notes": "ملاحظات",
        "created_at": "2026-02-10 10:00:00",
        "updated_at": "2026-02-10 10:00:00"
      },
      {
        "id": 2,
        "teacher_id": 1,
        "type": "deduction",
        "type_label": "خصم",
        "title": "خصم التأخير",
        "description": "خصم بسبب التأخير في الحضور",
        "amount": 100.00,
        "month": "2026-02",
        "notes": "تم التأخير 3 مرات",
        "created_at": "2026-02-10 11:00:00",
        "updated_at": "2026-02-10 11:00:00"
      }
    ],
    "pagination": {
      "total": 2,
      "per_page": 15,
      "current_page": 1,
      "total_pages": 1
    }
  }
}
```

---

### 3.2. إضافة مكافأة/خصم

#### Endpoint:
```
POST /api/dashboard/teachers/{teacher_id}/rewards-deductions
```

#### Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:
```json
{
  "type": "reward",  // "reward" | "deduction"
  "title": "مكافأة الأداء المتميز",
  "description": "مكافأة لتحقيق نتائج ممتازة",
  "amount": 500.00,
  "month": "2026-02",  // تنسيق: Y-m (مثال: 2026-02)
  "notes": "ملاحظات إضافية"  // optional
}
```

#### Response:
```json
{
  "status": true,
  "message": "تم إنشاء المكافأة/الخصم بنجاح",
  "data": {
    "id": 1,
    "teacher_id": 1,
    "type": "reward",
    "type_label": "مكافأة",
    "title": "مكافأة الأداء المتميز",
    "description": "مكافأة لتحقيق نتائج ممتازة",
    "amount": 500.00,
    "month": "2026-02",
    "notes": "ملاحظات إضافية",
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-10 10:00:00"
  }
}
```

#### Validation:
- `type`: مطلوب، يجب أن يكون: `reward` أو `deduction`
- `title`: مطلوب، نص، أقصى 255 حرف
- `description`: اختياري، نص
- `amount`: مطلوب، رقم، يجب أن يكون أكبر من 0.01
- `month`: مطلوب، تنسيق: `Y-m` (مثال: `2026-02`)
- `notes`: اختياري، نص

---

### 3.3. عرض مكافأة/خصم

#### Endpoint:
```
GET /api/dashboard/teachers/{teacher_id}/rewards-deductions/{reward_deduction_id}
```

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم جلب البيانات بنجاح",
  "data": {
    "id": 1,
    "teacher_id": 1,
    "type": "reward",
    "type_label": "مكافأة",
    "title": "مكافأة الأداء المتميز",
    "description": "مكافأة لتحقيق نتائج ممتازة",
    "amount": 500.00,
    "month": "2026-02",
    "notes": "ملاحظات",
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-10 10:00:00",
    "teacher": {
      "id": 1,
      "name": "أحمد محمد"
    }
  }
}
```

---

### 3.4. تحديث مكافأة/خصم

#### Endpoint:
```
POST /api/dashboard/teachers/{teacher_id}/rewards-deductions/{reward_deduction_id}
```

#### Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:
```json
{
  "type": "reward",  // optional
  "title": "مكافأة الأداء المتميز - محدث",  // optional
  "description": "مكافأة محدثة",  // optional
  "amount": 600.00,  // optional
  "month": "2026-02",  // optional
  "notes": "ملاحظات محدثة"  // optional
}
```

#### Response:
```json
{
  "status": true,
  "message": "تم تحديث المكافأة/الخصم بنجاح",
  "data": {
    "id": 1,
    "teacher_id": 1,
    "type": "reward",
    "type_label": "مكافأة",
    "title": "مكافأة الأداء المتميز - محدث",
    "description": "مكافأة محدثة",
    "amount": 600.00,
    "month": "2026-02",
    "notes": "ملاحظات محدثة",
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-10 12:00:00"
  }
}
```

---

### 3.5. حذف مكافأة/خصم

#### Endpoint:
```
DELETE /api/dashboard/teachers/{teacher_id}/rewards-deductions/{reward_deduction_id}
```

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم حذف المكافأة/الخصم بنجاح",
  "data": null
}
```

---

### 3.6. حساب الراتب مع المكافآت والخصومات

#### Endpoint:
```
GET /api/dashboard/teachers/{teacher_id}/salary?month=2026-02
```

#### Query Parameters:
- `month` (required): `2026-02` - الشهر (Y-m)

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
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
    "month": "2026-02",
    "students": [
      // ... بيانات الطلاب
    ],
    "summary": {
      "total_students": 5,
      "total_sessions": 40,
      "total_trial_sessions": 2,
      "total_hours": 40.00,
      "total_trial_amount": 100.00,
      "total_amount": 5000.00,      // ✅ مجموع الحصص
      "total_rewards": 500.00,      // ✅ مجموع المكافآت
      "total_deductions": 100.00,   // ✅ مجموع الخصومات
      "final_amount": 5400.00       // ✅ المبلغ النهائي (الحصص + المكافآت - الخصومات)
    },
    "rewards": [
      {
        "id": 1,
        "title": "مكافأة الأداء المتميز",
        "description": "مكافأة لتحقيق نتائج ممتازة",
        "amount": 500.00,
        "notes": "ملاحظات"
      }
    ],
    "deductions": [
      {
        "id": 2,
        "title": "خصم التأخير",
        "description": "خصم بسبب التأخير في الحضور",
        "amount": 100.00,
        "notes": "تم التأخير 3 مرات"
      }
    ],
    "payment_methods": [
      // ... طرق الدفع
    ],
    "payment": null  // أو بيانات الدفع إذا تم الدفع
  }
}
```

#### ملاحظات مهمة:
- `final_amount = total_amount + total_rewards - total_deductions`
- المكافآت والخصومات مرتبطة بشهر محدد
- عند حساب الراتب، يتم إرجاع قائمة المكافآت والخصومات في نفس الشهر

---

## ملخص الـ APIs المضافة:

1. **POST** `/api/dashboard/notifications/send` - إرسال إشعارات
2. **POST/POST** `/api/dashboard/teachers` - إضافة/تحديث معلم (مع `trial_session_duration`)
3. **GET** `/api/dashboard/teachers/{teacher_id}` - جلب بيانات المعلم (يحتوي على `trial_session_duration`)
4. **GET** `/api/dashboard/teachers/{teacher_id}/rewards-deductions` - قائمة المكافآت والخصومات
5. **POST** `/api/dashboard/teachers/{teacher_id}/rewards-deductions` - إضافة مكافأة/خصم
6. **GET** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - عرض مكافأة/خصم
7. **POST** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - تحديث مكافأة/خصم
8. **DELETE** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - حذف مكافأة/خصم
9. **GET** `/api/dashboard/teachers/{teacher_id}/salary?month=Y-m` - حساب الراتب (يحتوي على المكافآت والخصومات)

---

## أمثلة على الاستخدام:

### مثال 1: إرسال إشعار
```javascript
const response = await fetch('/api/dashboard/notifications/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'إشعار مهم',
    description: 'هذا إشعار تجريبي',
    recipient_type: 'all'
  })
});
```

### مثال 2: إضافة مكافأة
```javascript
const response = await fetch(`/api/dashboard/teachers/${teacherId}/rewards-deductions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'reward',
    title: 'مكافأة الأداء المتميز',
    description: 'مكافأة لتحقيق نتائج ممتازة',
    amount: 500.00,
    month: '2026-02',
    notes: 'ملاحظات'
  })
});
```

### مثال 3: جلب حساب الراتب
```javascript
const response = await fetch(`/api/dashboard/teachers/${teacherId}/salary?month=2026-02`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('المبلغ النهائي:', data.data.summary.final_amount);
console.log('المكافآت:', data.data.rewards);
console.log('الخصومات:', data.data.deductions);
```

---

## 4. APIs رواتب المشرفين

### 4.1. قائمة رواتب المشرف

#### Endpoint:
```
GET /api/dashboard/supervisors/{supervisor_id}/salaries
```

#### Query Parameters:
- `month` (optional): `2026-02` - فلترة حسب الشهر (Y-m)
- `is_paid` (optional): `true` | `false` - فلترة حسب حالة السداد
- `per_page` (optional): رقم - عدد النتائج في الصفحة (افتراضي: 15)

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم جلب البيانات بنجاح",
  "data": {
    "salaries": [
      {
        "id": 1,
        "supervisor_id": 1,
        "month": "2026-02",
        "amount": 5000.00,
        "is_paid": false,
        "payment_proof_image": null,
        "paid_at": null,
        "notes": "راتب شهر فبراير",
        "created_at": "2026-02-10 10:00:00",
        "updated_at": "2026-02-10 10:00:00",
        "supervisor": {
          "id": 1,
          "name": "أحمد المشرف",
          "username": "ahmed_supervisor"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "per_page": 15,
      "current_page": 1,
      "total_pages": 1
    }
  }
}
```

---

### 4.2. إضافة راتب للمشرف

#### Endpoint:
```
POST /api/dashboard/supervisors/{supervisor_id}/salaries
```

#### Headers:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

#### Request Body:
```json
{
  "month": "2026-02",  // تنسيق: Y-m (مثال: 2026-02)
  "amount": 5000.00,
  "is_paid": false,  // optional
  "payment_proof_image": "file",  // optional - صورة التحويل
  "notes": "راتب شهر فبراير"  // optional
}
```

#### Response:
```json
{
  "status": true,
  "message": "تم إنشاء الراتب بنجاح",
  "data": {
    "id": 1,
    "supervisor_id": 1,
    "month": "2026-02",
    "amount": 5000.00,
    "is_paid": false,
    "payment_proof_image": "http://example.com/Admin/images/supervisor-payment-proofs/1234567890_abc.jpg",
    "paid_at": null,
    "notes": "راتب شهر فبراير",
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-10 10:00:00",
    "supervisor": {
      "id": 1,
      "name": "أحمد المشرف",
      "username": "ahmed_supervisor"
    }
  }
}
```

#### Validation:
- `month`: مطلوب، تنسيق: `Y-m` (مثال: `2026-02`)
- `amount`: مطلوب، رقم، يجب أن يكون أكبر من 0.01
- `is_paid`: اختياري، boolean
- `payment_proof_image`: اختياري، صورة (jpeg, png, jpg, gif)، أقصى 5 ميجابايت
- `notes`: اختياري، نص

#### ملاحظات:
- لا يمكن إضافة راتب لنفس المشرف لنفس الشهر مرتين (سيتم إرجاع خطأ)

---

### 4.3. عرض راتب محدد

#### Endpoint:
```
GET /api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}
```

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم جلب البيانات بنجاح",
  "data": {
    "id": 1,
    "supervisor_id": 1,
    "month": "2026-02",
    "amount": 5000.00,
    "is_paid": true,
    "payment_proof_image": "http://example.com/Admin/images/supervisor-payment-proofs/1234567890_abc.jpg",
    "paid_at": "2026-02-15 14:30:00",
    "notes": "تم السداد",
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-15 14:30:00",
    "supervisor": {
      "id": 1,
      "name": "أحمد المشرف",
      "username": "ahmed_supervisor"
    }
  }
}
```

---

### 4.4. تحديث راتب المشرف

#### Endpoint:
```
POST /api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}
```

#### Headers:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

#### Request Body:
```json
{
  "month": "2026-02",  // optional
  "amount": 5500.00,  // optional
  "is_paid": true,  // optional
  "payment_proof_image": "file",  // optional - صورة التحويل
  "notes": "تم تحديث الراتب"  // optional
}
```

#### Response:
```json
{
  "status": true,
  "message": "تم تحديث الراتب بنجاح",
  "data": {
    "id": 1,
    "supervisor_id": 1,
    "month": "2026-02",
    "amount": 5500.00,
    "is_paid": true,
    "payment_proof_image": "http://example.com/Admin/images/supervisor-payment-proofs/1234567890_abc.jpg",
    "paid_at": "2026-02-15 14:30:00",
    "notes": "تم تحديث الراتب",
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-15 15:00:00",
    "supervisor": {
      "id": 1,
      "name": "أحمد المشرف",
      "username": "ahmed_supervisor"
    }
  }
}
```

#### ملاحظات:
- عند تغيير `is_paid` إلى `true`، يتم تحديث `paid_at` تلقائياً إلى الوقت الحالي
- عند تغيير `is_paid` إلى `false`، يتم حذف `paid_at`
- لا يمكن تغيير الشهر إلى شهر موجود بالفعل لنفس المشرف (سيتم إرجاع خطأ)
- عند رفع صورة جديدة، يتم حذف الصورة القديمة تلقائياً

---

### 4.5. حذف راتب المشرف

#### Endpoint:
```
DELETE /api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}
```

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم حذف الراتب بنجاح",
  "data": null
}
```

#### ملاحظات:
- عند الحذف، يتم حذف صورة التحويل تلقائياً إذا كانت موجودة

---

## ملخص الـ APIs المضافة:

1. **POST** `/api/dashboard/notifications/send` - إرسال إشعارات
2. **POST/POST** `/api/dashboard/teachers` - إضافة/تحديث معلم (مع `trial_session_duration`)
3. **GET** `/api/dashboard/teachers/{teacher_id}` - جلب بيانات المعلم (يحتوي على `trial_session_duration`)
4. **GET** `/api/dashboard/teachers/{teacher_id}/rewards-deductions` - قائمة المكافآت والخصومات
5. **POST** `/api/dashboard/teachers/{teacher_id}/rewards-deductions` - إضافة مكافأة/خصم
6. **GET** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - عرض مكافأة/خصم
7. **POST** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - تحديث مكافأة/خصم
8. **DELETE** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - حذف مكافأة/خصم
9. **GET** `/api/dashboard/teachers/{teacher_id}/salary?month=Y-m` - حساب الراتب (يحتوي على المكافآت والخصومات)
10. **GET** `/api/dashboard/supervisors/{supervisor_id}/salaries` - قائمة رواتب المشرف
11. **POST** `/api/dashboard/supervisors/{supervisor_id}/salaries` - إضافة راتب للمشرف
12. **GET** `/api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}` - عرض راتب محدد
13. **POST** `/api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}` - تحديث راتب المشرف
14. **DELETE** `/api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}` - حذف راتب المشرف

---

## أمثلة على الاستخدام:

### مثال 1: إرسال إشعار
```javascript
const response = await fetch('/api/dashboard/notifications/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'إشعار مهم',
    description: 'هذا إشعار تجريبي',
    recipient_type: 'all'
  })
});
```

### مثال 2: إضافة مكافأة
```javascript
const response = await fetch(`/api/dashboard/teachers/${teacherId}/rewards-deductions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'reward',
    title: 'مكافأة الأداء المتميز',
    description: 'مكافأة لتحقيق نتائج ممتازة',
    amount: 500.00,
    month: '2026-02',
    notes: 'ملاحظات'
  })
});
```

### مثال 3: جلب حساب الراتب
```javascript
const response = await fetch(`/api/dashboard/teachers/${teacherId}/salary?month=2026-02`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('المبلغ النهائي:', data.data.summary.final_amount);
console.log('المكافآت:', data.data.rewards);
console.log('الخصومات:', data.data.deductions);
```

### مثال 4: إضافة راتب للمشرف
```javascript
const formData = new FormData();
formData.append('month', '2026-02');
formData.append('amount', '5000.00');
formData.append('is_paid', 'false');
formData.append('notes', 'راتب شهر فبراير');
// formData.append('payment_proof_image', fileInput.files[0]); // optional

const response = await fetch(`/api/dashboard/supervisors/${supervisorId}/salaries`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log('الراتب المضاف:', data.data);
```

### مثال 5: تحديث راتب المشرف
```javascript
const formData = new FormData();
formData.append('amount', '5500.00');
formData.append('is_paid', 'true');
formData.append('notes', 'تم السداد');
// formData.append('payment_proof_image', fileInput.files[0]); // optional

const response = await fetch(`/api/dashboard/supervisors/${supervisorId}/salaries/${salaryId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log('الراتب المحدث:', data.data);
```

### مثال 6: جلب قائمة رواتب المشرف
```javascript
const response = await fetch(`/api/dashboard/supervisors/${supervisorId}/salaries?month=2026-02&is_paid=false`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('الرواتب:', data.data.salaries);
console.log('إجمالي:', data.data.pagination.total);
```

---

## 5. APIs سياسة الأكاديمية

### 5.1. قائمة سياسات الأكاديمية

#### Endpoint:
```
GET /api/dashboard/academy-policies
```

#### Query Parameters:
- `is_active` (optional): `true` | `false` - فلترة حسب حالة التفعيل
- `per_page` (optional): رقم - عدد النتائج في الصفحة (افتراضي: 15)

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم جلب سياسات الأكاديمية بنجاح",
  "data": {
    "policies": [
      {
        "id": 1,
        "content": "نص السياسة بالعربية",  // يعرض حسب اللغة المحددة
        "content_ar": "نص السياسة بالعربية",
        "content_en": "Policy text in English",
        "is_active": true,
        "created_at": "2026-02-10 10:00:00",
        "updated_at": "2026-02-10 10:00:00"
      }
    ],
    "pagination": {
      "total": 1,
      "per_page": 15,
      "current_page": 1,
      "total_pages": 1
    }
  }
}
```

---

### 5.2. إضافة سياسة جديدة

#### Endpoint:
```
POST /api/dashboard/academy-policies
```

#### Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:
```json
{
  "content_ar": "نص السياسة بالعربية",  // مطلوب
  "content_en": "Policy text in English",  // optional
  "is_active": true  // optional، افتراضي: true
}
```

#### Response:
```json
{
  "status": true,
  "message": "تم إنشاء سياسة الأكاديمية بنجاح",
  "data": {
    "id": 1,
    "content": "نص السياسة بالعربية",
    "content_ar": "نص السياسة بالعربية",
    "content_en": "Policy text in English",
    "is_active": true,
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-10 10:00:00"
  }
}
```

#### Validation:
- `content_ar`: مطلوب، نص
- `content_en`: اختياري، نص
- `is_active`: اختياري، boolean (افتراضي: true)

---

### 5.3. عرض سياسة محددة

#### Endpoint:
```
GET /api/dashboard/academy-policies/{policy_id}
```

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم جلب بيانات سياسة الأكاديمية بنجاح",
  "data": {
    "id": 1,
    "content": "نص السياسة بالعربية",
    "content_ar": "نص السياسة بالعربية",
    "content_en": "Policy text in English",
    "is_active": true,
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-10 10:00:00"
  }
}
```

---

### 5.4. تحديث سياسة

#### Endpoint:
```
POST /api/dashboard/academy-policies/{policy_id}
```

#### Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:
```json
{
  "content_ar": "نص محدث بالعربية",  // optional
  "content_en": "Updated policy text",  // optional
  "is_active": false  // optional
}
```

#### Response:
```json
{
  "status": true,
  "message": "تم تحديث سياسة الأكاديمية بنجاح",
  "data": {
    "id": 1,
    "content": "نص محدث بالعربية",
    "content_ar": "نص محدث بالعربية",
    "content_en": "Updated policy text",
    "is_active": false,
    "created_at": "2026-02-10 10:00:00",
    "updated_at": "2026-02-10 12:00:00"
  }
}
```

---

### 5.5. حذف سياسة

#### Endpoint:
```
DELETE /api/dashboard/academy-policies/{policy_id}
```

#### Headers:
```
Authorization: Bearer {token}
```

#### Response:
```json
{
  "status": true,
  "message": "تم حذف سياسة الأكاديمية بنجاح",
  "data": null
}
```

#### ملاحظات:
- يتم استخدام Soft Delete (يمكن استرجاع البيانات المحذوفة)
- عند الحذف، يتم وضع علامة `deleted_at` فقط

---

## ملخص الـ APIs المضافة:

1. **POST** `/api/dashboard/notifications/send` - إرسال إشعارات
2. **POST/POST** `/api/dashboard/teachers` - إضافة/تحديث معلم (مع `trial_session_duration`)
3. **GET** `/api/dashboard/teachers/{teacher_id}` - جلب بيانات المعلم (يحتوي على `trial_session_duration`)
4. **GET** `/api/dashboard/teachers/{teacher_id}/rewards-deductions` - قائمة المكافآت والخصومات
5. **POST** `/api/dashboard/teachers/{teacher_id}/rewards-deductions` - إضافة مكافأة/خصم
6. **GET** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - عرض مكافأة/خصم
7. **POST** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - تحديث مكافأة/خصم
8. **DELETE** `/api/dashboard/teachers/{teacher_id}/rewards-deductions/{id}` - حذف مكافأة/خصم
9. **GET** `/api/dashboard/teachers/{teacher_id}/salary?month=Y-m` - حساب الراتب (يحتوي على المكافآت والخصومات)
10. **GET** `/api/dashboard/supervisors/{supervisor_id}/salaries` - قائمة رواتب المشرف
11. **POST** `/api/dashboard/supervisors/{supervisor_id}/salaries` - إضافة راتب للمشرف
12. **GET** `/api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}` - عرض راتب محدد
13. **POST** `/api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}` - تحديث راتب المشرف
14. **DELETE** `/api/dashboard/supervisors/{supervisor_id}/salaries/{salary_id}` - حذف راتب المشرف
15. **GET** `/api/dashboard/academy-policies` - قائمة سياسات الأكاديمية
16. **POST** `/api/dashboard/academy-policies` - إضافة سياسة جديدة
17. **GET** `/api/dashboard/academy-policies/{policy_id}` - عرض سياسة محددة
18. **POST** `/api/dashboard/academy-policies/{policy_id}` - تحديث سياسة
19. **DELETE** `/api/dashboard/academy-policies/{policy_id}` - حذف سياسة

---

## أمثلة على الاستخدام:

### مثال 1: إرسال إشعار
```javascript
const response = await fetch('/api/dashboard/notifications/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'إشعار مهم',
    description: 'هذا إشعار تجريبي',
    recipient_type: 'all'
  })
});
```

### مثال 2: إضافة مكافأة
```javascript
const response = await fetch(`/api/dashboard/teachers/${teacherId}/rewards-deductions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'reward',
    title: 'مكافأة الأداء المتميز',
    description: 'مكافأة لتحقيق نتائج ممتازة',
    amount: 500.00,
    month: '2026-02',
    notes: 'ملاحظات'
  })
});
```

### مثال 3: جلب حساب الراتب
```javascript
const response = await fetch(`/api/dashboard/teachers/${teacherId}/salary?month=2026-02`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('المبلغ النهائي:', data.data.summary.final_amount);
console.log('المكافآت:', data.data.rewards);
console.log('الخصومات:', data.data.deductions);
```

### مثال 4: إضافة راتب للمشرف
```javascript
const formData = new FormData();
formData.append('month', '2026-02');
formData.append('amount', '5000.00');
formData.append('is_paid', 'false');
formData.append('notes', 'راتب شهر فبراير');
// formData.append('payment_proof_image', fileInput.files[0]); // optional

const response = await fetch(`/api/dashboard/supervisors/${supervisorId}/salaries`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log('الراتب المضاف:', data.data);
```

### مثال 5: تحديث راتب المشرف
```javascript
const formData = new FormData();
formData.append('amount', '5500.00');
formData.append('is_paid', 'true');
formData.append('notes', 'تم السداد');
// formData.append('payment_proof_image', fileInput.files[0]); // optional

const response = await fetch(`/api/dashboard/supervisors/${supervisorId}/salaries/${salaryId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log('الراتب المحدث:', data.data);
```

### مثال 6: جلب قائمة رواتب المشرف
```javascript
const response = await fetch(`/api/dashboard/supervisors/${supervisorId}/salaries?month=2026-02&is_paid=false`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('الرواتب:', data.data.salaries);
console.log('إجمالي:', data.data.pagination.total);
```

### مثال 7: إضافة سياسة جديدة
```javascript
const response = await fetch('/api/dashboard/academy-policies', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content_ar: 'نص السياسة بالعربية',
    content_en: 'Policy text in English',
    is_active: true
  })
});

const data = await response.json();
console.log('السياسة المضافة:', data.data);
```

### مثال 8: جلب قائمة السياسات
```javascript
const response = await fetch('/api/dashboard/academy-policies?is_active=true&per_page=15', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('السياسات:', data.data.policies);
console.log('إجمالي:', data.data.pagination.total);
```

### مثال 9: تحديث سياسة
```javascript
const response = await fetch(`/api/dashboard/academy-policies/${policyId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content_ar: 'نص محدث بالعربية',
    is_active: false
  })
});

const data = await response.json();
console.log('السياسة المحدثة:', data.data);
```

---

## نهاية التوثيق
