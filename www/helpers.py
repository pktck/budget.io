from functools import wraps
from django.http import HttpResponse
from django.utils import simplejson as json

def render_to_json(f):
    @wraps(f)
    def inner_json(request, *args, **kwargs):
        result = f(request, *args, **kwargs)
        r = HttpResponse(mimetype='application/json')
        if result:
            r.write(json.dumps(result, indent=4))
        else:
            r.write("{}")
        return r
    return inner_json

def jsonResponse(data):
    response = HttpResponse(mimetype='application/json')
    response.write(json.dumps(data, indent=4))
    return response


def serializeUser(user):
    return {'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            }

