from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from helpers import render_to_json
from django.contrib.auth.models import User
from models import Account, Transaction
from collections import defaultdict
import pprint
from decimal import Decimal

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
def monthlyReport(req):
    # {<month> : {
    #             "users" : {
    #                        <user1> : {
    #                                   "transactions": [<<transactions>>],
    #                                   "sum": <sum>
    #                                  },
    #                        <user2> : {
    #                                   "transactions": [<<transactions>>],
    #                                   "sum": <sum>
    #                                  },
    #                        ...,
    #                      }
    #             "accounts" : {
    #                           <account1> : {
    #                                      "transactions": [<<transactions>>],
    #                                      "sum": <sum>
    #                                     },
    #                           <account2> : {
    #                                      "transactions": [<<transactions>>],
    #                                      "sum": <sum>
    #                                     },
    #                           ...,
    #                          }
    #           },
    #  ...,
    # }    

    transactions_by_month = defaultdict(lambda: {'users':    defaultdict(lambda: {'sum': Decimal(0), 'transactions': []}),
        'accounts': defaultdict(lambda: {'sum': Decimal(0), 'transactions': []}),
        })
    #transactions_by_month = defaultdict(lambda: {'users':    defaultdict(lambda: {'sum': Decimal(0)}),
        #'accounts': defaultdict(lambda: {'sum': Decimal(0)}),
        #})

    buy_in_account = Account.objects.get(name='Buy-in')

    transactions = Transaction.objects.exclude(account=buy_in_account)
    for transaction in transactions:
        month = transaction.date.replace(day=1)
        month_dict = transactions_by_month[month]
        month_dict['users'][transaction.paid_by]['transactions'].append(transaction)
        month_dict['users'][transaction.paid_by]['sum'] += transaction.amount
        month_dict['accounts'][transaction.account]['transactions'].append(transaction)
        month_dict['accounts'][transaction.account]['sum'] += transaction.amount

    
    return HttpResponse(pprint.pformat(defaultdictToDict(transactions_by_month)), mimetype='text/plain')

def defaultdictToDict(d):
    if type(d) == defaultdict:
        return defaultdictToDict(dict(d))
    elif type(d) == dict:
        return dict([(defaultdictToDict(key), defaultdictToDict(value)) for key, value in d.items()])
    elif type(d) in (list, tuple):
        return map(defaultdictToDict, d)
    else:
        return d
                

@login_required
def front(req):
    return HttpResponse(open('/home/pktck/budget_io/www/static/html/front.html'))
