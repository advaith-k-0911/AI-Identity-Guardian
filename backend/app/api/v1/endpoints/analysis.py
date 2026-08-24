"""Analysis endpoints for Username, Privacy, Impersonation, Credentials, Recovery, and DIESS evaluations."""

from typing import List
from fastapi import APIRouter, status
from app.schemas.findings import APIResponse
from app.schemas.username import UsernameAnalysisRequest, UsernameAnalysisResult
from app.schemas.privacy import PrivacyAnalysisRequest, PrivacyAnalysisResult, PrivacyFieldInput
from app.schemas.impersonation import ImpersonationAnalysisRequest, ImpersonationAnalysisResult
from app.schemas.credentials import CredentialAnalysisRequest, CredentialAnalysisResult
from app.schemas.recovery import RecoveryAnalysisRequest, RecoveryAnalysisResult
from app.schemas.identity import IdentityAnalysisRequest, IdentityAnalysisResult
from app.schemas.diess import ComprehensiveIdentityScanRequest, DiessCalculationResult
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix="/analysis", tags=["Risk Analysis"])


@router.post(
    "/username",
    response_model=APIResponse[UsernameAnalysisResult],
    status_code=status.HTTP_200_OK,
    summary="Analyze Username Risk",
    description="Evaluates a username for PII leakage (names, birth years, predictable numbers, and compounding risks).",
)
async def analyze_username(request: UsernameAnalysisRequest):
    """Execute deterministic risk evaluation on a provided username."""
    result = AnalysisService.analyze_username(request)
    return APIResponse(
        success=True,
        data=result,
        message="Username analysis completed successfully."
    )


@router.post(
    "/privacy",
    response_model=APIResponse[PrivacyAnalysisResult],
    status_code=status.HTTP_200_OK,
    summary="Analyze Privacy Exposure",
    description="Evaluates privacy risk across user profile fields based on sensitivity, necessity, and visibility.",
)
async def analyze_privacy(request: PrivacyAnalysisRequest):
    """Execute deterministic privacy exposure evaluation."""
    result = AnalysisService.analyze_privacy(request)
    return APIResponse(
        success=True,
        data=result,
        message="Privacy exposure analysis completed successfully."
    )


@router.get(
    "/privacy/defaults",
    response_model=APIResponse[List[PrivacyFieldInput]],
    status_code=status.HTTP_200_OK,
    summary="Get Default Privacy Fields",
    description="Returns the standard baseline privacy fields and their default sensitivities.",
)
async def get_privacy_defaults():
    """Retrieve standard privacy profile attribute templates."""
    defaults = AnalysisService.get_default_privacy_fields()
    return APIResponse(
        success=True,
        data=defaults,
        message="Default privacy fields retrieved."
    )


@router.post(
    "/impersonation",
    response_model=APIResponse[ImpersonationAnalysisResult],
    status_code=status.HTTP_200_OK,
    summary="Analyze Impersonation & Spoofing Attack Surface",
    description="Evaluates lookalike vulnerability, homoglyphs, authority role targeting, and predictable canonical handle naming.",
)
async def analyze_impersonation(request: ImpersonationAnalysisRequest):
    """Execute defensive impersonation risk evaluation."""
    result = AnalysisService.analyze_impersonation(request)
    return APIResponse(
        success=True,
        data=result,
        message="Impersonation risk assessment completed successfully."
    )


@router.post(
    "/credentials",
    response_model=APIResponse[CredentialAnalysisResult],
    status_code=status.HTTP_200_OK,
    summary="Analyze Credential Security & Authentication Posture",
    description="Evaluates multi-factor authentication, password manager adoption, reuse scope, and rotation hygiene without collecting real passwords.",
)
async def analyze_credentials(request: CredentialAnalysisRequest):
    """Execute zero-knowledge credential hygiene evaluation."""
    result = AnalysisService.analyze_credentials(request)
    return APIResponse(
        success=True,
        data=result,
        message="Credential security assessment completed successfully."
    )


@router.post(
    "/recovery",
    response_model=APIResponse[RecoveryAnalysisResult],
    status_code=status.HTTP_200_OK,
    summary="Analyze Account Recovery & Fallback Resilience",
    description="Evaluates security question predictability, offline backup codes readiness, and recovery email/phone channel isolation.",
)
async def analyze_recovery(request: RecoveryAnalysisRequest):
    """Execute zero-knowledge account recovery resilience evaluation."""
    result = AnalysisService.analyze_recovery(request)
    return APIResponse(
        success=True,
        data=result,
        message="Account recovery assessment completed successfully."
    )


@router.post(
    "/diess",
    response_model=APIResponse[DiessCalculationResult],
    status_code=status.HTTP_200_OK,
    summary="Execute Full 5-Vector DIESS Assessment",
    description="Evaluates all 5 security dimensions (Username 20%, Privacy 25%, Impersonation 20%, Credentials 20%, Recovery 15%) to produce the canonical DIESS score and breakdown.",
)
async def analyze_diess(request: ComprehensiveIdentityScanRequest):
    """Execute unified 5-vector digital identity scan with exact DIESS weights and breakdown."""
    result = AnalysisService.analyze_comprehensive_diess(request)
    return APIResponse(
        success=True,
        data=result,
        message="DIESS unified assessment completed successfully."
    )


@router.post(
    "/identity",
    response_model=APIResponse[IdentityAnalysisResult],
    status_code=status.HTTP_200_OK,
    summary="Analyze Complete Digital Identity Posture",
    description="Combines security evaluations to calculate the unified DIESS score and prioritized recommendations.",
)
async def analyze_identity(request: IdentityAnalysisRequest):
    """Execute composite digital identity risk assessment."""
    result = AnalysisService.analyze_identity(request)
    return APIResponse(
        success=True,
        data=result,
        message="Identity risk assessment completed successfully."
    )
