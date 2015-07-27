"""empty message

Revision ID: 104b33f7e28
Revises: 1541680138f
Create Date: 2015-07-27 21:54:52.723187

"""

# revision identifiers, used by Alembic.
revision = '104b33f7e28'
down_revision = '1541680138f'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('siteusers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=20), nullable=True),
    sa.Column('email', sa.String(length=30), nullable=True),
    sa.Column('registered_on', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('siteusers')
    ### end Alembic commands ###
