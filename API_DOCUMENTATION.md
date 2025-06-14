# Lynk Labs - API Documentation

## 📋 API Overview

The Lynk Labs API follows RESTful principles and provides comprehensive endpoints for managing lab tests, orders, users, and administrative functions. All API responses are in JSON format.

## 🔐 Authentication

### Authentication Methods
1. **JWT Tokens** - For web application
2. **API Keys** - For third-party integrations
3. **OAuth 2.0** - For social login

### Headers Required
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-API-Version: 1.0
```

### Authentication Endpoints

#### **POST /api/auth/login**
User login with credentials

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "success": false,
  "error": "Invalid credentials"
}

// 400 Bad Request
{
  "success": false,
  "error": "Email and password are required"
}
```

#### **POST /api/auth/register**
User registration

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securepassword",
  "phone": "+91-9876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### **POST /api/auth/logout**
User logout

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### **GET /api/auth/me**
Get current user information

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91-9876543210",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 🛒 Checkout System API

### Order Creation Endpoint

#### **POST /api/orders**
Create a new order with comprehensive validation and error handling

**Authentication Required:** Yes (JWT Token)

**Request Body:**
```json
{
  "items": [
    {
      "testId": "cmbwf98g7000npxmavi1jjmxt",
      "quantity": 1,
      "price": 249
    }
  ],
  "addressId": "cmbwfam800002oyzyvvpreisy",
  "scheduledDate": "2024-06-15",
  "scheduledTime": "09:00-12:00",
  "paymentMethod": "cod",
  "totalAmount": 249
}
```

**Validation Rules:**
- `items`: Required array with at least one item
- `testId`: Must exist in database and be active
- `quantity`: Must be positive integer
- `price`: Must match current test price
- `addressId`: Must belong to authenticated user
- `scheduledDate`: Must be future date in YYYY-MM-DD format
- `scheduledTime`: Must be valid time slot
- `paymentMethod`: Either "cod" or "razorpay"
- `totalAmount`: Must match calculated total

**Response (201):**
```json
{
  "success": true,
  "order": {
    "id": "cmbwfbm9x0003oyzyvvpreisy",
    "orderNumber": "LL2025534042",
    "status": "PENDING",
    "totalAmount": 249,
    "discountAmount": 0,
    "finalAmount": 249,
    "paymentMethod": "cod",
    "createdAt": "2024-01-01T00:00:00Z",
    "items": [
      {
        "id": "item_123",
        "testId": "cmbwf98g7000npxmavi1jjmxt",
        "quantity": 1,
        "price": 249,
        "test": {
          "name": "Complete Blood Count (CBC)",
          "slug": "complete-blood-count-cbc"
        }
      }
    ],
    "homeVisit": {
      "id": "visit_123",
      "scheduledDate": "2024-06-15",
      "scheduledTime": "09:00-12:00",
      "status": "SCHEDULED"
    }
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "success": false,
  "error": "Authentication required"
}

// 400 Bad Request - Validation Error
{
  "success": false,
  "error": "Invalid test ID: cmbuy13bu000fajpn9mhpdie4"
}

// 400 Bad Request - Address Error
{
  "success": false,
  "error": "Address not found or doesn't belong to user"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Failed to create order. Please try again."
}
```

### Address Management for Checkout

#### **GET /api/addresses**
Get user addresses for checkout

