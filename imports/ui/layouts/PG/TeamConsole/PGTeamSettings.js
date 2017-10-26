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
    }
});

Template.PGTeamSettings.helpers({
    modalHeader: function() {
        return Template.instance().modalHeader.get();
    },
    modalMessage: function() {
        return Template.instance().modalMessage.get();
    },
});
