# FINBI Server API Specification

Base URL: `https://api.fulwariya.in`

All endpoints return JSON. Authentication uses JWT Bearer tokens.

---

## Authentication

### POST /api/auth/register

Register a new user account.

**Request:**
```json
{
  "name": "Rajesh Sharma",
  "email": "rajesh@company.com",
  "phone": "9876543210",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uuid": "usr_abc123",
    "name": "Rajesh Sharma",
    "email": "rajesh@company.com",
    "phone": "9876543210",
    "created_at": "2026-03-20T10:00:00Z"
  }
}
```

**Error (400):**
```json
{ "error": "Email already registered" }
```

---

### POST /api/auth/login

Authenticate and receive a JWT.

**Request:**
```json
{
  "email": "rajesh@company.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uuid": "usr_abc123",
    "name": "Rajesh Sharma",
    "email": "rajesh@company.com",
    "created_at": "2026-03-20T10:00:00Z"
  }
}
```

**Error (401):**
```json
{ "error": "Invalid email or password" }
```

---

## License Management

All license endpoints require `Authorization: Bearer <token>` header.

### POST /api/license/activate

Activate a purchased license key.

**Request:**
```json
{
  "key": "ABCDE-12345-FGHIJ-67890"
}
```

**Response (200):**
```json
{
  "activated": true,
  "message": "License activated successfully",
  "expires_at": "2027-03-20",
  "status": "active"
}
```

**Error (400):**
```json
{ "error": "Invalid or already used license key" }
```

---

### GET /api/license/status

Get current license status for the authenticated user.

**Response (200):**
```json
{
  "status": "trial",
  "days_left": 72,
  "trial_start": "2026-01-09",
  "expires_at": "2026-04-09",
  "license_key": null
}
```

**Possible status values:**
- `trial` — within trial period
- `active` — paid license, valid
- `expired` — trial ended, no active license

---

## Downloads

### GET /api/downloads/latest

Get download links for the latest version.

**Query params:**
- `platform` (optional): `windows`, `mac`, `linux`

**Response (200):**
```json
{
  "version": "1.0.0",
  "released_at": "2026-03-20T00:00:00Z",
  "downloads": {
    "windows": "https://cdn.fulwariya.in/releases/finbi-1.0.0-setup.exe",
    "mac": "https://cdn.fulwariya.in/releases/finbi-1.0.0.dmg",
    "linux": "https://cdn.fulwariya.in/releases/finbi-1.0.0.AppImage"
  },
  "url": "https://cdn.fulwariya.in/releases/finbi-1.0.0-setup.exe",
  "release_notes": "Bug fixes and performance improvements"
}
```

When `platform` is specified, `url` is the direct download link for that platform.

---

## Error Format

All errors follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE"
}
```

**Common HTTP status codes:**
- `200` OK
- `201` Created
- `400` Bad Request (validation errors)
- `401` Unauthorized (invalid/missing token)
- `403` Forbidden (valid token, no permission)
- `404` Not Found
- `429` Too Many Requests (rate limited)
- `500` Internal Server Error

---

## Authentication Notes

- Tokens expire after 30 days by default.
- Tokens are JWT (HS256) signed with a server secret.
- Include token in `Authorization: Bearer <token>` header.
- On token expiry, re-authenticate via POST /api/auth/login.

---

## Rate Limits

- `/api/auth/*` — 10 requests/minute per IP
- `/api/license/*` — 20 requests/minute per user
- `/api/downloads/*` — 100 requests/minute per IP
