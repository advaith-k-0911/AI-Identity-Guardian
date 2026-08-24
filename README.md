# AI Identity Guardian

A privacy-focused web application that evaluates a user's digital identity exposure and security posture.

AI Identity Guardian analyzes digital identity indicators—such as usernames, exposed personal data, impersonation risk, credential-security practices, and account-recovery configurations—to produce actionable insights and a unified **Digital Identity Exposure & Security Score (DIESS)**.

---

## Key Features

- **Username Risk Analysis**: Identifies sensitive patterns, name leaks, birth year indicators, predictable sequences, and multi-factor exposure.
- **Privacy Exposure Evaluation**: Assesses personal data sensitivity, visibility, and necessity across services.
- **Actionable Findings**: Provides deterministic, severity-graded security findings (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) with practical remediation recommendations.
- **DIESS Metric**: A composite 0–100 score reflecting total identity posture.
- **Zero-Knowledge Privacy Principles**: Never logs or persists unneeded sensitive input; passwords and secrets are strictly protected.

---

## Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── api/          # API route endpoints (v1)
│   │   ├── core/         # Configuration, enums, security settings
│   │   ├── db/           # Database sessions and migrations
│   │   ├── engines/      # Deterministic risk and analysis engines
│   │   ├── models/       # ORM models (SQLAlchemy)
│   │   ├── repositories/ # Data access layer
│   │   ├── schemas/      # Pydantic data contracts and validation
│   │   ├── services/     # Business logic and coordination
│   │   └── main.py       # FastAPI application entrypoint
│   └── tests/            # Pytest test suite
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom React hooks
│       ├── layouts/      # Application page layouts
│       ├── pages/        # Route page views
│       ├── services/     # API integration client
│       ├── types/        # TypeScript interfaces & models
│       └── utils/        # Formatting and helper utilities
├── ARCHITECTURE.md       # Detailed technical architecture specification
├── DEVELOPMENT.md        # Local environment and developer guide
├── SECURITY.md           # Security & privacy standards
├── API.md                # API contract specifications
├── .env.example          # Environment variables template
└── .gitignore            # Git exclusion rules
```

---

## Quickstart

### Backend Setup

```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
pytest
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Development Roadmap

- [x] **Phase 1**: Project audit & architecture foundation
- [ ] **Phase 2**: Refactor existing Python risk engine
- [ ] **Phase 3**: FastAPI backend and API layer
- [ ] **Phase 4**: React frontend and design system
- [ ] **Phase 5**: Username Analysis web workflow
- [ ] **Phase 6**: Privacy Analysis web workflow
- [ ] **Phase 7**: Database and persistent reports
- [ ] **Phase 8**: Authentication and user dashboard
- [ ] **Phase 9**: Impersonation Detection
- [ ] **Phase 10**: Credential Security
- [ ] **Phase 11**: Account Recovery Security
- [ ] **Phase 12**: DIESS unified scoring
- [ ] **Phase 13**: AI Explanation Engine
- [ ] **Phase 14**: Security reports and history
- [ ] **Phase 15**: Admin analytics and final hardening
