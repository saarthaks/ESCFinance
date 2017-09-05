import { Template } from 'meteor/templating';
import { Meteor }  from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

import './LoginLayout.html';

var loginRules = {
    loginUsername: {
        identifier: 'loginUsername',
        rules: [{ type: 'empty', prompt: 'Please enter your email' }]
    },
    loginPassword: {
        identifier: 'loginPassword',
        rules: [{ type: 'empty', prompt: "Please enter your password" }]
    }
};

var loginAction = function() {
    $('.ui.form').form({ fields: loginRules, inline: true });

    if( $('.ui.form').form('is valid') ) {
        const data = $('.ui.form').form('get values');
        Meteor.loginWithPassword(data.loginUsername, data.loginPassword, function(error) {
            if (error) {
                //alert of some kind
                Template.instance().modalHeader.set("Error");
                Template.instance().modalMessage.set("Please try again.");
                $('.ui.modal').modal({inverted: true}).modal('show');
                Meteor.setTimeout(() => {
                    $('.ui.modal').modal('hide');
                    FlowRouter.go(Template.instance().redirect.get());
                }, 1000);

                $('.ui.form').form('clear');
                console.log(error);
            } else {
                // modal for success + some routing with FlowRouter.go('/')
                Template.instance().modalHeader.set("Success!");
                Template.instance().modalMessage.set("You have successfully logged in.");
                $('.ui.modal').modal({inverted: true}).modal('show');
                Meteor.setTimeout(() => {
                    $('.ui.modal').modal('hide');
                    FlowRouter.go(Template.instance().redirect.get());
                }, 1000);

            }
        });
        $('.ui.form').form('clear');
    } else {
        $('.ui.form').form('validate rules');
    }
}

Template.LoginLayout.onCreated( function() {
    this.modalHeader = new ReactiveVar('');
    this.modalMessage = new ReactiveVar('');

    this.redirect = Session.get("redirectURI");
    if (!this.redirect) {
        this.redirect = '/';
    }
})

Template.LoginLayout.events({
    'click #login-button': function(e, template) {
        e.preventDefault();
        loginAction();
    }
})

Template.LoginLayout.helpers({
    modalHeader: function() {
        return Template.instance().modalHeader.get();
    },
    modalMessage: function() {
        return Template.instance().modalMessage.get();
    }
})
