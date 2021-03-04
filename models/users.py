from connect_db import db

class User(db.Model):

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    username = db.Column(db.String(30), nullable=False)

    password = db.Column(db.Text, nullable=False)

    state_id = db.Column(db.Integer, db.ForeignKey('states.id'))

    state = db.relationship('State')


