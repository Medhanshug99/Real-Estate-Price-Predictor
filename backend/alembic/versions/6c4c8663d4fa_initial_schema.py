"""Initial schema

Revision ID: 6c4c8663d4fa
Revises: 
Create Date: 2026-05-25 08:46:58.028842

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6c4c8663d4fa'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_name'), 'users', ['name'], unique=False)

    op.create_table(
        'properties',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('location', sa.String(), nullable=False),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('locality', sa.String(), nullable=False),
        sa.Column('property_type', sa.String(), nullable=False),
        sa.Column('area_sqft', sa.Float(), nullable=False),
        sa.Column('bedrooms', sa.Integer(), nullable=False),
        sa.Column('bathrooms', sa.Integer(), nullable=False),
        sa.Column('furnishing_status', sa.String(), nullable=False),
        sa.Column('property_age', sa.String(), nullable=False),
        sa.Column('amenities', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('listed_price', sa.Float(), nullable=False),
        sa.Column('predicted_price', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_properties_city'), 'properties', ['city'], unique=False)
    op.create_index(op.f('ix_properties_id'), 'properties', ['id'], unique=False)
    op.create_index(op.f('ix_properties_locality'), 'properties', ['locality'], unique=False)
    op.create_index(op.f('ix_properties_location'), 'properties', ['location'], unique=False)
    op.create_index(op.f('ix_properties_property_type'), 'properties', ['property_type'], unique=False)
    op.create_index(op.f('ix_properties_title'), 'properties', ['title'], unique=False)

    op.create_table(
        'user_activity',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('property_id', sa.Integer(), nullable=False),
        sa.Column('viewed_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('liked', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_activity_id'), 'user_activity', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_user_activity_id'), table_name='user_activity')
    op.drop_table('user_activity')
    op.drop_index(op.f('ix_properties_title'), table_name='properties')
    op.drop_index(op.f('ix_properties_property_type'), table_name='properties')
    op.drop_index(op.f('ix_properties_location'), table_name='properties')
    op.drop_index(op.f('ix_properties_locality'), table_name='properties')
    op.drop_index(op.f('ix_properties_id'), table_name='properties')
    op.drop_index(op.f('ix_properties_city'), table_name='properties')
    op.drop_table('properties')
    op.drop_index(op.f('ix_users_name'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
