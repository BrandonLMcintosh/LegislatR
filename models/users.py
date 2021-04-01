from models_shared import db
from flask import session
from flask_bcrypt import Bcrypt
from models.states import State
from models.bills import Bill
from models.tags import Tag
from models.comments import Comment
import json

bcrypt = Bcrypt()


class User(db.Model):
    """User"""

    __tablename__ = 'users'

    def __repr__(self):
        return json.dumps(self.data)

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    username = db.Column(db.String(30), nullable=False)

    password = db.Column(db.Text, nullable=False)

    phone = db.Column(db.Integer, nullable=False)

    state_id = db.Column(db.Text, db.ForeignKey(
        'states.id'), nullable=False)

    state = db.relationship('State', backref='users')

    tags_following = db.relationship(
        'Tag', secondary='users_tags', backref='users_following')

    bills_following = db.relationship(
        'Bill', secondary='bills_users', backref='users_following')

    # messages = db.relationship(
    #     'Message', secondary='users_messages', cascade="all, delete-orphan")

    comments = db.relationship('Comment', backref='user')

    liked_comments = db.relationship(
        'Comment', secondary='comments_likes', backref='likes')

    @property
    def data(self):
        data = {
            'username': self.username,
            'state': self.state.data,
            'tags_following': self.tags_following,
            'bills_following': self.bills_following,
            'comments': self.comments,
            'liked_comments': self.liked_comments
        }
        return data

    @property
    def bills_data(self):
        data = {
            'bills': self.bills_following
        }
        return data

    @classmethod
    def get(cls, user_id=None, username=None):
        if user_id:
            user = cls.query.get_or_404(user_id)
            return user
        user = cls.query.filter_by(username=username).first()
        return user

    @classmethod
    def login(cls, username, password):
        result = {}
        user = cls.get(username=username)
        if user:
            if bcrypt.check_password_hash(user.password, password):
                session['user_id'] = user.id
                result['data'] = user.data
                return result
            result['data'] = {'error': 'Incorrect username / password'}
            return result
        result['data'] = {'error': 'That username does not exist'}
        return result

    @classmethod
    def register(cls, username, password, phone, state_id):
        result = {}
        if cls.get(username=username):
            result['data'] = {'error': 'That username already exists'}
            return result
        hashed_password = bcrypt.generate_password_hash(
            password).decode('utf8')
        existing_state = State.get(state_id)
        state_id = existing_state.id
        user = cls(
            username=username,
            password=hashed_password,
            phone=phone,
            state_id=state_id)
        db.session.add(user)
        db.session.commit()
        new_user = cls.get(username=username)
        session['user_id'] = new_user.id
        result['data'] = {
            'registered': f'successfully registered {new_user.username}'}
        return result

    @classmethod
    def is_logged_in(cls):
        if 'user_id' in session:
            return True
        else:
            return False

    @classmethod
    def logout(self):
        result = {}
        session.clear()
        result['data'] = {'logout': 'success'}
        return result

    def toggle_follow_bill(self, bill_id):
        result = {}
        bill = Bill.get(bill_id)
        if bill in self.bills_following:
            self.bills_following.remove(bill)
            result['data'] = {'bill_unfollowed': bill.data}
            return result
        self.bills_following.append(bill)
        result['data'] = {'bill_followed': bill.data}
        return result

    def toggle_follow_tag(self, tag_id):
        result = {}
        tag = Tag.get(tag_id=tag_id)
        if tag in self.tags_following:
            self.tags_following.remove(tag)
            result['data'] = {'tag_unfollowed': tag.data}
            return result
        self.tags_following.append(tag)
        result['data'] = {'tag_followed': tag.data}
        return result

    def comment(self, bill_id, text):
        result = {}
        comment = Comment(bill_id=bill_id, text=text, user_id=self.id)
        db.session.add(comment)
        db.session.commit()
        bill = Bill.get(bill_id)
        result['data'] = {'new_comment': {
            'bill': bill.data,
        }}
        return result

    @classmethod
    def authentication_error(cls):
        data = {
            'auth_error': 'you must be logged in to do this'
        }
        return data
