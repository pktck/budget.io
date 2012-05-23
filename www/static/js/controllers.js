;(function(exports) {

function PageController() {
	console.log('page controller inited');
	$(document).bind('IOmodelUpdated', function() {console.log('meep?')});
	$(document).bind('IOmodelUpdated', this.updateTransactions);
	$(document).bind('IOmodelUpdated', this.updateAccounts);
}

PageController.prototype.updateTransactions = function() {
	console.log('triggered!');
	var transaction_view = new AppController.TransactionsView(
		'#transactions',
		this.transactions);

	transaction_view.replaceContents();
}

PageController.prototype.updateAccounts = function() {
	var accounts_view = new AppController.AccountsView(
		'#accounts',
		this.accounts);

	accounts_view.replaceContents();
}

exports.PageController = PageController;

})(AppController);
