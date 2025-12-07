# API Integration Updates Summary

## Overview
All components and API services have been updated to match the actual API response format as documented in `API_DOCUMENTATION.md`.

## Key Changes

### 1. API Response Format
The API wraps all responses in a standard format:
```json
{
    "status": true,
    "message": "Success message",
    "data": {...}
}
```

**Exception:** `/api/user` endpoint returns:
```json
{
    "status": true,
    "message": "...",
    "user": {...}
}
```

### 2. Updated API Client (`lib/api-client.ts`)
- Automatically extracts `data` field from wrapped responses
- Handles special case for `/api/user` endpoint (returns `user` at top level)
- Properly handles error responses with `status: false` and error codes
- Extracts error messages from API error format

### 3. Updated API Service Interfaces

#### Students (`lib/api/students.ts`)
- Added `gender_label` field (localized gender label)
- Added `created_at` and `updated_at` timestamps

#### Teachers (`lib/api/teachers.ts`)
- Added `name_ar` and `specialization_ar` fields
- `name` and `specialization` are now localized based on `Accept-Language` header

#### Packages (`lib/api/packages.ts`)
- Added `name_ar` and `features_ar` fields
- `name` and `features` are now localized based on `Accept-Language` header

#### Reviews (`lib/api/reviews.ts`)
- Added `review_ar` field
- `review` is now localized based on `Accept-Language` header

#### Honor Boards (`lib/api/honor-boards.ts`)
- Added `level_ar` and `achievement_ar` fields
- `level` and `achievement` are now localized based on `Accept-Language` header

#### Sessions (`lib/api/sessions.ts`)
- Added `day_of_week_label` field (localized day label)
- Added `created_at` and `updated_at` timestamps

### 4. Updated Store (`store/useAdminStore.ts`)
- Now uses API types directly instead of redefining them
- All CRUD operations properly handle API response format
- Pagination data correctly extracted from `data.data`, `data.links`, `data.meta`

### 5. Updated Admin Pages
All admin pages have been updated to:
- Use API calls instead of local state
- Handle loading states
- Display error messages
- Use correct data types (numbers instead of strings for IDs)
- Match API field names (`is_popular` instead of `popular`, etc.)

## Response Structure Examples

### Paginated Response
**API Returns:**
```json
{
    "status": true,
    "message": "Students retrieved successfully",
    "data": {
        "data": [...],
        "links": {...},
        "meta": {...}
    }
}
```

**After API Client Extraction:**
```json
{
    "data": [...],
    "links": {...},
    "meta": {...}
}
```

### Single Resource Response
**API Returns:**
```json
{
    "status": true,
    "message": "Student created successfully",
    "data": {
        "id": 1,
        "name": "...",
        ...
    }
}
```

**After API Client Extraction:**
```json
{
    "id": 1,
    "name": "...",
    ...
}
```

### Error Response
**API Returns:**
```json
{
    "status": false,
    "number": "E001",
    "message": "The name field is required."
}
```

**Handled by:** API client throws Error with the message

## Field Name Changes

| Old Name | New Name | Notes |
|----------|----------|-------|
| `popular` | `is_popular` | Boolean field for packages |
| `id` (string) | `id` (number) | All IDs are now numbers |
| `price` (string) | `price` (number) | Package price is numeric |
| `experience` (string) | `experience_years` (number) | Teacher experience |

## Bilingual Support

All endpoints support Arabic and English through the `Accept-Language` header:
- `Accept-Language: ar` - Returns Arabic content (default)
- `Accept-Language: en` - Returns English content

The API returns both `_ar` and `_en` fields, with the main field (`name`, `specialization`, etc.) being localized based on the header.

## Testing Checklist

- [x] API client correctly extracts `data` from responses
- [x] Login endpoint handles `{ data: { user, token } }` format
- [x] `/api/user` endpoint handles `{ user }` format
- [x] Paginated responses correctly extract `data.data`, `data.links`, `data.meta`
- [x] Error responses properly extract error messages
- [x] All interfaces match API response structure
- [x] Store uses correct field names and types
- [x] All admin pages use API calls

## Notes

1. The register form (`components/register/RegisterForm.tsx`) still uses local state (`useStore`) as it's a public form that doesn't require authentication. If you want to integrate it with the API, you'll need to either:
   - Create a public registration endpoint
   - Or handle registration through a different flow

2. All API responses are automatically localized based on the `Accept-Language` header sent with each request.

3. The API client automatically handles token management and redirects to login on 401 errors.

