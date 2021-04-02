from unittest import TestCase
from app import app
from flask import session

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class TestRoutes(TestCase):

    def test_user_full_registration(self):
        with app.test_client() as client:
            data = dict(
                username = 'test001',
                password = 'test001',
                state = 'ocd-jurisdiction/country:us/state:al/government',
                phone = '0000000000')
            result = client.post('/user/register', json=data)
            self.assertEqual(result.status_code, 200)
            self.assertEqual()

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
