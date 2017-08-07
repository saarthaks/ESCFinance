import { Template } from 'meteor/templating';
import { Meteor }  from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
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

Template.LoginLayout.onCreated( function() {
    this.toLogin = new ReactiveVar(true);
});

var loginAction = function() {
    $('.ui.form').form({ fields: loginRules, inline: true });

    if( $('.ui.form').form('is valid') ) {
        const data = $('.ui.form').form('get values');
        Meteor.loginWithPassword(data.loginUsername, data.loginPassword, function(error) {
            if (error) {
                //alert of some kind
                $('.ui.form').form('clear');
                console.log(error);
            } else {
                // modal for success + some routing with FlowRouter.go('/')
                console.log('login success');
            }
        });
        $('.ui.form').form('clear');
    } else {
        $('.ui.form').form('validate rules');
    }
}

var registerAction = function() {
    const data = $('.ui.form').form('get values');
    Accounts.createUser({
        username: data.registerUsername,
        password: data.registerPassword
    }, function(error) {
        if (error) {
            console.log("Error: " + error.reason);
        } else {
            console.log('register success');
        }
    });
}

Template.LoginLayout.events({
    'click #login-button': function(e, template) {
        e.preventDefault();
        loginAction();
    },
    'click #register-button': function(e, template) {
        e.preventDefault();
        registerAction();
    },
    'click #register': function(e, template) {
        Template.instance().toLogin.set(false);
    },
    'click #login': function(e, template) {
        Template.instance().toLogin.set(true);
    }
})

Template.LoginLayout.helpers({
    toLogin: function() {
        return Template.instance().toLogin.get();
    }
})
