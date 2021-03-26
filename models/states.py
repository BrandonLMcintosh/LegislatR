from models.politicians import Politician
from models_shared import db
import requests
from flask import jsonify
from keys import openstates
from openstates_urls import request_states, request_state_bills
import time


openstates_key = openstates


class State(db.Model):
    """State"""

    __tablename__ = 'states'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    jurisdiction_id = db.Column(db.Text, nullable=False)

    division_id = db.Column(db.Text, nullable=False)

    name = db.Column(db.Text, nullable=False)

    url = db.Column(db.Text, nullable=False)

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
            'bills': self.bills, 
            'url':self.url
        }
        return data

    @classmethod
    def get(cls, state_code):
        state = cls.query.filter_by(code=state_code).first()
        return state

    @classmethod
    def get_all(cls):
        states = cls.query.all()
        response = {}
        response['data'] = []
        for state in states:
            response['data'].append(state.data)
        return jsonify(response)

    @classmethod
    def Generate_States(cls):
        response = requests.get(
            request_states.substitute(classification='state'))
        data = response.json()
        results = data['results']
        existing_states = cls.query.count()
        if existing_states != 52:
            for state in results:
                division_id = state['division_id']
                name = state['name']
                url = state['url']
                new_state = cls(
                    division_id=division_id,
                    name=name,
                    url=url
                )
                db.session.add(new_state)
        db.session.commit()

    def get_bills(self, page):
        response = requests.get(request_state_bills.substitute(state_jurisdiction_id=self.jurisdiction_id, page=page))
        data = response.json()
        results = data['results']
        
        
