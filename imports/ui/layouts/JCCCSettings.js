import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { JCCCSettingsDB } from '../../api/jccc-settings.js';
import { JCCCFinances } from '../../api/jccc-finances.js';

import './JCCCSettingsTemplate.html';

const contactRules = {
    pocEmail: {
        identifier: 'pocEmail',
        rules: [{ type: 'email', prompt: "Please enter a valid email" }]
    }
};

const financeRules = {
    ccAllocation: {
        identifier: 'ccAllocation',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    },
    seasAllocation: {
        identifier: 'seasAllocation',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    },
    gsAllocation: {
        identifier: 'gsAllocation',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    },
    bcAllocation: {
        identifier: 'bcAllocation',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    }
};

var updatePoc = function(template) {
    const formElem = $('.ui.form#update-poc');
    formElem.form({ fields: contactRules, inline: true });

    if ( formElem.form('is valid') ) {
        const data = formElem.form('get values');
        if (Template.instance().firstTime.get()) {
            const insertData = {
                "pocEmail": data.pocEmail,
                "emailTag": data.emailTag,
                "formStatus": false
            }
            Meteor.call('jccc-settings.insert', insertData);
            Template.instance().pocEmail.set(data.pocEmail);
            Template.instance().emailTag.set(data.emailTag);
        } else {
            const entryId = JCCCSettingsDB.findOne()._id;
            const updateData = {
                "pocEmail": data.pocEmail,
                "emailTag": data.emailTag
            };
            Meteor.call('jccc-settings.update', entryId, updateData);
            Template.instance().pocEmail.set(data.pocEmail);
            Template.instance().emailTag.set(data.emailTag);
        }

        Template.instance().modalHeader.set("Success!");
        Template.instance().modalMessage.set("You have successfully updated the point of contact info.");
        $('.ui.modal').modal({inverted: true}).modal('show');
        Meteor.setTimeout(() => {
            $('.ui.modal').modal('hide');
        }, 1000);
        formElem.form('clear');
    } else {
        formElem.form('validate rules');
    }
}

var updateFormStatus = function(value) {
    if (Template.instance().firstTime.get()) {
        const insertData = {
            "pocEmail": "d@mmy.com",
            "emailTag": "dtag",
            "formStatus": value
        };
        Meteor.call('jccc-settings.insert', insertData);
        Template.instance().firstTime.set(false);
    } else {
        const entryId = JCCCSettingsDB.findOne()._id;
        const updateData = {
            "formStatus": value
        };
        Meteor.call('jccc-settings.update', entryId, updateData);
        console.log(JCCCSettingsDB.findOne().formStatus);
    }
    Template.instance().formIsLive.set(value);
}

var initFinances = function(template) {
    const formElem = $('.ui.form#init-form');
    formElem.form({ fields: financeRules, inline: true });

    if ( formElem.form('is valid') ) {
        const data = formElem.form('get values');
        const ccAmt = parseFloat(data.ccAllocation);
        const seasAmt = parseFloat(data.seasAllocation);
        const gsAmt = parseFloat(data.gsAllocation);
        const bcAmt = parseFloat(data.bcAllocation);
        const totalAmt = ccAmt + seasAmt + gsAmt + bcAmt;
        const insertData = {
            "date": new Date(),
            "applicationID": "Deposit",
            "applicationName": "Deposit",
            "totalTransaction": totalAmt,
            "ccTransaction": ccAmt,
            "seasTransaction": seasAmt,
            "gsTransaction": gsAmt,
            "bcTransaction": bcAmt,
            "receiptAmount": totalAmt
        };
        
        Meteor.call('jccc-finances.insert', insertData);
        if (ccAmt > 0) { Template.instance().currentCC.set(ccAmt.toString()); }
        if (seasAmt > 0) { Template.instance().currentSEAS.set(seasAmt.toString()); }
        if (gsAmt > 0) { Template.instance().currentGS.set(gsAmt.toString()); }
        if (bcAmt > 0) { Template.instance().currentBC.set(bcAmt.toString()); }

        Template.instance().modalHeader.set("Success!");
        Template.instance().modalMessage.set("You have successfully deposited new finances.");
        $('.ui.modal').modal({inverted: true}).modal('show');
        Meteor.setTimeout(() => {
            $('.ui.modal').modal('hide');
        }, 1000);
        formElem.form('clear');
    } else {
        formElem.form('validate rules');
    }
}

Template.JCCCSettings.onCreated( function() {
    const entry = JCCCSettingsDB.findOne();
    if (entry === undefined) {
        this.formIsLive = new ReactiveVar(false);
        this.firstTime = new ReactiveVar(true);
        this.pocEmail = new ReactiveVar('');
        this.emailTag = new ReactiveVar('');
    } else {
        this.formIsLive = new ReactiveVar(entry.formStatus);
        this.firstTime = new ReactiveVar(false);
        this.pocEmail = new ReactiveVar(entry.pocEmail==="d@mmy.com" ? '' : entry.pocEmail);
        this.emailTag = new ReactiveVar(entry.emailTag==="dtag" ? '' : entry.emailTag);
    }
    const lastDeposit = JCCCFinances.find({"applicationID": "Deposit"}, {sort: {'submitted': -1}}).fetch()[0];
    if (lastDeposit === undefined) {
        this.currentCC = new ReactiveVar('');
        this.currentSEAS = new ReactiveVar('');
        this.currentGS = new ReactiveVar('');
        this.currentBC = new ReactiveVar('');
    } else {
        this.currentCC = new ReactiveVar(lastDeposit.ccTransaction.toString());
        this.currentSEAS = new ReactiveVar(lastDeposit.seasTransaction.toString());
        this.currentGS = new ReactiveVar(lastDeposit.gsTransaction.toString());
        this.currentBC = new ReactiveVar(lastDeposit.bcTransaction.toString());
    }

    this.modalHeader = new ReactiveVar('');
    this.modalMessage = new ReactiveVar('');
});

Template.JCCCSettings.events({
    'submit form#update-poc' : function(e, template) {
        e.preventDefault();
        updatePoc(template);
        return false;
    },
    'submit form#init-form' : function(e, template) {
        e.preventDefault();
        initFinances(template);
        return false;
    },
    'change [name=formStatus]' : function(e, template) {
        updateFormStatus(e.target.checked);
    }
});

Template.JCCCSettings.helpers({
    modalHeader: function() {
        return Template.instance().modalHeader.get();
    },
    modalMessage: function() {
        return Template.instance().modalMessage.get();
    },
    currentPoc: function() {
        return Template.instance().pocEmail.get();
    },
    currentTag: function() {
        return Template.instance().emailTag.get();
    },
    formStatus: function() {
        return Template.instance().formIsLive.get();
    },
    formStatusFormat: function() {
        return Template.instance().formIsLive.get() ? 'Live' : 'Closed';
    },
    currentCC: function() {
        return Template.instance().currentCC.get();
    },
    currentSEAS: function() {
        return Template.instance().currentSEAS.get();
    },
    currentGS: function() {
        return Template.instance().currentGS.get();
    },
    currentBC: function() {
        return Template.instance().currentBC.get();
    }
});
