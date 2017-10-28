import { Template } from 'meteor/templating';

import './PGTeamSettingsTemplate.html';

const passwordRules = {
    oldPassword: {
        identifier: 'oldPassword',
        rules: [{ type: 'empty', prompt: "Please enter your current password" }]
    },
    newPassword: {
        identifier: 'newPassword',
        rules: [{ type: 'empty', prompt: "Please enter a new password" }]
    }
}

const addressRules = {
    firstName: {
        identifier: 'firstName',
        rules: [{ type: 'empty', prompt: "Please enter your first name" }]
    },
    lastName: {
        identifier: 'lastName',
        rules: [{ type: 'empty', prompt: "Please enter your last name" }]
    },
    streetAddress: {
        identifier: 'streetAddress',
        rules: [{ type: 'empty', prompt: "Please enter the street address" }]
    },
    city: {
        identifier: 'city',
        rules: [{ type: 'empty', prompt: "Please enter the city" }]
    },
    state: {
        identifier: 'state',
        rules: [{ type: 'empty', prompt: "Please enter the state" }]
    },
    zipcode: {
        identifier: 'zipcode',
        rules: [{ type: 'empty', prompt: "Please enter the zipcode" }]
    }
}

var updatePassword = function(template) {
    const formElem = $('.ui.form#update-password');
    formElem.form({ fields: passwordRules, inline: true });

    if ( formElem.form('is valid')) {
        const data = formElem.form('get values');
        const oldPassword = data.oldPassword;
        const newPassword = data.newPassword;
        Accounts.changePassword(oldPassword, newPassword);
        Template.instance().modalHeader.set("Success!");
        Template.instance().modalMessage.set("You have successfully changed your password.");
        $('.ui.modal').modal({inverted: true}).modal('show');
        Meteor.setTimeout(() => {
            $('.ui.modal').modal('hide');
        }, 1000);
        formElem.form('clear');
    } else {
        formElem.form('validate rules');
    }
}

var updateAddress = function(template) {
    const formElem = $('.ui.form#update-address');
    formElem.form({ fields: passwordRules, inline: true });

    if ( formElem.form('is valid')) {
        const data = formElem.form('get values');
        //TODO: update address
        Template.instance().modalHeader.set("Success!");
        Template.instance().modalMessage.set("You have successfully changed your address.");
        $('.ui.modal').modal({inverted: true}).modal('show');
        Meteor.setTimeout(() => {
            $('.ui.modal').modal('hide');
        }, 1000);
        formElem.form('clear');
    } else {
        formElem.form('validate rules');
    }
}

Template.PGTeamSettings.onCreated( function() {
    this.modalHeader = new ReactiveVar('');
    this.modalMessage = new ReactiveVar('');
});

Template.PGTeamSettings.events({
    'submit form#update-password' : function(e, template) {
        e.preventDefault();
        updatePassword(template);
        return false;
    },
    'submit form#update-email' : function(e, template) {
        e.preventDefault();
        updateEmail(template);
        return false;
    },
    'submit form#update-address' : function(e, template) {
        e.preventDefault();
        updateAddress(template);
        return false;
    }
});

Template.PGTeamSettings.helpers({
    modalHeader: function() {
        return Template.instance().modalHeader.get();
    },
    modalMessage: function() {
        return Template.instance().modalMessage.get();
    },
    firstName: function() {
        return '';
    },
    lastName: function() {
        return '';
    },
    streetAddress: function() {
        return "70 Morningside Dr."
    },
    mailAddress: function() {
        return "#### Columbia Student Mail"
    },
    city: function() {
        return '';
    },
    state: function() {
        return '';
    },
    zipcode: function() {
        return '';
    }
});
