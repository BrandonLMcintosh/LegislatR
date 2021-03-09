from flask_wtf import FlaskForm
from wtforms import StringField, FloatField

class UserSignup(FlaskForm):
    username = StringField('username')

class UserEdit(FlaskForm):
    pass

class Comment(FlaskForm):
    pass

class Message(FlaskForm):
    pass