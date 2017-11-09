import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './PGHubLayout.html';
import './PGBudgetViewer.js';
import './PGOrderRequest.js';
import './PGContactAdmin.js';
import './PGTeamSettings.js';

const ALL_TABS = {
    'PGBudgetViewer': true,
    'PGOrderRequest': true,
    'PGContactAdmin': true,
    'PGTeamSettings': true
}

// Tracker.autorun(() => {
//     var newTab = Session.get('newTab');
//
//     if (ALL_TABS[newTab]) {
//         const tabId = 'a#' + newTab;
//         $('.active').removeClass('active');
//         $(tabId).addClass('active');
//
//         Template.instance().currentTab.set(newTab);
//         console.log(Template.instance().currentTab.get());
//     }
//
//     Session.set('newTab', null);
// })

Template.PGHubLayout.onCreated( function() {
    this.currentTab = new ReactiveVar("PGBudgetViewer");
    Session.set('newTab', null);

    this.autorun(() => {
        var newTab = Session.get('newTab');

        if (ALL_TABS[newTab]) {
            const tabId = 'a#' + newTab;
            $('.active').removeClass('active');
            $(tabId).addClass('active');

            Template.instance().currentTab.set(newTab);
        }

        Session.set('newTab', null);
    })
});

Template.PGHubLayout.onDestroyed( function() {
    Session.set('newTab', undefined);
})

Template.PGHubLayout.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    }
});

Template.PGHubLayout.events({
    'click a.item.tab': function(e, template) {
        const cTab = $(e.target);
        $('.active').removeClass('active');
        cTab.addClass('active');

        Template.instance().currentTab.set(cTab.data('template'));
        console.log(Template.instance().currentTab.get());
    }
});
