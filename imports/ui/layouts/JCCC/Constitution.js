import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './ConstitutionLayout.html';

Template.ConstitutionLayout.onCreated( function() {
    this.constitutionViewing = new ReactiveVar(true);
});

Template.ConstitutionLayout.helpers({
    constitutionViewing: function() {
        return Template.instance().constitutionViewing.get();
    }
})

Template.ConstitutionLayout.events({
    'click #constitution-tab': function(e, template) {
        const cTab = $(e.target);
        $('.active').removeClass('active');
        cTab.addClass('active');

        const currentlyViewing = Template.instance().constitutionViewing.get();
        Template.instance().constitutionViewing.set(!currentlyViewing);
    }
})
