from django.db import models
from django.contrib.auth.models import User
from django.forms import ModelForm

class Transaction(models.Model):
    items = models.CharField(max_length=255)
    place = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=19, decimal_places=2) 
    date = models.DateField()
    paid_by = models.ForeignKey(User, related_name='paid_by')
    entered_by = models.ForeignKey(User, related_name='entered_by')
    account = models.ForeignKey('Account')

    def serialize(self):
        properties = ('id', 'items', 'place', 'amount', 'date', 'paid_by', 'account')
        props_dict =  dict([(prop, self.__getattribute__(prop))
            for prop in properties])
        props_dict['paid_by'] = str(props_dict['paid_by'])
        props_dict['account'] = str(props_dict['account'])
        props_dict['amount'] = float(props_dict['amount'])
        props_dict['date'] = props_dict['date'].ctime()
        return props_dict


class Account(models.Model):
    name = models.CharField(max_length=255)
    account_type = models.CharField(max_length=255)
    budget = models.DecimalField(max_digits=19, decimal_places=2)

    def __str__(self):
        return self.name
