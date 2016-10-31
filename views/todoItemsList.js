/**
 * Created by MBAAS on 06/06/16.
 */


// Todo Item View
// --------------
// The DOM element for a todo item...

var TodoListView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#todoitem').html()),

    // The DOM events specific to an item.
    events: {
        "blur .edit"  : "close"
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        var handler = _.bind(this.render, this);
        this.model.bind('change', handler);
    },

    // Re-render the description of the todo item.
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.edit');
        return this;
    },


});

var Todos = new app.collections.TodoItemList;

app.views.TodoListView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todolistapp"),

    // Our template for the line of statistics at the bottom of the app.

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "keypress #newTodoItem":  "newTodoItem"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function(options) {

        this.input = this.$("#newTodoItem");
        this.inputDetail = this.$("#newTodoDetail");


        this.listenTo(Todos, 'add', this.addOne);
        this.listenTo(Todos, 'all', this.render);

        this.footer = this.$('footer');
        this.main = $('#main');

        this.parentList = this.$("#todolist");
        this.detailsList = this.$("#todoDetailsList");

        this.itemsList = options.itemsList;

        Todos.fetch({
            beforeSend: sendAuthentication
        });
    },

    newTodoItem: function(e) {
        if (e.keyCode != 13) return;
        if (!this.input.val()) return;

        console.log("Creating todo with value name "+this.input.val());
        Todos.create(
            {name: this.input.val()},
            {
                beforeSend: sendAuthentication
            }
        );
        this.input.val('');
    },


    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {

        this.input.show();
        this.inputDetail.hide();
        this.parentList.show();
        this.detailsList.hide();

        if (Todos.length) {
            this.main.show();
            this.footer.show();
        } else {
            this.main.hide();
            this.footer.hide();
        }

    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
        var view = new TodoListView({model: todo});
        this.$("#todolist").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
        Todos.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.

});