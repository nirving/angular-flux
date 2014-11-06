angular.module("app").factory("TodoStore", ["AppDispatcher", "Assign", "Events", "todoActionsConstant", "todoEventsConstant", function (AppDispatcher, assign, events, todoActionsConstant, todoEventsConstant) {


    var _todos = {};
    var CHANGE_EVENT = todoEventsConstant.LIST_CHANGE;
    var current_source = "LIST_ACTION";
    var EventEmitter = events.EventEmitter;

    /**
     * Create a TODO item.
     * @param  {string} text The content of the TODO
     */
    function create(text) {
        var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        _todos[id] = {
            id: id,
            complete: false,
            text: text
        };
    }

    /**
     * Delete a TODO item.
     * @param  {string} id
     */
    function destroy(id) {
        delete _todos[id];
    }

    var TodoStore = assign({}, EventEmitter.prototype, {

        getAll: function () {
            return _todos;
        },

        emitChange: function () {
            this.emit(CHANGE_EVENT);
        },

        addChangeListener: function (callback) {
            this.on(CHANGE_EVENT, callback);
        },

        removeChangeListener: function (callback) {
            this.removeListener(CHANGE_EVENT, callback);
        }
    });

    AppDispatcher.register(function (payload) {
        var action = payload.action;
        var text;

        if (payload.source == current_source) {
            switch (action.actionType) {
                case todoActionsConstant.TODO_CREATE:
                    text = action.text.trim();
                    if (text !== '') {
                        create(text);
                    }
                    break;
                case todoActionsConstant.TODO_DESTROY:
                    destroy(action.id);
                    break;
                default:
                    return true;
            }
            TodoStore.emitChange();
        }
        return true;
    });


    return TodoStore;

}]);

