import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './PGAdminLayout.html';
import './PGRequests.js';
import './PGReview.js';
import './PGContactTeams.js';
import './PGSettings.js';

Template.PGAdminLayout.onCreated( function() {
    this.currentTab = new ReactiveVar("PGRequests");
});

Template.PGAdminLayout.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    }
});

Template.PGAdminLayout.events({
    'click #admin-tab': function(e, template) {
        const cTab = $(e.target);
        $('.active').removeClass('active');
        cTab.addClass('active');

        Template.instance().currentTab.set(cTab.data('template'));
        console.log(Template.instance().currentTab.get());
    }
});
