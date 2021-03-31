from models_shared import db
import json


class Tag(db.Model):
    """Tag"""

    __tablename__ = 'tags'

    def __repr__(self):
        return json.dumps(self.data)

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    name = db.Column(db.String(15), nullable=False)

    @property
    def data(self):
        data = {
            'name': self.name,
            'bills_tagged': self.bills_tagged
        }
        return data

    @classmethod
    def get(cls, tag_id):
        tag = cls.query.get(tag_id)
        return tag
