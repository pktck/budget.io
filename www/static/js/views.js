;(function(exports) {

function GenericView() {
}

GenericView.prototype.replaceContents = function() {
	var view = this._generateView();
	var rendered_html = $.mustache(this._template, view);
	$(this._selector).html(rendered_html);
}

// override in sublcasses
GenericView.prototype._generateView = function() {
    var view = {}; // generate view from models
    return view;
}

/*****************************************************************************/

function TransactionsView(selector, transactions) {
	this._selector = selector;
    this._transactions = transactions;

    this._template_url = '/static/mustache/transactions.mustache';
	this._template = APP_CONTROLLER.templates[this._template_url];

    GenericView.call(this);
}

TransactionsView.prototype = new GenericView();
TransactionsView.constructor = TransactionsView;

TransactionsView.prototype._generateView = function() {
    var sorted_transactions = this._transactions.sort(function(a, b) {
        return a.date_obj - b.date_obj;
    });
    var view = {'transactions': sorted_transactions};
    return view;
}

/*****************************************************************************/

function AccountsView(selector, accounts) {
	this._selector = selector;
    this._accounts = accounts;

    this._template_url = '/static/mustache/accounts.mustache';
	this._template = APP_CONTROLLER.templates[this._template_url];

    GenericView.call(this);
}

AccountsView.prototype = new GenericView();
AccountsView.constructor = AccountsView;

AccountsView.prototype._generateView = function() {
    var view = {
        'my_sum': 326.47,
        'outgoing': this._accounts.filter(function(el) { return el.account_type == 'outgoing' }),
        'incoming': this._accounts.filter(function(el) { return el.account_type == 'incoming' }),
        'holding' : this._accounts.filter(function(el) { return el.account_type == 'holding'  }),
    };
    return view;
}

/*****************************************************************************/

exports.TransactionsView = TransactionsView;
exports.AccountsView = AccountsView;

})(AppController);
