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

BudgetIO.loadTemplate = function(selector, template_url, view_url, is_append) {
    is_append = is_append || false;

    var request_id = BudgetIO._request_counter++;

    BudgetIO._render_queue[request_id] = {};

    BudgetIO._render_queue[request_id]['selector'] = selector;

    $.ajax(view_url, {
       'success': function(data) {
          BudgetIO._render_queue[request_id]['view'] = data;
          BudgetIO._renderFromQueue(request_id, is_append);
       }
    }); 

    $.ajax(template_url, {
       'success': function(data) {
          BudgetIO._render_queue[request_id]['template'] = data;
          BudgetIO._renderFromQueue(request_id, is_append);
       }
    }); 
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
        delete BudgetIO._render_queue[request_id];
    }
}

exports.BudgetIO = BudgetIO;
})(this);
