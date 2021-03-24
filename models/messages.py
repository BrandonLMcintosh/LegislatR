# from models_shared import db
# from flask import jsonify


# class Message(db.Model):
#     """Message"""

#     __tablename__ = 'messages'

#     text = db.Column(db.Text, nullable=False)

#     from_user_id = db.Column(
#         db.Integer, db.ForeignKey('users.id'), nullable=False, primary_key=True)

#     to_user_id = db.Column(
#         db.Integer, db.ForeignKey('users.id'), nullable=False, primary_key=True)

#     date_time = db.Column(db.DateTime, nullable=False)

#     seen = db.Column(db.Boolean, nullable=False)

#     from_user = db.relationship('User', backref='sent_messages')

#     to_user = db.relationship('User', backref='received_messages')
