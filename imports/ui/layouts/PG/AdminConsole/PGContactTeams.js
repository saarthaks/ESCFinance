import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';

import './PGContactTeamsTemplate.html';

const validationRules = {
    recipSelection: {
        identifier: 'recipSelection',
        rules: [{type: 'minCount[1]', prompt: "Please select at least one recipient"}]
    },
    emailSubject: {
        identifier: 'emailSubject',
        rules: [{ type: 'empty', prompt: "Please enter a subject"}]
    },
    applicantEmail: {
        identifier: 'emailBody',
        rules: [{ type: 'empty', prompt: "Please enter your message"}]
    }
}

var sendEmail = function(data) {
    const tos = data.recipSelection.split(',');
    const admin = Meteor.user().emails[0].address;
    const from = "ESC Finance Committee <" + admin + ">";
    const cc = admin;
    const subject = data.emailSubject;
    const body = data.emailBody;
    for (i = 0; i < tos.length; i++) {
        Meteor.call('sendEmailWithCC', tos[i], from, subject, body, cc);
    }
}

var submitForm = function(elem) {
    elem.form({ fields: validationRules, inline: true });

    if(elem.form('is valid')) {
        const data = elem.form('get values');
        sendEmail(data);
        elem.form('clear');
    } else {
        elem.form('validate form');
    }
}

Template.PGContactTeams.onCreated( function() {

});

Template.PGContactTeams.rendered = function() {
    $('div#recip-drop.ui.multiple.selection.scrolling.dropdown').dropdown();
}

Template.PGContactTeams.events({
    'submit form': function(e, template) {
        e.preventDefault();
        submitForm( $('.ui.form') );
        return false;
    }
});

Template.PGContactTeams.helpers({
    'teams': function() {
        return Roles.getUsersInRole('pgteam');
    },
    'extractAddress': function(team) {
        return team.address[0];
    }
})
