from models_shared import db


class BillTag(db.Model):
    """BillTag"""

    __tablename__ = 'bills_tags'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    bill_id = db.Column(db.Text, db.ForeignKey(
        'bills.id'))

    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'))
