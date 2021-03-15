from connect_db import db


class Comment(db.Model):
    """Comment"""

    __tablename__ = 'comments'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    text = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('User'))

    user = db.relationship('User')

    bill_id = db.Column(db.Integer, db.ForeignKey('Bill'))

    bill = db.relationship('Bill')

    likes = db.relationship('User', secondary='comments_likes')
