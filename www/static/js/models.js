;(function(exports) {

function Transaction(
    id, items, place, amount, date, paid_by, entered_by, account, comments) {

    this.id = id;
    this.items = items;
    this.place = place;
    this.amount = amount;
    this.date = date;
    this.paid_by = paid_by;
    this.entered_by = entered_by;
    this.account = account;
}

Transaction.getTransactions = function() {
    return [new Transaction(), new Transaction()];
}


function Account(id, name, account_type, budget, comments) {
    this.id = id;
    this.name = name;
    this.account_type = account_type;
    this.budget = budget;
    this.comments = comments;
}

Account.getAccounts = function() {
    return [new Account(), new Account];
}


function User(id, username, first_name, last_name) {
    this.id = id;
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
}

User.getUsers = function() {
    return [new User(), new User()];
}

})(this);