**Authentication Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "addresses": [
    {
      "id": "cmbwfam800002oyzyvvpreisy",
      "type": "HOME",
      "line1": "123 Test Street",
      "line2": "Apt 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "landmark": null,
      "isDefault": true
    }
  ]
}
```

#### **POST /api/addresses**
Create new address during checkout

**Request Body:**
```json
{
  "type": "HOME",
  "line1": "123 New Street",
  "line2": "Apt 5C",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400002",
  "landmark": "Near City Mall"
}
```

**Response (201):**
```json
{
  "success": true,
  "address": {
    "id": "new_address_id",
    "type": "HOME",
    "line1": "123 New Street",
    "line2": "Apt 5C",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002",
    "landmark": "Near City Mall",
    "isDefault": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Payment Integration

#### **POST /api/payments/create-order**
Create Razorpay order for online payment

**Authentication Required:** Yes

**Request Body:**
```json
{
  "amount": 24900,
  "currency": "INR",
  "orderId": "cmbwfbm9x0003oyzyvvpreisy"
}
```

**Response (200):**
```json
{
  "success": true,
  "razorpayOrder": {
    "id": "order_razorpay_123",
    "amount": 24900,
    "currency": "INR",
    "status": "created"
  }
}
```

#### **POST /api/payments/verify**
Verify Razorpay payment after successful payment

**Request Body:**
```json
{
  "razorpay_order_id": "order_razorpay_123",
  "razorpay_payment_id": "pay_razorpay_123",
  "razorpay_signature": "signature_hash",
  "orderId": "cmbwfbm9x0003oyzyvvpreisy"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "order": {
    "id": "cmbwfbm9x0003oyzyvvpreisy",
    "status": "CONFIRMED",
    "paymentId": "pay_razorpay_123"
  }
}
```

---

## 👥 User Management

### User Profile Endpoints

#### **GET /api/users/profile**
Get user profile information

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+91-9876543210",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "addresses": [
      {
        "id": "addr_123",
        "type": "HOME",
        "line1": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "isDefault": true
      }
    ]
  }
}
```

#### **PUT /api/users/profile**
Update user profile

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+91-9876543211",
  "dateOfBirth": "1990-01-01",
  "gender": "Male"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_123",
    "name": "John Doe Updated",
    // ... updated user data
  }
}
```

### Address Management

#### **GET /api/users/addresses**
Get user addresses

**Response (200):**
```json
{
  "success": true,
  "addresses": [
    {
      "id": "addr_123",
      "type": "HOME",
      "line1": "123 Main Street",
      "line2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "landmark": "Near City Mall",
      "isDefault": true
    }
  ]
}
```

#### **POST /api/users/addresses**
Add new address

**Request Body:**
```json
{
  "type": "HOME",
  "line1": "123 Main Street",
  "line2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "landmark": "Near City Mall",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Address added successfully",
  "address": {
    "id": "addr_124",
    // ... address data
  }
}
```

#### **PUT /api/users/addresses/[id]**
Update address

#### **DELETE /api/users/addresses/[id]**
Delete address

---

## 🧪 Test Catalog

### Test Categories

#### **GET /api/categories**
Get all test categories

**Query Parameters:**
- `parent` (optional): Get subcategories of a parent category
- `active` (optional): Filter by active status (default: true)

**Response (200):**
```json
{
  "success": true,
  "categories": [
    {
      "id": "cat_123",
      "name": "Blood Tests",
      "slug": "blood-tests",
      "description": "Comprehensive blood analysis tests",
      "icon": "blood-drop-icon",
      "parentId": null,
      "children": [
        {
          "id": "cat_124",
          "name": "Complete Blood Count",
          "slug": "complete-blood-count",
          "parentId": "cat_123"
        }
      ],
      "testCount": 25
    }
  ]
}
```

