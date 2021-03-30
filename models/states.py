from models_shared import db
import requests
import re
from flask import jsonify
from keys import openstates
from openstates_urls import request_states, request_state, request_state_bills
from datetime import datetime,
from models.bills import Bill


openstates_key = openstates


class State(db.Model):
    """State"""

    __tablename__ = 'states'

    def __repr__(self):
        return self.data

    id = db.Column(db.Text, primary_key=True, nullable=False)

    name = db.Column(db.Text, nullable=False)

    url = db.Column(db.Text, nullable=False)

    next_page_request = db.Column(db.Text, nullable=False, default=0)

    last_updated = db.Column(
        db.DateTime, nullable=False, default=datetime.now())

    @property
    def days_since_last_update(self):
        difference = datetime.now() - self.last_updated
        return difference.days

    @property
    def updated(self):
        if self.days_since_last_update >= 1:
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
    def get(cls, state_id):
        state = cls.query.filter_by(code=state_id).first()
        if state.updated:
            return state
        state.next_page_request = 1
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

    def get_new_bills(self):
        response = requests.get(
            request_state_bills.substitute(id=self.id, page=self.next_page_request))
        data = response.json()
        result = data['result']
        return result

    def request_bills(self):
        response = requests.get(request_state_bills.substitute(
            id=self.id, page=self.next_page_request))
        data = response.json()
        result = data['result']
        self.next_page_request += 1
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
                updated_at = datetime.now()
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

    def update_bills(self):
        result = self.request_bills()
        self.add_bills(result)
        self.last_updated = datetime.now()
        db.session.add(self)
        db.session.commit()
