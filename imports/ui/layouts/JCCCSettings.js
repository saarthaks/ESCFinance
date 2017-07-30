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
                "formStatus": true
            }
            Meteor.call('jccc-settings.insert', insertData);
        } else {
            const entryId = JCCCSettingsDB.findOne()._id;
            const updateData = {
                "pocEmail": data.pocEmail,
                "emailTag": data.emailTag
            };
            Meteor.call('jccc-settings.update', entryId, updateData);
        }
        formElem.form('clear');
    } else {
        formElem.form('validate rules');
    }
}

var updateFormStatus = function(value) {
    Template.instance().formIsLive.set(value);
    const entryId = JCCCSettingsDB.findOne()._id;
    const updateData = {
        "formStatus": value 
    };
    Meteor.call('jccc-settings.update', entryId, updateData);
    console.log(JCCCSettingsDB.findOne().formStatus);
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
            "applicationID": "Initialize",
            "totalTransaction": totalAmt,
            "ccTransaction": ccAmt,
            "seasTransaction": seasAmt,
            "gsTransaction": gsAmt,
            "bcTransaction": bcAmt,
            "receiptAmount": totalAmt
        };
        Meteor.call('jccc-finances.insert', insertData);
        formElem.form('clear');
    } else {
        formElem.form('validate rules');
    }
}

Template.JCCCSettings.onCreated( function() {
    const entry = JCCCSettingsDB.findOne();
    if (entry === undefined) {
        this.formIsLive = new ReactiveVar(true);
        this.firstTime = new ReactiveVar(true);
    } else {
        this.formIsLive = new ReactiveVar(entry.formStatus);
        this.firstTime = new ReactiveVar(false);
    }
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
    currentPoc: function() {
        return JCCCSettingsDB.findOne().pocEmail;
    },
    currentTag: function() {
        return JCCCSettingsDB.findOne().emailTag;
    },
    formStatus: function() {
        return Template.instance().formIsLive.get();
    },
    formStatusFormat: function() {
        const str = Template.instance().formIsLive.get().toString();
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    currentCC: function() {
        return JCCCFinances.findOne({ "applicationID": "Initialize" }).ccTransaction.toString();
    },
    currentSEAS: function() {
        return JCCCFinances.findOne({ "applicationID": "Initialize" }).seasTransaction.toString();
    },
    currentGS: function() {
        return JCCCFinances.findOne({ "applicationID": "Initialize" }).gsTransaction.toString();
    },
    currentBC: function() {
        return JCCCFinances.findOne({ "applicationID": "Initialize" }).bcTransaction.toString();
    },
});
