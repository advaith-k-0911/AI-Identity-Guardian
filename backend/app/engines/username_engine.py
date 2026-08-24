"""Deterministic Username Risk Analysis Engine."""

import re
from typing import List, Optional, Tuple
from app.core.enums import Severity, RiskLevel, FindingCategory
from app.schemas.findings import Finding
from app.schemas.username import UsernameAnalysisResult


class UsernameRiskEngine:
    """Evaluates usernames for privacy leakage, PII exposure, and predictability."""

    @staticmethod
    def _calculate_risk_level(score: float) -> RiskLevel:
        """Map numerical score to standard RiskLevel."""
        if score >= 85.0:
            return RiskLevel.LOW
        elif score >= 60.0:
            return RiskLevel.MEDIUM
        elif score >= 35.0:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL

    @classmethod
    def analyze(
        cls,
        username: str,
        full_name: Optional[str] = None,
        birth_year: Optional[int] = None,
    ) -> UsernameAnalysisResult:
        """Execute deterministic risk evaluation on a username.
        
        Args:
            username: The username string to analyze.
            full_name: Optional user's legal or common name.
            birth_year: Optional user's birth year.
            
        Returns:
            UsernameAnalysisResult containing score, risk level, findings, and detected patterns.
        """
        raw_username = username or ""
        clean_user = raw_username.strip().lower()
        findings: List[Finding] = []
        detected_patterns: List[str] = []
        total_deduction = 0.0

        if not clean_user:
            findings.append(
                Finding(
                    id="USR-ERR-EMPTY",
                    category=FindingCategory.USERNAME,
                    severity=Severity.CRITICAL,
                    title="Empty Username",
                    description="No username was provided for analysis.",
                    score_impact=100.0,
                    recommendation="Provide a valid username handle.",
                )
            )
            return UsernameAnalysisResult(
                score=0.0,
                risk_level=RiskLevel.CRITICAL,
                findings=findings,
                summary="No username provided. Unable to calculate security score.",
                username=raw_username,
                detected_patterns=["EMPTY_USERNAME"],
            )

        name_leak_detected = False
        birth_year_leak_detected = False

        # 1. Evaluate Name Leaks (if full_name provided)
        if full_name and full_name.strip():
            clean_full = full_name.strip().lower()
            name_parts = [re.sub(r"[^a-z0-9]", "", part) for part in clean_full.split() if len(part) >= 2]
            combined_name = "".join(name_parts)
            clean_user_alphanumeric = re.sub(r"[^a-z0-9]", "", clean_user)

            # Check full combined name (e.g. 'johndoe' in 'johndoe88' or 'john_doe_hq')
            if len(combined_name) >= 4 and combined_name in clean_user_alphanumeric:
                name_leak_detected = True
                detected_patterns.append("FULL_NAME_MATCH")
                deduction = 35.0
                total_deduction += deduction
                findings.append(
                    Finding(
                        id="USR-NAME-FULL",
                        category=FindingCategory.USERNAME,
                        severity=Severity.CRITICAL,
                        title="Full Legal Name in Username",
                        description=f"Your username contains your complete name ('{full_name.strip()}').",
                        score_impact=deduction,
                        recommendation="Avoid using your real full name in public handles to prevent identity linkage and doxxing.",
                    )
                )
            else:
                # Check individual parts (first or last name)
                matched_parts = []
                for part in name_parts:
                    if len(part) >= 3 and part in clean_user:
                        matched_parts.append(part)

                if matched_parts:
                    name_leak_detected = True
                    detected_patterns.append("PARTIAL_NAME_MATCH")
                    deduction = min(30.0, 20.0 * len(matched_parts))
                    total_deduction += deduction
                    parts_str = ", ".join(f"'{p}'" for p in matched_parts)
                    findings.append(
                        Finding(
                            id="USR-NAME-PARTIAL",
                            category=FindingCategory.USERNAME,
                            severity=Severity.HIGH,
                            title="Personal Name Elements in Username",
                            description=f"Your username contains personal name component(s): {parts_str}.",
                            score_impact=deduction,
                            recommendation="Replace real name fragments with unrelated pseudonyms or randomized handles.",
                        )
                    )

        # 2. Evaluate Birth Year Leaks
        if birth_year and 1900 <= birth_year <= 2100:
            year_str = str(birth_year)
            short_year = year_str[-2:]

            if year_str in clean_user:
                birth_year_leak_detected = True
                detected_patterns.append("EXACT_BIRTH_YEAR")
                deduction = 25.0
                total_deduction += deduction
                findings.append(
                    Finding(
                        id="USR-DOB-YEAR",
                        category=FindingCategory.USERNAME,
                        severity=Severity.HIGH,
                        title="Exact Birth Year Exposed",
                        description=f"Your username contains your exact birth year ({year_str}).",
                        score_impact=deduction,
                        recommendation="Remove your birth year from usernames to prevent attackers from determining your age, date of birth, or password reset hints.",
                    )
                )
            elif re.search(rf"{short_year}$", clean_user) or re.search(rf"[._-]{short_year}", clean_user):
                birth_year_leak_detected = True
                detected_patterns.append("BIRTH_YEAR_2DIGIT")
                deduction = 15.0
                total_deduction += deduction
                findings.append(
                    Finding(
                        id="USR-DOB-2DIGIT",
                        category=FindingCategory.USERNAME,
                        severity=Severity.MEDIUM,
                        title="Potential 2-Digit Birth Year Suffix",
                        description=f"Your username ends with '{short_year}', which corresponds to your birth year.",
                        score_impact=deduction,
                        recommendation="Avoid appending two-digit birth years to usernames.",
                    )
                )
        else:
            # Standalone Year Pattern Check (e.g. 1940 - 2026)
            year_matches = re.findall(r"(?:19[4-9]\d|20[0-2]\d)", clean_user)
            if year_matches:
                detected_patterns.append("PROBABLE_YEAR")
                deduction = 15.0
                total_deduction += deduction
                matched_str = ", ".join(year_matches)
                findings.append(
                    Finding(
                        id="USR-YEAR-PATTERN",
                        category=FindingCategory.USERNAME,
                        severity=Severity.MEDIUM,
                        title="Probable Year Detected in Username",
                        description=f"Your username contains 4-digit year sequence(s): {matched_str}.",
                        score_impact=deduction,
                        recommendation="Remove year references from handles to eliminate age and identity correlation.",
                    )
                )

        # 3. Evaluate Predictable Number Sequences
        # Check ascending sequences (e.g. 123, 1234, 012, 6789)
        seq_matches = re.findall(r"(012|123|234|345|456|567|678|789|1234|2345|3456|4567|5678|6789|12345)", clean_user)
        if seq_matches:
            detected_patterns.append("SEQUENTIAL_NUMBERS")
            deduction = 15.0
            total_deduction += deduction
            findings.append(
                Finding(
                    id="USR-NUM-SEQ",
                    category=FindingCategory.USERNAME,
                    severity=Severity.MEDIUM,
                    title="Sequential Number Pattern",
                    description=f"Username contains predictable sequential numbers: {', '.join(set(seq_matches))}.",
                    score_impact=deduction,
                    recommendation="Avoid simple sequential numbers such as '123' as they are easily guessed and enumerated.",
                )
            )

        # Check descending sequences (e.g. 321, 4321, 987)
        rev_seq_matches = re.findall(r"(321|432|543|654|765|876|987|4321|5432|6543|7654|8765|9876)", clean_user)
        if rev_seq_matches:
            detected_patterns.append("REVERSE_SEQUENTIAL_NUMBERS")
            deduction = 15.0
            total_deduction += deduction
            findings.append(
                Finding(
                    id="USR-NUM-REVSEQ",
                    category=FindingCategory.USERNAME,
                    severity=Severity.MEDIUM,
                    title="Reverse Sequential Number Pattern",
                    description=f"Username contains reverse sequential numbers: {', '.join(set(rev_seq_matches))}.",
                    score_impact=deduction,
                    recommendation="Avoid reverse sequential numbers in handles.",
                )
            )

        # Check repeating digit sequences (e.g. 000, 111, 777, 999)
        rep_matches = re.findall(r"(\d)\1{2,}", clean_user)
        if rep_matches:
            detected_patterns.append("REPEATING_DIGITS")
            deduction = 10.0
            total_deduction += deduction
            findings.append(
                Finding(
                    id="USR-NUM-REPEAT",
                    category=FindingCategory.USERNAME,
                    severity=Severity.LOW,
                    title="Repeating Digit Pattern",
                    description="Username contains repeated digit patterns (e.g. '000', '111').",
                    score_impact=deduction,
                    recommendation="Use non-repeating or alphanumeric patterns if numbers are required.",
                )
            )

        # 4. Compounding Risk: Multiple Personal Identifiers Exposed
        if name_leak_detected and birth_year_leak_detected:
            detected_patterns.append("MULTIPLE_PERSONAL_DETAILS")
            compound_deduction = 15.0
            total_deduction += compound_deduction
            findings.append(
                Finding(
                    id="USR-COMPOUND-LEAK",
                    category=FindingCategory.USERNAME,
                    severity=Severity.CRITICAL,
                    title="Multiple Personal Details Exposed Together",
                    description="Your username combines both your personal name and birth year. This drastically increases your susceptibility to cross-platform correlation, OSINT profiling, and impersonation.",
                    score_impact=compound_deduction,
                    recommendation="Immediately change this handle on sensitive accounts to a pseudonym unlinked from your legal identity.",
                )
            )

        # 5. Short Handle / Low Entropy Check
        if len(clean_user) < 4:
            detected_patterns.append("SHORT_HANDLE")
            deduction = 5.0
            total_deduction += deduction
            findings.append(
                Finding(
                    id="USR-ENTROPY-SHORT",
                    category=FindingCategory.USERNAME,
                    severity=Severity.LOW,
                    title="Short Handle Length",
                    description="Very short usernames are frequently targeted for credential stuffing, handle hijacking, or brute force.",
                    score_impact=deduction,
                    recommendation="Consider handles with at least 6-12 characters for improved resistance.",
                )
            )

        # Calculate final score
        raw_score = 100.0 - total_deduction
        final_score = max(0.0, min(100.0, round(raw_score, 2)))
        risk_level = cls._calculate_risk_level(final_score)

        # Build human-readable summary
        if final_score >= 85.0:
            summary = "Excellent username security posture. No personal identifiers or predictable sequences were detected."
        elif final_score >= 60.0:
            summary = "Moderate username exposure. Minor predictable patterns or non-critical hints were identified."
        elif final_score >= 35.0:
            summary = "High username exposure. Personally identifying attributes or predictable patterns significantly weaken your privacy."
        else:
            summary = "Critical username exposure. Direct PII linkage identified, presenting immediate privacy and impersonation risks."

        return UsernameAnalysisResult(
            score=final_score,
            risk_level=risk_level,
            findings=findings,
            summary=summary,
            username=raw_username,
            detected_patterns=detected_patterns,
        )
