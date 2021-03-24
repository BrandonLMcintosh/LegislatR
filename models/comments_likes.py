from models_shared import db


class CommentLike(db.Model):
    """CommentLike"""

    __tablename__ = 'comments_likes'

    comment_id = db.Column(
        db.Integer, db.ForeignKey('comments.id'), primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), primary_key=True)
