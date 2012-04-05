;(function(exports) {

function PageController() {
    this.page_view = new BudgetIO.PageView();

    this.accounts = Account.getAccounts();
    this.users = Account.getUsers();
    this.transactions = Transaction.getTransactions();
}

exports.Controller = PageController;

})(BudgetIO);
