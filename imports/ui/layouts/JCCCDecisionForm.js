import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { JCCCRequests } from '../../api/jccc-requests.js';
import { JCCCSettingsDB } from '../../api/jccc-settings.js';
import { JCCCFinances } from '../../api/jccc-finances.js';

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

var emailDecision = function(data) {
    const to = Template.instance().data.pocEmail;
    const from = "Finance Committee <" + JCCCSettingsDB.findOne().pocEmail + ">";
    const subject = "JCCC Notification: " + data.responseAction;
    const body = data.emailBody;

    Meteor.call('sendEmail', to, from, subject, body);
}

var checkSums = function(data) {
    const totalSum = parseFloat(data.ccFunding) + parseFloat(data.seasFunding) + parseFloat(data.gsFunding) + parseFloat(data.bcFunding);
    return (totalSum == parseFloat(data.acceptedAmount));
}

var insertTransaction = function(data) {
    const financeInsert = {
        "date": new Date,
        "applicationID": Template.instance().data._id,
        "applicationName": Template.instance().data.name + ": " + Template.instance().data.eventName,
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
    var rules = basicRules;
    if (Template.instance().isAccepting.get()) {
        rules = $.extend(rules, basicAcceptRules);
        if (!Template.instance().isConditional.get()) {
            rules = $.extend(rules, fullAcceptRules);
        }
    }
    $('.ui.form').form({ fields: rules, inline: true });

    if( $('.ui.form').form('is valid') ) {
        const data = $('.ui.form').form('get values');
        try {
            decideApplication(data);
            emailDecision(data);
            if (Template.instance().isAccepting.get()) {
                try {
                    if (!Template.instance().isConditional.get() && !checkSums(data)) {
                        Template.instance().modalHeader.set("Error");
                        Template.instance().modalMessage.set("Your contributions do not add up to your total.");
                        $('.ui.modal').modal({inverted: true}).modal('show');
                        Meteor.setTimeout(() => {
                            $('.ui.modal').modal('hide');
                        }, 2000);
                        throw Error("Check sum failed");
                    }
                    insertTransaction(data);
                } catch (e) {
                    console.log(e);
                }
            }
            Template.instance().modalHeader.set("Success!");
            Template.instance().modalMessage.set("Your decision has been recorded.");
            $('.ui.modal').modal({inverted: true}).modal('show');
            Meteor.setTimeout(() => {
                $('.ui.modal').modal('hide');
                FlowRouter.go('/jccc/admin-console');
            }, 1000);

            $('.ui.form').form('clear');
        } catch (e) {
            console.log(e);

            Template.instance().modalHeader.set("Error");
            Template.instance().modalMessage.set("Your decision could not be processed at this time. Please try again later.");
            $('.ui.modal').modal({inverted: true}).modal('show');
            Meteor.setTimeout(() => {
                $('.ui.modal').modal('hide');
            }, 2000);
        }

    } else {
        $('.ui.form').form('validate rules');
    }
}

Template.JCCCDecisionForm.onCreated( function() {
    Meteor.subscribe('jccc-settings');
    Meteor.subscribe('jccc-requests');
    Meteor.subscribe('jccc-finances');

    this.isAccepting = new ReactiveVar(false);
    this.isConditional = new ReactiveVar(false);
    this.modalHeader = new ReactiveVar("");
    this.modalMessage = new ReactiveVar("");
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
    modalHeader: function() {
        return Template.instance().modalHeader.get();
    },
    modalMessage: function() {
        return Template.instance().modalMessage.get();
    },
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
