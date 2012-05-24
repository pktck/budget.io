;(function(exports) {

/*****************************************************************************/
// Accepts an object and assigns all the objects properties to itsself
function GenericModel(attributes) {
    for(var key in attributes) {
        this[key] = attributes[key];
    }
}

GenericModel._url = 'replace_with_object_url';
GenericModel.objects = []; // gets populated by get()

// Make a call to the object's get API with params
// Pass a list of objects to callback
GenericModel.get = function(params) {
    var this_class = this;
    $.ajax(this._url + 'get/', {
        data: params,
        success: function(data) {
            // the response will be in JSON -- a list of the objects
            var objects = data.map(function(attributes) {
                return new this_class(attributes);
            });
            this_class.objects = objects;
			$(document).trigger('IOmodelUpdated');
        },
    });
}

// objects property must be populated prior to making this call.
// Returns a single object with the sepcified id.
GenericModel.getById = function(id, id_field) {
    id_field = id_field || 'id';
    var return_val = this.objects.filter(function(el) {
        return el[id_field] == id;
    });
    return return_val ? return_val[0] : null;
}

GenericModel.filterBy = function(field, value) {
    return this.objects.filter(function(el) { return el[field] == value });
}

/*****************************************************************************/

function Transaction(attributes) {
    // Attributes:
    // id, items, place, amount, date, paid_by, entered_by, account, comments
    GenericModel.call(this, attributes);

    this.__defineGetter__('paid_by_obj', function() {
        return Account.getById(this.paid_by);
    });

    this.__defineGetter__('account_obj', function() {
        return Account.getById(this.account);
    });

    this.__defineGetter__('amount_str', function() {
        return this.amount.toFixed(2);
    });

    this.__defineGetter__('date_obj', function() {
        return new Date(this.date);
    });

    this.__defineGetter__('date_str', function() {
        var month = this.date_obj.getUTCMonth() + 1;
        var day = this.date_obj.getUTCDate();
        var year = this.date_obj.getUTCFullYear();

        return month + '/' + day + '/' + year;
    });
}

Transaction.prototype = new GenericModel();
Transaction.prototype.constructor = Transaction;

Transaction._url = '/1/transactions/';
Transaction.objects = []; // gets populated by get()
Transaction.get = GenericModel.get;
Transaction.getById = GenericModel.getById;
Transaction.filterBy = GenericModel.filterBy;

Transaction.filterByDateRange = function(start_date, end_date) {
	return this.objects.filter(function(el) {
		return (el.date_obj >= start_date) && (el.date_obj < end_date);
	});
}


/*****************************************************************************/

function PaymentRequest(attributes) {
    // Attributes:
    // id, items, place, amount, date, paid_by, entered_by, account, comments
    GenericModel.call(this, attributes);

    this.__defineGetter__('paid_by_obj', function() {
        return Account.getById(this.paid_by);
    });

    this.__defineGetter__('to_account_obj', function() {
        return Account.getById(this.to_account);
    });

    this.__defineGetter__('amount_str', function() {
        return this.amount.toFixed(2);
    });

    this.__defineGetter__('request_date_obj', function() {
        return new Date(this.request_date);
    });

    this.__defineGetter__('request_date_str', function() {
        var month = this.request_date_obj.getUTCMonth() + 1;
        var day = this.request_date_obj.getUTCDate();
        var year = this.request_date_obj.getUTCFullYear();

        return month + '/' + day + '/' + year;
    });
}

PaymentRequest.prototype = new GenericModel();
PaymentRequest.prototype.constructor = PaymentRequest;

PaymentRequest._url = '/1/payment_requests/';
PaymentRequest.objects = []; // gets populated by get()
PaymentRequest.get = GenericModel.get;
PaymentRequest.getById = GenericModel.getById;
PaymentRequest.filterBy = GenericModel.filterBy;

/*****************************************************************************/

function Account(attributes) {
    // Attributes:
    // id, name, account_type, budget, comments
    GenericModel.call(this, attributes);

    this.__defineGetter__('debits', function() {
        if(this.account_type == 'holding')
            var transactions = Transaction.filterBy('paid_by_obj', this);
        else
            var transactions = Transaction.filterBy('account_obj', this);

        return sumTransactions(transactions)
    });

    this.__defineGetter__('credits', function() {
        if(this.account_type == 'holding')
            var transactions = Transaction.filterBy('account_obj', this);
        else
            var transactions = Transaction.filterBy('paid_by_obj', this);

        return sumTransactions(transactions)
    });

    this.__defineGetter__('payment_requests', function() {
        var transactions = PaymentRequest.filterBy('paid_by_obj', this);

        return sumTransactions(transactions)
    });

    this.__defineGetter__('balance', function() {
        //var credits_sum = sumTransactions(this.credits);
        //var debits_sum = sumTransactions(this.debits);
        //var payment_requests_sum = sumTransactions(this.payment_requests);

        //var balance = credits_sum - debits_sum - payment_requests_sum;

        var balance = this.credits - this.debits - this.payment_requests;

        balance = balance.toFixed(2);

        //return "credits: " + credits_sum.toFixed(2) + " debits: " + debits_sum.toFixed(2) + " payment requests: " + payment_requests_sum + " sum: " + balance;
        return balance;
    });
}

Account.prototype = new GenericModel();
Account.prototype.constructor = Account;

Account._url = '/1/accounts/';
Account.objects = []; // gets populated by get()
Account.get = GenericModel.get;
Account.getById = GenericModel.getById;
Account.filterBy = GenericModel.filterBy;

/*****************************************************************************/

function User(attributes) {
    // Attributes:
    // id, username, first_name, last_name
    GenericModel.call(this, attributes);
}

User.prototype = new GenericModel();
User.prototype.constructor = User;

User._url = '/1/users/';
User.objects = []; // gets populated by get()
User.get = GenericModel.get;
User.filterBy = GenericModel.filterBy;

// the id field for users is user_id, so we have to wrap the generic call
User.getById = function(id) {
    return GenericModel.getById.call(this, id, 'user_id');
};

/*****************************************************************************/
// helper functions

function sumTransactions(transactions) {
    var sum = function(a, b) { return a + b.amount };

    if(transactions)
        return transactions.reduce(sum, 0);
    else
        return 0;
}

/*****************************************************************************/

exports.Transaction = Transaction;
exports.PaymentRequest = PaymentRequest;
exports.Account = Account;
exports.User = User;

})(AppController);
