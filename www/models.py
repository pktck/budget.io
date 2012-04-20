from django.db import models
from django.contrib.auth.models import User
from django.forms import ModelForm

class Transaction(models.Model):
    items = models.CharField(max_length=255)
    place = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=19, decimal_places=2) 
    date = models.DateField()
    #paid_by = models.ForeignKey(User, related_name='paid_by_set')
    paid_by = models.ForeignKey('Account', related_name='paid_by_set')
    #entered_by = models.ForeignKey(User, related_name='entered_by_set')
    entered_by = models.ForeignKey(User)
    account = models.ForeignKey('Account', related_name='account_set')
    comments = models.TextField()

    def __str__(self):
        return '%s (%s - $%s)' % (self.items, self.place, self.amount)

    def serialize(self):
        properties = (
                'id',
                'items',
                'place',
                'amount',
                'date',
                'paid_by',
                'account')
        props_dict =  dict([(prop, self.__getattribute__(prop))
            for prop in properties])
        #props_dict['paid_by_username'] = props_dict['paid_by'].username
        props_dict['paid_by'] = props_dict['paid_by'].id
        props_dict['account_name'] = props_dict['account'].name
        props_dict['account'] = props_dict['account'].id
        props_dict['amount'] = float(props_dict['amount'])
        props_dict['date'] = props_dict['date'].ctime()
        return props_dict


class Account(models.Model):
    name = models.CharField(max_length=255)
    account_type = models.CharField(max_length=255)
    budget = models.DecimalField(max_digits=19, decimal_places=2)
    comments = models.TextField()

    def __str__(self):
        return self.name

    def serialize(self):
        properties = (
                'id', 
                'name',
                'account_type',
                'budget')
        props_dict =  dict([(prop, self.__getattribute__(prop))
            for prop in properties])
        props_dict['budget'] = float(props_dict['budget'])
        return props_dict

