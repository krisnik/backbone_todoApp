/**
 * Created by MBAAS on 06/06/16.
 */

//router, views, models

var user = "mbaas";// your actual username
var pass = "kony@1234";// your actual password

function getTokenForBasicAuth(user, pass) {
    var token = user.concat(":", pass);
    return btoa(token);
}
function sendAuthentication(xhr) {
    var token =getTokenForBasicAuth(user, pass);
    xhr.setRequestHeader('Authorization', ("Basic ".concat(token)));
    console.log("user req updated with auth header..");
}

var app = (function() {

   
    var api = {
        views: {},
        models: {},
        collections: {},
        content: null,
        router: null,
        todos: null,

        init: function() {
            this.content = $("#content");
            ViewsFactory.list();
            this.todos = new api.collections.TodoItemList();
            Backbone.history.start();
            return this;
        },
        changeContent: function(el) {
            this.content.empty().append(el);
            return this;
        },
        title: function(str) {
            $("h1").text(str);
            return this;
        }
    };

    var ViewsFactory = {
        list: function() {
            if(!this.listView) {
                this.listView = new api.views.TodoListView({
                    model: api.models.TodoItem
                });
            }
            return this.listView;
        },
        detail: function(parentId) {
            
            this.detailView = new api.views.TodoDetailsView({
                model: api.models.Todo,
                parentId: parentId
            });

            return this.detailView;
        }
    };

    var Router = Backbone.Router.extend({

        routes: {
            "details/:index": "getDetails",
            "" : "list"
        },

        getDetails: function(index) {
            console.log("This got called for index ",index);

            var parentId = index;

            var view = ViewsFactory.detail(parentId);
            api.title("Todo details...").
            changeContent(view.$el);
            view.render();
        },

        list: function() {
            console.log("Showing List..");
            var view = ViewsFactory.list();
            api.title("Todos List...")
                .changeContent(view.$el);
            view.render();
        }
    });

    api.router = new Router();

    return api;

})();