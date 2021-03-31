from models_shared import db
from models.actions import Action
import requests
from openstates_urls import request_bill
from datetime import datetime
import json


class Bill(db.Model):
    """Bill"""

    __tablename__ = 'bills'

    def __repr__(self):
        return json.dumps(self.data)

    id = db.Column(db.Text, primary_key=True, nullable=False)

    db_created_at = db.Column(db.Text, nullable=False)

    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now())

    session = db.Column(db.Text, nullable=False)

    identifier = db.Column(db.Text, nullable=False)

    title = db.Column(db.Text, nullable=False)

    full = db.Column(db.Boolean, nullable=False, default=False)

    abstract = db.Column(db.Text)

    url = db.Column(db.Text)

    state_id = db.Column(db.Text, db.ForeignKey(
        'states.id'), nullable=False)

    state = db.relationship('State', backref='bills')

    tags = db.relationship('Tag', secondary='bills_tags',
                           backref='tagged_bills')

    sponsors = db.relationship(
        'Politician', secondary='bills_politicians', backref='sponsored_bills')

    actions = db.relationship('Action', backref='bill')

    comments = db.relationship('Comment', backref='bill')

    @property
    def created_at(self):
        new_date = datetime.strptime(self.db_created_at[0:10], '%Y-%m-%d')
        return new_date

    @property
    def days_since_last_update(self):
        difference = datetime.now() - self.updated_at
        return difference.days

    @ property
    def updated(self):

        if (self.days_since_update >= 1) or (not self.full):
            return False
        return True

    @ property
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

    @ classmethod
    def get(cls, id):
        bill = cls.query.get_or_404(id)
        if bill.updated:
            return bill
        bill.update()
        return bill

    def request(self):
        response = requests.get(request_bill.substitute(id=self.id))
        data = response.json()
        result = data['result']
        return result

    def add_actions(self, actions):
        for action in actions:
            organization = action['organization']['name']
            description = action['description']
            date = action['date']
            order = action['order']
            new_action = Action(organization=organization,
                                description=description, date=date, order=order, bill_id=self.id)
            db.session.add(new_action)
        db.session.commit()

    def patch(self, result):
        self.abstract = result['abstracts'][0]['abstract']
        self.url = result['sources'][0]['url']
        actions = result['actions']
        self.add_actions(actions)
        self.full = True

    def update(self):
        result = self.request()
        self.patch(result)
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
