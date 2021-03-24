from connect_db import db
import requests
from flask import jsonify
from keys import openstates
from openstates_urls import request_states

openstates_key = openstates


class State(db.Model):

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    division_id = db.Column(db.Text, nullable=False)

    name = db.Column(db.Text, nullable=False)

    url = db.Column(db.Text, nullable=False)

    politicians = db.relationship('Politician')

    bills = db.relationship('Bill')

    users = db.relationship('User')


    @property
    def code(self):
        return self.division_id[-2:]


    @property
    def data(self):
        data = {
            'division_id': self.division_id,
            'code': self.code,
            'name': self.name,
            'politicians': self.politicians,
            'bills': self.bills
        }
        response = jsonify(data)
        return response


    @classmethod
    def Generate_States(cls):
        response = requests.get(request_states)
        data = response.json()
        results = data['results']
        for state in results:
            division_id = state['division_id']
            code = state['division_id'][-2:]
            name = state['name']
            url = state['url']
            new_state = cls(
                division_id=division_id,
                code=code,
                name=name,
                url=url
            )
            db.session.add(new_state)
        db.session.commit()
