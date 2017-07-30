import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { JCCCRequests } from '../../api/jccc-requests';
import { JCCCFinances } from '../../api/jccc-finances';

import './JCCCDecisionFormTemplate.html';

const basicRules = {
    responseAction: {
        identifier: 'responseAction',
        rules: [{ type: 'empty', prompt: "Please select an action" }]
    },
    decisionDetails: {
        identifier: 'decisionDetails',
        rules: [{ type: 'empty', prompt: "Please enter your decision rationale" }]
    },
    emailBody: {
        identifier: 'emailBody',
        rules: [{ type: 'empty', prompt: "Please enter an email to send" }]
    }
};

const basicAcceptRules = {
    acceptedAmount: {
        identifier: 'acceptedAmount',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    }
};

const fullAcceptRules = {
    ccFunding: {
        identifier: 'ccFunding',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    },
    seasFunding: {
        identifier: 'seasFunding',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    },
    gsFunding: {
        identifier: 'gsFunding',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    },
    bcFunding: {
        identifier: 'bcFunding',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    }
};

var decideApplication = function(data) {
    const updateData = {
        "applicationStatus": data.responseAction,
        "decisionDetails": data.decisionDetails
    };
    Meteor.call('jccc-requests.update', Template.instance().data._id, updateData);
}

var insertTransaction = function(data) {
    const financeInsert = {
        "applicationID": Template.instance().data._id,
        "totalTransaction": parseFloat(data.acceptedAmount),
        "ccTransaction": !Template.instance().isConditional.get() ? parseFloat(data.ccFunding) : 0.0,
        "seasTransaction": !Template.instance().isConditional.get() ? parseFloat(data.seasFunding) : 0.0,
        "gsTransaction": !Template.instance().isConditional.get() ? parseFloat(data.gsFunding) : 0.0,
        "bcTransaction": !Template.instance().isConditional.get() ? parseFloat(data.bcFunding) : 0.0,
        "receiptAmount": 0.0
    };
    Meteor.call('jccc-finances.insert', financeInsert);
}

var submitForm = function(template) {
    console.log(Template.instance().isAccepting.get());
    console.log(Template.instance().isConditional.get());
    var rules = basicRules;
    if (Template.instance().isAccepting.get()) {
        rules = $.extend(rules, basicAcceptRules);
        if (!Template.instance().isConditional.get()) {
            rules = $.extend(rules, fullAcceptRules);
        }
    }
    console.log(rules);
    $('.ui.form').form({ fields: rules, inline: true });

    if( $('.ui.form').form('is valid') ) {
        const data = $('.ui.form').form('get values');
        try { 
            decideApplication(data);
            if (Template.instance().isAccepting.get()) {
                try {
                    insertTransaction(data);
                    $('.ui.form').form('clear');
                } catch (e) {
                    console.log(e);
                }
            }
            $('.ui.form').form('clear');
        } catch (e) {
            console.log(e);
        }

        console.log(data);
    } else {
        $('.ui.form').form('validate rules');
    }
}

Template.JCCCDecisionForm.onCreated( function() {
    this.isAccepting = new ReactiveVar(false);
    this.isConditional = new ReactiveVar(false);
});

Template.JCCCDecisionForm.rendered = function() {
    $('#select-action.ui.selection.dropdown').dropdown();
}

Template.JCCCDecisionForm.events({
    'change [name=responseAction]': function(e, template) {
        const responseStatus = e.target.value.toLowerCase();
        if (responseStatus.includes('accept')) {
            Template.instance().isAccepting.set(true);
            if (responseStatus.includes('condition')) {
                Template.instance().isConditional.set(true);
            } else {
                Template.instance().isConditional.set(false);
            }
        } else {
            $('.ui.form').form('destroy');
            Template.instance().isAccepting.set(false);
            Template.instance().isConditional.set(false);
        }
    },
    'submit form': function(e, template) {
        e.preventDefault();
        submitForm(template);
        return false;
    }
});

Template.JCCCDecisionForm.helpers({
    name: function() {
        return Template.instance().data.name;
    },
    eventName: function() {
        return Template.instance().data.eventName;
    },
    requestedAmount: function() {
        return Template.instance().data.requestedAmount;
    },
    requestType: function() {
        return Template.instance().data.requestType;
    },
    isAccepting: function() {
        return Template.instance().isAccepting.get();
    },
    notConditional: function() {
        return !Template.instance().isConditional.get();
    }
});
