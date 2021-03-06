from models_shared import db
from models.actions import Action
from models.politicians import Politician
from models.tags import Tag
import requests
from openstates_urls import request_bill
from datetime import datetime
import json


class Bill(db.Model):
    """Bill"""

    __tablename__ = 'bills'

    # def __repr__(self):
    #     return json.dumps(self.data)

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

        if (self.days_since_last_update >= 1) or (not self.full):
            return False
        return True

    @ property
    def data(self):
        data = {
            'id': self.id,
            'title': self.title,
            'identifier':self.identifier,
            'abstract':self.abstract,
            'url': self.url,
            'state': self.state.id,
            'tags': self.tags_data,
            'sponsors': self.sponsors_data,
            'actions': self.actions_data,
            'comments': self.comments_data, 
            'full': self.full
        }
        return data

    @property
    def tags_data(self):
        data = []
        for tag in self.tags:
            data.append(tag.name)
        return data

    @property
    def sponsors_data(self):
        data = []
        for sponsor in self.sponsors:
            data.append({'name':sponsor.name, 'id':sponsor.id})
        return data

    @property
    def comments_data(self):
        data = []
        for comment in self.comments:
            data.append(comment.data)

        return data

    @property
    def actions_data(self):
        data = []
        for action in self.actions:
            data.append(action.data)

        return data

    @ classmethod
    def get(cls, id):
        bill = cls.query.get(id)
        if not bill:
            cls.request_new(id)
            return cls.get(id)
        if bill.updated:
            return bill
        bill.update()
        return bill
    
    @classmethod
    def request_new(cls, id):
        response = requests.get(request_bill.substitute(id=id))
        bill = response.json()
        db_created_at = bill['created_at']
        updated_at = datetime.now()
        session = bill['session']
        identifier = bill['identifier']
        title = bill['title']
        state_id = bill['jurisdiction']['id']
        new_bill = Bill(
            id=id,
            db_created_at=db_created_at,
            updated_at=updated_at,
            session=session,
            identifier=identifier,
            title=title,
            state_id=state_id,
        )
        db.session.add(new_bill)
        db.session.commit()

    def request(self):
        response = requests.get(request_bill.substitute(id=self.id))
        data = response.json()
        return data

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

    def add_sponsors(self, sponsorships, existing_sponsors_ids):
        for sponsor in sponsorships:
            if('person' in sponsor.keys()):
                person = sponsor['person']
                id = person['id']
                name = person['name']
                party = person['party']
                title = person['current_role']['title']
                if id not in existing_sponsors_ids:
                    newSponsor = Politician(
                        id=id,
                        name=name,
                        title=title,
                        state_id=self.state_id
                    )
                    newSponsor.add_party(party)
                    db.session.add(newSponsor)
                    db.session.commit()
                    self.sponsors.append(newSponsor)




    def patch(self, result):
        if 'abstracts' in result:
            self.abstract = result['abstracts'][0]['abstract'] if len(result['abstracts']) > 0 else ''
        self.url = result['sources'][0]['url']
        actions = result['actions']
        sponsors = result['sponsorships']
        self.add_actions(actions)
        existing_sponsors = Politician.get_all()
        existing_sponsors_ids = []
        for sponsor in existing_sponsors:
            existing_sponsors_ids.append(sponsor.id) 

        self.add_sponsors(sponsors, existing_sponsors_ids)

    def update(self):
        result = self.request()
        self.patch(result)
        self.full = True
        db.session.add(self)
        db.session.commit()

    def toggle_tag(self, tag_name):
        result = {}
        tags = []
        tag = Tag.get(name=tag_name)
        for tag in self.tags:
            tags.append(tag.name)
        if tag_name in tags:
            self.tags.remove(tag)
            db.session.add(self)
            db.session.commit()
            result['action'] = f'remove tag {tag_name}'
            result['bill'] = self.id
            return result
        self.tags.append(tag)
        db.session.add(self)
        db.session.commit()
        result['action'] = f'add tag {tag_name}'
        result['bill'] = self.id
        return result