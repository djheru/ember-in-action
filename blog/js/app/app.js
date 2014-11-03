var Blog = Ember.Application.create({});

Blog.Router = Ember.Router.extend({
    //Use hash based urls - default
    location: 'hash'
});

Blog.Router.map(function(){
    this.route('index', {path: '/'});
    this.route('blog', {path: '/blog'});
});

Blog.IndexRoute = Ember.Route.extend({
    redirect: function(){
        this.transitionTo('blog');
    }
});

Blog.BlogRoute = Ember.Route.extend({
    model: function(){
        //Uses this return value to automagically create a ObjectController ListController
        return this.store.find('blogPost');
    }
});

//Convention: REST URI: /blogPosts STRUCTURE: {"blogPosts": [{//structure same as model}, ... ]}
Blog.BlogPost = DS.Model.extend({
    postTitle: DS.attr('string'),
    postDate: DS.attr('date'),
    postShortIntro: DS.attr('string'),
    postLongIntro: DS.attr('string'),
    postFilename: DS.attr('string'),
    markdown: null,
    formattedDate: function(){
        return (this.get('postDate')) ?
            this.get('postDate').getUTCDay()
                + "/" + (this.get('postDate').getUTCMonth() + 1)
                + "/" + this.get('postDate').getUTCFullYear() : '';
    }.property('postDate')
});