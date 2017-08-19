import { Template } from 'meteor/templating';
import { Meteor }  from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

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

Template.LoginLayout.events({
    'click #login-button': function(e, template) {
        e.preventDefault();
        loginAction();
    }
})
