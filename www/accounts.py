from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from helpers import render_to_json, jsonResponse
from django.forms.models import modelformset_factory
from django.template import RequestContext
from models import Account

@login_required
@render_to_json
def get(req, account_id):
    if account_id:
        account = Account.objects.get(id=account_id)
        return account.serialize()
    else:
        return [account.serialize() 
                for account in Account.objects.all()]

@login_required
def create(req):
    AccountFormSet = modelformset_factory(Account)
    if req.method == 'POST':
        formset = AccountFormSet(req.POST)
        if formset.is_valid():
            account = formset.save()
            # do something.
            return jsonResponse(account[0].serialize())
    else:
        formset = AccountFormSet(queryset=Account.objects.none())
    return render_to_response("account.html",
            {"formset": formset},
            context_instance=RequestContext(req))

@login_required
@render_to_json
def update(req, account_id):
    pass

@login_required
@render_to_json
def delete(req, account_id):
    Account.objects.get(id=account_id).delete()
    return {'success': True}

