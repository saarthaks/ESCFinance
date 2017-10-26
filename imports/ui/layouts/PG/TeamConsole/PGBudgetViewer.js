import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { PGBudgets } from '../../../../api/pg-budgets.js';
import { BudgetItemSchema } from '../../../../api/pg-budgets.js';

import './PGBudgetEntry.js';
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

var initBudget = function(userId) {
    const teamID = userId;
    const monthlyBudget = {
        'oct': [],
        'nov': [],
        'dec': [],
        'jan': [],
        'feb': [],
        'mar': [],
        'apr': []
    };
    const amountSpent = 0.00;

    const budgetInsert = {
        'teamID': teamID,
        'monthlyBudget': monthlyBudget,
        'amountSpent': amountSpent
    };
    Meteor.call('pg-budgets.insert', budgetInsert);
}

var addNewEntry = function() {
    if (!Meteor.user().hasBudget) {
        initBudget(Meteor.userId());
        Meteor.users.update({_id: Meteor.user()._id},
            {$set: { 'hasBudget': true }});
        console.log('marking budget as started');
    }

    Template.instance().addingRow.set(true);
}

var validateEntry = function(entry) {
    if (entry.itemName
        && entry.websiteLink
        && entry.distributor
        && (entry.unitPrice > 0)
        && (entry.quantity > 0)
        && (entry.cost > 0)) {

        return true;
    } else {
        return false;
    }
}

var saveNewEntry = function() {
    const entry = {
        'itemName' : $('input[name="rowItem"]').val(),
        'websiteLink' : $('input[name="rowLink"]').val(),
        'distributor' : $('input[name="rowDistributor"]').val(),
        'unitPrice' : parseFloat($('input[name="rowPrice"]').val()),
        'quantity' : parseInt($('input[name="rowQuant"]').val()),
        'shippingCost' : parseFloat($('input[name="rowShipping"]').val()),
        'cost' : parseFloat($('input[name="rowCost"]').val())
    };

    if (validateEntry(entry)) {
        const teamID = Meteor.userId();
        const budgetEntry = PGBudgets.find( {'teamID': teamID} ).fetch()[0];
        var budget = budgetEntry['monthlyBudget'];
        budget[Template.instance().currentPage.get()].push(entry);

        const budgetUpdate = {
            "monthlyBudget": budget
        };
        Meteor.call('pg-budgets.update', budgetEntry._id, budgetUpdate);
        Template.instance().addingRow.set(false);
    } else {
        Template.instance().errorMessage.set("Oops, looks like you've left field(s) blank.")
    }
}

Template.PGBudgetViewer.onCreated( function() {
    Meteor.subscribe('pg-budgets');
    this.currentPage = new ReactiveVar("oct");
    this.addingRow = new ReactiveVar(false);
    this.errorMessage = new ReactiveVar('');
})

Template.PGBudgetViewer.events({
    'click a.page.item': function(e, template) {
        Template.instance().currentPage.set($(e.target).attr('id'));
    },
    'click #add-entry': function(e, template) {
        addNewEntry();
        console.log('adding');
    },
    'click #delete-entry': function(e, template) {
        Template.instance().addingRow.set(false);
        Template.instance().errorMessage.set('');
    },
    'click #save-entry': function(e, template) {
        Template.instance().errorMessage.set('');
        saveNewEntry();
        console.log('saving');
    }
});

Template.PGBudgetViewer.helpers({
    budgetMonth: function() {
        return TAB_MAPPING[Template.instance().currentPage.get()];
    },
    monthIsFilled: function() {
        const teamID = Meteor.user()._id;
        const currentPage = Template.instance().currentPage.get();
        if (Meteor.user().hasBudget) {
            const budget = PGBudgets.find( {'teamID': teamID} ).fetch()[0]['monthlyBudget'];
            return (budget[currentPage].length > 0);
        } else {
            return false;
        }
    },
    addingRow: function() {
        return Template.instance().addingRow.get();
    },
    hasError: function() {
        return !!Template.instance().errorMessage.get();
    },
    errorMessage: function() {
        return Template.instance().errorMessage.get();
    },
    entries: function() {
        const teamID = Meteor.user()._id;
        const currentPage = Template.instance().currentPage.get();
        const budget = PGBudgets.find( {'teamID': teamID} ).fetch()[0]['monthlyBudget'];
        return budget[currentPage];
    }
})
