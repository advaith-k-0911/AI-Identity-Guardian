"""Report service for generating, formatting, and analyzing trends across persistent reports."""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.core.enums import RiskLevel, Severity, FindingCategory
from app.models.entities import ReportModel
from app.repositories.report_repository import ReportRepository
from app.schemas.findings import Finding
from app.schemas.username import UsernameAnalysisResult
from app.schemas.privacy import PrivacyAnalysisResult
from app.schemas.reports import ReportCreateRequest, ReportDetailResponse, ReportSummaryResponse
from app.services.analysis_service import AnalysisService


class ReportService:
    """Business logic for persistent security reports and historical posture progression."""

    @classmethod
    def create_report(
        cls,
        db: Session,
        request: ReportCreateRequest,
        user_id: Optional[str] = None,
    ) -> ReportDetailResponse:
        """Create a new report by either analyzing identity input or saving provided results."""
        if request.identity_result:
            result = request.identity_result
        elif request.identity_data:
            result = AnalysisService.analyze_identity(request.identity_data)
        else:
            raise ValueError("Must provide either 'identity_data' or 'identity_result' to generate a report.")

        report_model = ReportRepository.create_scan_and_report(
            db=db,
            result=result,
            title=request.report_title or "Digital Identity Security Report",
            user_id=user_id,
        )

        return cls._format_detail_response(db, report_model)

    @classmethod
    def get_report(
        cls,
        db: Session,
        report_id: str,
        user_id: Optional[str] = None,
    ) -> Optional[ReportDetailResponse]:
        """Fetch and format a detailed report by UUID with authorization checks."""
        report_model = ReportRepository.get_report_by_id(db, report_id)
        if not report_model:
            return None

        # Verify access authorization: if report belongs to a user, only that user may view it
        if report_model.user_id and report_model.user_id != user_id:
            return None

        return cls._format_detail_response(db, report_model)

    @classmethod
    def delete_report(
        cls,
        db: Session,
        report_id: str,
        user_id: Optional[str] = None,
    ) -> bool:
        """Delete report by UUID with strict authorization check."""
        return ReportRepository.delete_report(db, report_id, user_id=user_id)

    @classmethod
    def list_reports(
        cls,
        db: Session,
        user_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[ReportSummaryResponse]:
        """Fetch historical reports with chronological trend deltas."""
        models = ReportRepository.list_reports(db, user_id=user_id, limit=limit, offset=offset)
        
        # Sort in chronological order to compute pairwise progressive score deltas
        sorted_chrono = sorted(models, key=lambda m: m.created_at)
        deltas = {}
        for i, m in enumerate(sorted_chrono):
            if i == 0:
                deltas[m.id] = (None, None, "INITIAL")
            else:
                prev = sorted_chrono[i - 1]
                diff = round(m.diess_score - prev.diess_score, 2)
                direction = "IMPROVED" if diff > 0 else ("DEGRADED" if diff < 0 else "STABLE")
                deltas[m.id] = (diff, prev.diess_score, direction)

        # Output in reverse chronological order
        summaries = []
        for m in models:
            d_delta, d_prev, d_dir = deltas.get(m.id, (None, None, "INITIAL"))
            summaries.append(
                ReportSummaryResponse(
                    id=m.id,
                    scan_id=m.scan_id,
                    created_at=m.created_at,
                    report_title=m.report_title,
                    diess_score=m.diess_score,
                    risk_level=RiskLevel(m.risk_level),
                    summary=m.summary,
                    score_delta=d_delta,
                    previous_score=d_prev,
                    trend_direction=d_dir,
                )
            )
        return summaries

    @classmethod
    def _format_detail_response(cls, db: Session, model: ReportModel) -> ReportDetailResponse:
        """Transform ORM ReportModel into Pydantic ReportDetailResponse with trend metrics."""
        scan = model.scan

        # Calculate score delta relative to immediately preceding scan
        prev_report = ReportRepository.get_previous_report_for_user(db, model.user_id, model.created_at)
        if prev_report:
            score_delta = round(model.diess_score - prev_report.diess_score, 2)
            previous_score = prev_report.diess_score
            trend_direction = "IMPROVED" if score_delta > 0 else ("DEGRADED" if score_delta < 0 else "STABLE")
        else:
            score_delta = None
            previous_score = None
            trend_direction = "INITIAL"

        username_res = None
        user_score = None
        if scan and scan.username_analysis:
            u = scan.username_analysis
            user_score = u.score
            username_res = UsernameAnalysisResult(
                score=u.score,
                risk_level=RiskLevel(u.risk_level),
                findings=[],
                summary=u.summary,
                username=u.username,
                detected_patterns=u.detected_patterns or [],
            )

        privacy_res = None
        priv_score = None
        if scan and scan.privacy_analysis:
            p = scan.privacy_analysis
            priv_score = p.score
            privacy_res = PrivacyAnalysisResult(
                score=p.score,
                risk_level=RiskLevel(p.risk_level),
                findings=[],
                summary=p.summary,
                exposed_sensitive_count=p.exposed_sensitive_count,
                unnecessary_exposed_count=p.unnecessary_exposed_count,
            )

        findings: List[Finding] = []
        if scan and scan.findings:
            for f in scan.findings:
                findings.append(
                    Finding(
                        id=f.id,
                        category=FindingCategory(f.category) if f.category in FindingCategory.__members__ else FindingCategory.USERNAME,
                        severity=Severity(f.severity),
                        title=f.title,
                        description=f.description,
                        score_impact=f.score_impact,
                        recommendation=f.recommendation,
                    )
                )

        recs: List[str] = []
        if scan and scan.recommendations:
            recs = [r.recommendation_text for r in scan.recommendations]

        return ReportDetailResponse(
            id=model.id,
            scan_id=model.scan_id,
            created_at=model.created_at,
            report_title=model.report_title,
            diess_score=model.diess_score,
            risk_level=RiskLevel(model.risk_level),
            summary=model.summary,
            score_delta=score_delta,
            previous_score=previous_score,
            trend_direction=trend_direction,
            username_score=user_score,
            privacy_score=priv_score,
            impersonation_score=scan.impersonation_score if scan else None,
            credential_score=scan.credential_score if scan else None,
            recovery_score=scan.recovery_score if scan else None,
            username_result=username_res,
            privacy_result=privacy_res,
            findings=findings,
            recommendations=recs,
        )
