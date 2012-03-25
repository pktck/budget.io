from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from helpers import render_to_json

@login_required
@render_to_json
def get(req, user_id):
    pass

@login_required
@render_to_json
def create(req):
    pass

@login_required
@render_to_json
def update(req, user_id):
    pass

@login_required
@render_to_json
def delete(req, user_id):
    pass

