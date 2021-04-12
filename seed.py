from models_shared import db
from app import app
from models.states import State

db.drop_all()
db.create_all()

State.Generate_States()