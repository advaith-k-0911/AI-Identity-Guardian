"""Deterministic Account Recovery Security and Fallback Resilience Engine."""

from typing import List
from app.core.enums import Severity, RiskLevel, FindingCategory
from app.schemas.findings import Finding
from app.schemas.recovery import (
    RecoveryEmailStatus,
    RecoveryPhoneStatus,
    BackupCodesStatus,
    SecurityQuestionUsage,
    RecoveryAnalysisRequest,
    RecoveryAnalysisResult,
)


class RecoveryRiskEngine:
    """Evaluates account recovery architecture, fallback vulnerability, and OSINT resilience without collecting secret answers."""

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
    def analyze(cls, request: RecoveryAnalysisRequest) -> RecoveryAnalysisResult:
        """Execute deterministic account recovery security evaluation."""
        findings: List[Finding] = []
        recs: List[str] = []
        total_deduction = 0.0

        # 1. Knowledge-Based Security Question Vulnerability
        if request.security_question_usage == SecurityQuestionUsage.BIOGRAPHICAL_ANSWERS:
            deduction = 30.0
            total_deduction += deduction
            rec = "Disable knowledge-based security questions or replace real biographical answers with randomly generated 20+ character passphrases stored in your password manager."
            recs.append(rec)
            findings.append(
                Finding(
                    id="REC-QUESTION-OSINT",
                    category=FindingCategory.RECOVERY,
                    severity=Severity.CRITICAL,
                    title="Predictable Knowledge-Based Security Questions (OSINT Vulnerability)",
                    description="Real biographical answers (childhood pets, schools, mother's maiden name, hometowns) are easily discoverable via social media, genealogy records, or basic OSINT investigations.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # 2. Offline Backup / Emergency Codes Readiness
        if request.backup_codes_status in [BackupCodesStatus.STORED_ENCRYPTED_VAULT, BackupCodesStatus.PRINTED_PHYSICAL_SAFE]:
            backup_codes_summary = "READY (Securely Archived)"
        elif request.backup_codes_status == BackupCodesStatus.STORED_PLAINTEXT:
            backup_codes_summary = "VULNERABLE (Plaintext Desktop Storage)"
            deduction = 15.0
            total_deduction += deduction
            rec = "Move emergency recovery codes from unencrypted notes or desktop files into an encrypted password manager vault or physical safe."
            recs.append(rec)
            findings.append(
                Finding(
                    id="REC-BACKUP-PLAINTEXT",
                    category=FindingCategory.RECOVERY,
                    severity=Severity.MEDIUM,
                    title="Unencrypted Emergency Backup Codes Storage",
                    description="Storing 2FA recovery codes in unencrypted text files or screenshots allows infostealer malware to bypass multi-factor authentication instantly.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        else:  # BackupCodesStatus.NOT_GENERATED_OR_LOST
            backup_codes_summary = "UNPREPARED (Missing / Un-generated Backup Codes)"
            deduction = 25.0
            total_deduction += deduction
            rec = "Generate and securely store offline 2FA backup codes for all primary accounts to prevent permanent lockout in case of device failure or loss."
            recs.append(rec)
            findings.append(
                Finding(
                    id="REC-BACKUP-MISSING",
                    category=FindingCategory.RECOVERY,
                    severity=Severity.HIGH,
                    title="Missing Emergency Recovery Backup Codes",
                    description="Without offline emergency codes, losing your primary authenticator device or phone number can result in permanent account lockout or irreversible data loss.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # 3. Recovery Email Channel & 2FA Protection
        if request.recovery_email_status == RecoveryEmailStatus.DEDICATED_ISOLATED_2FA:
            pass  # Gold standard
        elif request.recovery_email_status == RecoveryEmailStatus.STANDARD_PERSONAL:
            deduction = 10.0
            total_deduction += deduction
            rec = "Ensure your personal recovery email is guarded by strong hardware/TOTP multi-factor authentication."
            recs.append(rec)
            findings.append(
                Finding(
                    id="REC-EMAIL-SHARED",
                    category=FindingCategory.RECOVERY,
                    severity=Severity.LOW,
                    title="Standard Personal Recovery Channel",
                    description="Using a primary personal email as a recovery channel means that if your primary email is compromised, all linked services become vulnerable.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        elif request.recovery_email_status == RecoveryEmailStatus.UNPROTECTED_WORK:
            deduction = 20.0
            total_deduction += deduction
            rec = "Never use work or unmanaged corporate email accounts as recovery channels for personal digital identities."
            recs.append(rec)
            findings.append(
                Finding(
                    id="REC-EMAIL-WORK",
                    category=FindingCategory.RECOVERY,
                    severity=Severity.HIGH,
                    title="Corporate / Unmanaged Recovery Email Channel",
                    description="Organizational emails can be monitored, accessed by IT administrators, or abruptly terminated upon job transitions.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        else:  # RecoveryEmailStatus.NONE
            deduction = 25.0
            total_deduction += deduction
            rec = "Configure a secured, dedicated secondary email account for critical recovery verification."
            recs.append(rec)
            findings.append(
                Finding(
                    id="REC-EMAIL-NONE",
                    category=FindingCategory.RECOVERY,
                    severity=Severity.HIGH,
                    title="Absence of Secondary Recovery Email",
                    description="Lacking a secondary recovery channel severely limits automated identity verification if your primary login fails.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # 4. Recovery Phone / SMS Fallback Bypass Risk
        if request.recovery_phone_status == RecoveryPhoneStatus.STANDARD_CELLULAR:
            deduction = 15.0
            total_deduction += deduction
            rec = "Contact your cellular carrier to enable a mandatory port-freeze / SIM PIN, or remove SMS as an authorized password reset mechanism."
            recs.append(rec)
            findings.append(
                Finding(
                    id="REC-PHONE-SMS-RESET",
                    category=FindingCategory.RECOVERY,
                    severity=Severity.MEDIUM,
                    title="Unprotected Cellular SMS Password Reset Channel",
                    description="Accounts allowing SMS-based password resets can be taken over by SIM-swap attacks, entirely bypassing stronger login passwords.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )
        elif request.recovery_phone_status == RecoveryPhoneStatus.SIM_LOCKED_CELLULAR:
            deduction = 5.0
            total_deduction += deduction

        # 5. Public Exposure of Recovery Contact Channels
        if request.is_recovery_contact_public:
            deduction = 20.0
            total_deduction += deduction
            rec = "Isolate your recovery email and phone number from publicly listed contact details on social profiles, resumes, and websites."
            recs.append(rec)
            findings.append(
                Finding(
                    id="REC-CONTACT-PUBLIC",
                    category=FindingCategory.RECOVERY,
                    severity=Severity.HIGH,
                    title="Public Exposure of Account Recovery Identifiers",
                    description="Your recovery email or phone number is publicly visible online, allowing targeted attackers to pinpoint exactly which reset channels to attack.",
                    score_impact=deduction,
                    recommendation=rec,
                )
            )

        # Calculate final score and clamp [0.0, 100.0]
        raw_score = 100.0 - total_deduction
        final_score = max(0.0, min(100.0, round(raw_score, 2)))
        risk_level = cls._calculate_risk_level(final_score)

        if final_score >= 85.0:
            recovery_resilience_tier = "EXCELLENT (Hardened Recovery Architecture)"
            summary = "Outstanding account recovery security. Recovery channels are isolated, security questions are hardened against OSINT, and backup codes are securely archived."
        elif final_score >= 65.0:
            recovery_resilience_tier = "MODERATE (Standard Recovery Channels)"
            summary = "Acceptable recovery posture, but minor vulnerabilities in SMS reset fallback or emergency code availability exist."
        elif final_score >= 40.0:
            recovery_resilience_tier = "VULNERABLE (Elevated Takeover Risk)"
            summary = "Elevated recovery risk. Predictable security questions or un-isolated public recovery channels expose accounts to social engineering."
        else:
            recovery_resilience_tier = "CRITICAL (Severe Account Takeover Vulnerability)"
            summary = "Critical account recovery exposure. Real biographical security questions and un-isolated reset channels enable effortless account takeover via OSINT."

        if not recs:
            recs.append("Maintain periodic testing of offline backup codes and keep recovery email MFA configurations up to date.")

        return RecoveryAnalysisResult(
            score=final_score,
            risk_level=risk_level,
            recovery_resilience_tier=recovery_resilience_tier,
            backup_codes_status_summary=backup_codes_summary,
            findings=findings,
            recommendations=recs,
            summary=summary,
        )
