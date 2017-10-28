import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { PGBudgets } from '../../../../api/pg-budgets.js';

import './PGOrderRequestTemplate.html';

const validationRules = {
    fbLink: {
        identifier: 'fbLink',
        rules: [{ type: 'empty', prompt: "Please enter your link" }]
    },
    requestMonth: {
        identifier: 'requestMonth',
        rules: [{ type: 'empty', prompt: "Please select the month" }]
    },
    partSelection: {
        identifier: 'partSelection',
        rules: [{ type: 'empty', prompt: "Please select your parts" }]
    }
};

var updateRequestList = function(parts) {
    var requests = [];
    const team = Meteor.user();
    const budget = PGBudgets.find( {'teamID': team._id} ).fetch()[0]['monthlyBudget'];
    for (i = 0; i < parts.length; i++) {
        const month = parts[i].slice(0,3);
        const idx = parseInt(parts[i].slice(4));
        requests.push(budget[month][idx]);
    }

    Template.instance().requestList.set(requests);
}

var submitForm = function(elem) {
    elem.form({ fields: validationRules, inline: true });
    if(elem.form('is valid')) {
        const data = elem.form('get values');

        //TODO: add requests to pg-requests-db
        //TODO: send email notifying that Team wishes to order parts
        elem.form('clear');
    } else {
        elem.form('validate rules');
    }
}

Template.PGOrderRequest.onCreated( function() {
    Meteor.subscribe('pg-budgets');
    this.monthInView = new ReactiveVar(undefined);
    this.requestList = new ReactiveVar([]);
});

Template.PGOrderRequest.rendered = function() {
    $('div#request-month.ui.selection.dropdown').dropdown();
    $('div#parts-drop.ui.multiple.selection.scrolling.dropdown').dropdown();
}

Template.PGOrderRequest.events({
    'change #request-month': function(e, template) {
        const month = $('input[name="requestMonth"]').val();
        Template.instance().monthInView.set(month);
    },
    'change #parts-drop': function(e, template) {
        var parts = $('input[name="partSelection"]').val();
        parts = parts.split(',');
        if (parts[0] === "") {
            parts = [];
        }
        updateRequestList(parts);
    },
    'submit form': function(e, template) {
        e.preventDefault();
        submitForm( $('.ui.form') );
        return false;
    }
});

Template.PGOrderRequest.helpers({
    budgetItems: function() {
        const month = Template.instance().monthInView.get();
        const team = Meteor.user()
        if (month) {
            if (team.hasBudget) {
                const budget = PGBudgets.find( {'teamID': team._id} ).fetch()[0]['monthlyBudget'][month];
                var items = [];
                for (i = 0; i < budget.length; i++) {
                    items.push({
                        'month': month,
                        'idx': i,
                        'itemName': budget[i]['itemName'],
                        'totalCost': budget[i]['cost']
                    });
                }
                return items;
            }
        }

        return [];
    },
    filledRequests: function() {
        return Template.instance().requestList.get().length > 0;
    },
    requestList: function() {
        return Template.instance().requestList.get();
    },
    totalRequest: function() {
        console.log('calculating')
        var total = 0;
        const requests = Template.instance().requestList.get();
        for (i = 0; i < requests.length; i++) {
            total = total + requests[i]['cost'];
        }
        return total
    }
});
