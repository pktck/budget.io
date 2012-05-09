;(function(exports) {

function AccountsController() {
}


/*****************************************************************************/

function PageController() {
    this.transactions = [];
    this.accounts = [];
    this.users = [];
}

PageController.prototype._loadModels = function(callback) {
    this.transactions = [];
    this.accounts = [];
    this.users = [];

    var this_object = this;
    var request_counter = 3;

    BudgetIO.Transaction.get(function(transactions) {
        this_object.transactions = transactions;
        if(--request_counter === 0) {
            callback();
        }
    });

 BudgetIO.PaymentRequest.get(function(payment_requests) {
        this_object.payment_requests = payment_requests;
        if(--request_counter === 0) {
            callback();
        }
    });

    BudgetIO.Account.get(function(accounts) {
        this_object.accounts = accounts;
        if(--request_counter === 0) {
            callback();
        }
    });

    BudgetIO.User.get(function(users) {
        this_object.users = users;
        if(--request_counter === 0) {
            callback();
        }
    });
}

PageController.prototype.updateTransactions = function() {
    var this_object = this;
    this._loadModels(function() {
        var transaction_view = new BudgetIO.TransactionsView(
                this_object.transactions,
                this_object.accounts,
                this_object.users);
        transaction_view.replaceContents('div#transactions');
    });
}

PageController.prototype.updateAccounts = function() {
    var this_object = this;
    this._loadModels(function() {
        var accounts_view = new BudgetIO.AccountsView(
                this_object.transactions,
                this_object.accounts);
        accounts_view.replaceContents('div#accounts');
    });
}

PageController.prototype.init = function() {
    this.updateTransactions();
    this.updateAccounts();
}

exports.PageController = PageController;

})(BudgetIO);
