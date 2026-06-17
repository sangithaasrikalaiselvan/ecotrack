"""initial_schema

Revision ID: 1a2b3c4d5e6f
Revises: 
Create Date: 2026-06-16 10:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '1a2b3c4d5e6f'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. users
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('country_code', sa.CHAR(length=2), server_default='IN', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    
    # 2. carbon_records
    op.create_table('carbon_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('transport_kg', sa.Numeric(precision=8, scale=2), nullable=False),
        sa.Column('electricity_kg', sa.Numeric(precision=8, scale=2), nullable=False),
        sa.Column('food_kg', sa.Numeric(precision=8, scale=2), nullable=False),
        sa.Column('waste_kg', sa.Numeric(precision=8, scale=2), nullable=False),
        sa.Column('total_kg', sa.Numeric(precision=8, scale=2), nullable=False),
        sa.Column('green_score', sa.SmallInteger(), nullable=False),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_carbon_records_user_created_desc', 'carbon_records', ['user_id', sa.text('created_at DESC')])
    op.create_index(op.f('ix_carbon_records_user_id'), 'carbon_records', ['user_id'], unique=False)
    
    # 3. achievements
    op.create_table('achievements',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('badge_slug', sa.String(length=50), nullable=False),
        sa.Column('earned_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'badge_slug', name='uq_user_badge')
    )
    
    # 4. coach_messages
    op.create_table('coach_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_coach_messages_user_created', 'coach_messages', ['user_id', 'created_at'])
    
    # 5. recommendations
    op.create_table('recommendations',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=True),
        sa.Column('action', sa.Text(), nullable=False),
        sa.Column('estimated_saving_kg', sa.Numeric(precision=6, scale=2), nullable=True),
        sa.Column('is_completed', sa.Boolean(), server_default=sa.text('false'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('recommendations')
    op.drop_index('ix_coach_messages_user_created', table_name='coach_messages')
    op.drop_table('coach_messages')
    op.drop_table('achievements')
    op.drop_index(op.f('ix_carbon_records_user_id'), table_name='carbon_records')
    op.drop_index('ix_carbon_records_user_created_desc', table_name='carbon_records')
    op.drop_table('carbon_records')
    op.drop_table('users')
