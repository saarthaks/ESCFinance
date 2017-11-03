import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { PGBudgets } from '../../../../api/pg-budgets.js';
import { PGRequests } from '../../../../api/pg-requests.js';

import './PGRequestEntry.js';
import './PGRequestsTemplate.html';

var updateRequests = function() {
    console.log('updating');
    const requests = PGRequests.find({}, { sort: {'distributor': 1} }).fetch()
    console.log(requests);
    var totalRequest = 0;
    var groupRequests = {};
    var reqs = [];
    for (i = 0; i < requests.length; i++) {
        console.log(requests[i]);
        totalRequest = totalRequest + requests[i].cost;
        reqs.push({
            "team": requests[i].teamName,
            "item": requests[i].itemName,
            "link": requests[i].websiteLink,
            "distributor": requests[i].distributor,
            "quantity": requests[i].quantity,
            "cost": requests[i].cost
        });
        console.log(reqs);
        if (groupRequests[requests[i].teamName]) {
            groupRequests[requests[i].teamName]['amountRequested'] = groupRequests[requests[i].teamName]['amountRequested'] + requests[i].cost;
        } else {
            const team = Meteor.users.findOne({'username': requests[i].teamName})
            console.log(team);
            const alloc = team.allocation
            const spent = PGBudgets.findOne({'teamID': team._id}).amountSpent;
            groupRequests[requests[i].teamName] = {
                "teamName": requests[i].teamName,
                "allocatedAmount": alloc,
                "amountRemaining": alloc - spent,
                "amountRequested": requests[i].cost
            };
        }
    }
    console.log(totalRequest);
    console.log(groupRequests);
    console.log(reqs);

    const update = {
        'requestCount': requests.length,
        'totalRequest': totalRequest,
        'groupRequests': Object.values(groupRequests),
        'requests': reqs
    };

    return update;
}

Template.PGRequests.onCreated( function() {
    Meteor.subscribe('pg-requests');
    Meteor.subscribe('pg-budgets');
    const init = updateRequests();
    this.requestCount = new ReactiveVar(init['requestCount']);
    this.totalRequest = new ReactiveVar(init['totalRequest']);
    this.groupRequests = new ReactiveVar(init['groupRequests']);
    this.requests = new ReactiveVar(init['requests']);
});

Template.PGRequests.events({

});

Template.PGRequests.helpers({
    anyRequests: function() {
        return (Template.instance().requestCount.get() > 0);
    },
    groupRequests: function() {
        return Template.instance().groupRequests.get();
    },
    requests: function() {
        return Template.instance().requests.get();
    },
    totalRequest: function() {
        return Template.instance().totalRequest.get();
    }
});
