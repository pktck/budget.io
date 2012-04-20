;(function(exports) {

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
    this._loadModels(function() {this_object._updateTransactionsPart2();});
}

PageController.prototype._updateTransactionsPart2 = function() {
    var transaction_view = new BudgetIO.TransactionView(
            this.transactions, this.accounts, this.users);
    transaction_view.replaceContents('div');
}

exports.PageController = PageController;

})(BudgetIO);
