from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from helpers import render_to_json, jsonResponse
from django.forms.models import modelformset_factory
from django.template import RequestContext
from models import Transaction

@login_required
@render_to_json
def get(req, transaction_id):
    if transaction_id:
        transaction = Transaction.objects.get(id=transaction_id)
        return transaction.serialize()
    else:
        if req.GET.has_key('filter_attribute') and req.GET.has_key('filter_value'):
            filter_args = {req.GET['filter_attribute']: req.GET['filter_value']}
            transactions = Transaction.objects.filter(**filter_args)
        else:
            transactions = Transaction.objects.all()
            #transactions = transactions.filter(date__month=4)
            
        return [transaction.serialize() for transaction in transactions]

@login_required
def create(req):
    TransactionFormSet = modelformset_factory(Transaction)
    if req.method == 'POST':
        formset = TransactionFormSet(req.POST)
        if formset.is_valid():
            transactions = formset.save()
            # do something.
            return jsonResponse([transaction.serialize()
                for transaction in transactions])
    else:
        formset = TransactionFormSet(queryset=Transaction.objects.none())
    return render_to_response("transaction.html",
            {"formset": formset},
            context_instance=RequestContext(req))

@login_required
def update(req):
    TransactionFormSet = modelformset_factory(Transaction)
    if req.method == 'POST':
        formset = TransactionFormSet(req.POST)
        if formset.is_valid():
            transaction = formset.save()
            # do something.
            return jsonResponse(transaction[0].serialize())
    else:
        formset = TransactionFormSet()
    return render_to_response("transaction.html",
            {"formset": formset},
            context_instance=RequestContext(req))


@login_required
@render_to_json
def delete(req, transaction_id):
    Transaction.objects.get(id=transaction_id).delete()
    return {'success': True}

