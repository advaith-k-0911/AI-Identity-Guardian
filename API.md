# API Reference — AI Identity Guardian

The AI Identity Guardian API is a versioned REST API (`/api/v1`) using JSON requests and responses.

---

## 1. Response Structure

### Success Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Analysis completed successfully."
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Username must contain between 3 and 50 characters."
  }
}
```

---

## 2. Standard Endpoints Overview

### Health & Status
- `GET /api/v1/health` — System status and version information.

### Identity Analysis
- `POST /api/v1/analysis/username` — Analyze username for PII leakage, predictability, and pattern exposure.
- `POST /api/v1/analysis/privacy` — Analyze personal data profile exposure and necessity.
- `POST /api/v1/analysis/identity` — Comprehensive composite identity risk evaluation (DIESS).

### Authentication (Future Phase)
- `POST /api/v1/auth/register` — Register a user account.
- `POST /api/v1/auth/login` — Authenticate and receive session/JWT tokens.

### Reports (Future Phase)
- `GET /api/v1/reports` — List user's saved security reports.
- `GET /api/v1/reports/{id}` — Retrieve a detailed historical report.
