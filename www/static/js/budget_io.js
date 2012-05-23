;(function(exports) {

function AppController() {
	this.template_urls = [
		'/static/mustache/transactions.mustache',
		'/static/mustache/accounts.mustache',
		];
	this.templates = {};
	this.page_controller = null;

	this.loadModels();
	this.loadTemplates();
}

AppController.prototype.loadTemplates = function() {
	var this_obj = this;

	for(var i in this.template_urls) {
		var template_url = this.template_urls[i];

		// Using a wrapper function so the inner handler can bind to the
		// current template_url in the for loop.
		// (See http://www.mennovanslooten.nl/blog/post/62)
		var successHandler = function(template_url) {
			return function(data) {
				this_obj.templates[template_url] = data;
				this_obj.initPage();
			};
		};

		$.ajax(template_url, {
			success: successHandler(template_url),
		});
	}
}

AppController.prototype.loadModels = function() {
	AppController.Transaction.get();
	AppController.Account.get();
	AppController.User.get();
}

AppController.prototype.initPage = function() {
	if(this.isTemplatesLoaded() && this.page_controller === null) {
		this.page_controller = new AppController.PageController();
	}
}

AppController.prototype.isTemplatesLoaded = function() {
	for(var i in this.template_urls) {
		var template_url = this.template_urls[i];

		if(!this.templates.hasOwnProperty(template_url)) {
			return false;
		}
	}

	return true;
}

exports.AppController = AppController;
$(function() { exports.APP_CONTROLLER = new AppController(); });
})(this);
