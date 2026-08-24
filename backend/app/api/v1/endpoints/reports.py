"""API endpoints for Security Reports persistence, retrieval, authorization, and history."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user_optional, get_current_user
from app.db.session import get_db
from app.models.entities import UserModel
from app.schemas.findings import APIResponse
from app.schemas.reports import ReportCreateRequest, ReportDetailResponse, ReportSummaryResponse
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Security Reports"])


@router.post(
    "",
    response_model=APIResponse[ReportDetailResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Save / Generate Persistent Report",
    description="Saves a completed scan or executes analysis to generate a permanent report record.",
)
async def create_report(
    request: ReportCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
):
    """Persist an identity scan and return the created report with user association."""
    try:
        user_id = current_user.id if current_user else None
        report = ReportService.create_report(db, request, user_id=user_id)
        return APIResponse(
            success=True,
            data=report,
            message="Security report generated and persisted successfully."
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/{report_id}",
    response_model=APIResponse[ReportDetailResponse],
    status_code=status.HTTP_200_OK,
    summary="Retrieve Persistent Report by ID",
    description="Fetches full scan breakdown, component scores, findings, and remediation steps by Report UUID with authorization checks.",
)
async def get_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
):
    """Retrieve historical security audit report. Enforces user isolation."""
    user_id = current_user.id if current_user else None
    report = ReportService.get_report(db, report_id, user_id=user_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' was not found or access is denied.",
        )
    return APIResponse(
        success=True,
        data=report,
        message="Report retrieved successfully."
    )


@router.delete(
    "/{report_id}",
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Delete Security Report",
    description="Permanently removes a historical security audit report and cascading scan records.",
)
async def delete_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
):
    """Delete a user-owned report."""
    user_id = current_user.id if current_user else None
    success = ReportService.delete_report(db, report_id, user_id=user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' could not be deleted or access was denied.",
        )
    return APIResponse(
        success=True,
        data={"deleted_report_id": report_id},
        message="Security audit report deleted successfully."
    )


@router.get(
    "",
    response_model=APIResponse[List[ReportSummaryResponse]],
    status_code=status.HTTP_200_OK,
    summary="List Historical Reports with Trend Deltas",
    description="Returns metadata summary list of recently generated security reports with historical score deltas.",
)
async def list_reports(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
):
    """List recent security audit reports with trend indicators."""
    user_id = current_user.id if current_user else None
    reports = ReportService.list_reports(db, user_id=user_id, limit=limit, offset=offset)
    return APIResponse(
        success=True,
        data=reports,
        message="Reports list retrieved."
    )