#### **POST /api/categories** (Admin Only)
Create new category

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description",
  "parentId": "cat_123",
  "icon": "icon-name"
}
```

### Test Management

#### **GET /api/tests**
Get all tests with filtering and pagination

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `categoryId`: Filter by category
- `search`: Search in test name and description
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sortBy`: Sort by (name, price, popularity)
- `sortOrder`: Sort order (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "tests": [
    {
      "id": "test_123",
      "name": "Complete Blood Count (CBC)",
      "slug": "complete-blood-count-cbc",
      "description": "Comprehensive blood analysis including RBC, WBC, platelets",
      "price": 299.00,
      "discountPrice": 249.00,
      "preparationInstructions": "12-hour fasting required",
      "reportTime": "24 hours",
      "category": {
        "id": "cat_123",
        "name": "Blood Tests",
        "slug": "blood-tests"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

#### **GET /api/tests/[slug]**
Get test details by slug

**Response (200):**
```json
{
  "success": true,
  "test": {
    "id": "test_123",
    "name": "Complete Blood Count (CBC)",
    "slug": "complete-blood-count-cbc",
    "description": "Comprehensive blood analysis...",
    "price": 299.00,
    "discountPrice": 249.00,
    "preparationInstructions": "12-hour fasting required",
    "reportTime": "24 hours",
    "category": {
      "id": "cat_123",
      "name": "Blood Tests"
    },
    "relatedTests": [
      {
        "id": "test_124",
        "name": "Blood Sugar Test",
        "price": 150.00
      }
    ]
  }
}
```

#### **POST /api/tests** (Admin Only)
Create new test

**Request Body:**
```json
{
  "name": "New Test",
  "description": "Test description",
  "price": 299.00,
  "discountPrice": 249.00,
  "categoryId": "cat_123",
  "preparationInstructions": "Instructions here",
  "reportTime": "24 hours"
}
```

#### **PUT /api/tests/[id]** (Admin Only)
Update test

#### **DELETE /api/tests/[id]** (Admin Only)
Delete test

---

## 🛒 Shopping Cart

#### **GET /api/cart**
Get user's cart items

**Response (200):**
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "id": "cart_123",
        "test": {
          "id": "test_123",
          "name": "Complete Blood Count",
          "price": 299.00,
          "discountPrice": 249.00
        },
        "quantity": 1,
        "totalPrice": 249.00
      }
    ],
    "summary": {
      "itemCount": 1,
      "subtotal": 249.00,
      "discount": 50.00,
      "tax": 0.00,
      "total": 249.00
    }
  }
}
```

#### **POST /api/cart/add**
Add item to cart

**Request Body:**
```json
{
  "testId": "test_123",
  "quantity": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cartItem": {
    "id": "cart_123",
    "testId": "test_123",
    "quantity": 1
  }
}
```

#### **PUT /api/cart/[id]**
Update cart item quantity

**Request Body:**
```json
{
  "quantity": 2
}
```

#### **DELETE /api/cart/[id]**
Remove item from cart

#### **DELETE /api/cart/clear**
Clear all cart items

---

## 📦 Order Management

#### **GET /api/orders**
Get user's orders

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `status`: Filter by order status

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_123",
      "orderNumber": "LL2024001",
      "status": "CONFIRMED",
      "totalAmount": 299.00,
      "finalAmount": 249.00,
      "orderItems": [
        {
          "test": {
            "name": "Complete Blood Count",
            "price": 249.00
          },
          "quantity": 1
        }
      ],
      "homeVisit": {
        "scheduledDate": "2024-01-15",
        "scheduledTime": "10:00 AM",
        "status": "SCHEDULED"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

#### **GET /api/orders/[id]**
Get order details

**Response (200):**
```json
{
  "success": true,
  "order": {
    "id": "order_123",
    "orderNumber": "LL2024001",
    "status": "CONFIRMED",
    "totalAmount": 299.00,
    "discountAmount": 50.00,
    "finalAmount": 249.00,
    "paymentMethod": "stripe",
    "paymentId": "pi_123",
    "address": {
      "line1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "orderItems": [
      {
        "test": {
          "id": "test_123",
          "name": "Complete Blood Count",
          "description": "Comprehensive blood analysis"
        },
        "quantity": 1,
        "price": 249.00
      }
    ],
    "homeVisit": {
      "scheduledDate": "2024-01-15",
      "scheduledTime": "10:00 AM",
      "status": "SCHEDULED",
      "agent": {
        "name": "Agent Name",
        "phone": "+91-9876543210"
      }
    },
    "statusHistory": [
      {
        "status": "PENDING",
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "status": "CONFIRMED",
        "createdAt": "2024-01-01T01:00:00Z"
      }
    ]
  }
}
```

#### **POST /api/orders**
Create new order

**Request Body:**
```json
{
  "items": [
    {
      "testId": "test_123",
      "quantity": 1
    }
  ],
  "addressId": "addr_123",
  "homeVisit": {
    "scheduledDate": "2024-01-15",
    "scheduledTime": "10:00"
  },
  "couponCode": "SAVE10",
  "paymentMethod": "stripe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "order_123",
    "orderNumber": "LL2024001",
    "paymentIntent": {
      "clientSecret": "pi_123_secret_456"
    }
  }
}
```

#### **PUT /api/orders/[id]/cancel**
Cancel order

#### **PUT /api/orders/[id]/status** (Admin Only)
Update order status

---

## 🏠 Home Visit Management

#### **GET /api/home-visits/slots**
Get available time slots

**Query Parameters:**
- `date`: Date for which to get slots (YYYY-MM-DD)
- `pincode`: Area pincode

**Response (200):**
```json
{
  "success": true,
  "slots": [
    {
      "time": "09:00",
      "label": "9:00 AM",
      "available": true
    },
    {
      "time": "10:00",
      "label": "10:00 AM",
      "available": true
    },
    {
      "time": "11:00",
      "label": "11:00 AM",
      "available": false
    }
  ]
}
```

#### **POST /api/home-visits/book**
Book home visit slot

**Request Body:**
```json
{
  "orderId": "order_123",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "10:00",
  "notes": "Please call before visiting"
}
```

#### **GET /api/home-visits/[id]** (Agent/Admin)
Get home visit details

#### **PUT /api/home-visits/[id]/status** (Agent)
Update home visit status

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "otp": "123456",
  "notes": "Started sample collection"
}
```

