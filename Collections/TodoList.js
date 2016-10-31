/**
 * Created by MBAAS on 06/06/16.
 */

app.collections.TodoItemList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.models.TodoItem,


    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
        if (!this.length) return 1;
        return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: 'order',

    urlRoot: 'http://localhost:8000/todos/rest/lists/',

    getCustomUrl: function (method) {
        switch (method) {
            case 'read':
                return 'http://localhost:8000/todos/rest/lists/';
                break;
            case 'create':
                return 'http://localhost:8000/todos/rest/lists/';
                break;
            case 'update':
                return 'http://localhost:8000/todos/rest/lists/' + this.id;
                break;
            case 'delete':
                return 'http://localhost:8000/todos/rest/lists/' + this.id;
                break;
        }
    },

    sync: function (method, model, options) {
        options || (options = {});

        options.url = this.getCustomUrl(method.toLowerCase());

        // Lets notify backbone to use our URLs and do follow default course
        return Backbone.sync.apply(this, arguments);
    },

    parse: function (response) {
        console.log("response ",response);
        return response.results;
    }

});
