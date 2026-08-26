"""FastAPI application entrypoint for AI Identity Guardian."""

from fastapi import FastAPI, Request, status, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.middleware import SecurityHeadersMiddleware, RateLimitingMiddleware
from app.db.base import Base
from app.db.session import engine
from app.api.v1.router import api_router
from app.schemas.findings import APIResponse, ErrorDetail

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Deterministic Privacy & Digital Identity Risk Engine API",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# 1. Security Headers & Rate Limiting Middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitingMiddleware, max_requests=150, window_seconds=60)

# 2. CORS Middleware (Added last so it wraps as outermost middleware)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request payload validation errors with standardized JSON envelope."""
    error_messages = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        error_messages.append(f"{loc}: {msg}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=APIResponse(
            success=False,
            error=ErrorDetail(
                code="VALIDATION_ERROR",
                message="; ".join(error_messages) or "Invalid request parameters.",
                details={"errors": exc.errors()},
            ),
        ).model_dump(),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle explicit HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=APIResponse(
            success=False,
            error=ErrorDetail(
                code="HTTP_ERROR",
                message=str(exc.detail),
            ),
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Catch-all handler for unhandled exceptions to prevent stack trace leaks."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=APIResponse(
            success=False,
            error=ErrorDetail(
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected internal server error occurred.",
            ),
        ).model_dump(),
    )


# Root Health Check
@app.get("/health", response_model=APIResponse[dict], tags=["System"])
async def root_health():
    """Root health check endpoint."""
    return APIResponse(
        success=True,
        data={
            "status": "healthy",
            "app_name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        },
        message="AI Identity Guardian API is healthy."
    )


# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)
