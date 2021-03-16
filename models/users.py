from connect_db import db
from flask import jsonify, session
from flask_bcrypt import Bcrypt
from models.states import State

bcrypt = Bcrypt()


class User(db.Model):

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    username = db.Column(db.String(30), nullable=False)

    password = db.Column(db.Text, nullable=False)

    phone = db.Column(db.Integer, nullable=False)

    state_id = db.Column(db.Integer, db.ForeignKey(
        'states.id'), nullable=False)

    state = db.relationship('State')

    tags_following = db.relationship('Tag', secondary='users_tags')

    bills_following = db.relationship('Bill', secondary='bills_users')

    messages = db.relationship('Message', secondary='users_messages')

    comments = db.relationship('Comments')

    liked_comments = db.relationship('Comment', secondary='comments_likes')

    @property
    def data(self):
        data = {
            'username': self.username,
            'phone': self.phone,
            'state': self.state,
            'tags_following': self.tags_following,
            'bills_following': self.bills_following,
            'messages': self.messages,
            'comments': self.comments,
            'liked_comments': self.liked_comments}

        response = jsonify(data)

        return response

    @staticmethod
    def toggle_follow_bill(self, bill_id):
        pass

    @staticmethod
    def toggle_follow_tag(self, tag_id):
        pass

    @staticmethod
    def comment(self, bill_id, message):
        pass

    @classmethod
    def login(cls, username, password):
        result = {}
        user = cls.query.filter_by(username=username).first()
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
                return jsonify(result)
            result['data'] = {'error': 'Incorrect username / password'}
            return jsonify(result)
        result['data'] = {'error': 'That username does not exist'}
        return jsonify(result)

    @classmethod
    def register(cls, username, password, phone, state, tags):
        hashed_password = bcrypt.generate_password_hash(
            password).decode('utf8')
        existing_state = State.query.filter_by(code=state).first()
        state_id = existing_state.id
        user = cls(
            username=username,
            password=hashed_password,
            phone=phone,
            state_id=state_id)
        db.session.add(user)
        db.session.commit()

        new_user = cls.query.filter_by(username=username).first()
        session['user'] = new_user

    @classmethod
    def logout(self):
        session.clear()
