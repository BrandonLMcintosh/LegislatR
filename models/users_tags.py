from connect_db import db

class UserTag(db.Model):
    """UserTag"""

    __tablename__ = 'users_tags'

    user_id = db.Column(db.Integer, db.ForeignKey('User'), primary_key=True)
    
    tag_id = db.Column(db.Integer, db.ForeignKey('Tag'), primary_key=True)