---

## 💳 Payment Processing

#### **POST /api/payments/create-intent**
Create payment intent

**Request Body:**
```json
{
  "orderId": "order_123",
  "amount": 24900,  // Amount in paise (₹249.00)
  "currency": "inr"
}
```

**Response (200):**
```json
{
  "success": true,
  "clientSecret": "pi_123_secret_456",
  "publishableKey": "pk_test_123"
}
```

#### **POST /api/payments/confirm**
Confirm payment

**Request Body:**
```json
{
  "paymentIntentId": "pi_123",
  "orderId": "order_123"
}
```

#### **POST /api/payments/webhook**
Payment webhook endpoint

#### **GET /api/payments/[id]** (Admin)
Get payment details

---

## 🎟️ Coupon Management

#### **GET /api/coupons/validate**
Validate coupon code

**Query Parameters:**
- `code`: Coupon code
- `amount`: Order amount for validation

**Response (200):**
```json
{
  "success": true,
  "coupon": {
    "id": "coupon_123",
    "code": "SAVE10",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "maxDiscount": 100,
    "minOrderAmount": 500
  },
  "discount": 50.00
}
```

#### **POST /api/coupons** (Admin Only)
Create coupon

#### **GET /api/coupons** (Admin Only)
Get all coupons

---

## 📋 Report Management

#### **GET /api/reports**
Get user's reports

**Response (200):**
```json
{
  "success": true,
  "reports": [
    {
      "id": "report_123",
      "order": {
        "orderNumber": "LL2024001",
        "tests": ["Complete Blood Count"]
      },
      "fileName": "CBC_Report_2024.pdf",
      "fileSize": 1024000,
      "uploadedAt": "2024-01-16T00:00:00Z",
      "isDelivered": true,
      "downloadUrl": "/api/reports/report_123/download"
    }
  ]
}
```

#### **GET /api/reports/[id]/download**
Download report file

**Response (200):**
- Returns PDF file with proper headers

#### **POST /api/reports** (Admin Only)
Upload report

**Request Body (multipart/form-data):**
```
orderId: order_123
file: [PDF file]
```

