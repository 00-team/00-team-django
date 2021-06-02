from functools import wraps

from django.http import JsonResponse


def login_required(view_func):
    def wrap(request, *args, **kwargs):
        if request.user.is_authenticated:
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'Error': 'login required', 'Redirect':'/login'})
    return wrap