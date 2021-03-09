from connect_db import db

class Tag(db.Model):
    """Tag"""

    __tablename__ = 'tags'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    name = db.Column(db.String(15), nullable=False)

    users_following = db.relationship('User', secondary='users_tags')

    bills_tagged = db.relationship('Bill', secondary='bills_tags')