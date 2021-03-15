from connect_db import db


class Message(db.Model):
    """Message"""

    __tablename__ = 'messages'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    text = db.Column(db.Text, nullable=False)

    from_user_id = db.Column(db.Integer, db.ForeignKey('User'), nullable=False)

    to_user_id = db.Column(db.Integer, db.ForeignKey('User'), nullable=False)

    date_time = db.Column(db.DateTime, nullable=False)

    seen = db.Column(db.Boolean, nullable=False)

    from_user = db.relationship('User', backref='sent_messages')

    to_user = db.relationship('User', backref='received_messages')
