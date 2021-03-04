from flask_sqlalchemy import SQLAlchemy
from connect_db import db

class Bill(db.Model):
    """Bill"""
    
    __tablename__ = 'bills'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    title = db.Column(db.Text, nullable=False)

    body = db.Column(db.Text, nullable=False)

    state = db.Column(db.Integer, db.ForeignKey('states.id'))

