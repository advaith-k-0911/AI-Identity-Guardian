"""Dedicated mathematical scoring service for DIESS (Digital Identity Exposure & Security Score)."""

from typing import Dict, List, Optional, Tuple
from app.core.config import settings
from app.core.enums import RiskLevel, Severity
from app.schemas.findings import Finding
from app.schemas.username import UsernameAnalysisResult
from app.schemas.privacy import PrivacyAnalysisResult
from app.schemas.impersonation import ImpersonationAnalysisResult
from app.schemas.credentials import CredentialAnalysisResult
from app.schemas.recovery import RecoveryAnalysisResult
from app.schemas.diess import (
    DiessGrade,
    DiessWeightComponent,
    DiessModuleScores,
    DiessCalculationResult,
)

MODULE_META = {
    "username": ("Username Security", settings.DIESS_WEIGHT_USERNAME),
    "privacy": ("Privacy Exposure & Minimization", settings.DIESS_WEIGHT_PRIVACY),
    "impersonation": ("Impersonation & Clone Resilience", settings.DIESS_WEIGHT_IMPERSONATION),
    "credentials": ("Credential Security & Hygiene", settings.DIESS_WEIGHT_CREDENTIALS),
    "recovery": ("Account Recovery & Fallback", settings.DIESS_WEIGHT_RECOVERY),
}


class DiessService:
    """Computes composite DIESS scores, grading classifications, and weighted breakdowns."""

    @classmethod
    def resolve_grade_and_risk(
        cls,
        score: float,
        thresholds: Optional[Dict[str, float]] = None,
        custom_thresholds: Optional[Dict[str, float]] = None,
    ) -> Tuple[DiessGrade, RiskLevel]:
        """Classify a DIESS score into a 5-tier grade and risk level."""
        t_dict = custom_thresholds or thresholds or {}
        t_exc = t_dict.get("EXCELLENT", settings.DIESS_THRESHOLD_EXCELLENT)
        t_good = t_dict.get("GOOD", settings.DIESS_THRESHOLD_GOOD)
        t_med = t_dict.get("MEDIUM", settings.DIESS_THRESHOLD_MEDIUM)
        t_high = t_dict.get("HIGH", settings.DIESS_THRESHOLD_HIGH)

        if score >= t_exc:
            return DiessGrade.EXCELLENT, RiskLevel.LOW
        elif score >= t_good:
            return DiessGrade.GOOD, RiskLevel.LOW
        elif score >= t_med:
            return DiessGrade.MEDIUM_RISK, RiskLevel.MEDIUM
        elif score >= t_high:
            return DiessGrade.HIGH_RISK, RiskLevel.HIGH
        else:
            return DiessGrade.CRITICAL_RISK, RiskLevel.CRITICAL

    @classmethod
    def calculate_diess(
        cls,
        username_res: Optional[UsernameAnalysisResult] = None,
        privacy_res: Optional[PrivacyAnalysisResult] = None,
        impersonation_res: Optional[ImpersonationAnalysisResult] = None,
        credential_res: Optional[CredentialAnalysisResult] = None,
        recovery_res: Optional[RecoveryAnalysisResult] = None,
        custom_weights: Optional[Dict[str, float]] = None,
        custom_thresholds: Optional[Dict[str, float]] = None,
    ) -> DiessCalculationResult:
        """Compute the unified DIESS score across provided security modules."""
        # 1. Collect provided scores
        raw_scores: Dict[str, float] = {}
        if username_res is not None:
            raw_scores["username"] = username_res.score
        if privacy_res is not None:
            raw_scores["privacy"] = privacy_res.score
        if impersonation_res is not None:
            raw_scores["impersonation"] = impersonation_res.score
        if credential_res is not None:
            raw_scores["credentials"] = credential_res.score
        if recovery_res is not None:
            raw_scores["recovery"] = recovery_res.score

        # If no module was provided, return baseline critical score
        if not raw_scores:
            return DiessCalculationResult(
                overall_score=0.0,
                grade=DiessGrade.CRITICAL_RISK,
                risk_level=RiskLevel.CRITICAL,
                module_scores=DiessModuleScores(),
                weighted_breakdown=[],
                findings=[],
                recommendations=["Execute at least one security module to calculate DIESS."],
                summary="No security modules evaluated.",
            )

        # 2. Determine base weights
        base_weights: Dict[str, float] = {}
        for key in raw_scores.keys():
            if custom_weights and key in custom_weights:
                base_weights[key] = custom_weights[key]
            else:
                base_weights[key] = MODULE_META[key][1]

        # 3. Normalize weights to sum to exactly 1.0 (handles missing/partial modules)
        total_weight_sum = sum(base_weights.values())
        if total_weight_sum <= 0.0:
            total_weight_sum = 1.0

        normalized_weights = {k: w / total_weight_sum for k, w in base_weights.items()}

        # 4. Calculate weighted contributions and composite score
        breakdown: List[DiessWeightComponent] = []
        overall_sum = 0.0

        for key, score in raw_scores.items():
            norm_weight = normalized_weights[key]
            contribution = round(score * norm_weight, 2)
            overall_sum += contribution

            breakdown.append(
                DiessWeightComponent(
                    module_key=key,
                    module_name=MODULE_META[key][0],
                    score=score,
                    weight=round(norm_weight, 4),
                    weighted_contribution=contribution,
                )
            )

        final_score = max(0.0, min(100.0, round(overall_sum, 2)))
        grade, risk_level = cls.resolve_grade_and_risk(final_score, custom_thresholds)

        # 5. Aggregate findings and extract prioritized recommendations
        all_findings: List[Finding] = []
        if username_res:
            all_findings.extend(username_res.findings)
        if privacy_res:
            all_findings.extend(privacy_res.findings)
        if impersonation_res:
            all_findings.extend(impersonation_res.findings)
        if credential_res:
            all_findings.extend(credential_res.findings)
        if recovery_res:
            all_findings.extend(recovery_res.findings)

        # Sort findings by impact/severity
        severity_order = {Severity.CRITICAL: 0, Severity.HIGH: 1, Severity.MEDIUM: 2, Severity.LOW: 3}
        sorted_findings = sorted(
            all_findings,
            key=lambda f: (severity_order.get(f.severity, 4), -f.score_impact)
        )

        recs: List[str] = []
        for finding in sorted_findings:
            if finding.recommendation and finding.recommendation not in recs:
                recs.append(finding.recommendation)

        # 6. Executive summary
        summary = (
            f"Composite DIESS Posture: {final_score}/100 ({grade.value} — {risk_level.value} Risk). "
            f"Evaluated {len(raw_scores)} active security dimension(s) with {len(all_findings)} finding(s)."
        )

        return DiessCalculationResult(
            overall_score=final_score,
            grade=grade,
            risk_level=risk_level,
            module_scores=DiessModuleScores(
                username=raw_scores.get("username"),
                privacy=raw_scores.get("privacy"),
                impersonation=raw_scores.get("impersonation"),
                credentials=raw_scores.get("credentials"),
                recovery=raw_scores.get("recovery"),
            ),
            weighted_breakdown=breakdown,
            username_result=username_res,
            privacy_result=privacy_res,
            impersonation_result=impersonation_res,
            credential_result=credential_res,
            recovery_result=recovery_res,
            findings=sorted_findings,
            recommendations=recs,
            summary=summary,
        )
