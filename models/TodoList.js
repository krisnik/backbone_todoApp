/**
 * Created by MBAAS on 06/06/16.
 */

// Our basic **Todo** model has `description`, `order`, and `done` attributes.
app.models.TodoItem = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
        return {
            id: null,
            name: "random todo",
            items : []
        };
    },

    urlRoot: 'http://localhost:8000/todos/rest/lists/',
});
