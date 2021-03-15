from connect_db import db


class User(db.Model):

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    username = db.Column(db.String(30), nullable=False)

    password = db.Column(db.Text, nullable=False)

    phone = db.Column(db.Integer, nullable=False)

    state_id = db.Column(db.Integer, db.ForeignKey('states.id'))

    state = db.relationship('State')

    tags_following = db.relationship('Tag', secondary='users_tags')

    bills_following = db.relationship('Bill', secondary='bills_users')

    messages = db.relationship('Message', secondary='users_messages')

    comments = db.relationship('Comments')

    liked_comments = db.relationship('Comment', secondary='comments_likes')

    @staticmethod
    def follow_bill(self):
        pass

    @staticmethod
    def follow_tag(self):
        pass

    @staticmethod
    def edit_profile(self):
        pass

    @classmethod
    def signup(self):
        pass

    @classmethod
    def logout(self):
        pass
