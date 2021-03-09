from connect_db import db

class Bill(db.Model):
    """Bill"""
    
    __tablename__ = 'bills'
    
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    title = db.Column(db.Text, nullable=False)

    body = db.Column(db.Text, nullable=False)

    state_id = db.Column(db.Integer, db.ForeignKey('states.id'), nullable=False)

    state = db.relationship('State')

    tags = db.relationship('Tag', secondary='bills_tags')

    users_following = db.relationship('User', secondary='bills_users')

    sponsors = db.relationship('Politician', secondary='bills_politicians')

    comments = db.relationship('Comment')