/**
 * Created by MBAAS on 06/06/16.
 */


// Todo Item View
// --------------
var TodoDetailsView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item..."dblclick .view"  : "edit",
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
        "click .toggle"   : "toggleDone",

        "click a.destroy" : "clear",
        "keypress .edit"  : "updateOnEnter",
        },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.

    //"blur .edit"      : "close"

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the description of the todo item.
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('done', this.model.get('done'));
        this.input = this.$('.edit');
        return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
        this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
        this.$el.addClass("editing");
        this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
        var value = this.input.val();
        if (!value) {
            this.clear();
        } else {
            console.log("saving it here..");
            this.model.save({description: value});
            this.$el.removeClass("editing");
        }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
        var value = this.input.val();
        var self = this;
        if (e.keyCode == 13 && value && value.trim().length > 0) {
            this.model.save({description: value,
                contentType: "application/json",
            } , {
                beforeSend: sendAuthentication,

                success: function(todo, response) {
                    self.undelegateEvents();
                    var parentId = response.parent;

                    Backbone.history.navigate('#details/'+parentId);
                }
            });
        }
    },

    // Remove the item, destroy the model.
    clear: function() {
        this.model.destroy();
    }

});

var TodosDetails = new app.collections.TodoList;
var Todo = new app.models.Todo;

app.views.TodoDetailsView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todolistapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "keypress #newTodoDetail":  "newTodoDetail",
        "click #clear-completed": "clearCompleted",
        "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `TodosDetails`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function(options) {
        this.input = this.$("#newTodoItem");
        this.inputDetail = this.$("#newTodoDetail");
        //console.log("this items ",this.itemsList);
        this.allCheckbox = this.$("#toggle-all")[0];

        TodosDetails = new app.collections.TodoList;

        this.listenTo(TodosDetails, 'add', this.addOne);
        this.listenTo(TodosDetails, 'reset', this.addAll);
        this.listenTo(TodosDetails, 'all', this.render);

        this.parentList = this.$("#todolist");
        this.detailsList = this.$("#todoDetailsList");
        this.footer = this.$('footer');
        this.main = $('#main');

        //url: yourModel.urlRoot
        //TodosDetails.setItems(this.itemsList);
        this.$('#todoDetailsList').empty();
        TodosDetails.setParent(options.parentId);
        TodosDetails.fetch({
            beforeSend: sendAuthentication
        });
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        this.parentList.hide();
        this.detailsList.show();
        this.input.hide();
        this.inputDetail.show();

        var done = TodosDetails.done().length;
        var remaining = TodosDetails.remaining().length;

        if (TodosDetails.length) {
            this.main.show();
            this.footer.show();
            this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
        } else {
            this.main.hide();
            this.footer.hide();
        }

        this.allCheckbox.checked = !remaining;
    },

    newTodoDetail: function(e) {
        if (e.keyCode != 13) return;
        if (!this.inputDetail.val()) return;

        console.log("Creating todo with value name "+this.inputDetail.val());
        TodosDetails.create(
            {
                description: this.inputDetail.val(),
                parent: TodosDetails.getParent()
            },
            {
                beforeSend: sendAuthentication,
                success: function(todo, response){
                    console.log("created...",response);
                }
            }
        );
        this.inputDetail.val('');
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
        var view = new TodoDetailsView({model: todo});
        this.$("#todoDetailsList").append(view.render().el);
    },

    // Add all items in the **TodosDetails** collection at once.
    addAll: function() {
        this.$('#todoDetailsList').empty(); //empties the existing data in the lists.
        TodosDetails.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
        _.invoke(TodosDetails.done(), 'destroy');
        return false;
    },

    toggleAllComplete: function () {
        var done = this.allCheckbox.checked;
        TodosDetails.each(function (todo) { todo.save({'done': done}); });
    }

});
