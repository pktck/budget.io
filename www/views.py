from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from helpers import render_to_json
from django.contrib.auth.models import User
from models import Account, Transaction

@login_required
def buyInReport(req):
    entries = []
    buy_in_account = Account.objects.get(name='Buy-in')
    users = User.objects.all()
    for user in users:
        transactions = user.paid_by_set.filter(account=buy_in_account)
        transactions = transactions.order_by('date').all()

        total = sum([t.amount for t in transactions])
        entries.append({
            'user': user,
            'buy_in_amount': total,
            'transactions': transactions})
    
    total_buy_in = sum([e['buy_in_amount'] for e in entries])
    buy_in_per_user = total_buy_in / len(users)

    for entry in entries:
        entry['amount_due'] = buy_in_per_user - entry['buy_in_amount']

    return render_to_response('buy-in-report.html', locals())

@login_required
def front(req):
    return HttpResponse(open('/home/pktck/budget_io/www/static/html/front.html'))
