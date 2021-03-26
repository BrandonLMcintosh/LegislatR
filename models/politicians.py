from models_shared import db
from flask import json, jsonify
from models.parties import Party
import requests
from openstates_urls import request_politician


class Politician(db.Model):
    """Politician"""

    __tablename__ = 'politicians'

    id = db.Column(db.Text, primary_key=True, nullable=False)

    first_name = db.Column(db.Text)

    last_name = db.Column(db.Text)

    title = db.Column(db.Text, nullable=False)

    image = db.Column(db.Text, nullable=False)

    email = db.Column(db.Text, nullable=False)

    party_id = db.Column(db.Integer, db.ForeignKey(
        'parties.id'))

    party = db.relationship('Party', backref='politicians')

    state_id = db.Column(db.Integer, db.ForeignKey(
        'states.id'), nullable=False)

    state = db.relationship('State', backref='politicians')

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
    def get(cls, os_id):
        politician = cls.query.filter_by(os_id=os_id).first()
        if politician:
            return politician
        Politician.grab(os_id)
        return cls.get(os_id)

    @classmethod
    def grab(cls, os_id):
        response = requests.get(request_politician.substitute(os_id=os_id))
        data = response.json()
        results = data['result']
        first_name = results['given_name']
        last_name = results['family_name']
        title = results['current_role']['title']
        email = results['email']
        image = results['image']
        party = results['party']
        politician = cls(os_id=os_id, first_name=first_name,
                         last_name=last_name, title=title, email=email, image=image)
        politician.add_party(party)
        db.session.add(politician)
        db.session.commit()

    def update(self):
        response = requests.get(
            request_politician.substitute(os_id=self.os_id))
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
