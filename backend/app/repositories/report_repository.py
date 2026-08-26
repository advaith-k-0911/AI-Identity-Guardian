"""Repository for database persistence of scans, findings, and reports."""

import uuid
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.entities import (
    IdentityScanModel,
    UsernameAnalysisModel,
    PrivacyAnalysisModel,
    FindingModel,
    RecommendationModel,
    ReportModel,
)
from app.schemas.identity import IdentityAnalysisResult


class ReportRepository:
    """Handles normalized database transactions for scans and reports."""

    @classmethod
    def create_scan_and_report(
        cls,
        db: Session,
        result: IdentityAnalysisResult,
        title: str = "Digital Identity Security Report",
        user_id: Optional[str] = None,
    ) -> ReportModel:
        """Persist a complete identity scan and associated report record with optional user ownership."""
        scan_id = str(uuid.uuid4())

        # Extract 5-dimension scores if present
        imp_score = None
        cred_score = None
        rec_score = None
        for f in result.findings:
            cat = str(f.category).upper()
            if "IMPERSONATION" in cat and imp_score is None:
                imp_score = max(0.0, 100.0 - f.score_impact)
            elif "CREDENTIAL" in cat and cred_score is None:
                cred_score = max(0.0, 100.0 - f.score_impact)
            elif "RECOVERY" in cat and rec_score is None:
                rec_score = max(0.0, 100.0 - f.score_impact)

        # 1. Create Master Scan
        scan = IdentityScanModel(
            id=scan_id,
            user_id=user_id,
            diess_score=result.diess_score,
            risk_level=result.risk_level.value,
            summary=result.summary,
            impersonation_score=imp_score or 85.0,
            credential_score=cred_score or 85.0,
            recovery_score=rec_score or 85.0,
        )
        db.add(scan)

        # 2. Create Username Analysis Record
        if result.username_result:
            u = result.username_result
            username_record = UsernameAnalysisModel(
                id=str(uuid.uuid4()),
                scan_id=scan_id,
                username=u.username,
                score=u.score,
                risk_level=u.risk_level.value,
                detected_patterns=u.detected_patterns,
                summary=u.summary,
            )
            db.add(username_record)

        # 3. Create Privacy Analysis Record
        if result.privacy_result:
            p = result.privacy_result
            privacy_record = PrivacyAnalysisModel(
                id=str(uuid.uuid4()),
                scan_id=scan_id,
                score=p.score,
                risk_level=p.risk_level.value,
                exposed_sensitive_count=p.exposed_sensitive_count,
                unnecessary_exposed_count=p.unnecessary_exposed_count,
                summary=p.summary,
            )
            db.add(privacy_record)

        # 4. Create Findings
        for f in result.findings:
            finding_record = FindingModel(
                id=str(uuid.uuid4()),
                scan_id=scan_id,
                category=f.category.value if hasattr(f.category, "value") else str(f.category),
                severity=f.severity.value if hasattr(f.severity, "value") else str(f.severity),
                title=f.title,
                description=f.description,
                score_impact=f.score_impact,
                recommendation=f.recommendation,
            )
            db.add(finding_record)

        # 5. Create Recommendations
        for idx, rec_text in enumerate(result.recommendations):
            rec_record = RecommendationModel(
                id=str(uuid.uuid4()),
                scan_id=scan_id,
                recommendation_text=rec_text,
                priority_order=idx + 1,
            )
            db.add(rec_record)

        # 6. Create Report Record
        report_id = str(uuid.uuid4())
        report = ReportModel(
            id=report_id,
            user_id=user_id,
            scan_id=scan_id,
            report_title=title,
            diess_score=result.diess_score,
            risk_level=result.risk_level.value,
            summary=result.summary,
        )
        db.add(report)

        db.commit()
        db.refresh(report)
        return report

    @classmethod
    def get_report_by_id(cls, db: Session, report_id: str) -> Optional[ReportModel]:
        """Fetch report with all nested scan relations."""
        return (
            db.query(ReportModel)
            .options(
                joinedload(ReportModel.scan).joinedload(IdentityScanModel.username_analysis),
                joinedload(ReportModel.scan).joinedload(IdentityScanModel.privacy_analysis),
                joinedload(ReportModel.scan).joinedload(IdentityScanModel.findings),
                joinedload(ReportModel.scan).joinedload(IdentityScanModel.recommendations),
            )
            .filter(ReportModel.id == report_id)
            .first()
        )

    @classmethod
    def get_previous_report_for_user(
        cls,
        db: Session,
        user_id: Optional[str],
        current_created_at,
    ) -> Optional[ReportModel]:
        """Fetch the immediate chronologically preceding report for score trend comparison."""
        query = db.query(ReportModel).filter(ReportModel.created_at < current_created_at)
        if user_id:
            query = query.filter(ReportModel.user_id == user_id)
        return query.order_by(ReportModel.created_at.desc()).first()

    @classmethod
    def list_reports(
        cls,
        db: Session,
        user_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[ReportModel]:
        """List historical reports ordered by creation date.
        
        Authenticated users see only their own reports.
        Anonymous users see only unowned reports (user_id is None).
        """
        query = db.query(ReportModel)
        if user_id:
            # Authenticated: only their own reports
            query = query.filter(ReportModel.user_id == user_id)
        else:
            # Anonymous: only unowned reports
            query = query.filter(ReportModel.user_id.is_(None))
        return (
            query.order_by(ReportModel.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    @classmethod
    def delete_report(
        cls,
        db: Session,
        report_id: str,
        user_id: Optional[str] = None,
    ) -> bool:
        """Delete report and cascading scan if authorized."""
        query = db.query(ReportModel).filter(ReportModel.id == report_id)
        if user_id:
            query = query.filter(ReportModel.user_id == user_id)

        report = query.first()
        if not report:
            return False

        # Delete associated master scan if present (cascade will handle child tables)
        if report.scan:
            db.delete(report.scan)
        else:
            db.delete(report)

        db.commit()
        return True
