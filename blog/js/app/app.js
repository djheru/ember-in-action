var Blog = Ember.Application.create({});

Blog.Router = Ember.Router.extend({
    //Use hash based urls - default
    location: 'hash'
});

Blog.Router.map(function () {
    this.route('index', {path: '/'});
    this.resource('blog', {path: '/blog'}, function () {
        this.route('index', {path: '/posts'});
        this.route('post', {path: '/post/:blog_post_id'});
    });
});

Blog.IndexRoute = Ember.Route.extend({
    redirect: function () {
        this.transitionTo('blog');
    }
});

Blog.BlogIndexRoute = Ember.Route.extend({
    model: function () {
        //Uses this return value to automagically create a ObjectController ListController
        return this.modelFor('blog');
    }
});

Blog.BlogRoute = Ember.Route.extend({
    model: function () {
        //Uses this return value to automagically create a ObjectController ListController
        return this.store.find('blogPost');
    }
});

Blog.BlogPostRoute = Ember.Route.extend({
    model: function(blogPost){
        return this.store.find('blogPost', blogPost.blog_post_id);
    }
});

Blog.BlogPostController = Ember.ObjectController.extend({
    contentObserver: function(){
        if(this.get('content')){
            var page = this.get('content');;
            var id = page.get('id');

            $.get("/posts/" + id + ".md", function(data){
                var converter = new Showdown.converter();
                page.set('markdown', new Handlebars.SafeString(converter.makeHtml(data)));
            }, "text")
                .error(function(){
                    page.set('markdown', 'Unable to find specified page');
                    //TODO: navigate to a 404 state
                });
        }
    }.observes('content')
});

//Convention: REST URI: /blogPosts STRUCTURE: {"blogPosts": [{//structure same as model}, ... ]}
Blog.BlogPost = DS.Model.extend({
    postTitle: DS.attr('string'),
    postDate: DS.attr('date'),
    postShortIntro: DS.attr('string'),
    postLongIntro: DS.attr('string'),
    postFilename: DS.attr('string'),
    markdown: null,
    formattedDate: function () {
        return (this.get('postDate')) ?
            this.get('postDate').getUTCDay()
            + "/" + (this.get('postDate').getUTCMonth() + 1)
            + "/" + this.get('postDate').getUTCFullYear() : '';
    }.property('postDate')
});