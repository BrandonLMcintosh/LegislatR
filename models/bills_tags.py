from models_shared import db


class BillTag(db.Model):
    """BillTag"""

    __tablename__ = 'bills_tags'

    bill_id = db.Column(db.Text, db.ForeignKey(
        'bills.id'), primary_key=True)

    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), primary_key=True)
