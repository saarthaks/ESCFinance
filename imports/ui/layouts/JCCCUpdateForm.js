import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { JCCCRequests } from '../../api/jccc-requests.js';
import { JCCCFinances } from '../../api/jccc-finances.js';

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

var submitForm = function(elem) {
    elem.form({ fields: validationRules, inline: true });
    if(elem.form('is valid')) {
        const data = elem.form('get values');
        var updateData = {};
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
                //TODO:
                //Something with update error
            }
        }
        try {
            Meteor.call('jccc-finances.updateByAppID', Template.instance().data._id, updateData);
            elem.form('clear');
        } catch (e) {
            console.log(e);
            //TODO:
            //Something with update error
        }
    } else {
        elem.form('validate rules');
    }
}

Template.JCCCUpdateForm.onCreated( function() {
    this.isReady = new ReactiveVar(false);
    this.isChanging = new ReactiveVar(false);
    this.isLogging = new ReactiveVar(false);
});

Template.JCCCUpdateForm.rendered = function() {
    $('#select-action.ui.selection.dropdown').dropdown();
}

Template.JCCCUpdateForm.events({
    'change [name=updateAction]': function(e, template) {
        console.log('changed');
        console.log(e.target.value);
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
        console.log(JCCCFinances.find({}).fetch());
        const entry = JCCCFinances.findOne({ applicationID: Template.instance().data._id });
        return entry.totalTransaction;
    }
});

