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

        if (entry.unitPrice*entry.quantity + entry.shippingCost === entry.cost) {
            return true;
        } else {
            return undefined;
        }
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
    entry.shippingCost = !!entry.shippingCost ? entry.shippingCost : 0.0;

    const isValid = validateEntry(entry);
    if (isValid === true) {

        const teamID = Meteor.userId();
        const budgetEntry = PGBudgets.find( {'teamID': teamID} ).fetch()[0];
        var budget = budgetEntry['monthlyBudget'];
        budget[Template.instance().currentPage.get()].push(entry);

        const budgetUpdate = {
            "monthlyBudget": budget
        };
        Meteor.call('pg-budgets.update', budgetEntry._id, budgetUpdate);
        return true;
    } else if (isValid === false) {
        Template.instance().errorMessage.set("Oops, looks like you've left field(s) blank.");
        return false;
    } else if (isValid === undefined) {
        Template.instance().errorMessage.set("Oops, looks like your costs don't add up.");
        return false;
    }
}

var editEntry = function(idx) {
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
        budget[Template.instance().currentPage.get()][idx] = entry;

        const budgetUpdate = {
            "monthlyBudget": budget
        };
        Meteor.call('pg-budgets.update', budgetEntry._id, budgetUpdate);
        return true;
    } else {
        Template.instance().errorMessage.set("Oops, looks like you've left field(s) blank.");
        return false;
    }
}

var removeEntry = function(entryData) {
    const idx = entryData['idx'];

    const teamID = Meteor.userId();
    const budgetEntry = PGBudgets.find( {'teamID': teamID} ).fetch()[0];
    var budget = budgetEntry['monthlyBudget'];

    budget[Template.instance().currentPage.get()].splice(idx, 1);
    const budgetUpdate = {
        "monthlyBudget": budget
    };
    Meteor.call('pg-budgets.update', budgetEntry._id, budgetUpdate);
    return true;
}

Template.PGBudgetViewer.onCreated( function() {
    Meteor.subscribe('pg-budgets');
    this.currentPage = new ReactiveVar("oct");
    this.addingRow = new ReactiveVar(false);
    this.errorMessage = new ReactiveVar('');
})

Template.PGBudgetViewer.onDestroyed( function() {
    Session.set('save-button', false);
});

Template.PGBudgetViewer.events({
    'click a.page.item': function(e, template) {
        if (Session.get('save-button')) {
            Template.instance().errorMessage.set("Please save before changing pages.");
        } else {
            Template.instance().currentPage.set($(e.target).attr('id'));
        }

    },
    'click #add-entry': function(e, template) {
        Session.set('save-button', true);
        addNewEntry();
    },
    'click #delete-entry': function(e, template) {
        Template.instance().errorMessage.set('');
        const editData = Session.get('editing');
        if (!editData) {
            Template.instance().addingRow.set(false);
            Session.set('save-button', false);
        } else {
            if (removeEntry(editData)) {
                Session.set('save-button', false)
                Session.set('editing', null);
                Session.set('isEditing', null);
            }
        }
    },
    'click #save-entry': function(e, template) {
        Template.instance().errorMessage.set('');
        const editData = Session.get('editing');
        console.log(editData);
        if (!editData) {
            if (saveNewEntry()) {
                Template.instance().addingRow.set(false);
                Session.set('save-button', false);
            }
        } else {
            const idx = Session.get('isEditing');
            if (editEntry(idx)) {
                Session.set('save-button', false)
                Session.set('editing', null);
                Session.set('isEditing', null);
            }
        }
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
    saveButton: function() {
        return Session.get('save-button');
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
        var budget = PGBudgets.find( {'teamID': teamID} ).fetch()[0]['monthlyBudget'];
        for (i = 0; i < budget[currentPage].length; i++) {
            budget[currentPage][i]['idx'] = i.toString();
            budget[currentPage][i]['currentPage'] = currentPage;
        }
        return budget[currentPage];
    },
    monthTotal: function() {
        var total = 0;
        const teamID = Meteor.user()._id;
        const currentPage = Template.instance().currentPage.get();
        if (Meteor.user().hasBudget) {
            const budget = PGBudgets.find( {'teamID': teamID} ).fetch()[0]['monthlyBudget'][currentPage];
            for (i = 0; i < budget.length; i++) {
                total = total + budget[i]['cost'];
            }
        }
        return total;
    },
    projectTotal: function() {
        var total = 0;
        const teamID = Meteor.user()._id;
        const currentPage = Template.instance().currentPage.get();
        if (Meteor.user().hasBudget) {
            const monthlyBudget = PGBudgets.find( {'teamID': teamID} ).fetch()[0]['monthlyBudget'];
            const budget = Object.values(monthlyBudget);
            for (i = 0; i < budget.length; i++) {
                total = total + budget[i].reduce((acc, entry) => {
                    return acc + entry['cost'];
                }, 0);
            }
        }
        return total;
    }
})
