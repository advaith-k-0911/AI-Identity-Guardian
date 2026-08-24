"""Deterministic Privacy Exposure Risk Analysis Engine."""

from typing import List, Optional
from app.core.enums import Severity, RiskLevel, Sensitivity, FindingCategory
from app.schemas.findings import Finding
from app.schemas.privacy import PrivacyFieldInput, PrivacyAnalysisResult

# Sensitivity defaults for standard identity fields
DEFAULT_FIELD_SENSITIVITY = {
    "phone_number": Sensitivity.CRITICAL,
    "phone": Sensitivity.CRITICAL,
    "date_of_birth": Sensitivity.HIGH,
    "dob": Sensitivity.HIGH,
    "email": Sensitivity.HIGH,
    "full_name": Sensitivity.MEDIUM,
    "name": Sensitivity.MEDIUM,
    "country": Sensitivity.LOW,
    "location": Sensitivity.LOW,
    "interests": Sensitivity.LOW,
    "bio": Sensitivity.LOW,
}


class PrivacyRiskEngine:
    """Evaluates privacy exposure, data minimization, and sensitive attribute visibility."""

    @staticmethod
    def _calculate_risk_level(score: float) -> RiskLevel:
        """Map numerical score to standard RiskLevel."""
        if score >= 85.0:
            return RiskLevel.LOW
        elif score >= 65.0:
            return RiskLevel.MEDIUM
        elif score >= 40.0:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL

    @classmethod
    def get_default_fields(cls) -> List[PrivacyFieldInput]:
        """Return standardized baseline privacy profile fields."""
        return [
            PrivacyFieldInput(
                field_name="full_name",
                is_provided=False,
                is_public=False,
                is_necessary=True,
                sensitivity=Sensitivity.MEDIUM,
            ),
            PrivacyFieldInput(
                field_name="date_of_birth",
                is_provided=False,
                is_public=False,
                is_necessary=False,
                sensitivity=Sensitivity.HIGH,
            ),
            PrivacyFieldInput(
                field_name="country",
                is_provided=False,
                is_public=False,
                is_necessary=False,
                sensitivity=Sensitivity.LOW,
            ),
            PrivacyFieldInput(
                field_name="email",
                is_provided=False,
                is_public=False,
                is_necessary=True,
                sensitivity=Sensitivity.HIGH,
            ),
            PrivacyFieldInput(
                field_name="phone_number",
                is_provided=False,
                is_public=False,
                is_necessary=False,
                sensitivity=Sensitivity.CRITICAL,
            ),
            PrivacyFieldInput(
                field_name="interests",
                is_provided=False,
                is_public=False,
                is_necessary=False,
                sensitivity=Sensitivity.LOW,
            ),
        ]

    @classmethod
    def analyze(cls, fields: List[PrivacyFieldInput]) -> PrivacyAnalysisResult:
        """Execute deterministic privacy exposure evaluation on profile fields.
        
        Args:
            fields: List of PrivacyFieldInput items.
            
        Returns:
            PrivacyAnalysisResult containing score, risk level, findings, and exposure metrics.
        """
        findings: List[Finding] = []
        total_deduction = 0.0
        exposed_sensitive_count = 0
        unnecessary_exposed_count = 0

        # Base deduction weights by sensitivity for publicly exposed data
        sensitivity_penalties = {
            Sensitivity.CRITICAL: 30.0,
            Sensitivity.HIGH: 20.0,
            Sensitivity.MEDIUM: 10.0,
            Sensitivity.LOW: 5.0,
        }

        # Severity mapping
        severity_mapping = {
            Sensitivity.CRITICAL: Severity.CRITICAL,
            Sensitivity.HIGH: Severity.HIGH,
            Sensitivity.MEDIUM: Severity.MEDIUM,
            Sensitivity.LOW: Severity.LOW,
        }

        for field in fields:
            field_label = field.field_name.replace("_", " ").title()

            # If user has not provided this information, there is zero exposure
            if not field.is_provided:
                continue

            # Case 1: Information is Provided and Publicly Visible
            if field.is_public:
                base_impact = sensitivity_penalties.get(field.sensitivity, 10.0)
                unnecessary_penalty = 5.0 if not field.is_necessary else 0.0
                field_deduction = base_impact + unnecessary_penalty
                total_deduction += field_deduction

                if field.sensitivity in (Sensitivity.HIGH, Sensitivity.CRITICAL):
                    exposed_sensitive_count += 1
                if not field.is_necessary:
                    unnecessary_exposed_count += 1

                # Build descriptive recommendation and finding
                rec_text = f"Change the privacy setting of '{field_label}' to private or hidden."
                if not field.is_necessary:
                    rec_text += f" Because '{field_label}' is optional, consider deleting it completely."

                findings.append(
                    Finding(
                        id=f"PRIV-EXP-{field.field_name.upper()}",
                        category=FindingCategory.PRIVACY,
                        severity=severity_mapping.get(field.sensitivity, Severity.MEDIUM),
                        title=f"Publicly Exposed {field_label}",
                        description=(
                            f"Your {field_label} is publicly accessible to anyone online. "
                            f"Sensitivity classification: {field.sensitivity.value}."
                            + (" This field is not required for the service." if not field.is_necessary else "")
                        ),
                        score_impact=field_deduction,
                        recommendation=rec_text,
                    )
                )

            # Case 2: Information is Provided, Kept Private, but Not Necessary
            elif not field.is_necessary:
                # Stored optional data still carries minor third-party breach risk
                findings.append(
                    Finding(
                        id=f"PRIV-STORED-{field.field_name.upper()}",
                        category=FindingCategory.PRIVACY,
                        severity=Severity.LOW,
                        title=f"Unnecessary Stored Data: {field_label}",
                        description=(
                            f"'{field_label}' is marked private, but is optional for the service. "
                            "In the event of a platform data breach, stored attributes may still be compromised."
                        ),
                        score_impact=0.0,  # Informational advisory; no direct deduction to encourage keeping data private
                        recommendation=f"Delete '{field_label}' if it does not provide active utility.",
                    )
                )

        # Clamping score between 0.0 and 100.0
        raw_score = 100.0 - total_deduction
        final_score = max(0.0, min(100.0, round(raw_score, 2)))
        risk_level = cls._calculate_risk_level(final_score)

        # Human-readable summary
        if final_score >= 85.0:
            summary = "Strong privacy posture. Sensitive data is either not provided or properly restricted to private access."
        elif final_score >= 65.0:
            summary = "Moderate privacy risk. Some non-critical attributes or unnecessary fields are exposed."
        elif final_score >= 40.0:
            summary = "High privacy exposure. Highly sensitive attributes are publicly visible, facilitating social engineering and tracking."
        else:
            summary = "Critical privacy exposure. Multiple sensitive personal identifiers are publicly accessible, presenting significant security risks."

        return PrivacyAnalysisResult(
            score=final_score,
            risk_level=risk_level,
            findings=findings,
            summary=summary,
            exposed_sensitive_count=exposed_sensitive_count,
            unnecessary_exposed_count=unnecessary_exposed_count,
        )
