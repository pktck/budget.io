from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from helpers import render_to_json, jsonResponse, serializeUser
from django.forms.models import modelformset_factory
from django.template import RequestContext
from django.contrib.auth.models import User

@login_required
@render_to_json
def get(req, user_id):
    if user_id:
        user = User.objects.get(id=user_id)
        return serializeUser(user)
    else:
        return [serializeUser(user)
                for user in User.objects.all()]

@login_required
def create(req):
    UserFormSet = modelformset_factory(User)
    if req.method == 'POST':
        formset = UserFormSet(req.POST)
        if formset.is_valid():
            user = formset.save()[0]
            user.set_password(user.password)
            user.save()
            # do something.
            return jsonResponse(serializeUser(user))
    else:
        formset = UserFormSet(queryset=User.objects.none())
    return render_to_response("user.html",
            {"formset": formset},
            context_instance=RequestContext(req))

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



