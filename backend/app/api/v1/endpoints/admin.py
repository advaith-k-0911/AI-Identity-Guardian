"""Admin analytics endpoints for privacy-preserving fleet telemetry."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.findings import APIResponse
from app.schemas.admin import AdminAnalyticsResponse
from app.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["Administrative Analytics"])


@router.get(
    "/analytics",
    response_model=APIResponse[AdminAnalyticsResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Privacy-Preserving Fleet Analytics",
    description="Returns anonymized, aggregated telemetry including total audits, average DIESS, risk level distributions, top threat categories, and posture improvement deltas.",
)
async def get_admin_analytics(db: Session = Depends(get_db)):
    """Fetch global security posture telemetry with zero PII exposure."""
    data = AdminService.get_aggregated_analytics(db)
    return APIResponse(
        success=True,
        data=data,
        message="Aggregated administrative analytics retrieved successfully."
    )
