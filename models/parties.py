from connect_db import db


class Party(db.Model):
    """Political Party"""

    __tablename__ = 'parties'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    name = db.Column(db.Text, nullable=False)

    politicians = db.relationship(
        'Politician', secondary='parties_politicians')
