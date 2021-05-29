# 00 Team Django Project

A small web project for 00 Team

## How to run locally

### Requirements

1. Python 3.9
2. Django 3.2
3. Nodejs

### Install

```bash
git clone https://github.com/00-team/00-team-django.git
cd 00-team-django
npm i
pip install requests django Pillow
```

### Edit

edit `manage.py` :

```diff
- os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Team_00.local_settings')
+ os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Team_00.settings')
```

edit `Team_00/settings.py` :

```diff
- SECRET_KEY = ''
+ SECRET_KEY = '13r+28!4ii8%n7#ofeeju3aj@zn_br*byimxfbt$e-u(3*#1#('


GOOGLE = {
-   "client_id": "",
+   "client_id": "<your google app client_id>",

-   "client_secret": "",
+   "client_secret": "<your google app client_secret>",
    "redirect_uri": "http://localhost:8000/account/login/google_callback/"
}
```

### Run

```bash
npm run build
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver --insecure
```
