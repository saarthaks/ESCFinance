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

Template.PGSettings.onCreated( function() {
    this.addingUser = new ReactiveVar(false);
})

var addUser = function() {
    const formElem = $('.ui.form#add-user-form');
    formElem.form({ fields: newUserRules, inline: true });

    if ( formElem.form('is valid') ) {
        const data = formElem.form('get values');
        const userId = Accounts.createUser({
            username: data.teamName,
            email: data.teamEmail,
            password: "teampassword",
            allocation: data.teamAllocation,
            isAdmin: false,
            hasBudget: false
        }, function(error) {
            if (error) {
                console.log("Error: " + error.reason);
            } else {

                console.log('register success');
            }
        });

        formElem.form('clear');
    } else {
        formElem.form('validate rules');
    }
}

var dropPGTeams = function() {
    const remaining = Meteor.call('accounts.dropPGTeams');
    console.log("Remaining teams: " + remaining);
}

Template.PGSettings.helpers({
    displayUsers: function() {
        return (Meteor.users.find({ isAdmin: false }).count() > 0);
    },
    addingUser: function() {
        return Template.instance().addingUser.get();
    },
    teams: function() {
        return Meteor.users.find({ isAdmin: false }).fetch();
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
