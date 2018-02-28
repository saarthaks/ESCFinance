import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { PGBudgets } from '../../../../api/pg-budgets.js';
import { PGRequests } from '../../../../api/pg-requests.js';

import './PGRequestEntryTemplate.html';

const logRules = {
    trueCost: { identifier: "trueCost", rules: [{ type: 'number', prompt: "Please enter a number" }] }
};

var logPurchase = function(formElem) {
    const team = Meteor.users.findOne({"username": Template.instance().data.team});
    const budgetEntry = PGBudgets.find({ 'teamID': team._id }).fetch()[0];
    formElem.form({ fields: logRules, inline: true });
    const trueCost = parseFloat(formElem.form('get values')['trueCost']);

    if ( !isNaN(trueCost) && formElem.form('is valid') ) {
        // update budget with final cost and "ordered" status, and update amountSpent with new cost
        var monthBudget = budgetEntry['monthlyBudget'];
        const budget = monthBudget[Template.instance().data.month];
        for (i = 0; i < budget.length; i++) {
            if (budget[i].itemName === Template.instance().data.item) {
                budget[i].cost = trueCost;
                budget[i].status = 3;
                break;
            }
        }
        monthBudget[Template.instance().data.month] = budget;
        amountSpent = budgetEntry['amountSpent'] + trueCost;

        const budgetUpdate = {
            "monthlyBudget": monthBudget,
            "amountSpent": amountSpent
        };
        Meteor.call('pg-budgets.update', budgetEntry._id, budgetUpdate);

        // update requests complete status in pg-requests
        const requestUpdate = {
            "complete": true
        };

        Meteor.call('pg-requests.update', Template.instance().data.id, requestUpdate);
        Session.set('shouldUpdate', true);
        formElem.form('clear');
        Template.instance().isViewing.set(false);
        Template.instance().rowColor.set("positive");
        return true;
    } else {
        formElem.form('validate rules');
        return false;
    }

}

Template.PGRequestEntry.onCreated( function() {
    Meteor.subscribe('pg-requests');
    Meteor.subscribe('pg-budgets');

    this.isViewing = new ReactiveVar(false);
    if (Template.instance().data.complete) {
        this.rowColor = new ReactiveVar("positive");
    } else {
        this.rowColor = new ReactiveVar("");
    }

    const team = Meteor.users.findOne({"username": Template.instance().data.team});
    if (team.address) {
        this.hasAddress = new ReactiveVar(true)
        this.address = new ReactiveVar(team.address);
        if (this.address.mailAddress) {
            this.hasMailLine = new ReactiveVar(true);
        } else {
            this.hasMailLine = new ReactiveVar(false);
        }
    } else {
        this.hasAddress = new ReactiveVar(false);
        this.hasMailLine = new ReactiveVar(false);
    }

});

Template.PGRequestEntry.events({
    'click tr.entry': function(e, template) {
        Template.instance().isViewing.set(!Template.instance().isViewing.get());
    },
    'click button.cancel': function(e, template) {
        e.preventDefault();
        const team = Meteor.users.findOne({"username": Template.instance().data.team});
        const budgetEntry = PGBudgets.find({ 'teamID': team._id }).fetch()[0];
        var monthBudget = budgetEntry['monthlyBudget'];
        const budget = monthBudget[Template.instance().data.month];
        for (i = 0; i < budget.length; i++) {
            if (budget[i].itemName === Template.instance().data.item) {
                budget[i].status = 5;
                break;
            }
        }
        monthBudget[Template.instance().data.month] = budget;

        const budgetUpdate = {
            "monthlyBudget": monthBudget,
        };

        Meteor.call('pg-budgets.update', budgetEntry._id, budgetUpdate);

        Meteor.call('pg-requests.remove', Template.instance().data.team, Template.instance().data.link);
        Session.set('shouldUpdate', true);
        Template.instance().isViewing.set(false);
    },
    'submit form': function(e, template) {
        e.preventDefault();
        const idtag = ".ui.form#" + Template.instance().data.team + "-" + Template.instance().data.id + "-form"
        const formElem = $(idtag);
        logPurchase(formElem);
        return false;
    }
});

Template.PGRequestEntry.helpers({
    isViewing: function() {
        return Template.instance().isViewing.get();
    },
    hasAddress: function() {
        return Template.instance().hasAddress.get();
    },
    hasMailLine: function() {
        return Template.instance().hasMailLine.get();
    },
    firstName: function() {
        return Template.instance().address.get().firstName;
    },
    lastName: function() {
        return Template.instance().address.get().lastName;
    },
    streetAddress: function() {
        return Template.instance().address.get().streetAddress;
    },
    mailAddress: function() {
        return Template.instance().address.get().mailAddress;
    },
    city: function() {
        return Template.instance().address.get().city;
    },
    state: function() {
        return Template.instance().address.get().state;
    },
    zipcode: function() {
        return Template.instance().address.get().zipcode;
    },
    rowColor: function() {
        return Template.instance().rowColor.get();
    }
});
