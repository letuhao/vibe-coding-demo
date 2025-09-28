# 02_API_Spec.md

## Tổng quan
REST API specification cho Expense Manager App, bao gồm authentication, categories, expenses và reports endpoints.

---

## Base Configuration

### Base URL
- **Development**: `http://localhost:3000/api/v1`
- **Staging**: `https://staging-api.expense-manager.com/api/v1`
- **Production**: `https://api.expense-manager.com/api/v1`

### Content Type
- **Request**: `application/json`
- **Response**: `application/json`

### Authentication
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <access_token>`
- **Refresh**: Sử dụng refresh token để lấy access token mới

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be greater than 0"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Authentication Endpoints

### POST /auth/register
Đăng ký tài khoản mới

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": 900
    }
  },
  "message": "User registered successfully"
}
```

### POST /auth/login
Đăng nhập vào hệ thống

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": 900
    }
  },
  "message": "Login successful"
}
```

### POST /auth/refresh
Làm mới access token

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

### POST /auth/logout
Đăng xuất khỏi hệ thống

---

## Category Endpoints

### GET /categories
Lấy danh sách categories của user

**Query Parameters:**
- `type` (optional): `expense` | `income` | `all` (default: `all`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### POST /categories
Tạo category mới

**Request Body:**
```json
{
  "name": "Food & Dining",
  "type": "expense"
}
```

### GET /categories/:id
Lấy thông tin category theo ID

### PUT /categories/:id
Cập nhật category

### DELETE /categories/:id
Xóa category

---

## Expense Endpoints

### GET /expenses
Lấy danh sách expenses của user

**Query Parameters:**
- `categoryId` (optional): Filter by category ID
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `minAmount` (optional): Minimum amount
- `maxAmount` (optional): Maximum amount
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### POST /expenses
Tạo expense mới

**Request Body:**
```json
{
  "amount": 50000,
  "note": "Lunch at restaurant",
  "date": "2024-01-15",
  "categoryId": "uuid"
}
```

### GET /expenses/:id
Lấy thông tin expense theo ID

### PUT /expenses/:id
Cập nhật expense

### DELETE /expenses/:id
Xóa expense

---

## Reports Endpoints

### GET /reports/summary
Lấy báo cáo tổng quan

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `type` (optional): `expense` | `income` | `all` (default: `all`)

### GET /reports/categories
Lấy báo cáo theo categories

### GET /reports/trends
Lấy báo cáo xu hướng chi tiêu

---

## Error Codes

### HTTP Status Codes
- `200`: OK - Request successful
- `201`: Created - Resource created successfully
- `400`: Bad Request - Invalid request data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Access denied
- `404`: Not Found - Resource not found
- `422`: Unprocessable Entity - Validation error
- `500`: Internal Server Error - Server error

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_REQUIRED`: Authentication token required
- `INVALID_CREDENTIALS`: Invalid email or password
- `TOKEN_EXPIRED`: Access token expired
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `ACCESS_DENIED`: User doesn't have permission