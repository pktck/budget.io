;(function(exports) {

function PageController() {
	var now = new Date();
	this._filter_date_start = new Date(now.getFullYear(), now.getMonth());

	this.__defineGetter__('_filter_date_end', function() {
		var filter_date_end = new Date(this._filter_date_start);
		filter_date_end.setMonth(this._filter_date_start.getMonth() + 1);
		filter_date_end.setMilliseconds(-1);
		return filter_date_end;	   
	});

	var this_obj = this;

	$(document).bind('IOmodelUpdated', function() {this_obj.updateTransactions()});
	$(document).bind('IOmodelUpdated', function() {this_obj.updateAccounts()});

	$('#date-control-increment').click(function(){this_obj.incrementMonth()});
	$('#date-control-decrement').click(function(){this_obj.decrementMonth()});

	this.updateTransactions();
	this.updateAccounts();
}

PageController.prototype.updateTransactions = function() {
	var transactions = AppController.Transaction.filterByDateRange(
		this._filter_date_start,
		this._filter_date_end);

	var transaction_view = new AppController.TransactionsView(
		'#transactions',
		transactions);

	transaction_view.replaceContents();

	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'];

	var month = months[this._filter_date_start.getMonth()];
	$('#date').text(month + ' ' + this._filter_date_start.getFullYear());
}

PageController.prototype.updateAccounts = function() {
	var accounts_view = new AppController.AccountsView(
		'#accounts',
		AppController.Account.objects);

	accounts_view.replaceContents();
}

PageController.prototype.incrementMonth = function() {
	this. _filter_date_start = new Date(
			this._filter_date_start.getFullYear(),
			this._filter_date_start.getMonth() + 1);

	this.updateTransactions();
	this.updateAccounts();
}
	
PageController.prototype.decrementMonth = function() {
	this. _filter_date_start = new Date(
			this._filter_date_start.getFullYear(),
			this._filter_date_start.getMonth() - 1);

	this.updateTransactions();
	this.updateAccounts();
}
	

exports.PageController = PageController;

})(AppController);
