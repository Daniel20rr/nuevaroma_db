"""initial

Revision ID: 0001_initial
Revises: 
Create Date: 2025-11-10 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('students',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('email', sa.String(length=200), nullable=True, unique=True)
    )
    op.create_table('subjects',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False, unique=True)
    )
    op.create_table('grades',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('student_id', sa.Integer(), sa.ForeignKey('students.id'), nullable=False),
        sa.Column('subject_id', sa.Integer(), sa.ForeignKey('subjects.id'), nullable=False),
        sa.Column('grade', sa.Float(), nullable=False),
        sa.UniqueConstraint('student_id','subject_id', name='uix_student_subject')
    )

def downgrade():
    op.drop_table('grades')
    op.drop_table('subjects')
    op.drop_table('students')
