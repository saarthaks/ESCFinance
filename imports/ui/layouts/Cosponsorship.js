import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var'

import './CosponsorshipLayout.html';

const validationRules = {
    applicantName: {
        identifier: 'applicantName',
        rules: [{ type: 'empty', prompt: "Please enter your name"}]
    },
    applicantEmail: {
        identifier: 'applicantEmail',
        rules: [{ type: 'email', prompt: "Please enter a valid email"}]
    },
    studentGroup: {
        identifier: 'studentGroup',
        rules: [{ type: 'empty', prompt: "Please enter the name of your student group"}]
    },
    escRecipient: {
        identifier: 'escRecipient',
        rules: [{ type: 'minCount[1]', prompt: "Please select at least one ESC cosponsor"},
                { type: 'maxCount[6]', prompt: "Please don't send this request to everyone"}]
    },
    proposal: {
        identifier: 'proposal',
        rules: [{ type: 'minLength[10]', prompt: "Please give a more complete description of your request"}]
    }
};

const contacts = {
    "2020" : "2020",
    "2019" : "2019",
    "2018" : "2018",
    "Finance" : "Finance",
    "Tech" : "Tech",
    "Diversity" : "Diversity",
    "Eboard" : "Eboard"
}

var emailRequest = function(data) {
    const to = data.escRecipient;
    const from = "";
    const subject = "Cosponsorship Request";
    const body = data.proposal;

    // Meteor.call('sendEmail', to, from, subject, body);
}

var submitForm = function(template) {
    $('.ui.form').form({ fields: validationRules, inline: true });

    if( $('.ui.form').form('is valid') ) {
        const data = $('.ui.form').form('get values');
        emailRequest(data);
        console.log(data);
        Template.instance().modalHeader.set("Success!");
        Template.instance().modalMessage.set("You should hear from us soon.");
        $('.ui.modal').modal({inverted: true}).modal('show');
        Meteor.setTimeout(() => {
            $('.ui.modal').modal('hide');
            FlowRouter.go('/');
        }, 2000);
        $('.ui.form').form('clear');
    } else {
        $('.ui.form').form('validate form');
    }
}

Template.CosponsorshipLayout.onCreated(function() {
    this.modalHeader = new ReactiveVar("");
    this.modalMessage = new ReactiveVar("");
});

Template.CosponsorshipLayout.helpers({
    modalHeader: function() {
        return Template.instance().modalHeader.get();
    },
    modalMessage: function() {
        return Template.instance().modalMessage.get();
    },
    email2020: function() {
        return contacts["2020"];
    },
    email2019: function() {
        return contacts["2019"];
    },
    email2018: function() {
        return contacts["2018"];
    },
    emailFinance: function() {
        return contacts["Finance"]
    },
    emailTech: function() {
        return contacts["Tech"];
    },
    emailDiversity: function() {
        return contacts["Diversity"];
    },
    emailEboard: function() {
        return contacts["Eboard"];
    }
});

Template.CosponsorshipLayout.events({
    'submit form': function(e, template) {
        e.preventDefault();
        submitForm(template);
        return false;
    }
});

Template.CosponsorshipLayout.rendered = function() {
    this.$('#recip-drop.ui.multiple.selection.scrolling.dropdown').dropdown();
};
