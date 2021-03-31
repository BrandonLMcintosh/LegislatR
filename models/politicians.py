from models_shared import db
from flask import json, jsonify
from models.parties import Party
import requests
from openstates_urls import request_politician
from datetime import datetime


class Politician(db.Model):
    """Politician"""

    __tablename__ = 'politicians'

    def __repr__(self):
        return self.data

    id = db.Column(db.Text, primary_key=True, nullable=False)

    name = db.Column(db.Text, nullable=False)

    title = db.Column(db.Text, nullable=False)

    image = db.Column(db.Text, nullable=False)

    email = db.Column(db.Text, nullable=False)

    last_updated = db.Column(
        db.DateTime, nullable=False, default=datetime.now())

    party_id = db.Column(db.Integer, db.ForeignKey(
        'parties.id'))

    party = db.relationship('Party', backref='politicians')

    state_id = db.Column(db.Text, db.ForeignKey(
        'states.id'), nullable=False)

    state = db.relationship('State', backref='politicians')

    @property
    def days_since_last_update(self):
        difference = datetime.now() - self.last_updated
        return difference.days

    @property
    def updated(self):
        if self.days_since_last_update >= 30:
            return False
        return True

    @property
    def data(self):
        data = {
            'id': self.id,
            'name': self.name,
            'title': self.title,
            'party': self.party,
            'state': self.state,
            'sponsored_bills': self.sponsored_bills
        }

        response = jsonify(data)
        return response

    @classmethod
    def get(cls, id):
        politician = cls.query.filter_by(id=id).first()
        if politician.updated:
            return politician
        politician.update()
        cls.get(id)

    def request(self):
        response = requests.get(request_politician.substitute(id=self.id))
        data = response.json()
        result = data['result']
        return result

    def patch(self, results):
        self.first_name = results['given_name']
        self.last_name = results['family_name']
        self.title = results['current_role']['title']
        self.email = results['email']
        self.image = results['image']
        party_name = results['person']['party']
        self.add_party(party_name)

    def update(self):
        results = self.request()
        self.patch(results)
        self.last_updated = datetime.now()
        db.session.add(self)
        db.session.commit()

    def add_party(self, party_name):
        party = Party.get(party_name)
        self.party = party
