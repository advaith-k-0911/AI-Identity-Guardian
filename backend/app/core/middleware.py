"""Production Security and Hardening Middleware for FastAPI."""

import os
import time
from collections import defaultdict
from typing import Dict, List
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from fastapi import status

# Allow bypassing rate limiting in test environment
_IS_TEST = os.environ.get("TESTING") == "1" or os.environ.get("ENVIRONMENT") == "test"


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforces essential defensive HTTP security headers across all API responses."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        return response


class RateLimitingMiddleware(BaseHTTPMiddleware):
    """Sliding-window IP rate limiter to protect authentication and analysis endpoints."""

    def __init__(self, app, max_requests: int = 150, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clients: Dict[str, List[float]] = defaultdict(list)
        self.auth_clients: Dict[str, List[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        
        # Allow health checks and OpenAPI docs without throttling
        if path in ["/health", "/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)
        
        # Skip rate limiting in test environment
        if _IS_TEST:
            return await call_next(request)

        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        window_start = now - self.window_seconds

        # Stricter rate limit for auth endpoints (brute-force protection)
        if path in ["/api/v1/auth/login", "/api/v1/auth/register"]:
            auth_timestamps = [t for t in self.auth_clients[client_ip] if t > window_start]
            self.auth_clients[client_ip] = auth_timestamps
            
            if len(auth_timestamps) >= 100:  # 100 auth attempts per minute per IP
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "success": False,
                        "error": {
                            "code": "RATE_LIMIT_EXCEEDED",
                            "message": "Too many authentication attempts. Please try again later.",
                        },
                        "message": "Rate limit exceeded.",
                    },
                )
            self.auth_clients[client_ip].append(now)

        # General rate limit
        timestamps = [t for t in self.clients[client_ip] if t > window_start]
        self.clients[client_ip] = timestamps

        if len(timestamps) >= self.max_requests:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "success": False,
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests. Please slow down and try again shortly.",
                    },
                    "message": "Rate limit exceeded.",
                },
            )

        self.clients[client_ip].append(now)
        return await call_next(request)
