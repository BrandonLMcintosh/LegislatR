from models_shared import db
from flask import jsonify
from models.tags import Tag


class Bill(db.Model):
    """Bill"""

    __tablename__ = 'bills'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    title = db.Column(db.Text, nullable=False)

    body = db.Column(db.Text, nullable=False)

    link = db.Column(db.Text, nullable=False)

    state_id = db.Column(db.Integer, db.ForeignKey(
        'states.id'), nullable=False)

    state = db.relationship('State', backref='bills')

    tags = db.relationship('Tag', secondary='bills_tags',
                           backref='tagged_bills')

    sponsors = db.relationship(
        'Politician', secondary='bills_politicians', backref='sponsored_bills')

    actions = db.relationship('Action', backref='bill')

    comments = db.relationship('Comment', backref='bill')

    @property
    def data(self):
        data = {
            'title': self.title,
            'body': self.body,
            'state': self.state,
            'tags': self.tags,
            'sponsors': self.sponsors,
            'actions': self.actions,
            'comments': self.comments
        }

    @classmethod
    def get(cls, bill_id):
        bill = cls.query.get(bill_id)
        return bill

    def toggle_tag(self, tag):
        result = {}
        if tag in self.tags:
            self.remove(tag)
            result['data'] = {'action': 'remove tag', 'bill': self.data}
        db.session.add(self)
        db.session.commit()

    def add_action(self, action):
        self.actions.append(action)
        db.session.add(self)
        db.session.commit()
