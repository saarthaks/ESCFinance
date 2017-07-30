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

const extraRules = {
    acceptedAmount: {
        identifier: 'acceptedAmount',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    },
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

var updateRequest = function(data) {
    JCCCRequests.update({ _id: Template.instance().data._id }, {
        $set: { applicationStatus: data.responseAction, 
                decisionDetails: data.decisionDetails }});
}

var insertTransaction = function(data) {
    const financeInsert = {
        "applicationID": Template.instance().data._id,
        "totalTransaction": parseFloat(data.acceptedAmount),
        "ccTransaction": parseFloat(data.ccFunding),
        "seasTransaction": parseFloat(data.seasFunding),
        "gsTransaction": parseFloat(data.gsFunding),
        "bcTransaction": parseFloat(data.bcFunding),
        "receiptAmount": 0.0
    };
    JCCCFinances.schema.validate(financeInsert);
    JCCCFinances.insert(financeInsert);
}

var submitForm = function(template) {
    $('.ui.form').form({ fields: basicRules, inline: true });
    if (Template.instance().isAccepting.get()) {
        const allRules = $.extend(basicRules, extraRules);
        $('.ui.form').form({ fields: allRules, inline: true });
    }

    if( $('.ui.form').form('is valid') ) {
        const data = $('.ui.form').form('get values');
        try { 
            updateRequest(data);
            try {
                insertTransaction(data);
                $('.ui.form').form('clear');
            } catch (e) {
                console.log(e);
            }
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
});

Template.JCCCDecisionForm.rendered = function() {
    $('#select-action.ui.selection.dropdown').dropdown();
}

Template.JCCCDecisionForm.events({
    'change [name=responseAction]': function(e, template) {
        if (e.target.value.toLowerCase().includes('accept')) {
            Template.instance().isAccepting.set(true);
        } else {
            $('.ui.form').form('destroy');
            Template.instance().isAccepting.set(false);
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
});
