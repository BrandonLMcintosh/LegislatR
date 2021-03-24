from models_shared import db


class BillUser(db.Model):
    """BillUser"""

    __tablename__ = 'bills_users'

    bill_id = db.Column(db.Integer, db.ForeignKey(
        'bills.id'), primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), primary_key=True)
