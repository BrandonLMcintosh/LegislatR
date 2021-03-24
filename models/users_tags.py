from models_shared import db


class UserTag(db.Model):
    """UserTag"""

    __tablename__ = 'users_tags'

    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), primary_key=True)

    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), primary_key=True)
