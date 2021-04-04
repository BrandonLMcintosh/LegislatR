from models_shared import db
import json


class Party(db.Model):
    """Political Party"""

    __tablename__ = 'parties'

    def __repr__(self):
        return json.dumps(self.data)

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    name = db.Column(db.Text, nullable=False)

    @property
    def data(self):
        data = {
            'db_id': self.id,
            'name': self.name,
            'politicians': self.politicians
        }
        return data

    @classmethod
    def get(cls, name):
        party = cls.query.filter_by(name=name).first()
        if party:
            return party
        new_party = cls(name=name)
        db.session.add(new_party)
        db.session.commit()
        cls.get(name)


