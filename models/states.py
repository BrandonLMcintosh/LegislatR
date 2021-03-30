from models_shared import db
import requests
import re
from flask import jsonify
from keys import openstates
from openstates_urls import request_states, request_state, request_state_bills
from datetime import date
from models.bills import Bill


openstates_key = openstates


class State(db.Model):
    """State"""

    __tablename__ = 'states'

    def __repr__(self):
        return self.data

    id = db.Column(db.Text, primary_key=True, nullable=False)

    name = db.Column(db.Text, nullable=False)

    url = db.Column(db.Text)

    last_updated = db.Column(db.DateTime, nullable=False, default=date.today())

    @property
    def updated(self):
        days_since_update = date.today() - self.last_updated
        if days_since_update >= 1:
            return False
        return True

    @property
    def code(self):
        pattern = re.compile(r'(?<=state:)[a-z][a-z]')
        match = pattern.search(self.jurisdiction_id)
        code = match.group(0)
        return code

    @property
    def data(self):
        data = {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'url': self.url,
            'politicians': self.politicians,
            'bills': self.bills
        }
        return data

    @classmethod
    def get(cls, state_code):
        state = cls.query.filter_by(code=state_code).first()
        if state.updated:
            return state
        state.update_bills()
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
        existing_states = cls.query.count()
        if existing_states != 52:
            response = requests.get(request_states)
            data = response.json()
            results = data['results']
            for state in results:
                id = state['id']
                name = state['name']
                url = state['url']
                new_state = cls(
                    id=id,
                    name=name,
                    url=url
                )
                db.session.add(new_state)
        db.session.commit()

    def request(self):
        response = requests.get(request_state.substitute(id=self.id))
        data = response.json()
        result = data['result']
        return result
    
    def add_bills(self, result):
        existing_bills = self.bills
        bill_ids = []
        for bill in existing_bills:
            bill_ids.append(bill.id)
        for bill in result:
            if bill['id'] not in bill_ids:
                id = bill['id']
                created_at = bill['created_at']
                updated_at = date.today()
                session = bill['session']
                identifier = bill['identifier']
                title = bill['title']
                new_bill = Bill(
                    id=id,
                    created_at=created_at,
                    updated_at=updated_at,
                    session=session,
                    identifier=identifier,
                    title=title
                )
                db.session.add(new_bill)
                self.bills.append(new_bill)
                

    
    def update_bills(self, page=1):
        result = self.request_bills(page)
        self.add_bills(result)
        db.session.add(self)
        db.session.commit()
        

    def request_bills(self, page):
        response = requests.get(request_state_bills.substitute(
            state_name=self.name, page=page))
        data = response.json()
        results = data['results']
