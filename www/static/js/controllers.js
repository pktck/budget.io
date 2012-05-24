;(function(exports) {

function PageController() {
	$(document).bind('IOmodelUpdated', this.updateTransactions);
	$(document).bind('IOmodelUpdated', this.updateAccounts);
	this.updateTransactions();
	this.updateAccounts();
}

PageController.prototype.updateTransactions = function() {
	var transaction_view = new AppController.TransactionsView(
		'#transactions',
		AppController.Transaction.objects);

	transaction_view.replaceContents();
}

PageController.prototype.updateAccounts = function() {
	var accounts_view = new AppController.AccountsView(
		'#accounts',
		AppController.Account.objects);

	accounts_view.replaceContents();
}

exports.PageController = PageController;

})(AppController);
