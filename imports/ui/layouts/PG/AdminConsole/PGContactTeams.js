import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

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
    //TODO: finish email sending
    const to = '';
    const from = '';
    const subject = data.emailSubject;
    const body = data.emailBody;

    // Meteor.call('sendEmail', to, from, subject, body);
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

var fetchTeams = function() {
    //TODO
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
        return fetchTeams();
    }
})
