"""AI Provider abstraction, Gemini LLM integration, and deterministic fallback explanation engine."""

import os
import json
import logging
from abc import ABC, abstractmethod
from typing import List, Optional
from app.core.config import settings
from app.core.enums import Severity, RiskLevel
from app.schemas.findings import Finding
from app.schemas.ai import (
    AIFindingExplanation,
    AIExplanationRequest,
    AIExplanationResponse,
)

logger = logging.getLogger("ai_explanation_service")


class AIProvider(ABC):
    """Abstract interface for AI explanation providers."""

    @abstractmethod
    async def explain(self, request: AIExplanationRequest) -> AIExplanationResponse:
        """Generate human-readable explanations and prioritized defensive guidance."""
        pass


class DeterministicFallbackProvider(AIProvider):
    """Rule-based, pedagogical natural language explanation generator guaranteeing zero hallucination."""

    @classmethod
    def _map_priority(cls, severity: Severity) -> str:
        """Translate severity into human-friendly action urgency."""
        if severity == Severity.CRITICAL:
            return "Immediate Action Required"
        elif severity == Severity.HIGH:
            return "High-Priority Hardening"
        elif severity == Severity.MEDIUM:
            return "Recommended Security Step"
        else:
            return "Defensive Best Practice"

    @classmethod
    def _translate_finding(cls, finding: Finding) -> AIFindingExplanation:
        """Translate an individual deterministic finding into plain-English explanation."""
        priority = cls._map_priority(finding.severity)
        
        # Craft plain-language context
        impact = (
            f"This finding exposes your digital footprint to potential correlation or automated exploitation. "
            f"{finding.description}"
        )
        
        why_it_matters = (
            f"Severity is classified as {finding.severity.value} because it directly impacts your overall resilience "
            f"against credential stuffing, social engineering, or automated account takeovers."
        )

        return AIFindingExplanation(
            finding_id=finding.id,
            finding_title=finding.title,
            severity=finding.severity,
            plain_language_impact=impact,
            why_it_matters=why_it_matters,
            defensive_priority=priority,
            recommended_action=finding.recommendation or "Review and strengthen associated security controls.",
        )

    async def explain(self, request: AIExplanationRequest) -> AIExplanationResponse:
        """Synthesize authoritative deterministic findings into a comprehensive plain-English briefing."""
        context_str = f" for '{request.context_title}'" if request.context_title else ""
        
        # 1. Generate Executive Narrative Summary
        if request.diess_score >= 85.0:
            posture_desc = "demonstrates robust cyber hygiene with minimal exposure vectors."
        elif request.diess_score >= 65.0:
            posture_desc = "reflects moderate baseline security, though targeted hardening is advised to prevent account correlation."
        elif request.diess_score >= 40.0:
            posture_desc = "presents notable exposure vectors that could be leveraged in credential stuffing or OSINT-based social engineering."
        else:
            posture_desc = "indicates critical exposure vulnerabilities requiring immediate defensive remediation."

        critical_count = sum(1 for f in request.findings if f.severity in [Severity.CRITICAL, Severity.HIGH])
        
        if not request.findings:
            narrative = (
                f"Your digital identity evaluation{context_str} achieved an outstanding DIESS posture of "
                f"{request.diess_score}/100 ({request.risk_level.value} Risk). "
                f"Zero critical exposures or naming predictability patterns were identified across evaluated vectors."
            )
        else:
            narrative = (
                f"Your digital identity evaluation{context_str} scored {request.diess_score}/100 "
                f"({request.risk_level.value} Risk), which {posture_desc} "
                f"Our deterministic security engines detected {len(request.findings)} active finding(s), "
                f"including {critical_count} high-priority vector(s) requiring remediation."
            )

        # 2. Translate each finding
        finding_exps = [self._translate_finding(f) for f in request.findings]

        # 3. Compile prioritized actionable takeaways
        takeaways: List[str] = []
        for finding in sorted(
            request.findings,
            key=lambda f: (
                0 if f.severity == Severity.CRITICAL else
                1 if f.severity == Severity.HIGH else
                2 if f.severity == Severity.MEDIUM else 3
            )
        ):
            if finding.recommendation and finding.recommendation not in takeaways:
                takeaways.append(finding.recommendation)

        if not takeaways:
            takeaways.append("Maintain periodic security audits and hardware/TOTP multi-factor authentication across primary accounts.")

        return AIExplanationResponse(
            narrative_summary=narrative,
            finding_explanations=finding_exps,
            actionable_takeaways=takeaways,
            provider_used="Deterministic Security Synthesizer (Zero-Hallucination Fallback)",
            is_fallback=True,
        )


