"""AI Explanation endpoints for plain-English security briefing."""

from fastapi import APIRouter, status
from app.schemas.findings import APIResponse
from app.schemas.ai import AIExplanationRequest, AIExplanationResponse
from app.services.ai_provider import AIExplanationService

router = APIRouter(prefix="/ai", tags=["AI Explanation"])


@router.post(
    "/explain",
    response_model=APIResponse[AIExplanationResponse],
    status_code=status.HTTP_200_OK,
    summary="Generate Plain-English AI Explanation & Roadmap",
    description="Translates authoritative deterministic security findings into human-friendly explanations, pedagogical insights, and prioritized defensive recommendations with zero hallucinations.",
)
async def explain_findings(request: AIExplanationRequest):
    """Execute AI explanation synthesis with automatic deterministic fallback."""
    result = await AIExplanationService.explain(request)
    return APIResponse(
        success=True,
        data=result,
        message="AI explanation generated successfully."
    )