#### **POST /api/reports/[id]/deliver** (Admin Only)
Deliver report via email/WhatsApp

---

## 📊 Analytics (Admin Only)

#### **GET /api/analytics/dashboard**
Get dashboard analytics

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalOrders": 1250,
      "totalRevenue": 125000.00,
      "totalUsers": 850,
      "activeTests": 45
    },
    "charts": {
      "revenueByMonth": [
        {"month": "Jan", "revenue": 25000},
        {"month": "Feb", "revenue": 30000}
      ],
      "ordersByStatus": [
        {"status": "COMPLETED", "count": 800},
        {"status": "PROCESSING", "count": 150}
      ]
    }
  }
}
```

#### **GET /api/analytics/orders**
Get order analytics

#### **GET /api/analytics/users**
Get user analytics

#### **GET /api/analytics/tests**
Get test performance analytics

---

## 📱 Notification System

#### **POST /api/notifications/send**
Send notification

**Request Body:**
```json
{
  "userId": "user_123",
  "type": "ORDER_CONFIRMED",
  "channels": ["email", "sms", "whatsapp"],
  "data": {
    "orderNumber": "LL2024001",
    "userName": "John Doe"
  }
}
```

#### **GET /api/notifications**
Get user notifications

#### **PUT /api/notifications/[id]/read**
Mark notification as read

---

## 🔧 Admin Endpoints

### User Management (Admin Only)

#### **GET /api/admin/users**
Get all users with filtering

**Query Parameters:**
- `page`, `limit`: Pagination
- `role`: Filter by user role
- `status`: Filter by active status
- `search`: Search in name/email

#### **PUT /api/admin/users/[id]/role**
Update user role

#### **PUT /api/admin/users/[id]/status**
Activate/deactivate user

### Order Management (Admin Only)

#### **GET /api/admin/orders**
Get all orders with advanced filtering

#### **PUT /api/admin/orders/[id]/assign-agent**
Assign home visit agent

#### **POST /api/admin/orders/bulk-update**
Bulk update order status

---

## 📝 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Validation Error
- **500**: Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ENTRY`: Resource already exists
- `PAYMENT_FAILED`: Payment processing failed
- `INSUFFICIENT_STOCK`: Item not available

---

## 🔒 Rate Limiting

### Rate Limits by Endpoint Type:
- **Authentication**: 5 requests per minute
- **General API**: 100 requests per minute
- **File Upload**: 10 requests per minute
- **Payment**: 20 requests per minute

### Rate Limit Headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 📡 Webhooks

### Webhook Events
1. **order.created**
2. **order.updated**
3. **payment.succeeded**
4. **payment.failed**
5. **home_visit.completed**
6. **report.uploaded**

### Webhook Payload Format
```json
{
  "event": "order.created",
  "data": {
    "id": "order_123",
    "orderNumber": "LL2024001",
    // ... order data
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🧪 Testing

### Test Environment
- **Base URL**: `https://api-staging.lynklabs.com`
- **API Key**: Use test API keys for staging

### Postman Collection
Import the Postman collection for easy API testing:
```bash
curl -X GET "https://api.lynklabs.com/postman/collection.json"
```

### Sample Test Data
```javascript
// Test user credentials
{
  "email": "test@lynklabs.com",
  "password": "testpassword123"
}

// Test payment card
{
  "number": "4242424242424242",
  "exp_month": 12,
  "exp_year": 2025,
  "cvc": "123"
}
```

---

## 📋 API Versioning

### Current Version: v1
All endpoints include version in the URL: `/api/v1/...`

### Version Headers
```http
X-API-Version: 1.0
Accept: application/vnd.lynklabs.v1+json
```

### Deprecation Policy
- 6 months notice for breaking changes
- Deprecated endpoints marked in documentation
- Migration guides provided

---

This API documentation should be kept up-to-date as new endpoints are added or existing ones are modified. All endpoints should be tested thoroughly and examples should reflect actual API responses. 