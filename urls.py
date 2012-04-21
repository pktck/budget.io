from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
        # Examples:
        # url(r'^$', 'budget_io.views.home', name='home'),
        url(r'^$',
            'budget_io.www.views.front'),

        url(r'^buy-in-report$',
            'budget_io.www.views.buyInReport'),

        url(r'^monthly-report$',
            'budget_io.www.views.monthlyReport'),

        url(r'^accounts/login/',
            'django.contrib.auth.views.login',
            {'template_name': 'login.html'}),

        # users
        url(r'^1/users/get/(?P<user_id>[^/]+)?$',
            'budget_io.www.users.get'),

        url(r'^1/users/create/',
            'budget_io.www.users.create'),

        url(r'^1/users/delete/(?P<user_id>[^/]+)$',
            'budget_io.www.users.delete'),

        # transactions
        url(r'^1/transactions/get/(?P<transaction_id>[^/]+)?$',
            'budget_io.www.transactions.get'),

        url(r'^1/transactions/create/',
            'budget_io.www.transactions.create'),

        url(r'^1/transactions/update/',
            'budget_io.www.transactions.update'),

        url(r'^1/transactions/delete/(?P<transaction_id>[^/]+)$',
            'budget_io.www.transactions.delete'),

        # accounts
        url(r'^1/accounts/get/(?P<account_id>[^/]+)?$',
            'budget_io.www.accounts.get'),

        url(r'^1/accounts/create/',
            'budget_io.www.accounts.create'),

        url(r'^1/accounts/delete/(?P<account_id>[^/]+)$',
            'budget_io.www.accounts.delete'),

        # payment_requests
        url(r'^1/payment_requests/get/(?P<payment_request_id>[^/]+)?$',
            'budget_io.www.payment_requests.get'),

        url(r'^1/payment_requests/create/',
            'budget_io.www.payment_requests.create'),

        url(r'^1/payment_requests/delete/(?P<payment_request_id>[^/]+)$',
            'budget_io.www.payment_requests.delete'),

        # url(r'^budget_io/', include('budget_io.foo.urls')),

        # Uncomment the admin/doc line below to enable admin documentation:
        # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

# Uncomment the next line to enable the admin:
        # url(r'^admin/', include(admin.site.urls)),
        )

urlpatterns += staticfiles_urlpatterns()
