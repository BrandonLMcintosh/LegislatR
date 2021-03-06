from models_shared import db
import requests
import re
from keys import openstates
from openstates_urls import request_states, request_state, request_state_bills
from datetime import datetime
from models.bills import Bill
import json


openstates_key = openstates


class State(db.Model):
    """State"""

    __tablename__ = 'states'

    # def __repr__(self):
    #     return json.dumps(self.data)

    id = db.Column(db.Text, primary_key=True, nullable=False)

    name = db.Column(db.Text, nullable=False)

    url = db.Column(db.Text, nullable=False)

    full = db.Column(db.Boolean, nullable=False, default=False)

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
        state_pattern = re.compile(r'(?<=state:)[a-z][a-z]')
        district_pattern = re.compile(r'(?<=district:)[a-z][a-z]')
        territory_pattern = re.compile(r'(?<=territory:)[a-z][a-z]')

        state_match = state_pattern.search(self.id)
        district_match = district_pattern.search(self.id)
        territory_match = territory_pattern.search(self.id)

        code = None
        if state_match:
            code = state_match.group(0)
        if district_match:
            code = district_match.group(0)
        if territory_match:
            code = territory_match.group(0)
        return code

    @property
    def data(self):
        data = {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'url': self.url,
            'politicians': self.politician_data,
            'bills': self.bills_short_data, 
            'full': self.full
        }

        return data

    @property
    def bills_short_data(self):
        data = []

        for bill in self.bills:
            data.append(bill.id)
        return data

    @property
    def bills_long_data(self):
        data = []
        for bill in self.bills:
            data.append(bill.data)
        return data

    @property
    def politician_data(self):
        data = []
        for politician in self.politicians:
            data.append(politician.id)
        return data


    @classmethod
    def get(cls, id):
        state = cls.query.get_or_404(id)
        if state.updated and state.full:
            return state
        state.next_page_request = 1
        state.update_bills()
        return cls.get(id)

    @classmethod
    def get_all(cls):
        states = cls.query.order_by(State.name).all()
        response = {}
        response['states'] = []
        for state in states:
            response['states'].append(state.data)
        return response

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

    def request_bills(self):
        response = requests.get(request_state_bills.substitute(
            state_name=self.name, page=self.next_page_request))
        data = response.json()
        result = data['results']
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
                db_created_at = bill['created_at']
                updated_at = datetime.now()
                session = bill['session']
                identifier = bill['identifier']
                title = bill['title']
                new_bill = Bill(
                    id=id,
                    db_created_at=db_created_at,
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
        self.full = True
        db.session.add(self)
        db.session.commit()
