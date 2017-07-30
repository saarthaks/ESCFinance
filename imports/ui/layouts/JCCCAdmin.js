import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './JCCCViewer.js';
import './JCCCResponder.js';
import './JCCCUpdater.js';
import './JCCCSettings.js';

Template.JCCCAdminLayout.onCreated( function() {
    this.currentTab = new ReactiveVar("JCCCViewer");
});

Template.JCCCAdminLayout.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    }
});

Template.JCCCAdminLayout.events({
    'click #admin-tab': function(e, template) {
        const cTab = $(e.target);
        $('.active').removeClass('active');
        cTab.addClass('active');

        Template.instance().currentTab.set(cTab.data('template'));
        console.log(Template.instance().currentTab.get());
    }
});
