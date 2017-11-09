import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { PGBudgets } from '../../../../api/pg-budgets.js';
import { PGRequests } from '../../../../api/pg-requests.js';

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
    const team = Template.instance().team.get();
    const budget = PGBudgets.find( {'teamID': team._id} ).fetch()[0]['monthlyBudget'];
    for (i = 0; i < parts.length; i++) {
        const month = parts[i].slice(0,3);
        const idx = parseInt(parts[i].slice(4));
        requests.push(budget[month][idx]);
    }


    Template.instance().requestList.set(requests);
}

var buildRequest = function(team, formData, part) {
    var request = {
        'fbLink': formData.fbLink,
        'requestMonth': formData.requestMonth,
        'teamName': team.username,
        'itemName': part.itemName,
        'websiteLink': part.websiteLink,
        'distributor': part.distributor,
        'unitPrice': part.unitPrice,
        'quantity': part.quantity,
        'cost': part.cost,
        'shippingCost': !!part.shippingCost ? part.shippingCost : 0.0,
        'complete': false
    };

    return request;
}

var sendRequestEmail = function(data) {
    //TODO: finish email sending
    const to = '';
    const from = '';
    const subject = "Project Grant Order Request";
    const body = "Heads up!\n\n"
        + "A new request has been placed by " + data.name + ". "
        + "This request is for " + data.quantity + " items for a total "
        + "of $" + data.total + ". \n\n";

    // Meteor.call('sendEmail', to, from, subject, body);
}

var submitForm = function(elem) {
    elem.form({ fields: validationRules, inline: true });
    if(elem.form('is valid')) {
        const data = elem.form('get values');
        const team = Template.instance().team.get();
        const budgetEntry = PGBudgets.find( {'teamID': team._id} ).fetch()[0];
        var budget = budgetEntry['monthlyBudget'];

        const parts = Template.instance().requestList.get();
        var total = 0;
        for (i = 0; i < parts.length; i++) {
            console.log(budget[data.requestMonth]);
            for (j = 0; j < budget[data.requestMonth].length; j++) {
                if (budget[data.requestMonth][j].itemName === parts[i].itemName) {
                    budget[data.requestMonth][j].status = 2;
                    break;
                }
            }

            const requestInsert = buildRequest(team, data, parts[i]);
            Meteor.call('pg-requests.insert', requestInsert);
            total = total + parts[i].cost;
        }

        const budgetInsert = {
            'monthlyBudget' : budget
        };
        Meteor.call('pg-budgets.update', budgetEntry._id, budgetInsert);

        const messageData = {
            'name': team.username,
            'quantity': parts.length,
            'total': total
        };
        sendRequestEmail(messageData);
        //TODO: add requests to pg-requests
        //TODO: send email notifying that Team wishes to order parts
        elem.form('clear');
    } else {
        elem.form('validate rules');
    }
}

Template.PGOrderRequest.onCreated( function() {
    Meteor.subscribe('pg-budgets');
    Meteor.subscribe('pg-requests');
    this.team = new ReactiveVar(Meteor.user());
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
        console.log(parts);
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
        const team = Template.instance().team.get()
        if (month) {
            if (team.hasBudget) {
                const budget = PGBudgets.find( {'teamID': team._id} ).fetch()[0]['monthlyBudget'][month];
                var items = [];
                for (i = 0; i < budget.length; i++) {
                    if (budget[i]['status'] == 1) {
                        items.push({
                            'month': month,
                            'idx': i,
                            'itemName': budget[i]['itemName'],
                            'totalCost': budget[i]['cost']
                        });
                    }
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
