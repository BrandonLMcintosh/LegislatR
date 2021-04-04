from routes.users import login
from unittest import TestCase
from app import app
from flask import session
from models.users import User
from models.tags import Tag
from models.states import State
from models_shared import db


app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class TestRoutes(TestCase):

    def setUp(self):
        username = 'test1'
        password = 'test1'
        state = 'ocd-jurisdiction/country:us/state:al/government'
        phone = '1111111111'
        User.register(username=username, password=password, phone=phone, state_id=state)
        self.bill_id = 'ocd-bill/e35ae698-c97e-4834-ad86-81d1323c89fc'
        self.tag = Tag.get(name='testing')

    def tearDown(self):
        username = 'test1'
        user = User.get(username=username)
        db.session.delete(self.tag)
        db.session.delete(user)
        db.session.commit()

    def test_user_registration(self):
        with app.test_client() as client:

            data = dict(
                username = 'test2',
                password = 'test2',
                state = 'ocd-jurisdiction/country:us/state:al/government',
                phone = '0000000000')

            result = client.post('/user/register', json=data)
            response = result.get_json()
            user = User.get(username='test2')
            db.session.delete(user)
            db.session.commit()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data'], {'registered':'successfully registered test2'})

    def test_user_login(self):
        with app.test_client() as client:

            data = dict(
                username = 'test1',
                password = 'test1'
            )

            result = client.post('/user/login', json=data)
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['username'], 'test1')

            data = dict(
                username = 'badusername',
                password = 'test1'
            )

            result = client.post('/user/login', json=data)
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['error'], 'That username does not exist')

            data = dict(
                username = 'test1', 
                password = 'badpassword'
            )

            result = client.post('/user/login', json=data)
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['error'], 'Incorrect username / password')

    def test_user_logout(self):
        with app.test_client() as client:
            
            result = client.get('/user/logout')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data'], {'logout':'success'})
            
    def test_bill_list(self):
        with app.test_client() as client:
            login_data = dict(
                username = 'test1',
                password = 'test1'
            )
            client.post('/user/login', json=login_data)
            result = client.get('/bills/list')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data'], [])

    def test_bill_get(self):
        with app.test_client() as client:
            result = client.get(f'/bills/{self.bill_id}')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['state'], 'ocd-jurisdiction/country:us/state:al/government')  

    def test_bill_follow(self):
        with app.test_client() as client:
            login_data = dict(
                username = 'test1',
                password = 'test1'
            )
            client.post('/user/login', json=login_data)
            result = client.post(f'/bills/{self.bill_id}/follow')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['bill_followed']['id'], self.bill_id)
            user = User.get(user_id=session['user_id'])
            self.assertIn(self.bill_id, user.data['bills_following'])

            # unfollowing bill (this is a toggle function)
            result = client.post(f'/bills/{self.bill_id}/follow')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['bill_unfollowed']['id'], self.bill_id)
            user = User.get(user_id=session['user_id'])
            self.assertNotIn(self.bill_id, user.data['bills_following'])

    def test_bill_comment(self):
        with app.test_client() as client:
            login_data = dict(
                username = 'test1', 
                password = 'test1'
            )
            client.post('/user/login', json=login_data)


            comment_data = dict(
                text = 'testing'
            )
            result = client.post(f'/bills/{self.bill_id}/comment', json=comment_data)
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertIn('new_comment', response['data'])

    def test_bill_tag(self):
        with app.test_client() as client:
            login_data = dict(
                username = 'test1',
                password = 'test1'
            )
            client.post('/user/login', json=login_data)
            
            tag_data = dict(
                tag_name = 'testing2'
            )

            result = client.post(f'/bills/{self.bill_id}/tag', json=tag_data)
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['action'], 'add tag')


            # Untagging. This is a toggle function
            result = client.post(f'/bills/{self.bill_id}/tag', json=tag_data)
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['action'], 'remove tag')

            tag = Tag.query.filter_by(name='testing2').first()
            db.session.delete(tag)
            db.session.commit()


    def test_tag_list(self):
        with app.test_client() as client:

            result = client.get('/tags/list')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(len(response['data']), 1)


    def test_tag_get(self):
        with app.test_client() as client:
            result = client.get(f'/tags/{self.tag.id}')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['name'], 'testing')
            

    def test_tag_create(self):
        with app.test_client() as client:
            login_data = dict(
                username = 'test1',
                password = 'test1'
            )
            client.post('/user/login', json=login_data)

            tag_data = dict(
                tag_name = 'testing2'
            )
            result = client.post('/tags/create', json=tag_data)
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['created_tag'], 'testing2')
            
            tag = Tag.query.filter_by(name='testing2').first()
            db.session.delete(tag)
            db.session.commit()


    def test_tag_follow(self):
        with app.test_client() as client:
            login_data = dict(
                username = 'test1',
                password = 'test1'
            )
            client.post('/user/login', json=login_data)
            result = client.post(f'/tags/{self.tag.id}/follow')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['data']['tag_followed']['name'], 'testing')

    def test_state_list(self):
        with app.test_client() as client:
            result = client.get('/states/list')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(len(response['data']), 52)

    def test_state_get(self):
        with app.test_client() as client:
            result = client.get('/states/ocd-jurisdiction/country:us/state:ak/government')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(response['name'], 'Alaska')

    def test_state_bills(self):
        with app.test_client() as client:
            result = client.get('/states/ocd-jurisdiction/country:us/state:ak/government/bills')
            response = result.get_json()
            self.assertEqual(result.status_code, 200)
            self.assertEqual(len(response['bills']), 20)