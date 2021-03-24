from models_shared import db
from flask import jsonify


class Tag(db.Model):
    """Tag"""

    __tablename__ = 'tags'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    name = db.Column(db.String(15), nullable=False)

    @property
    def data(self):
        data = {
            'name': self.name,
            'bills_tagged': self.bills_tagged
        }

    @classmethod
    def get(cls, tag_id):
        tag = cls.query.get(tag_id)
        return tag
