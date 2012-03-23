from django.db import models

class Transaction(models.Model):
    items = models.CharField(max_length=255)
    place = models.CharField(max_length=255)
    amount = models.DecimalField(decimal_places=2) 
    date = models.DateField()
    paid_by = models.ForeignKey('User')
    account = models.ForeignKey('Account')


class Account(models.Model):
    name = models.CharField(max_length=255)
    type_ = models.CharField(max_length=255)
    budget = models.DecimalField(decimal_places=2)

