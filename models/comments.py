from connect_db import db
from flask import jsonify


class Comment(db.Model):
    """Comment"""

    __tablename__ = 'comments'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    text = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('User'), nullable=False)

    user = db.relationship('User')

    bill_id = db.Column(db.Integer, db.ForeignKey('Bill'), nullable=False)

    bill = db.relationship('Bill')

    likes = db.relationship('User', secondary='comments_likes')


    @property
    def data(self):
        data = {
            'text': self.text,
            'user': self.user,
            'bill': self.bill,
            'likes': self.likes,
        }

        response = jsonify(data)
        return response


    @classmethod
    def get(cls, user_id, text, bill_id):
        comment = cls.query.filter_by(user_id=user_id, text=text, bill_id=bill_id).first()
        return comment

