from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from helpers import render_to_json, jsonResponse
from django.forms.models import modelformset_factory
from django.template import RequestContext
from models import PaymentRequest

@login_required
@render_to_json
def get(req, payment_request_id):
    if payment_request_id:
        payment_request = PaymentRequest.objects.get(id=payment_request_id)
        return payment_request.serialize()
    else:
        return [payment_request.serialize() 
                for payment_request in PaymentRequest.objects.all()]

@login_required
def create(req):
    PaymentRequestFormSet = modelformset_factory(PaymentRequest)
    if req.method == 'POST':
        formset = PaymentRequestFormSet(req.POST)
        if formset.is_valid():
            payment_request = formset.save()
            # do something.
            return jsonResponse(payment_request[0].serialize())
    else:
        formset = PaymentRequestFormSet(queryset=PaymentRequest.objects.none())
    return render_to_response("payment_request.html",
            {"formset": formset},
            context_instance=RequestContext(req))

@login_required
@render_to_json
def update(req, payment_request_id):
    pass

@login_required
@render_to_json
def delete(req, payment_request_id):
    PaymentRequest.objects.get(id=payment_request_id).delete()
    return {'success': True}


