from django.test import TestCase, Client    
from django.contrib.auth.models import User
from .models import UserAccount
from django.db.utils import IntegrityError


class AccountTestCase(TestCase):
    def setUp(self):
        self.u = User.objects.create_user('test-user', email='test@example.com', password='th3TestPa$$w0rd')
        self.ua = UserAccount(user=self.u, nickname='test', locale='en')
        self.ua.save()


    def test_account(self):
        self.assertEqual(self.ua.nickname, 'test')