class GeminiAIProvider(AIProvider):
    """Google Gemini LLM explanation provider with strict security guardrails."""

    def __init__(self, api_key: str, model_name: str = "gemini-2.5-flash"):
        self.api_key = api_key
        self.model_name = model_name

    async def explain(self, request: AIExplanationRequest) -> AIExplanationResponse:
        """Call Gemini API to generate pedagogical explanation grounded strictly in provided findings."""
        try:
            # We attempt importing and using the official google.genai SDK
            from google import genai
            client = genai.Client(api_key=self.api_key)

            # Construct safe prompt
            findings_data = [
                {
                    "id": f.id,
                    "title": f.title,
                    "severity": f.severity.value,
                    "description": f.description,
                    "score_impact": f.score_impact,
                    "recommendation": f.recommendation,
                }
                for f in request.findings
            ]

            prompt = (
                f"You are a defensive cybersecurity educational assistant for AI Identity Guardian.\n"
                f"Analyze the following deterministic security assessment findings strictly without inventing new vulnerabilities or claiming accounts were compromised.\n"
                f"DIESS Score: {request.diess_score}/100\n"
                f"Risk Level: {request.risk_level.value}\n"
                f"Context: {request.context_title or 'Digital Identity Audit'}\n"
                f"Audience: {request.audience_level}\n\n"
                f"Deterministic Findings JSON:\n{json.dumps(findings_data, indent=2)}\n\n"
                f"Respond in valid JSON format with the following schema:\n"
                f"{{\n"
                f'  "narrative_summary": "Plain-English 2-3 sentence executive briefing of the security posture",\n'
                f'  "finding_explanations": [\n'
                f"    {{\n"
                f'      "finding_id": "Finding ID",\n'
                f'      "finding_title": "Finding Title",\n'
                f'      "severity": "CRITICAL/HIGH/MEDIUM/LOW",\n'
                f'      "plain_language_impact": "Why this matters in non-technical terms",\n'
                f'      "defensive_priority": "Immediate Action Required / High-Priority Hardening / Recommended Security Step",\n'
                f'      "recommended_action": "Clear step-by-step guidance"\n'
                f"    }}\n"
                f"  ],\n"
                f'  "actionable_takeaways": ["Top 3-5 prioritized defensive bullet points"]\n'
                f"}}\n"
            )

            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )

            raw_text = response.text or ""
            # Extract JSON from potential markdown fences
            if "```json" in raw_text:
                json_str = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                json_str = raw_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = raw_text.strip()

            parsed = json.loads(json_str)

            exps = [
                AIFindingExplanation(
                    finding_id=item.get("finding_id"),
                    finding_title=item.get("finding_title", "Security Finding"),
                    severity=Severity(item.get("severity", "MEDIUM")),
                    plain_language_impact=item.get("plain_language_impact", ""),
                    defensive_priority=item.get("defensive_priority", "Recommended Action"),
                    recommended_action=item.get("recommended_action", ""),
                )
                for item in parsed.get("finding_explanations", [])
            ]

            return AIExplanationResponse(
                narrative_summary=parsed.get("narrative_summary", "Security analysis generated."),
                finding_explanations=exps,
                actionable_takeaways=parsed.get("actionable_takeaways", []),
                provider_used=f"Google Gemini ({self.model_name})",
                is_fallback=False,
            )
        except Exception as err:
            logger.warning(f"Gemini AI generation failed, falling back to deterministic engine: {err}")
            fallback = DeterministicFallbackProvider()
            return await fallback.explain(request)


class AIExplanationService:
    """Orchestrates AI explanations with automatic zero-failure fallback."""

    @classmethod
    async def explain(cls, request: AIExplanationRequest) -> AIExplanationResponse:
        """Generate human-readable explanations using the active or fallback provider."""
        api_key = os.environ.get("GEMINI_API_KEY") or settings.GEMINI_API_KEY
        provider_mode = settings.AI_PROVIDER.lower()

        if provider_mode != "fallback" and api_key and api_key.strip():
            try:
                gemini_provider = GeminiAIProvider(api_key=api_key.strip(), model_name=settings.AI_MODEL_NAME)
                return await gemini_provider.explain(request)
            except Exception as e:
                logger.error(f"Error initializing Gemini provider: {e}")

        # Always fallback cleanly
        fallback_provider = DeterministicFallbackProvider()
        return await fallback_provider.explain(request)
