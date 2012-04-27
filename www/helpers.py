from functools import wraps
from django.http import HttpResponse
from django.utils import simplejson as json
import datetime
from collections import defaultdict
import os

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

def betterStatic(req, path, document_root):
    filename = os.path.join(document_root, path)
    fp = open(filename)
    print filename
    response = HttpResponse(fp)
    #response['Cache-Control'] = 'no-cache'
    return response

#def datetimeToCtime(d):
    #if type(d) in (dict, defaultdict):
        #return dict([(datetimeToCtime(key), datetimeToCtime(value)) for key, value in d.items()])
    #elif type(d) in (list, tuple):
        #map(datetimeToCtime, d)
    #elif type(d) in (datetime.date, datetime.datetime):
        #return d.ctime()
    #else:
        #return d


