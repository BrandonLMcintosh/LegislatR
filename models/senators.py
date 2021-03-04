from connect_db import db

class Senator(db.Model):
    """Senator"""

    __tablename__ = 'senators'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    first_name = db.Column(db.Text, nullable=False)

    last_name = db.Column(db.Text, nullable=False)

    party_id = db.Column(db.Integer, db.ForeignKey('parties.id'), nullable=False)

    party = db.relationship('Party')

