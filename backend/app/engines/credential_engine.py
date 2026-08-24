"""Deterministic Credential Security and Authentication Hygiene Engine."""

from typing import List, Optional
from app.core.enums import Severity, RiskLevel, FindingCategory
from app.schemas.findings import Finding
from app.schemas.credentials import (
    MfaMethod,
    PasswordManagerUsage,
    PasswordReuseScope,
    PasswordAgeBracket,
    CredentialAnalysisRequest,
    CredentialAnalysisResult,
)


class CredentialRiskEngine:
    """Evaluates user authentication practices and credential posture without collecting real passwords."""

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
    def analyze(cls, request: CredentialAnalysisRequest) -> CredentialAnalysisResult:
        """Execute deterministic evaluation of credential hygiene and authentication factors."""
        findings: List[Finding] = []
        recs: List[str] = []
        total_deduction = 0.0

        # 1. Multi-Factor Authentication (MFA) Evaluation
        if request.mfa_method == MfaMethod.HARDWARE_KEY:
            mfa_posture = "EXCELLENT (Phishing-Resistant Hardware Key)"
        elif request.mfa_method == MfaMethod.AUTHENTICATOR_APP:
            mfa_posture = "STRONG (Time-Based OTP App)"
        elif request.mfa_method == MfaMethod.SMS_EMAIL_OTP:
            mfa_posture = "MODERATE (SMS/Email OTP - SIM-Swap Prone)"
            deduction = 15.0
            total_deduction += deduction
            rec = "Upgrade from SMS/email verification to a hardware key (FIDO2) or TOTP authenticator app (Google Authenticator, YubiKey, Bitwarden)."
            recs.append(rec)
            findings.append(
                Finding(
                    id="CRED-MFA-SMS",
                    category=FindingCategory.CREDENTIALS,
                    severity=Severity.MEDIUM,
                    title="SIM-Swap & Interception Vulnerability in SMS/Email 2FA",
                    description="SMS and email verification codes can be intercepted via SIM-swapping, SS7 telecom exploitation, or email compromise.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        else:  # MfaMethod.NONE
            mfa_posture = "CRITICAL (No Multi-Factor Authentication)"
            deduction = 35.0
            total_deduction += deduction
            rec = "Enable multi-factor authentication (MFA) immediately across your primary email, banking portals, and password vaults."
            recs.append(rec)
            findings.append(
                Finding(
                    id="CRED-MFA-NONE",
                    category=FindingCategory.CREDENTIALS,
                    severity=Severity.CRITICAL,
                    title="Absence of Multi-Factor Authentication",
                    description="Single-factor authentication leaves accounts completely vulnerable to password leaks, credential stuffing, and phishing attacks.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # 2. Password Reuse Scope Evaluation
        if request.reuse_scope == PasswordReuseScope.UNIQUE_ALL:
            reuse_risk_tier = "LOW (Zero Cross-Site Reuse)"
        elif request.reuse_scope == PasswordReuseScope.SHARED_NONCRITICAL:
            reuse_risk_tier = "MODERATE (Shared Low-Risk Accounts)"
            deduction = 15.0
            total_deduction += deduction
            rec = "Generate unique passwords for every service to prevent secondary breaches from cascading into non-critical accounts."
            recs.append(rec)
            findings.append(
                Finding(
                    id="CRED-REUSE-NONCRITICAL",
                    category=FindingCategory.CREDENTIALS,
                    severity=Severity.MEDIUM,
                    title="Credential Sharing Across Low-Risk Services",
                    description="Reusing passwords across non-critical sites enables automated credential stuffing attacks when any single third-party site is breached.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        else:  # PasswordReuseScope.SHARED_CRITICAL_ACCOUNTS
            reuse_risk_tier = "CRITICAL (Shared Primary/Critical Passwords)"
            deduction = 35.0
            total_deduction += deduction
            rec = "Immediately reset shared passwords across primary email, financial portals, and work accounts to distinct, random passphrases."
            recs.append(rec)
            findings.append(
                Finding(
                    id="CRED-REUSE-CRITICAL",
                    category=FindingCategory.CREDENTIALS,
                    severity=Severity.CRITICAL,
                    title="Critical Account Credential Reuse Vulnerability",
                    description="Sharing credentials between primary email, banking, and general websites creates a single point of total identity failure if any database leaks.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # 3. Password Manager Usage
        if request.password_manager == PasswordManagerUsage.DEDICATED_MANAGER:
            pass  # Gold standard
        elif request.password_manager == PasswordManagerUsage.BROWSER_MANAGER:
            deduction = 5.0
            total_deduction += deduction
            rec = "Consider migrating to a dedicated cross-platform password manager with independent master encryption and biometric lockouts."
            recs.append(rec)
            findings.append(
                Finding(
                    id="CRED-MGR-BROWSER",
                    category=FindingCategory.CREDENTIALS,
                    severity=Severity.LOW,
                    title="Browser-Bound Credential Storage",
                    description="Browser password storage is convenient but susceptible to local infostealer malware targeting browser profile databases.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        elif request.password_manager == PasswordManagerUsage.MANUAL_DOCUMENT:
            deduction = 20.0
            total_deduction += deduction
            rec = "Never store passwords in plaintext notes, spreadsheets, or physical paper. Adopt an encrypted vault application."
            recs.append(rec)
            findings.append(
                Finding(
                    id="CRED-MGR-UNENCRYPTED",
                    category=FindingCategory.CREDENTIALS,
                    severity=Severity.HIGH,
                    title="Unencrypted / Plaintext Password Storage",
                    description="Storing passwords in documents, spreadsheets, or desktop notes exposes credentials directly to endpoint malware and unauthorized physical access.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        else:  # PasswordManagerUsage.MEMORY_ONLY
            deduction = 15.0
            total_deduction += deduction
            rec = "Adopt a dedicated password manager to generate and store high-entropy 16+ character passwords without relying on human memory."
            recs.append(rec)
            findings.append(
                Finding(
                    id="CRED-MGR-MEMORY",
                    category=FindingCategory.CREDENTIALS,
                    severity=Severity.MEDIUM,
                    title="Reliance on Human Memory for Passwords",
                    description="Human memory inherently encourages short passwords, predictable substitutions, and reuse across multiple websites.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # 4. Password Age and Rotation Hygiene
        if request.password_age in [PasswordAgeBracket.OVER_1_YEAR, PasswordAgeBracket.UNKNOWN_OLD]:
            deduction = 10.0
            total_deduction += deduction
            rec = "Perform an annual credential audit to rotate accounts created prior to establishing modern password security habits."
            recs.append(rec)
            findings.append(
                Finding(
                    id="CRED-AGE-OLD",
                    category=FindingCategory.CREDENTIALS,
                    severity=Severity.MEDIUM,
                    title="Stale / Long-Lived Credentials",
                    description="Accounts older than one year are significantly more likely to have appeared in historical data breach compilations without notification.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        elif request.password_age == PasswordAgeBracket.MONTHS_6_TO_12:
            deduction = 5.0
            total_deduction += deduction

        # 5. Optional Sample Pattern Type Evaluation
        if request.sample_pattern_type and request.sample_pattern_type.strip():
            pat = request.sample_pattern_type.strip().upper()
            if pat in ["NAME_YEAR", "DICTIONARY_WORD", "SIMPLE_SUBSTITUTION", "SEASON_YEAR"]:
                deduction = 15.0
                total_deduction += deduction
                rec = "Avoid predictable pattern structures (e.g. 'Word+Year!' or 'Name123'). Use truly random alphanumeric strings or multi-word Diceware passphrases."
                recs.append(rec)
                findings.append(
                    Finding(
                        id="CRED-PATTERN-PREDICTABLE",
                        category=FindingCategory.CREDENTIALS,
                        severity=Severity.HIGH,
                        title="Predictable Password Construction Pattern",
                        description=f"Your described password habit ({request.sample_pattern_type}) is highly vulnerable to dictionary rule attacks and brute-force cracking.",
                        score_impact=deduction,
                        recommendation=rec,
                    )
                )

        # Calculate final score and clamp [0.0, 100.0]
        raw_score = 100.0 - total_deduction
        final_score = max(0.0, min(100.0, round(raw_score, 2)))
        risk_level = cls._calculate_risk_level(final_score)

        if final_score >= 85.0:
            summary = "Excellent credential security posture. Zero-trust practices, strong MFA, and unique credentials protect against breach stuffing."
        elif final_score >= 65.0:
            summary = "Moderate credential posture. Authentication practices are acceptable, but minor gaps in MFA or credential storage were identified."
        elif final_score >= 40.0:
            summary = "High credential risk. Password reuse or weak multi-factor protection exposes accounts to automated takeover."
        else:
            summary = "Critical credential exposure. Lack of MFA and shared critical credentials create severe account takeover susceptibility."

        if not recs:
            recs.append("Continue using a dedicated password manager and hardware/TOTP multi-factor authentication across all active accounts.")

        return CredentialAnalysisResult(
            score=final_score,
            risk_level=risk_level,
            mfa_posture=mfa_posture,
            reuse_risk_tier=reuse_risk_tier,
            findings=findings,
            recommendations=recs,
            summary=summary,
        )
