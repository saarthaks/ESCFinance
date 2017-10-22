import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { JCCCRequests } from '../../../../api/jccc-requests.js';
import { JCCCFinances } from '../../../../api/jccc-finances.js';
import { JCCCSettingsDB } from '../../../../api/jccc-settings.js';

import './JCCCUpdateFormTemplate.html';

const validationRules = {
    finalAmount: {
        identifier: 'finalAmount',
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

var checkSums = function(data) {
    const totalSum = parseFloat(data.ccFunding) + parseFloat(data.seasFunding) + parseFloat(data.gsFunding) + parseFloat(data.bcFunding);
    return (totalSum == parseFloat(data.finalAmount));
}

var sendUpdateEmail = function(data) {
    const to = Template.instance().data.pocEmail;
    const from = "Finance Committee <" + JCCCSettingsDB.findOne().pocEmail + ">";
    const subject = "JCCC Update";
    const body = data.emailBody;
    const cc = JCCCSettingsDB.findOne().pocEmail;

    Meteor.call('sendEmailWithCC', to, from, subject, body, cc);
}

var submitForm = function(elem) {
    elem.form({ fields: validationRules, inline: true });
    if(elem.form('is valid')) {
        const data = elem.form('get values');
        var updateData = {};
        try {
            if (!checkSums(data)) {
                Template.instance().modalHeader.set("Error");
                Template.instance().modalMessage.set("Your contributions do not add up to your total.");
                $('.ui.modal').modal({inverted: true}).modal('show');
                Meteor.setTimeout(() => {
                    $('.ui.modal').modal('hide');
                }, 2000);
                throw Error("Check sum failed");
            }
            if (Template.instance().isChanging.get()) {
                updateData = {
                    "totalTransaction": parseFloat(data.finalAmount),
                    "ccTransaction": parseFloat(data.ccFunding),
                    "seasTransaction": parseFloat(data.seasFunding),
                    "gsTransaction": parseFloat(data.gsFunding),
                    "bcTransaction": parseFloat(data.bcFunding)
                }
            } else {
                updateData = {
                    "totalTransaction": parseFloat(data.finalAmount),
                    "ccTransaction": parseFloat(data.ccFunding),
                    "seasTransaction": parseFloat(data.seasFunding),
                    "gsTransaction": parseFloat(data.gsFunding),
                    "bcTransaction": parseFloat(data.bcFunding),
                    "receiptAmount": parseFloat(data.finalAmount)
                }

                try {
                    const receiptUpdate = {
                        "receiptSubmitted": true
                    };
                    Meteor.call('jccc-requests.update', Template.instance().data._id, receiptUpdate);
                } catch (e) {
                    console.log(e);

                    Template.instance().modalHeader.set("Error");
                    Template.instance().modalMessage.set("Your receipt could not be processed at this time. Please try again later.");
                    $('.ui.modal').modal({inverted: true}).modal('show');
                    Meteor.setTimeout(() => {
                        $('.ui.modal').modal('hide');
                    }, 2000);
                }
            }
            try {
                Meteor.call('jccc-finances.updateByAppID', Template.instance().data._id, updateData);

                if (Template.instance().isChanging.get()) {
                    sendUpdateEmail(data);
                }
                Template.instance().modalHeader.set("Success!");
                Template.instance().modalMessage.set("Your decision has been updated.");
                $('.ui.modal').modal({inverted: true}).modal('show');
                Meteor.setTimeout(() => {
                    $('.ui.modal').modal('hide');
                }, 1000);
                elem.form('clear');
            } catch (e) {
                console.log(e);

                Template.instance().modalHeader.set("Error");
                Template.instance().modalMessage.set("Your update could not be processed at this time. Please try again later.");
                $('.ui.modal').modal({inverted: true}).modal('show');
                Meteor.setTimeout(() => {
                    $('.ui.modal').modal('hide');
                }, 2000);

            }
        } catch (e) {
            console.log(e);
        }

    } else {
        elem.form('validate rules');
    }
}

Template.JCCCUpdateForm.onCreated( function() {
    Meteor.subscribe('jccc-settings');
    Meteor.subscribe('jccc-finances');
    Meteor.subscribe('jccc-requests');

    this.isReady = new ReactiveVar(false);
    this.isChanging = new ReactiveVar(false);
    this.isLogging = new ReactiveVar(false);
    this.modalHeader = new ReactiveVar("");
    this.modalMessage = new ReactiveVar("");
});

Template.JCCCUpdateForm.rendered = function() {
    $('#select-action.ui.selection.dropdown').dropdown();
}

Template.JCCCUpdateForm.events({
    'change [name=updateAction]': function(e, template) {
        if (e.target.value.toLowerCase().includes('change')) {
            Template.instance().isReady.set(true);
            Template.instance().isLogging.set(false);
            Template.instance().isChanging.set(true);
        } else {
            Template.instance().isReady.set(true);
            Template.instance().isChanging.set(false);
            Template.instance().isLogging.set(true);
        }
    },
    'submit form': function(e, template) {
        e.preventDefault();
        submitForm( $('.ui.form') );
        return false
    }
});

Template.JCCCUpdateForm.helpers({
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
    isReady: function() {
        return Template.instance().isReady.get();
    },
    isChanging: function() {
        return Template.instance().isChanging.get();
    },
    isLogging: function() {
        return Template.instance().isLogging.get();
    },
    approvedAmount: function() {
        const entry = JCCCFinances.findOne({ applicationID: Template.instance().data._id });
        return entry.totalTransaction;
    }
});
