from connect_db import db

class CommentLike(db.Model):
    """CommentLike"""
    
    __tablename__ = 'comments_likes'

    comment_id = db.Column(db.Integer, db.ForeignKey('Comment'), primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('User'), primary_key=True)

    