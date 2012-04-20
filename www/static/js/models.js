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
GenericModel.get = function(callback, params) {
    var thisClass = this;
    $.ajax(this._url + 'get/', {
        data: params,
        success: function(data) {
            // the response will be in JSON -- a list of the objects
            var objects = data.map(function(attributes) {
                return new thisClass(attributes);
            });
            thisClass.objects = objects;
            callback(objects);
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

/*****************************************************************************/

function Transaction(attributes) {
    // Attributes:
    // id, items, place, amount, date, paid_by, entered_by, account, comments
    GenericModel.call(this, attributes);

    this.__defineGetter__('paid_by_obj', function() {
        return BudgetIO.User.getById(this.paid_by);
    });

    this.__defineGetter__('account_obj', function() {
        return BudgetIO.Account.getById(this.account);
    });

    this.__defineGetter__('amount_string', function() {
        return this.amount.toFixed(2);
    });
}

Transaction.prototype = new GenericModel();
Transaction.prototype.constructor = Transaction;

Transaction._url = '/1/transactions/';
GenericModel.objects = []; // gets populated by get()
Transaction.get = GenericModel.get;
Transaction.getById = GenericModel.getById;


/*****************************************************************************/

function Account(attributes) {
    // Attributes:
    // id, name, account_type, budget, comments
    GenericModel.call(this, attributes);
}

Account.prototype = new GenericModel();
Account.prototype.constructor = Account;

Account._url = '/1/accounts/';
GenericModel.objects = []; // gets populated by get()
Account.get = GenericModel.get;
Account.getById = GenericModel.getById;

/*****************************************************************************/

function User(attributes) {
    // Attributes:
    // id, username, first_name, last_name
    GenericModel.call(this, attributes);
 }

User.prototype = new GenericModel();
User.prototype.constructor = User;

User._url = '/1/users/';
GenericModel.objects = []; // gets populated by get()
User.get = GenericModel.get;

// the id field for users is user_id, so we have to wrap the generic call
User.getById = function(id) {
    return GenericModel.getById.call(this, id, 'user_id');
};

/*****************************************************************************/

exports.Transaction = Transaction;
exports.Account = Account;
exports.User = User;

})(BudgetIO);
