import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

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

    Session.set('isEditing', Template.instance().data['idx']);
    Session.set('save-button', true);
    Session.set('editing', entry);
}

Template.PGBudgetEntry.onCreated( function() {
    Session.set('isEditing', null);
})

Template.PGBudgetEntry.onDestroyed( function() {
    Session.set('isEditing', null);
    Session.set('editing', null);
})

Template.PGBudgetEntry.events({
    'dblclick tr': function(e, template) {
        editEntry($(e.target).attr('id'));
    }
});

Template.PGBudgetEntry.helpers({
    isEditing: function() {
        return Session.get('isEditing') == Template.instance().data['idx'];
    }
});
