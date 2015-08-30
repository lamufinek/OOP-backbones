(function($){
    var Post = Backbone.Model.extend({
        defaults: function(){
            return{
                author :'',
                status :''
            }
        }
    });

    var newPostForm = document.getElementById('new-post');

    var clearForm = function(form){
        form.reset();
    };

    var PostsList = Backbone.Collection.extend({
        model: Post
    });

    var posts = new PostsList();

    var PostView = Backbone.View.extend({
        model: new Post(),
        tagName: 'div',
        events: {
            'click .edit': 'edit',
            'click .remove': 'remove',
            'blur .status': 'close',
            'keypress .status': 'onEnterUpdate'
        },
        initialize: function(){
            this.template = _.template($('#post-template').html());
        },
        edit: function(ev){
            ev.preventDefault();
            this.$('.status').attr('contenteditable', true).focus();
        },
        close: function(ev){
            var status = this.$('.status').text();
            this.model.set('status', status);
            this.$('.status').removeAttr('contenteditable');
        },
        onEnterUpdate: function(ev){
            var self = this;
            if (ev.keyCode === 13){
                this.close();
                _.delay(function(){ self.$('status').blur()}, 100);
                clearForm(newPostForm);
            }
        },
        remove: function(ev){
            ev.preventDefault();
            posts.remove(this.model);
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            clearForm(newPostForm);
            return this;
        }
    });

    var PostsView = Backbone.View.extend({
        model: posts,
        el: $('#posts-container'),
        initialize : function(){
            this.model.on('add', this.render, this);
            this.model.on('remove', this.render, this);
        },
        render: function(){
            var self = this;
            self.$el.html('');
            _.each(this.model.toArray(), function(post, i){
                self.$el.append((new PostView({model: post})).render().$el);
            });
            return this;
        }
    });

    $(document).ready(function(){
        $('#new-post').submit(function(ev){
            var post = new Post({author : $('#author-name').val(), status : $('#status-update').val()});
            posts.add(post);
            console.log(posts.toJSON());

            return false;
        });

        var appView = new PostsView();

    });

})(jQuery);