"""Service calculating aggregated administrative telemetry without exposing personal data."""

from collections import Counter
from typing import List
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.entities import (
    IdentityScanModel,
    ReportModel,
    FindingModel,
    RecommendationModel,
    UserModel,
)
from app.schemas.admin import (
    CategoryCount,
    RecommendationFrequency,
    RiskDistribution,
    ScoreTrendAnalytics,
    AdminAnalyticsResponse,
)


class AdminService:
    """Calculates privacy-preserving fleetwide analytics for security administrators."""

    @classmethod
    def get_aggregated_analytics(cls, db: Session) -> AdminAnalyticsResponse:
        """Compute anonymous systemwide security posture metrics."""
        # 1. High-Level Counts
        total_scans = db.query(IdentityScanModel).count()
        total_users = db.query(UserModel).count()
        total_reports = db.query(ReportModel).count()

        avg_score_raw = db.query(func.avg(IdentityScanModel.diess_score)).scalar()
        average_diess = round(float(avg_score_raw), 2) if avg_score_raw is not None else 0.0

        # 2. Risk Distribution
        risk_counts = db.query(
            IdentityScanModel.risk_level,
            func.count(IdentityScanModel.id),
        ).group_by(IdentityScanModel.risk_level).all()

        risk_dict = {str(k).upper(): v for k, v in risk_counts}
        risk_dist = RiskDistribution(
            low_risk=risk_dict.get("LOW", 0),
            medium_risk=risk_dict.get("MEDIUM", 0),
            high_risk=risk_dict.get("HIGH", 0),
            critical_risk=risk_dict.get("CRITICAL", 0),
        )

        # 3. Top Vulnerability Categories
        total_findings = db.query(FindingModel).count()
        cat_counts_raw = db.query(
            FindingModel.category,
            func.count(FindingModel.id),
        ).group_by(FindingModel.category).order_by(func.count(FindingModel.id).desc()).limit(10).all()

        top_categories: List[CategoryCount] = []
        for cat, cnt in cat_counts_raw:
            pct = round((cnt / total_findings * 100.0), 1) if total_findings > 0 else 0.0
            top_categories.append(
                CategoryCount(
                    category=str(cat).replace("FindingCategory.", ""),
                    count=cnt,
                    percentage=pct,
                )
            )

        # 4. Top Recommended Remediation Actions
        recs_raw = db.query(
            RecommendationModel.recommendation_text,
            func.count(RecommendationModel.id),
        ).group_by(RecommendationModel.recommendation_text).order_by(func.count(RecommendationModel.id).desc()).limit(8).all()

        top_recs: List[RecommendationFrequency] = [
            RecommendationFrequency(
                recommendation=r_text,
                frequency=freq,
            )
            for r_text, freq in recs_raw
        ]

        # 5. Security Improvement Progression Trends
        # Fetch user scans ordered chronologically
        user_scans = db.query(IdentityScanModel).filter(IdentityScanModel.user_id.isnot(None)).order_by(
            IdentityScanModel.user_id,
            IdentityScanModel.created_at.asc(),
        ).all()

        deltas: List[float] = []
        improved_cnt = 0
        degraded_cnt = 0
        stable_cnt = 0

        # Group by user_id
        user_map = {}
        for s in user_scans:
            user_map.setdefault(s.user_id, []).append(s.diess_score)

        for u_id, scores in user_map.items():
            if len(scores) >= 2:
                for i in range(1, len(scores)):
                    diff = round(scores[i] - scores[i - 1], 2)
                    deltas.append(diff)
                    if diff > 0:
                        improved_cnt += 1
                    elif diff < 0:
                        degraded_cnt += 1
                    else:
                        stable_cnt += 1

        avg_delta = round(sum(deltas) / len(deltas), 2) if deltas else 0.0

        trend_analytics = ScoreTrendAnalytics(
            average_improvement_delta=avg_delta,
            improved_scans_count=improved_cnt,
            degraded_scans_count=degraded_cnt,
            stable_scans_count=stable_cnt,
        )

        return AdminAnalyticsResponse(
            total_scans=total_scans,
            total_users=total_users,
            total_reports=total_reports,
            average_diess=average_diess,
            risk_distribution=risk_dist,
            top_vulnerability_categories=top_categories,
            top_remediation_actions=top_recs,
            improvement_trends=trend_analytics,
        )
