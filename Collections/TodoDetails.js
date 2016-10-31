/**
 * Created by MBAAS on 06/06/16.
 */

app.collections.TodoList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.models.Todo,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    //localStorage: new Backbone.LocalStorage("todos-backbone"),

    setParent: function(parentId) {
        this.parentId = parentId;
    },

    getParent: function() {
        return this.parentId;
    },

    // Filter down the list of all todo items that are finished.
    done: function() {
        return this.where({done: true});
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
        return this.where({done: false});
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
        if (!this.length) return 1;
        return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: 'order',

    //urlRoot : "http://localhost:8000/todos/rest/lists/" + this.parent + "/items/" + this.id,

    
    url: function() {
        return "http://localhost:8000/todos/rest/lists/" + this.parentId + "/items/";
    },
/*
    sync: function (method, model, options) {
        options || (options = {});


        options.url = this.urlRoot

        console.log("options.url ",options.url);

        // Lets notify backbone to use our URLs and do follow default course
        return Backbone.sync.apply(this, arguments);
    },
*/
    parse: function (response) {
        return response.results;
    }
});
