# API Documentation

This document describes all available API endpoints.

## Authentication Endpoints

### POST `/api/auth/signin`
Sign in with a provider.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signin/google
```

**Response:**
Redirects to provider's authorization page.

---

### POST `/api/auth/callback/[provider]`
OAuth callback endpoint.

**Providers:**
- `google`
- `github`
- `linkedin`

**Response:**
Redirects to dashboard after successful authentication.

---

### POST `/api/auth/signout`
Sign out the current user.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signout
```

**Response:**
```json
{
  "ok": true
}
```

---

## User Endpoints

### GET `/api/user/profile`
Get current user's profile information.

**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer <session-token>"
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://...",
    "emailVerified": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "connectedProviders": ["google", "github"]
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---

## Session Management

### GET `/api/auth/session`
Get current session information.

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/session
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "email": "john@example.com",
    "name": "John Doe",
    "image": "https://..."
  },
  "expires": "2024-02-14T10:30:00Z"
}
```

**Notes:**
- Returns `null` if not authenticated
- Session token sent as secure HTTP-only cookie

---

## Provider Integration

### Supported Providers

#### Google
- **Endpoint:** `/api/auth/signin/google`
- **Callback:** `/api/auth/callback/google`
- **Required Scopes:** `openid profile email`

#### GitHub
- **Endpoint:** `/api/auth/signin/github`
- **Callback:** `/api/auth/callback/github`
- **Required Scopes:** `user:email`

#### LinkedIn
- **Endpoint:** `/api/auth/signin/linkedin`
- **Callback:** `/api/auth/callback/linkedin`
- **Required Scopes:** `openid profile email`

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid credentials provided |
| `UNAUTHORIZED` | 403 | User not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `INTERNAL_ERROR` | 500 | Server error |
| `PROVIDER_ERROR` | 502 | Provider error |

---

## Rate Limiting

Rate limits are applied per IP address:

- **Sign In:** 5 requests per 15 minutes
- **Validation:** 10 requests per minute
- **Profile Updates:** 30 requests per hour

---

## Authentication Headers

For endpoints that require authentication, include the session token:

```bash
Authorization: Bearer <session-token>
```

Alternatively, the session is automatically managed via secure HTTP-only cookies.

---

## CORS

The API supports CORS for:
- Localhost
- Production domain

Cross-origin requests from other domains are blocked.

---

## Examples

### Example: Sign In Flow

1. **Initiate Sign In**
```bash
# User clicks "Sign in with Google"
# Browser redirects to:
GET http://localhost:3000/api/auth/signin/google
```

2. **Provider Redirects Back**
```bash
# User authorizes on Google
# Google redirects to:
GET http://localhost:3000/api/auth/callback/google?code=...&state=...
```

3. **Session Created**
```bash
# Auth.js handles callback
# User is redirected to /dashboard
# Session cookie is set
```

4. **Get User Profile**
```bash
curl -X GET http://localhost:3000/api/user/profile
# Session cookie automatically included
```

---

### Example: Sign Out Flow

```bash
curl -X POST http://localhost:3000/api/auth/signout

# Response:
# {"ok": true}

# Session cookie is cleared
```

---

## Webhooks (Optional)

You can add webhooks for events:

```typescript
// lib/auth.ts
events: {
  async signIn({ user, account, profile, isNewUser }) {
    // Log sign in
    console.log("User signed in:", user.email);
    
    // Send webhook
    // await fetch("https://your-webhook.url", {
    //   method: "POST",
    //   body: JSON.stringify({ event: "signIn", user })
    // });
  },
  async signOut() {
    // Log sign out
    console.log("User signed out");
  }
}
```

---

## Callbacks

You can customize behavior with callbacks:

```typescript
// lib/auth.ts
callbacks: {
  async jwt({ token, user, account }) {
    // Modify JWT token
    return token;
  },
  async session({ session, token }) {
    // Modify session
    return session;
  },
  async redirect({ url, baseUrl }) {
    // Handle redirects
    return baseUrl;
  }
}
```

---

## Testing

### Test with cURL

```bash
# Test sign out endpoint
curl -X POST http://localhost:3000/api/auth/signout

# Test user profile
curl -X GET http://localhost:3000/api/user/profile
```

### Test with JavaScript

```typescript
// Client-side
import { signIn, signOut, useSession } from "next-auth/react";

// Sign in
await signIn("google", { redirectTo: "/dashboard" });

// Sign out
await signOut({ redirectTo: "/auth/signin" });

// Get session
const { data: session } = useSession();
```

---

## Security Considerations

1. **CSRF Protection:** Enabled by default
2. **Session Tokens:** Stored in secure HTTP-only cookies
3. **HTTPS Required:** In production
4. **OAuth State:** Validated to prevent CSRF
5. **Token Refresh:** Automatic when expired

---

## Rate Limit Headers

Responses include rate limit headers:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1234567890
```

---

## Support

For API issues:
1. Check error response codes
2. Verify environment variables
3. Review Auth.js documentation
4. Check provider documentation
5. Enable debug logging
