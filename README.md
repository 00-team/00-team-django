# 00-team-django

The Django Site Project for 00 Team

## how to run locally

first clone the code with git

```bash
git clone https://github.com/00-team/00-team-django.git
```

second open `manage.py` in your text editor and edit **line 9** from this:

```py
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Team_00.local_settings")
```

to this:

```py
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Team_00.settings")
```

then open `settings.py` in your text editor and chnage **SECRET_KEY** to somting like this:

```py
SECRET_KEY = "13r+28!4ii8%n7#ofeeju3aj@zn_br*byimxfbt$e-u(3*#1#("
```

and also set your google **client_id** and **client_secret**

after changes you can run project like that:

```cmd
python manage.py runserver --insecure
```

I think it will run without any problems and you can go to [this link](http://127.0.0.1:8000/) after the site runs
