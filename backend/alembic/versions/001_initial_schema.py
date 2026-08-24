"""Initial schema migration with Users, Scans, and Reports

Revision ID: 001_initial
Revises: 
Create Date: 2026-08-24 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Users Table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True, index=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
    )

    # 2. Identity Scans
    op.create_table(
        'identity_scans',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('diess_score', sa.Float(), nullable=False),
        sa.Column('risk_level', sa.String(length=20), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
    )

    # 3. Username Analyses
    op.create_table(
        'username_analyses',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('scan_id', sa.String(length=36), sa.ForeignKey('identity_scans.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('score', sa.Float(), nullable=False),
        sa.Column('risk_level', sa.String(length=20), nullable=False),
        sa.Column('detected_patterns', sa.JSON(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
    )

    # 4. Privacy Analyses
    op.create_table(
        'privacy_analyses',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('scan_id', sa.String(length=36), sa.ForeignKey('identity_scans.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('score', sa.Float(), nullable=False),
        sa.Column('risk_level', sa.String(length=20), nullable=False),
        sa.Column('exposed_sensitive_count', sa.Integer(), nullable=False),
        sa.Column('unnecessary_exposed_count', sa.Integer(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
    )

    # 5. Findings
    op.create_table(
        'findings',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('scan_id', sa.String(length=36), sa.ForeignKey('identity_scans.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('score_impact', sa.Float(), nullable=False),
        sa.Column('recommendation', sa.Text(), nullable=False),
    )

    # 6. Recommendations
    op.create_table(
        'recommendations',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('scan_id', sa.String(length=36), sa.ForeignKey('identity_scans.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('recommendation_text', sa.Text(), nullable=False),
        sa.Column('priority_order', sa.Integer(), nullable=False),
    )

    # 7. Reports
    op.create_table(
        'reports',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('scan_id', sa.String(length=36), sa.ForeignKey('identity_scans.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('report_title', sa.String(length=200), nullable=False),
        sa.Column('diess_score', sa.Float(), nullable=False),
        sa.Column('risk_level', sa.String(length=20), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('reports')
    op.drop_table('recommendations')
    op.drop_table('findings')
    op.drop_table('privacy_analyses')
    op.drop_table('username_analyses')
    op.drop_table('identity_scans')
    op.drop_table('users')
