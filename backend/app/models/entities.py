"""SQLAlchemy Normalized Database Models for AI Identity Guardian."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base


def generate_uuid() -> str:
    """Generate a random UUID string."""
    return str(uuid.uuid4())


class UserModel(Base):
    """User account entity for authentication and ownership."""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    scans = relationship("IdentityScanModel", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("ReportModel", back_populates="user", cascade="all, delete-orphan")


class IdentityScanModel(Base):
    """Master scan record storing composite score and linking domain findings."""
    __tablename__ = "identity_scans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    diess_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    summary = Column(Text, nullable=False)
    impersonation_score = Column(Float, nullable=True)
    credential_score = Column(Float, nullable=True)
    recovery_score = Column(Float, nullable=True)

    # Relationships
    user = relationship("UserModel", back_populates="scans")
    username_analysis = relationship("UsernameAnalysisModel", back_populates="scan", uselist=False, cascade="all, delete-orphan")
    privacy_analysis = relationship("PrivacyAnalysisModel", back_populates="scan", uselist=False, cascade="all, delete-orphan")
    findings = relationship("FindingModel", back_populates="scan", cascade="all, delete-orphan", order_by="FindingModel.score_impact.desc()")
    recommendations = relationship("RecommendationModel", back_populates="scan", cascade="all, delete-orphan", order_by="RecommendationModel.priority_order.asc()")
    reports = relationship("ReportModel", back_populates="scan", cascade="all, delete-orphan")


class UsernameAnalysisModel(Base):
    """Username security evaluation record."""
    __tablename__ = "username_analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("identity_scans.id", ondelete="CASCADE"), nullable=False, unique=True)
    username = Column(String(100), nullable=False)
    score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    detected_patterns = Column(JSON, default=list, nullable=False)
    summary = Column(Text, nullable=False)

    scan = relationship("IdentityScanModel", back_populates="username_analysis")


class PrivacyAnalysisModel(Base):
    """Privacy profile exposure evaluation record."""
    __tablename__ = "privacy_analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("identity_scans.id", ondelete="CASCADE"), nullable=False, unique=True)
    score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    exposed_sensitive_count = Column(Integer, default=0, nullable=False)
    unnecessary_exposed_count = Column(Integer, default=0, nullable=False)
    summary = Column(Text, nullable=False)

    scan = relationship("IdentityScanModel", back_populates="privacy_analysis")


class FindingModel(Base):
    """Granular security and privacy finding."""
    __tablename__ = "findings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("identity_scans.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    score_impact = Column(Float, default=0.0, nullable=False)
    recommendation = Column(Text, nullable=False)

    scan = relationship("IdentityScanModel", back_populates="findings")


class RecommendationModel(Base):
    """Prioritized remediation advice."""
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("identity_scans.id", ondelete="CASCADE"), nullable=False, index=True)
    recommendation_text = Column(Text, nullable=False)
    priority_order = Column(Integer, default=0, nullable=False)

    scan = relationship("IdentityScanModel", back_populates="recommendations")


class ReportModel(Base):
    """User-facing persistent report."""
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    scan_id = Column(String(36), ForeignKey("identity_scans.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    report_title = Column(String(200), default="Digital Identity Security Report", nullable=False)
    diess_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    summary = Column(Text, nullable=False)

    user = relationship("UserModel", back_populates="reports")
    scan = relationship("IdentityScanModel", back_populates="reports")
