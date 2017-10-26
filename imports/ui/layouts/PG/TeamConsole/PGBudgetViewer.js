import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './PGBudgetViewerTemplate.html';

const TAB_MAPPING = {
    'oct': 'October',
    'nov': 'November',
    'dec': 'December',
    'jan': 'January',
    'feb': 'February',
    'mar': 'March',
    'apr': 'April'
};

Template.PGBudgetViewer.onCreated( function() {
    this.currentPage = new ReactiveVar("oct");
})

Template.PGBudgetViewer.events({
    'click a.page.item': function(e, template) {
        Template.instance().currentPage.set($(e.target).attr('id'));
    },
    'click #add-entry': function(e, template) {
        console.log('adding');
    }
});

Template.PGBudgetViewer.helpers({
    budgetMonth: function() {
        return TAB_MAPPING[Template.instance().currentPage.get()];
    },
    notEmpty: function() {
        return Meteor.user().hasBudget;
    }
})
