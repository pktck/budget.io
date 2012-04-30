;(function(exports) {

function GenericView() {
    // Define this._template_url in subclasses
    //this._template_url = '';
}

GenericView.prototype.replaceContents = function(selector) {
    var this_object = this;
    this._getTemplate(function(template) {
        var view = this_object._generateView();
        $(selector).html($.mustache(template, view));
    });
}

// callback is called with the template passed to it
GenericView.prototype._getTemplate = function(callback) {
    $.ajax(this._template_url, {
        success: callback,
    });
}

// override in sublcasses
GenericView.prototype._generateView = function() {
    var view = {}; // generate view from models
    return view;
}

/*****************************************************************************/

function TransactionsView(transactions, accounts, users) {
    this.transactions = transactions;
    this.users = users;
    this.accounts = accounts;

    this._template_url = '/static/mustache/transactions.mustache';

    GenericView.call(this);
}

TransactionsView.prototype = new GenericView();
TransactionsView.constructor = TransactionsView;

TransactionsView.prototype._generateView = function() {
    var sorted_transactions = this.transactions.sort(function(a, b) {
        return a.date_obj - b.date_obj;
    });
    var view = {'transactions': sorted_transactions};
    return view;
}

/*****************************************************************************/

function AccountsView(transactions, accounts) {
    this.transactions = transactions;
    this.accounts = accounts;

    this._template_url = '/static/mustache/accounts.mustache';

    GenericView.call(this);
}

AccountsView.prototype = new GenericView();
AccountsView.constructor = AccountsView;

AccountsView.prototype._generateView = function() {
    var view = {
        'my_sum': 326.47,
        'outgoing': this.accounts.filter(function(el) { return el.account_type == 'outgoing' }),
        'incoming': this.accounts.filter(function(el) { return el.account_type == 'incoming' }),
        'holding': this.accounts.filter(function(el) { return el.account_type == 'holding' }),
    };
    return view;
}

/*****************************************************************************/

exports.TransactionsView = TransactionsView;
exports.AccountsView = AccountsView;

})(BudgetIO);
