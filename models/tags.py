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
            'tagged_bills': self.bills_tagged_data
        }
        return data

    @property
    def bills_tagged_data(self):
        data = []
        for bill in self.tagged_bills:
            data.append(bill.id)
        return data

    @classmethod
    def get(cls, tag_id=None, name=None):
        if name:
            tag = cls.query.filter_by(name=name).first()
            if tag:
                return tag
            tag = cls(name=name)
            db.session.add(tag)
            db.session.commit()
            return cls.get(name=name) 
        tag = cls.query.get(tag_id)
        return tag

    @classmethod
    def get_all(cls):
        response = {}
        tags = cls.query.all()
        response['data'] = []
        for tag in tags:
            response['data'].append(tag.data)
        return response

    @classmethod
    def add(cls, name):
        response = {}
        tag = cls(name=name)
        db.session.add(tag)
        db.session.commit()
        tag = cls.get(name=name)
        response['data'] = {
            'created_tag': tag.name
        }
        return response
