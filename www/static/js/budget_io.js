;(function(exports) {

function BudgetIO() {
    // constructor
}

BudgetIO._render_queue = [];
BudgetIO._request_counter = 0;

BudgetIO._appendTemplateToContents = function(selector, template, view) {
    var html = $.mustache(template, view);
    $(selector).append(html);
}

BudgetIO._replaceContentsWithTemplate = function(selector, template, view) {
    var html = $.mustache(template, view);
    $(selector).html(html);
}

// View function is passed a callback function which it should call with the
// view data.
BudgetIO.loadTemplate = function(
        selector, template_url, viewFunction, is_append) {

    is_append = is_append || false;

    var request_id = BudgetIO._request_counter++;

    BudgetIO._render_queue[request_id] = {};

    BudgetIO._render_queue[request_id]['selector'] = selector;

    $.ajax(template_url, {
        'success': function(data) {
            BudgetIO._render_queue[request_id]['template'] = data;
            BudgetIO._renderFromQueue(request_id, is_append);
        }
    }); 

    var viewFunctionCallback = function(view_data) {
        BudgetIO._render_queue[request_id]['view'] = view_data;
        BudgetIO._renderFromQueue(request_id, is_append);
    };

    viewFunction(viewFunctionCallback);

}

BudgetIO._renderFromQueue = function(request_id, is_append) {
    var render_item = BudgetIO._render_queue[request_id];
    var renderFunction = is_append && BudgetIO._appendTemplateToContents
        || BudgetIO._replaceContentsWithTemplate;
    // if the template and view have loaded
    if(render_item['template'] && render_item['view']) {
        renderFunction(
                render_item['selector'],
                render_item['template'],
                render_item['view']);

        // free up some memory
        //delete BudgetIO._render_queue[request_id];
    }
}

BudgetIO.getTransactionsView = function(callback) {
    $.ajax('/1/transactions/get/', {
        'success': function(data) {
            callback({'transactions': data});
        },
    });
}

exports.BudgetIO = BudgetIO;
})(this);
