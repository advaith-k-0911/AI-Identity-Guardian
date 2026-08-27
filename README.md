# AI Identity Guardian

AI Identity Guardian is an open-source cybersecurity assessment tool designed to evaluate digital identity exposure. It analyzes public handles, profile metadata, impersonation vectors, credential habits, and account recovery configurations to generate an explainable score called the **Digital Identity Exposure and Security Score (DIESS)**.

The system uses deterministic risk engines and an AI-powered explanation service to deliver concrete remediation steps without storing personal data.

---

## Overview

Modern digital identities are vulnerable to open-source intelligence (OSINT) harvesting, credential stuffing, and social engineering. Most users inadvertently leak personal information through usernames, profile fields, and weak recovery options.

AI Identity Guardian evaluates these vulnerabilities across five core security dimensions:

1. **Username Threat Analysis**: Identifies real names, birth years, repeated character patterns, and predictable suffixes embedded in handles.
2. **Privacy Exposure Engine**: Evaluates public visibility, necessity, and sensitivity ratings of exposed profile attributes.
3. **Impersonation Risk Engine**: Analyzes lookalike handles, homoglyph character substitutions, and executive or high-value role targeting.
4. **Credential Hygiene Engine**: Checks password length, complexity metrics, multi-factor authentication (MFA) status, and password manager usage.
5. **Account Recovery Resilience**: Evaluates password reset mechanisms, backup code availability, and predictable knowledge-based security questions.

---

## DIESS Scoring Model

The **Digital Identity Exposure and Security Score (DIESS)** is a weighted composite metric ranging from 0 to 100.

### Mathematical Formula

$$\text{DIESS} = \sum_{i=1}^{n} (w_i \times S_i)$$

Where:
- $w_i$ represents the assigned weight of each security module.
- $S_i$ represents the sub-score (0–100) calculated by that module.

### Module Weights

| Security Module | Weight | Focus Area |
| :--- | :--- | :--- |
| Privacy Exposure | 25% | Public visibility and necessity of personal data |
| Username Analysis | 20% | Personal identifiers and predictable patterns in handles |
| Impersonation Risk | 20% | Homoglyphs, mimicry, and high-value target profile risks |
| Credential Hygiene | 20% | Password entropy, MFA adoption, and storage practices |
| Recovery Resilience | 15% | Reset channel isolation, backup codes, and security questions |

### Grading Scale

- **90 – 100**: Excellent (Minimal attack surface)
- **75 – 89**: Good (Low overall exposure)
- **50 – 74**: Medium Risk (Moderate exposure vectors detected)
- **25 – 49**: High Risk (Significant OSINT and takeover risk)
- **0 – 24**: Critical Risk (Severe vulnerabilities requiring immediate action)

---

## System Architecture

```text
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI route handlers (v1)
│   │   ├── core/         # Settings, enums, security headers, rate limiting
│   │   ├── db/           # SQLAlchemy models and database sessions
│   │   ├── engines/      # 5 deterministic risk analysis engines
│   │   ├── models/       # Database ORM entities
│   │   ├── schemas/      # Pydantic request and response contracts
│   │   ├── services/     # Business logic and AI explanation providers
│   │   └── main.py       # FastAPI application entrypoint
│   └── tests/            # Pytest test suite (94 automated tests)
├── frontend/
│   └── src/
│       ├── components/   # UI components and score visualizers
│       ├── contexts/     # Theme context (Light & Dark modes)
│       ├── layouts/      # App navigation and connection status banner
│       ├── pages/        # Landing, Scanner, Dashboard, and Reports
│       ├── services/     # Centralized API client
│       └── types/        # TypeScript data contracts
├── render.yaml           # Render deployment blueprint
└── README.md             # Project documentation
```

---

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn
- **Data Validation**: Pydantic v2
- **Database**: SQLAlchemy with SQLite (local) / PostgreSQL (production)
- **Security**: Strict CORS headers, rate limiting, and defensive HTTP middleware
- **AI Explanation**: Google Gemini API integration with deterministic fallback

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: Light Mode (Green and White) / Dark Mode (Green and Black)

---

## Getting Started

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run test suite
pytest

# Start development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API documentation will be available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```

The application will be accessible at `http://127.0.0.1:5173`.

---

## API Reference

### Health and System
- `GET /health` - Root health check.
- `GET /api/v1/health` - API version health check.

### Risk Analysis Engines
- `POST /api/v1/analysis/username` - Analyze handle for naming leaks and patterns.
- `POST /api/v1/analysis/privacy` - Evaluate profile field exposures and sensitivity.
- `POST /api/v1/analysis/impersonation` - Check homoglyphs, handle mimicry, and VIP targeting.
- `POST /api/v1/analysis/credentials` - Assess password entropy, MFA, and manager adoption.
- `POST /api/v1/analysis/recovery` - Analyze reset channels, backup codes, and security questions.
- `POST /api/v1/analysis/diess` - Perform full 5-vector composite scoring.
- `POST /api/v1/ai/explain` - Generate natural language security briefings.

### Reports
- `POST /api/v1/reports` - Persist an audit report.
- `GET /api/v1/reports` - List saved audit summaries.
- `GET /api/v1/reports/{report_id}` - Retrieve a detailed report by UUID.
- `DELETE /api/v1/reports/{report_id}` - Delete a report.

---

## Privacy and Security Principles

1. **Zero Plaintext Secret Storage**: The platform does not store passwords, recovery secrets, or raw answers to security questions.
2. **Transient In-Memory Evaluation**: Scanner inputs are processed in memory during the request lifecycle and discarded.
3. **Deterministic Grounding**: Every score deduction maps directly to an identifiable heuristic, avoiding opaque scoring models.
4. **Defensive Headers**: Production responses enforce strict Content-Type options, frame deny policies, and rate limits.

---

## Deployment

The project includes a `render.yaml` configuration file for automated deployment on Render:

- **Web Service**: Python backend running FastAPI on Uvicorn.
- **Static Site**: React Single Page Application built with Vite.

---

## License

This project is licensed under the MIT License.
