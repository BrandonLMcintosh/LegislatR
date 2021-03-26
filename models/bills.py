from models_shared import db
from flask import json, jsonify
from models.tags import Tag
from models.actions import Action
import requests
from openstates_urls import request_bill, request_bill_sponsors


class Bill(db.Model):
    """Bill"""

    __tablename__ = 'bills'

    id = db.Column(db.Text, primary_key=True, nullable=False)

    session = db.Column(db.Text, nullable=False)

    identifier = db.Column(db.Text, nullable=False)

    title = db.Column(db.Text, nullable=False)

    abstract = db.Column(db.Text)

    url = db.Column(db.Text)

    full = db.Column(db.Boolean, nullable=False, default=False)

    state_id = db.Column(db.Integer, db.ForeignKey(
        'states.id'), nullable=False)

    simple_bill_id = db.Column(db.Text, db.ForeignKey('simple_bills.os_id'))

    simple_politician_id = db.Column(
        db.Text, db.ForeignKey('simple_politicians.os_id'))

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
            'id': self.id,
            'title': self.title,
            'url': self.url,
            'state': self.state,
            'tags': self.tags,
            'sponsors': self.sponsors,
            'actions': self.actions,
            'comments': self.comments
        }
        return data

    @classmethod
    def get(cls, os_id):
        bill = cls.query.filter_by(os_id=os_id).first()
        if bill.full:
            return bill
        bill.get_full()
        return bill

    def get_full(self):
        response = requests.get(request_bill.substitute(id=self.id))
        data = response.json()
        result = data['result']
        self.abstract = data['abstracts'][0]['abstract']
        self.url = result['sources'][0]['url']
        actions = result['actions']
        for action in actions:
            organization = action['organization']['name']
            description = action['description']
            date = action['date']
            order = action['order']
            new_action = Action(organization=organization,
                                description=description, date=date, order=order, bill_id=self.id)
            db.session.add(new_action)
        self.full = True
        db.session.add(self)
        db.session.commit()

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
