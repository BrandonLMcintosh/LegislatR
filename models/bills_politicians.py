from connect_db import db


class BillPolitician(db.Model):
    """BillPolitician"""

    __tablename__ = 'bills_politician'

    bill_id = db.Column(db.Integer, db.ForeignKey('Bill'), primary_key=True)

    politician_id = db.Column(
        db.Integer, db.ForeignKey('Politician'), primary_key=True)
