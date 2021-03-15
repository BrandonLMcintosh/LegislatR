from connect_db import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


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
    def toggle_follow_bill(self):
        pass

    @staticmethod
    def toggle_follow_tag(self):
        pass

    @staticmethod
    def comment(self):
        pass

    @classmethod
    def login(cls, username, password):
        result = {}
        user = User.query.filter_by(username=username).first()
        if user:
            if bcrypt.check_password_hash(user.password, password):
                result['data'] = {
                    'username': user.username,
                    'state': user.state,
                    'tags_following': user.tags_following,
                    'bills_following': user.bills_following,
                    'messages': user.messages,
                    'comments': user.comments,
                    'liked_comments': user.liked_comments}
                return result
            result['data'] = {'error': 'Incorrect username / password'}
            return result
        result['data'] = {'error': 'That username does not exist'}
        return result

    @classmethod
    def register(cls):
        pass

    @classmethod
    def logout(self):
        pass
