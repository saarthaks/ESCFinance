import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

import { PGBudgets } from '../../../../api/pg-budgets.js';

import './PGBudgetEntryTemplate.html';

var editEntry = function(entryId) {
    console.log(entryId);

    const entry = {
        'itemName' : $('input[name="rowItem"]').val(),
        'websiteLink' : $('input[name="rowLink"]').val(),
        'distributor' : $('input[name="rowDistributor"]').val(),
        'unitPrice' : parseFloat($('input[name="rowPrice"]').val()),
        'quantity' : parseInt($('input[name="rowQuant"]').val()),
        'shippingCost' : parseFloat($('input[name="rowShipping"]').val()),
        'cost' : parseFloat($('input[name="rowCost"]').val()),
        'idx' : Template.instance().data['idx']
    };

    Session.set('isEditing', { 'id': Template.instance().data['id'], 'idx': Template.instance().data['idx'] });
    Session.set('save-button', true);
    // Session.set('editing', entry);
}

Template.PGBudgetEntry.onCreated( function() {
    Meteor.subscribe('pg-budgets');
    Session.set('isEditing', null);
})

Template.PGBudgetEntry.rendered = function() {
    const idtag = "div#" + Template.instance().data['id'] + "-status";
    $(idtag).dropdown();
}

Template.PGBudgetEntry.onDestroyed( function() {
    Session.set('isEditing', null);
    // Session.set('editing', null);
})

Template.PGBudgetEntry.events({
    'click tr': function(e, template) {
        const editId = $(e.target).attr('id')
        if (Template.instance().data['status'] == 1) {
            editEntry(editId);
        }
    },
    'change div.ui.selection.dropdown.fluid': function(e, template) {
        console.log('changed');
        const editId = $(e.target).attr('id');
        console.log(editId);
        const dropdownId = Template.instance().data['id'] + "-status";
        console.log(dropdownId);
        if (editId === dropdownId) {
            const inputId = Template.instance().data['id'] + "-input";
            const newStatus = $('input[name="' + inputId +'"]').val();
            console.log(newStatus);
            const teamID = Meteor.userId();
            const budgetEntry = PGBudgets.find({ 'teamID': teamID }).fetch()[0];
            var budget = budgetEntry['monthlyBudget'];
            budget[Template.instance().data['currentPage']][Template.instance().data['idx']]['status'] = newStatus;

            const budgetUpdate = {
                "monthlyBudget": budget
            };
            Meteor.call('pg-budgets.update', budgetEntry._id, budgetUpdate);
            Template.instance().data['mappedStatus'] = newStatus;
        }
    }
});

Template.PGBudgetEntry.helpers({
    isEditing: function() {
        const editData = Session.get('isEditing');
        if (editData) {
            return editData['id'] === Template.instance().data['id'];
        } else {
            return false;
        }
    },
    isDisabled: function () {
        return (Template.instance().data['status'] == 1 || Template.instance().data['status'] == 3) ? "" : "disabled";
    },
    haveOrdered: function() {
        return Template.instance().data['status'] == 3;
    },
    loadDropdown: function() {
        const idtag = "div#" + Template.instance().data['id'] + "-status";
        $(idtag).dropdown('refresh');
    },
    mappedStatus: function() {
        return Template.instance().data['mappedStatus'];
    }
});
