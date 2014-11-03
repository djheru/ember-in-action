var Notes = Ember.Application.create({});

//Router mapping to URIs
Notes.Router.map(function () {
    this.resource('notes', {path: "/"}, function () {
        this.route('note', {path: "/note/:note_id"});
    });
});

//Routes
Notes.NotesRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('note');
    }
});
Notes.NotesNoteRoute = Ember.Route.extend({
    model: function (note) {
        return this.store.find('note', note.note_id);
    }
});

//Model
Notes.Store = DS.Store.extend({
    adapter: DS.LSAdapter//Local storage adapter
});
Notes.Note = DS.Model.extend({
    name: DS.attr('string'),
    value: DS.attr('string'),
    //computed property
    introduction: function(){
        var intro = '';
        if(this.get('value')){
            intro = this.get('value').substring(0, 20);
        }
        return intro;
    }.property('value')
});

//Controllers
Notes.NotesController = Ember.ArrayController.extend({
    newNoteName: null,
    needs: ['notesNote'],
    selectedNoteBinding: 'controllers.notesNote.model',

    actions: {
        createNewNote: function () {
            var content = this.get('content');
            var newNoteName = this.get('newNoteName');
            var unique = (newNoteName != null && newNoteName.length > 1);
            //ensure uniqueness
            content.forEach(function (note) {
                if (newNoteName === note.get('name')) {
                    unique = false;
                    return;
                }
            });

            if (unique) {
                var newNote = this.store.createRecord('note');
                newNote.set('id', newNoteName);
                newNote.set('name', newNoteName);
                newNote.save();
                this.set('newNoteName', null);
            } else {
                alert('Note must have a unique name of at least 2 characters!');
            }
        },
        doDeleteNote: function (note) {
            this.set('noteForDeletion', note);
            $('#confirmDeleteNoteDialog').modal({"show": true});
        },
        doCancelDelete: function () {
            this.set('noteForDeletion', null);
            $('#confirmDeleteNoteDialog').modal('hide');
        },
        doConfirmDelete: function () {
            var selectedNote = this.get('noteForDeletion');
            this.set('noteForDeletion', null);
            if (selectedNote) {
                this.store.deleteRecord(selectedNote);
                selectedNote.save();

                //If deleting currently selected note, redirect back to index
                if (this.get('controllers.notesNote.model.id') === selectedNote.get('id')) {
                    this.transitionToRoute('notes');
                }
            }
            $('#confirmDeleteNoteDialog').modal('hide');
        }
    }
});
Notes.NotesNoteController = Ember.ObjectController.extend({
    actions: {
        updateNote: function () {
            var content = this.get('content');
            if (content) {
                content.save();
            }
        }
    }
});