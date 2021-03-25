from models.politicians import Politician
from models_shared import db
import requests
from flask import jsonify
from keys import openstates
from openstates_urls import request_states, request_state_politicians


openstates_key = openstates


class State(db.Model):

    __tablename__ = 'states'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

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
            'bills': self.bills
        }
        response = jsonify(data)
        return response

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
                new_state.get_politicians()
                db.session.add(new_state)
        db.session.commit()

    def get_politicians(self):
        finished_parsing_last_page = True
        current_page = 1
        while finished_parsing_last_page == False:
            response = requests.get(
                request_state_politicians.substitute(state_name=self.name, page=current_page))
            data = response.json()
            results = data['results']
            for politician in results:
                first_name = politician['given_name']
                last_name = politician['family_name']
                party = politician['party']
                title = politician['current_role']['title']
                image = politician['image']
                email = politician['email']
                os_id = politician['id']
                new_politician = Politician(
                    first_name=first_name, last_name=last_name, title=title, image=image, email=email, state_id=self.id)
                new_politician.add_party(party)
                db.session.add(new_politician)

            max_pages = data['pagination']['max_page']
            if current_page == max_pages:
                finished_parsing_last_page = True
            current_page += 1
        db.session.commit()
