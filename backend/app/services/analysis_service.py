"""Analysis service orchestrating deterministic risk engines and DIESS calculation."""

from typing import List, Optional
from app.core.enums import RiskLevel
from app.engines.username_engine import UsernameRiskEngine
from app.engines.privacy_engine import PrivacyRiskEngine
from app.engines.impersonation_engine import ImpersonationRiskEngine
from app.engines.credential_engine import CredentialRiskEngine
from app.engines.recovery_engine import RecoveryRiskEngine
from app.schemas.username import UsernameAnalysisRequest, UsernameAnalysisResult
from app.schemas.privacy import PrivacyAnalysisRequest, PrivacyAnalysisResult, PrivacyFieldInput
from app.schemas.impersonation import ImpersonationAnalysisRequest, ImpersonationAnalysisResult
from app.schemas.credentials import CredentialAnalysisRequest, CredentialAnalysisResult
from app.schemas.recovery import RecoveryAnalysisRequest, RecoveryAnalysisResult
from app.schemas.identity import IdentityAnalysisRequest, IdentityAnalysisResult
from app.schemas.diess import ComprehensiveIdentityScanRequest, DiessCalculationResult
from app.services.diess_service import DiessService


class AnalysisService:
    """Coordinates risk analysis across domain-specific engines and DIESS synthesis."""

    @classmethod
    def analyze_username(cls, request: UsernameAnalysisRequest) -> UsernameAnalysisResult:
        """Run username risk analysis."""
        return UsernameRiskEngine.analyze(
            username=request.username,
            full_name=request.full_name,
            birth_year=request.birth_year,
        )

    @classmethod
    def analyze_privacy(cls, request: PrivacyAnalysisRequest) -> PrivacyAnalysisResult:
        """Run privacy exposure risk analysis."""
        return PrivacyRiskEngine.analyze(fields=request.fields)

    @classmethod
    def get_default_privacy_fields(cls) -> List[PrivacyFieldInput]:
        """Return standardized baseline privacy fields."""
        return PrivacyRiskEngine.get_default_fields()

    @classmethod
    def analyze_impersonation(cls, request: ImpersonationAnalysisRequest) -> ImpersonationAnalysisResult:
        """Run defensive impersonation and spoofing attack surface assessment."""
        return ImpersonationRiskEngine.analyze(
            username=request.username,
            display_name=request.display_name,
            role_or_title=request.role_or_title,
            bio_keywords=request.bio_keywords,
        )

    @classmethod
    def analyze_credentials(cls, request: CredentialAnalysisRequest) -> CredentialAnalysisResult:
        """Run defensive credential security and authentication hygiene assessment."""
        return CredentialRiskEngine.analyze(request)

    @classmethod
    def analyze_recovery(cls, request: RecoveryAnalysisRequest) -> RecoveryAnalysisResult:
        """Run defensive account recovery security and fallback resilience assessment."""
        return RecoveryRiskEngine.analyze(request)

    @classmethod
    def analyze_comprehensive_diess(cls, request: ComprehensiveIdentityScanRequest) -> DiessCalculationResult:
        """Execute full 5-vector digital identity scan and calculate canonical DIESS."""
        # 1. Username Analysis
        user_res = cls.analyze_username(
            UsernameAnalysisRequest(
                username=request.username,
                full_name=request.full_name,
                birth_year=request.birth_year,
            )
        )

        # 2. Privacy Analysis
        priv_req = request.privacy_request or PrivacyAnalysisRequest(fields=cls.get_default_privacy_fields())
        priv_res = cls.analyze_privacy(priv_req)

        # 3. Impersonation Analysis
        imp_res = cls.analyze_impersonation(
            ImpersonationAnalysisRequest(
                username=request.username,
                display_name=request.full_name,
                role_or_title=request.role_or_title,
            )
        )

        # 4. Credential Analysis
        cred_req = request.credential_request or CredentialAnalysisRequest()
        cred_res = cls.analyze_credentials(cred_req)

        # 5. Recovery Analysis
        rec_req = request.recovery_request or RecoveryAnalysisRequest()
        rec_res = cls.analyze_recovery(rec_req)

        # Calculate Unified DIESS with canonical weights (20%, 25%, 20%, 20%, 15%)
        return DiessService.calculate_diess(
            username_res=user_res,
            privacy_res=priv_res,
            impersonation_res=imp_res,
            credential_res=cred_res,
            recovery_res=rec_res,
        )

    @classmethod
    def analyze_identity(cls, request: IdentityAnalysisRequest) -> IdentityAnalysisResult:
        """Execute composite digital identity assessment (backwards-compatible with reports)."""
        # Execute comprehensive scan
        comp_req = ComprehensiveIdentityScanRequest(
            username=request.username,
            full_name=request.full_name,
            birth_year=request.birth_year,
            privacy_request=PrivacyAnalysisRequest(fields=request.privacy_fields) if request.privacy_fields else None,
        )
        diess_res = cls.analyze_comprehensive_diess(comp_req)

        return IdentityAnalysisResult(
            diess_score=diess_res.overall_score,
            risk_level=diess_res.risk_level,
            username_result=diess_res.username_result,
            privacy_result=diess_res.privacy_result,
            total_findings_count=len(diess_res.findings),
            findings=diess_res.findings,
            recommendations=diess_res.recommendations,
            summary=diess_res.summary,
        )
