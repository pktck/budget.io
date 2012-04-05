;(function(exports) {

/*****************************************************************************/
// Accepts an object and assigns all the objects properties to itsself
function GenericModel(attributes) {
    for(var key in attributes) {
        this[key] = attributes[key];
    }
}

GenericModel._url = 'replace_with_object_url';

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
            callback(objects);
        },
    });
}

/*****************************************************************************/

function Transaction(attributes) {
    // Attributes:
    // id, items, place, amount, date, paid_by, entered_by, account, comments
    GenericModel.call(this, attributes);
 }

Transaction.prototype = new GenericModel();
Transaction.prototype.constructor = Transaction;

Transaction._url = '/1/transactions/';
Transaction.get = GenericModel.get;


/*****************************************************************************/

function Account(attributes) {
    // Attributes:
    // id, name, account_type, budget, comments
    GenericModel.call(this, attributes);
}

Account.prototype = new GenericModel();
Account.prototype.constructor = Account;

Account._url = '/1/accounts/';
Account.get = GenericModel.get;

/*****************************************************************************/

function User(attributes) {
    // Attributes:
    // id, username, first_name, last_name
    GenericModel.call(this, attributes);
 }

User.prototype = new GenericModel();
User.prototype.constructor = User;

User._url = '/1/users/';
User.get = GenericModel.get;

/*****************************************************************************/

exports.Transaction = Transaction;
exports.Account = Account;
exports.User = User;

})(BudgetIO);
