from connect_db import db


class State(db.Model):

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    code = db.Column(db.String(2), nullable=False)

    name = db.Column(db.Text, nullable=False)

    users = db.relationship('User')

    politicians = db.relationship('Politician')

    bills = db.relationship('Bill')

    users = db.relationship('User')
