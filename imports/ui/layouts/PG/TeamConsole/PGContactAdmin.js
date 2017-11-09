import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';

import './PGContactAdminTemplate.html';

const validationRules = {
    emailSubject: {
        identifier: 'emailSubject',
        rules: [{ type: 'empty', prompt: "Please enter a subject"}]
    },
    applicantEmail: {
        identifier: 'emailBody',
        rules: [{ type: 'empty', prompt: "Please enter your message"}]
    }
};

var sendEmail = function(data) {
    const admin = Roles.getUsersInRole('pgadmin').fetch()[0];
    const user = Meteor.user();
    const to = "ESC Finance Committee <" + admin.primaryEmail + ">";
    const from = user.username + " <" + user.primaryEmail + ">";
    const subject = data.emailSubject;
    const body = data.emailBody;

    Meteor.call('sendEmail', to, from, subject, body);
}

var submitForm = function(elem) {
    elem.form({ fields: validationRules, inline: true });

    if(elem.form('is valid')) {
        const data = elem.form('get values');
        sendEmail(data);
        Template.instance().modalHeader.set("Success!");
        Template.instance().modalMessage.set("Your email has been sent!");
        $('.ui.modal').modal({inverted: true}).modal('show');
        Meteor.setTimeout(() => {
            $('.ui.modal').modal('hide');
            Template.instance().modalHeader.set(false);
            Template.instance().modalMessage.set(false);
        }, 2000);
        elem.form('clear');
    } else {
        elem.form('validate form');
    }
}

Template.PGContactAdmin.onCreated( function() {
    this.modalHeader = new ReactiveVar(false);
    this.modalMessage = new ReactiveVar(false);
})

Template.PGContactAdmin.events({
    'submit form': function(e, template) {
        e.preventDefault();
        submitForm( $('.ui.form') );
        return false;
    }
})

Template.PGContactAdmin.helpers({
    'modalHeader': function() {
        return Template.instance().modalHeader.get();
    },
    'modalMessage': function() {
        return Template.instance().modalMessage.get();
    }
})
