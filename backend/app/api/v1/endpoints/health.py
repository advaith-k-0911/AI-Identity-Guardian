"""Health check endpoints."""

from fastapi import APIRouter
from app.core.config import settings
from app.schemas.findings import APIResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=APIResponse[dict])
async def get_health():
    """Verify backend status and operational metadata."""
    return APIResponse(
        success=True,
        data={
            "status": "healthy",
            "app_name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        },
        message="Backend service is operational."
    )
