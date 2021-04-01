from unittest import TestCase
from app import app
from flask import session

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class TestRoutes(TestCase):
    def setUp(self):
        session.clear()

    def test_user_get(self):
        with app.test_client() as client:
            pass

    def test_user_login(self):
        with app.test_client() as client:
            pass

    def test_user_register(self):
        with app.test_client() as client:
            pass

    def test_user_logout(self):
        with app.test_client() as client:
            pass

    def test_bill_get(self):
        with app.test_client() as client:
            pass

    def test_bill_list(self):
        with app.test_client() as client:
            pass

    def test_bill_follow(self):
        with app.test_client() as client:
            pass

    def test_bill_comment(self):
        with app.test_client() as client:
            pass

    def test_tag_get(self):
        with app.test_client() as client:
            pass

    def test_tag_list(self):
        with app.test_client() as client:
            pass

    def test_tag_create(self):
        with app.test_client() as client:
            pass

    def test_tag_follow(self):
        with app.test_client() as client:
            pass

    def test_state_get(self):
        with app.test_client() as client:
            pass

    def test_state_list(self):
        with app.test_client() as client:
            pass

    def test_state_bills(self):
        with app.test_client() as client:
            pass
