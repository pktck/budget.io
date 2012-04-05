;(function(exports) {

function GenericView() {
    // Define this._template_url in subclasses
    //this._template_url = '';
}

GenericView.prototype.replaceContents = function(selector) {
    var this_object = this;
    this._getTemplate(function(template) {
        this_object._replaceContentsPart2(selector, template);
    });
}

// callback is called with the template passed to it
GenericView.prototype._getTemplate = function(callback) {
    $.ajax(this._template_url, {
        success: function(data) {
                     callback(data);
                 },
    });
}

// override in sublcasses
GenericView.prototype._generateView = function() {
    var view = {}; // generate view from models
    return view;
}

GenericView.prototype._replaceContentsPart2 = function(selector, template) {

    var view = this._generateView();

    $(selector).html($.mustache(template, view));
}

/*****************************************************************************/

function TransactionView(transactions, accounts, users) {
    this.transactions = transactions;
    this.users = users;
    this.accounts = accounts;

    this._template_url = '/static/mustache/transactions.mustache';

    GenericView.call(this);
}

TransactionView.prototype = new GenericView();
TransactionView.constructor = TransactionView;

TransactionView.prototype._generateView = function() {
    var view = {'transactions': this.transactions};
    return view;
}

exports.TransactionView = TransactionView;

})(BudgetIO);
