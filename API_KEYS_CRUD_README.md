# API Keys CRUD API Documentation

This document describes the authenticated CRUD operations for managing API keys in the Dandi application.

## Overview

All API key operations now require user authentication. Users can only access, create, update, and delete their own API keys. The system uses NextAuth.js for authentication and Supabase for data storage.

## Authentication

All endpoints require a valid session cookie from NextAuth.js. The system:
1. Extracts the user's email from the JWT session
2. Looks up the corresponding user ID in the Supabase database
3. Ensures all operations are scoped to that specific user

## Database Schema

The `api_keys` table includes the following fields:
- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `value` (TEXT, Unique, Auto-generated)
- `usage` (INTEGER, Default: 0)
- `limit_usage` (BOOLEAN, Default: false)
- `monthly_limit` (INTEGER, Default: 1000)
- `user_id` (UUID, Foreign Key to users table)
- `created_at` (TIMESTAMP, Auto-generated)

## API Endpoints

### 1. Get All API Keys

**GET** `/api/keys`

Returns all API keys belonging to the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My API Key",
    "value": "dandi-dev-abc123def",
    "usage": 0,
    "limit_usage": false,
    "monthly_limit": 1000,
    "user_id": "user-uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not authenticated)
- `500` - Internal server error

### 2. Create API Key

**POST** `/api/keys`

Creates a new API key for the authenticated user.

**Request Body:**
```json
{
  "name": "My New API Key",
  "limitUsage": true,
  "monthlyLimit": 5000
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My New API Key",
  "value": "dandi-dev-xyz789abc",
  "usage": 0,
  "limit_usage": true,
  "monthly_limit": 5000,
  "user_id": "user-uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Bad request (missing name)
- `401` - Unauthorized (not authenticated)
- `500` - Internal server error

### 3. Get Specific API Key

**GET** `/api/keys/[id]`

Returns a specific API key if it belongs to the authenticated user.

**Response:**
```json
{
  "id": "uuid",
  "name": "My API Key",
  "value": "dandi-dev-abc123def",
  "usage": 0,
  "limit_usage": false,
  "monthly_limit": 1000,
  "user_id": "user-uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not authenticated)
- `404` - API key not found or not owned by user
- `500` - Internal server error

### 4. Update API Key

**PUT** `/api/keys/[id]`

Updates an API key if it belongs to the authenticated user.

**Request Body:**
```json
{
  "name": "Updated API Key Name",
  "limitUsage": true,
  "monthlyLimit": 2000
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated API Key Name",
  "value": "dandi-dev-abc123def",
  "usage": 0,
  "limit_usage": true,
  "monthly_limit": 2000,
  "user_id": "user-uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200` - Updated successfully
- `400` - Bad request (missing name)
- `401` - Unauthorized (not authenticated)
- `404` - API key not found or not owned by user
- `500` - Internal server error

### 5. Delete API Key

**DELETE** `/api/keys/[id]`

Deletes an API key if it belongs to the authenticated user.

**Response:**
```json
{
  "message": "API key deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `401` - Unauthorized (not authenticated)
- `404` - API key not found or not owned by user
- `500` - Internal server error

## Security Features

1. **Authentication Required**: All endpoints require valid NextAuth.js session
2. **User Isolation**: Users can only access their own API keys
3. **Ownership Verification**: Each operation verifies the user owns the resource
4. **Row Level Security**: Supabase RLS policies provide additional database-level security

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common error scenarios:
- `401 Unauthorized`: User not authenticated or session expired
- `404 Not Found`: Resource doesn't exist or user doesn't own it
- `400 Bad Request`: Invalid input data
- `500 Internal Server Error`: Server-side error

## Database Migration

Before using these endpoints, run the database migration script:

```sql
-- Run in Supabase SQL editor
-- See database-migration.sql for complete migration
```

## Usage Examples

### Frontend Integration

```javascript
// Get all API keys
const response = await fetch('/api/keys', {
  credentials: 'include' // Important for session cookies
})
const apiKeys = await response.json()

// Create new API key
const newKey = await fetch('/api/keys', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Production Key',
    limitUsage: true,
    monthlyLimit: 10000
  })
})
```

### Testing with cURL

```bash
# Get all keys (requires session cookie)
curl -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
     http://localhost:3000/api/keys

# Create new key
curl -X POST \
     -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Key","limitUsage":true,"monthlyLimit":1000}' \
     http://localhost:3000/api/keys
```

## Implementation Notes

- Uses `getServerSession()` from NextAuth.js for server-side authentication
- Implements proper error handling and status codes
- Follows REST API best practices
- Includes comprehensive input validation
- Uses utility functions for common authentication patterns 