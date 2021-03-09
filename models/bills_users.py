from connect_db import db

class BillUser(db.Model):
    """BillUser"""

    __tablename__ = 'bills_users'

    bill_id = db.Column(db.Integer, db.ForeignKey('Bill'), primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('User'), primary_key=True)