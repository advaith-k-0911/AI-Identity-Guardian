"""Deterministic Impersonation Risk and Spoofing Susceptibility Engine."""

import re
from typing import List, Optional, Set
from app.core.enums import Severity, RiskLevel, FindingCategory
from app.schemas.findings import Finding
from app.schemas.impersonation import ImpersonationAnalysisResult

HIGH_VALUE_ROLES = {
    "ceo", "cto", "cfo", "ciso", "cio", "coo", "founder", "co-founder",
    "admin", "administrator", "support", "helpdesk", "security", "sec",
    "moderator", "mod", "finance", "treasury", "lead", "director", "manager", "vip"
}

HOMOGLYPH_MAP = {
    "o": ["0"],
    "l": ["1", "i"],
    "i": ["1", "l"],
    "e": ["3"],
    "s": ["5"],
    "a": ["4", "@"],
    "t": ["7"],
}


class ImpersonationRiskEngine:
    """Evaluates how susceptible a user handle and profile are to impersonation and spoofing."""

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
    def generate_lookalike_variants(cls, username: str) -> List[str]:
        """Deterministically generate top high-risk lookalike spoofing vectors."""
        clean = username.strip().lower()
        if not clean:
            return []

        variants: Set[str] = set()

        # 1. Authority suffix/prefix vectors
        variants.add(f"{clean}_official")
        variants.add(f"{clean}_real")
        variants.add(f"{clean}_support")
        variants.add(f"{clean}_team")
        variants.add(f"real_{clean}")
        variants.add(f"the_{clean}")

        # 2. Separator duplication vectors
        if "_" in clean:
            variants.add(clean.replace("_", "__", 1))
        elif "." in clean:
            variants.add(clean.replace(".", "..", 1))
        elif "-" in clean:
            variants.add(clean.replace("-", "--", 1))
        else:
            variants.add(f"{clean}_")
            variants.add(f"_{clean}")

        # 3. Homoglyph / leetspeak character substitutions
        for char, replacements in HOMOGLYPH_MAP.items():
            if char in clean:
                for rep in replacements:
                    variants.add(clean.replace(char, rep, 1))

        # Return ordered list capped at top 8
        sorted_variants = sorted(list(variants))[:8]
        return sorted_variants

    @classmethod
    def analyze(
        cls,
        username: str,
        display_name: Optional[str] = None,
        role_or_title: Optional[str] = None,
        bio_keywords: Optional[List[str]] = None,
    ) -> ImpersonationAnalysisResult:
        """Execute deterministic impersonation risk assessment on provided profile parameters."""
        raw_username = username or ""
        clean_user = raw_username.strip().lower()
        findings: List[Finding] = []
        recs: List[str] = []
        total_deduction = 0.0

        if not clean_user:
            findings.append(
                Finding(
                    id="IMP-ERR-EMPTY",
                    category=FindingCategory.IMPERSONATION,
                    severity=Severity.CRITICAL,
                    title="Missing Target Handle",
                    description="No username handle provided for impersonation analysis.",
                    score_impact=100.0,
                    recommendation="Provide a valid username handle.",
                )
            )
            return ImpersonationAnalysisResult(
                score=0.0,
                risk_level=RiskLevel.CRITICAL,
                susceptibility_tier="VERY HIGH",
                lookalike_variants=[],
                findings=findings,
                recommendations=["Provide a valid username handle."],
                summary="Unable to evaluate impersonation risk without a target handle.",
                username=raw_username,
            )

        # 1. High-Authority Role Target Evaluation
        if role_or_title and role_or_title.strip():
            clean_role = role_or_title.strip().lower()
            role_words = [re.sub(r"[^a-z0-9]", "", w) for w in clean_role.split()]
            matched_roles = [r for r in role_words if r in HIGH_VALUE_ROLES]

            if matched_roles:
                deduction = 25.0
                total_deduction += deduction
                rec = "Implement mandatory multi-factor authentication (MFA) and consider claim-protection on key social platforms for high-authority titles."
                recs.append(rec)
                findings.append(
                    Finding(
                        id="IMP-ROLE-HIGHVALUE",
                        category=FindingCategory.IMPERSONATION,
                        severity=Severity.HIGH,
                        title="High-Authority Role Vulnerability",
                        description=f"Your specified role/title ('{role_or_title.strip()}') makes your profile an attractive target for executive impersonation, VIP fraud, and spear-phishing.",
                        score_impact=deduction,
                        recommendation=rec,
                    )
                )

        # 2. Canonical Name-to-Handle Predictability
        if display_name and display_name.strip():
            clean_name = display_name.strip().lower()
            name_parts = [re.sub(r"[^a-z0-9]", "", p) for p in clean_name.split() if len(p) >= 2]
            combined_name = "".join(name_parts)
            user_clean_alphanumeric = re.sub(r"[^a-z0-9]", "", clean_user)

            if len(combined_name) >= 4 and combined_name == user_clean_alphanumeric:
                deduction = 20.0
                total_deduction += deduction
                rec = "Consider registering primary brand variations or claiming identical handles across secondary platforms to prevent impersonators from occupying them."
                recs.append(rec)
                findings.append(
                    Finding(
                        id="IMP-NAME-CANONICAL",
                        category=FindingCategory.IMPERSONATION,
                        severity=Severity.HIGH,
                        title="Predictable Canonical Name-to-Handle Mapping",
                        description=f"Your handle directly mirrors your full legal name ('{display_name.strip()}'), allowing threat actors to predict your account name across newly launched services.",
                        score_impact=deduction,
                        recommendation=rec,
                    )
                )

        # 3. Homoglyph & Leetspeak Substitution Surface (trigger when >= 3 homoglyphs present)
        homoglyphs_in_user = [c for c in clean_user if c in HOMOGLYPH_MAP]
        if len(homoglyphs_in_user) >= 3:
            deduction = 10.0
            total_deduction += deduction
            rec = "Be vigilant against messages from accounts with subtle visual letter swaps (e.g. '0' for 'O', '1' or 'I' for 'l')."
            recs.append(rec)
            findings.append(
                Finding(
                    id="IMP-HOMOGLYPH-SURFACE",
                    category=FindingCategory.IMPERSONATION,
                    severity=Severity.MEDIUM,
                    title="High Homoglyph Spoofing Susceptibility",
                    description=f"Your username contains multiple characters ({', '.join(set(homoglyphs_in_user))}) that are readily swappable with visually indistinguishable lookalikes (homoglyphs).",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # 4. Separator Duplication Vulnerability (multiple or prominent single separator)
        if any(sep in clean_user for sep in ["_", ".", "-"]):
            deduction = 5.0
            total_deduction += deduction
            rec = "Warn your contacts that official accounts will never use double underscores (e.g. '__') or modified punctuation."
            recs.append(rec)
            findings.append(
                Finding(
                    id="IMP-SEPARATOR-MIMICRY",
                    category=FindingCategory.IMPERSONATION,
                    severity=Severity.LOW,
                    title="Separator Duplication Attack Surface",
                    description="Handles containing single separators are commonly spoofed by duplicating the separator (e.g., changing '_' to '__') which is difficult to spot on mobile devices.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # Generate defensive lookalike variants
        lookalike_variants = cls.generate_lookalike_variants(clean_user)

        # Clamping score between 0.0 and 100.0
        raw_score = 100.0 - total_deduction
        final_score = max(0.0, min(100.0, round(raw_score, 2)))
        risk_level = cls._calculate_risk_level(final_score)

        if final_score >= 85.0:
            susceptibility_tier = "LOW"
            summary = "Strong impersonation resilience. Handle exhibits low predictability and minimal homoglyph attack surface."
        elif final_score >= 65.0:
            susceptibility_tier = "MODERATE"
            summary = "Moderate impersonation attack surface. Some predictable naming patterns or lookalike variants can be spoofed."
        elif final_score >= 40.0:
            susceptibility_tier = "HIGH"
            summary = "High impersonation risk. High-authority role indicators or exact legal name mapping make this identity easy to spoof."
        else:
            susceptibility_tier = "VERY HIGH"
            summary = "Critical impersonation susceptibility. Multiple compounded factors allow adversaries to construct highly convincing clone accounts."

        if not recs:
            recs.append("Maintain strong account authentication practices and periodic monitoring of lookalike domain and handle registrations.")

        return ImpersonationAnalysisResult(
            score=final_score,
            risk_level=risk_level,
            susceptibility_tier=susceptibility_tier,
            lookalike_variants=lookalike_variants,
            findings=findings,
            recommendations=recs,
            summary=summary,
            username=raw_username,
        )
