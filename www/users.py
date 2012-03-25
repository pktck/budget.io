from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from helpers import render_to_json, serializeUser

@login_required
@render_to_json
def get(req, user_id):
    if user_id:
        user = User.objects.get(id=user_id)
        return serializeUser(user)
    else:
        return [serializeUser(user) for user in User.objects.all()]

@login_required
@render_to_json
def create(req):
    username = req.POST['username']
    password = req.POST['password']
    email = req.POST['email']
    first_name = req.POST['first_name']
    last_name = req.POST['last_name']

    user = User.objects.create_user(username, email=email, password=password)
    user.first_name = first_name
    user.last_name = last_name

    user.save()

    return serializeUser(user)

@login_required
@render_to_json
def update(req, user_id):
    pass

@login_required
@render_to_json
def delete(req, user_id):
    user = User.objects.get(id=user_id)
    user.is_active = False
    user.save()

    return {'success': True}



