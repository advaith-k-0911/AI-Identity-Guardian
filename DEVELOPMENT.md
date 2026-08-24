# AI Identity Guardian — Developer Guide

This document outlines environment setup, testing procedures, code formatting standards, and modular development guidelines.

---

## 1. Prerequisites

- **Python**: 3.10+ (Current runtime: Python 3.13.9)
- **Node.js**: 18+ (Current runtime: Node v24.19.0)
- **Package Managers**: `pip` and `npm`

---

## 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   # Windows (PowerShell)
   python -m venv .venv
   .venv\Scripts\Activate.ps1

   # Linux/macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Database & Migrations**:
   - By default, SQLite (`sqlite:///./ai_identity_guardian.db`) is used for rapid local development.
   - For PostgreSQL in production/staging, set `DATABASE_URL` in `.env`:
     ```env
     DATABASE_URL=postgresql://user:password@localhost:5432/ai_identity_guardian
     ```
   - Run Alembic migrations:
     ```bash
     alembic upgrade head
     ```

5. **Run Unit Tests**:
   ```bash
   pytest
   ```

6. **Run the Development Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

## 3. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

## 4. Code Standards & Best Practices

- **Type Annotations**: Always include full Python type hints (`mypy` compatible) and TypeScript interfaces.
- **Data Validation**: Enforce all payload contracts via Pydantic models in `backend/app/schemas/`.
- **Pure Risk Logic**: Risk analysis engines inside `backend/app/engines/` must be pure functions or stateless classes with 100% deterministic outputs.
- **Score Range Guard**: Every score calculation must be bounded between `0.0` and `100.0`.
- **Zero Hardcoded Secrets**: Ensure `.env` is never checked into Git. Use `.env.example` as reference.
- **No Console Leftovers**: Clean debug logs and transient print statements before committing.
