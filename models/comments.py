from models_shared import db
from flask import jsonify


class Comment(db.Model):
    """Comment"""

    __tablename__ = 'comments'

    def __repr__(self):
        return self.data

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    text = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    bill_id = db.Column(db.Text, db.ForeignKey('bills.id'), nullable=False)

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
    def get(cls, comment_id):
        comment = cls.query.get_or_404(comment_id)
        return comment

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, text):
        self.text = text
        db.session.add(self)
        db.session.commit()
