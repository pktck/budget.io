from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from helpers import render_to_json, jsonResponse
from django.forms.models import modelformset_factory
from django.template import RequestContext
from models import Transaction
import json

@login_required
@render_to_json
def get(req, transaction_id):
    if transaction_id:
        transaction = Transaction.objects.get(id=transaction_id)
        return transaction.serialize()
    else:
        return [transaction.serialize() 
                for transaction in Transaction.objects.all()]

@login_required
def create(req):
    TransactionFormSet = modelformset_factory(Transaction)
    if req.method == 'POST':
        formset = TransactionFormSet(req.POST)
        if formset.is_valid():
            transaction = formset.save()
            # do something.
            return jsonResponse(transaction[0].serialize())
    else:
        formset = TransactionFormSet(queryset=Transaction.objects.none())
    return render_to_response("transaction.html",
            {"formset": formset},
            context_instance=RequestContext(req))

@login_required
@render_to_json
def update(req, user_id):
    pass

@login_required
@render_to_json
def delete(req, user_id):
    pass

