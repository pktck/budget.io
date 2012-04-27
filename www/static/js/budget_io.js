;(function(exports) {

function BudgetIO() {
    // constructor
}

BudgetIO.init = function() {
    var page_controller = new BudgetIO.PageController();
    page_controller.init();
}

exports.BudgetIO = BudgetIO;
})(this);
