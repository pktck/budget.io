from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from helpers import render_to_json
from models import UserForm

@login_required
def front(req):
    user_form = UserForm()
    return render_to_response('main.html',
            locals(),
            context_instance=RequestContext(req))


