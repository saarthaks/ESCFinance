import { Template } from 'meteor/templating';

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
    //TODO: finish email sending
    const to = '';
    const from = Meteor.user().emails[0].address;
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

Template.PGContactAdmin.events({
    'submit form': function(e, template) {
        e.preventDefault();
        submitForm( $('.ui.form') );
        return false;
    }
})
