;(function(exports) {

function GenericView() {
    this._template_url = '';
    this._model = new Object();
    this._models = [];
    this._template = '';
    
    this._fetchTemplate();
}

GenericView.prototype._fetchTemplate = function() {
    $.ajax(this._template_url, {
        success: function(data) {
                     this._template = data;
                 },
    });
}

GenericView.prototype._generateView = function() {
    var view = {}; // generate view from this._models
    return view;
}

GenericView.prototype.populateModels = function() {

}

GenericView.prototype.replaceContents = function(selector) {
    var view = this._generateView();

    $(selector).html($.mustache(this._template, view));
}



function PageView() {
    this.accounts = [];
    this.users = [];
    this.transactions = [];
}

exports.PageView = PageView;

})(BudgetIO);
