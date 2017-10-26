import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './PGHubLayout.html';
import './PGBudgetViewer.js';
import './PGOrderRequest.js';
import './PGContactAdmin.js';
import './PGTeamSettings.js';

Template.PGHubLayout.onCreated( function() {
    this.currentTab = new ReactiveVar("PGOrder");
});

Template.PGHubLayout.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    }
});

Template.PGHubLayout.events({
    'click #admin-tab': function(e, template) {
        const cTab = $(e.target);
        $('.active').removeClass('active');
        cTab.addClass('active');

        Template.instance().currentTab.set(cTab.data('template'));
        console.log(Template.instance().currentTab.get());
    }
});
