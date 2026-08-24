# Security & Privacy Policy — AI Identity Guardian

AI Identity Guardian is designed with privacy-first and defense-in-depth principles.

---

## 1. Privacy Core Principles

1. **Transient Analysis Mode**: Personal identity inputs (names, emails, phone numbers, recovery settings) used during scan sessions are processed in-memory and are never written to database logs or telemetry.
2. **Zero Password Retention**: Passwords or credentials evaluated during strength analysis are processed transiently in memory, salted/hashed where applicable, and never logged or stored.
3. **No Unnecessary Data Collection**: The application requests only the minimal data points necessary to calculate specific risk vectors.
4. **No Sensitive PII in API Responses**: Raw sensitive inputs are redacted in report outputs unless explicitly displayed in a secure user context.

---

## 2. Technical Security Safeguards

- **Strict Input Validation**: All incoming requests are validated against strict Pydantic schemas.
- **SQL Injection Prevention**: Database operations use SQLAlchemy ORM with parameterized queries.
- **XSS & CSRF Protection**: Frontend rendering strictly escapes HTML; backend headers include standard security headers (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`).
- **CORS Protection**: Restricted to configured frontend origins via environment settings.
- **Error Sanitization**: API errors return standardized JSON responses without exposing internal stack traces or database schema details.

---

## 3. Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly to the project maintainers. Do not open public GitHub issues for security vulnerabilities.
