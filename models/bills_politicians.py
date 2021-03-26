from models_shared import db


class BillPolitician(db.Model):
    """BillPolitician"""

    __tablename__ = 'bills_politicians'

    bill_id = db.Column(db.Text, db.ForeignKey(
        'bills.id'), primary_key=True)

    politician_id = db.Column(
        db.Integer, db.ForeignKey('politicians.id'), primary_key=True)

    primary = db.Column(db.Boolean, nullable=False)
