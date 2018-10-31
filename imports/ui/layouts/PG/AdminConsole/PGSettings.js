import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './PGSettingsTemplate.html';

var newUserRules = {
    teamName: {
        identifier: 'teamName',
        rules: [{ type: 'empty', prompt: "Please enter the team name" }]
    },
    seasAllocation: {
        identifier: 'teamEmail',
        rules: [{ type: 'email', prompt: "Please enter an email" }]
    },
    teamAllocation: {
        identifier: 'teamAllocation',
        rules: [{ type: 'empty', prompt: "Please enter an amount" }]
    }
}

var loadTeams = function() {
    const teamAccounts = Roles.getUsersInRole('pgteam').fetch();
    var teams = [];
    for (i = 0; i < teamAccounts.length; i++) {
        teams.push({
            'username' : teamAccounts[i].username,
            'primaryEmail' : teamAccounts[i].primaryEmail,
            'allocation' : teamAccounts[i].allocation,
            'hasBudget' : teamAccounts[i].hasBudget.toString()
        });
    }
    return teams;
}

Template.PGSettings.onCreated( function() {
    this.addingUser = new ReactiveVar(false);
    this.currentTeams = new ReactiveVar(loadTeams());
});

var sendSuccessEmail = function(team_data) {
    const admin = Meteor.user().emails[0].address;
    const from = "ESC Finance Committee <" + admin + ">";

    //send account information
    const to = team_data.teamEmail;
    const cc = admin;
    const subject = "Welcome to the ESC Project Grant Program!";
    const body = "Hi!\n\n"
         + "Welcome to the ESC Project Grants! Below are your team's login default credentials, which can be updated once you sign in at the link below:\n"
         + "http://www.escfinances.com/project-grant/hub\n\n"
         + "Username: " + team_data.teamName + "\n"
         + "Password: " + team_data.teamName + "\n\n"
         + "Once you have logged in, don't forget to update shipping address and budget!\n\n"
         + "Best Regards,\n"
         + "ESC Finance\n";

    Meteor.call('sendEmailWithCC', to, from, subject, body, cc);
}

var addUser = function() {
    const formElem = $('.ui.form#add-user-form');
    formElem.form({ fields: newUserRules, inline: true });

    if ( formElem.form('is valid') ) {
        const data = formElem.form('get values');
        Meteor.call('accounts.createTeam', data);

        sendSuccessEmail(data);
        var newTeams = Template.instance().currentTeams.get();
        newTeams.push({
            'username' : data.teamName,
            'primaryEmail' : data.teamEmail,
            'allocation' : data.teamAllocation,
            'hasBudget' : 'false'
        });
        Template.instance().currentTeams.set(newTeams);
        console.log('register success');

        formElem.form('clear');
    } else {
        formElem.form('validate rules');
    }
}

var dropPGTeams = function() {
    const remaining = Meteor.call('accounts.dropPGTeams');
    Template.instance().currentTeams.set(loadTeams());
}

Template.PGSettings.helpers({
    displayUsers: function() {
        return (Template.instance().currentTeams.get().length > 0);
    },
    addingUser: function() {
        return Template.instance().addingUser.get();
    },
    teams: function() {
        return Template.instance().currentTeams.get();
    },
    primaryEmail: function(team) {
        return team.emails[0].address.toString();
    },
    hasBudget: function(team) {
        return team.hasBudget.toString();
    }
});

Template.PGSettings.events({
    'click .button#add-user': function(e, template) {
        Template.instance().addingUser.set(true);
    },
    'submit form#add-user-form': function(e, template) {
        e.preventDefault();
        addUser();
        Template.instance().addingUser.set(false);
    },
    'click .button#drop-users': function(e, template) {
        //TODO: Include some "Are you sure?" modal
        dropPGTeams();
    }
})
