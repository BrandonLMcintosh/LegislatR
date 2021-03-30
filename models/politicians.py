from models_shared import db
from flask import json, jsonify
from models.parties import Party
import requests
from openstates_urls import request_politician
from datetime import date


class Politician(db.Model):
    """Politician"""

    __tablename__ = 'politicians'

    def __repr__(self):
        return self.data

    id = db.Column(db.Text, primary_key=True, nullable=False)

    first_name = db.Column(db.Text)

    last_name = db.Column(db.Text)

    title = db.Column(db.Text, nullable=False)

    image = db.Column(db.Text, nullable=False)

    email = db.Column(db.Text, nullable=False)

    updated_at = db.Column(db.DateTime, nullable=False, default=date.today())

    party_id = db.Column(db.Integer, db.ForeignKey(
        'parties.id'))

    party = db.relationship('Party', backref='politicians')

    state_id = db.Column(db.Integer, db.ForeignKey(
        'states.id'), nullable=False)

    state = db.relationship('State', backref='politicians')

    @property
    def updated(self):
        days_since_update = date.today() - self.updated_at
        if days_since_update >= 30:
            return False
        return True

    @property
    def full_name(self):
        return self.first_name + self.last_name

    @property
    def data(self):
        data = {
            'os_id': self.os_id,
            'full_name': self.full_name,
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
        if politician.full:
            return politician
        politician.update()
        return politician

    def request(self):
        response = requests.get(request_politician.substitute(id=self.id))
        return response
        # needs finished

    def update(self):
        response = requests.get(
            request_politician.substitute(id=self.id))
        data = response.json()
        results = data['result']
        self.first_name = results['given_name']
        self.last_name = results['family_name']
        self.title = results['current_role']['title']
        self.email = results['email']
        self.image = results['image']

    def add_party(self, party_name):
        party = Party.get(party_name)
        if party:
            self.party = party
            return
        new_party = Party(name=party_name)
        db.session.add(new_party)
        db.session.commit()
        party = Party.get(party_name)
        self.party = party
        return
