/**
 * Created by MBAAS on 06/06/16.
 */

app.models.Todo = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
        return {
            id: null,
            parent: null,
            description: "empty todo...",
            order: Todos.nextOrder(),
            done: false
        };
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
        this.save({done: !this.get("done")});
    }
});
