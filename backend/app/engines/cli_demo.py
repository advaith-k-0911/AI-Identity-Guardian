import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.enums import Sensitivity
from app.engines.username_engine import UsernameRiskEngine
from app.engines.privacy_engine import PrivacyRiskEngine
from app.schemas.privacy import PrivacyFieldInput


def run_demo():
    print("=" * 60)
    print("   AI Identity Guardian — Risk Engine Demonstration")
    print("=" * 60)

    # 1. Username Analysis Demo
    demo_user = "john_doe_1995"
    demo_name = "John Doe"
    demo_dob = 1995
    print(f"\n[+] Analyzing Username: '{demo_user}'")
    print(f"    Name: {demo_name}, Birth Year: {demo_dob}")

    user_result = UsernameRiskEngine.analyze(
        username=demo_user,
        full_name=demo_name,
        birth_year=demo_dob,
    )

    print(f"    Score: {user_result.score}/100 | Risk Level: {user_result.risk_level.value}")
    print(f"    Detected Patterns: {user_result.detected_patterns}")
    print("    Findings:")
    for f in user_result.findings:
        print(f"      - [{f.severity.value}] {f.title} (-{f.score_impact} pts)")
        print(f"        Recommendation: {f.recommendation}")

    # 2. Privacy Exposure Demo
    print("\n" + "-" * 60)
    print("[+] Analyzing Privacy Profile Exposure:")
    fields = [
        PrivacyFieldInput(field_name="full_name", is_provided=True, is_public=True, is_necessary=True, sensitivity=Sensitivity.MEDIUM),
        PrivacyFieldInput(field_name="date_of_birth", is_provided=True, is_public=True, is_necessary=False, sensitivity=Sensitivity.HIGH),
        PrivacyFieldInput(field_name="email", is_provided=True, is_public=False, is_necessary=True, sensitivity=Sensitivity.HIGH),
        PrivacyFieldInput(field_name="phone_number", is_provided=True, is_public=True, is_necessary=False, sensitivity=Sensitivity.CRITICAL),
        PrivacyFieldInput(field_name="country", is_provided=True, is_public=True, is_necessary=False, sensitivity=Sensitivity.LOW),
        PrivacyFieldInput(field_name="interests", is_provided=False, is_public=False, is_necessary=False, sensitivity=Sensitivity.LOW),
    ]

    priv_result = PrivacyRiskEngine.analyze(fields=fields)
    print(f"    Score: {priv_result.score}/100 | Risk Level: {priv_result.risk_level.value}")
    print(f"    Exposed Sensitive Count: {priv_result.exposed_sensitive_count}")
    print(f"    Unnecessary Exposed Count: {priv_result.unnecessary_exposed_count}")
    print("    Findings:")
    for f in priv_result.findings:
        print(f"      - [{f.severity.value}] {f.title} (-{f.score_impact} pts)")
        print(f"        Recommendation: {f.recommendation}")
    print("=" * 60)


if __name__ == "__main__":
    run_demo()
