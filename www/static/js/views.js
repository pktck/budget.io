;(function(exports) {

function Page() {
    this.accounts = [];
    this.users = [];
    this.transactions = [];
}

Page.prototype.populate = function() {
    this.accounts = Account.getAccounts();
    this.users = Account.getUsers();
    this.transactions = Transaction.getTransactions();
}

})();
