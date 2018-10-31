import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';

import { PGBudgets } from '../../../../api/pg-budgets.js';

import './PGReviewTemplate.html';

const TAB_MAPPING = {
    'oct': 'October',
    'nov': 'November',
    'dec': 'December',
    'jan': 'January',
    'feb': 'February',
    'mar': 'March',
    'apr': 'April'
};

const ITEM_STATUS = {
    1 : "Pending",
    2 : "Requested",
    3 : "Ordered",
    4 : "Arrived"
};

Template.PGReview.onCreated( function() {
    this.teams = new ReactiveVar(Roles.getUsersInRole('pgteam').fetch());
    this.teamIDInView = new ReactiveVar(null);
    this.currentPage = new ReactiveVar('oct');
});

Template.PGReview.rendered = function() {
    $('div#team-drop.ui.selection.dropdown').dropdown();
}

Template.PGReview.events({
    'click a.page.item': function(e, template) {
        Template.instance().currentPage.set($(e.target).attr('id'));
    },
    'change #team-drop': function(e, template) {
        const id = $('input[name="teamSelect"]').val();
        Template.instance().currentPage.set('oct');
        Template.instance().teamIDInView.set(id);
    },
});

Template.PGReview.helpers({
    anyTeams: function() {
        return (Template.instance().teams.get().length > 0);
    },
    amountRemaining: function(team) {
        if (!team.hasBudget) {
            return team.allocation;
        }
        const amountSpent = PGBudgets.find({'teamID': team._id}).fetch()[0]['amountSpent'];
        return team.allocation - amountSpent;
    },
    monthInView: function() {
        return TAB_MAPPING[Template.instance().currentPage.get()];
    },
    monthIsFilled: function() {
        const teamID = Template.instance().teamIDInView.get();
        if (teamID) {
            const team = Meteor.users.find({'_id': teamID}).fetch()[0];
            if (team.hasBudget) {
                const budget = PGBudgets.find({'teamID': teamID}).fetch()[0]['monthlyBudget'];
                return (budget[Template.instance().currentPage.get()].length > 0);
            }
        }
        return false;
    },
    entries: function() {
        const currentPage = Template.instance().currentPage.get();
        var budget = PGBudgets.find( {'teamID': Template.instance().teamIDInView.get()} ).fetch()[0]['monthlyBudget'];
        for (i = 0; i < budget[currentPage].length; i++) {
            budget[currentPage][i]['mappedStatus'] = ITEM_STATUS[budget[currentPage][i]['status']];
        }

        return budget[currentPage];
    },
    teams: function() {
        return Template.instance().teams.get();
    }
});
