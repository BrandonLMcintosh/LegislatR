from connect_db import db


class BillTag(db.Model):
    """BillTag"""

    __tablename__ = 'bills_tags'

    bill_id = db.Column(db.Integer, db.ForeignKey('Bill'), primary_key=True)

    tag_id = db.Column(db.Integer, db.ForeignKey('Tag'), primary_key=True)
