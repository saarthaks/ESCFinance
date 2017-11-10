import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.startup(() => {
    if ( Meteor.users.find().count() === 0) {
        id = Accounts.createUser({
            username: 'ESCAdmin',
            email: 'ss4754@columbia.edu',
            password: 'password',
            roles: ['jcccadmin'],
            address: null,
            hasBudget: false,
            allocation: 0
        });

        console.log("New admin created");
    }

    if ( Meteor.users.find().count() === 1) {
        Accounts.createUser({
            username: 'PGAdmin',
            email: 'ss4754+pg@columbia.edu',
            password: 'password',
            roles: ['pgadmin'],
            address: null,
            hasBudget: false,
            allocation: 0
        });

        console.log("New pg admin created");
    }
})


Accounts.onCreateUser(function(options, user) {
    user.primaryEmail = options.email;
    user.roles = options.roles;
    user.address = options.address;
    user.hasBudget = options.hasBudget;
    user.allocation = options.allocation;

    if (Roles.userIsInRole(user._id, 'pgteam')) {
        Meteor.setTimeout(function() {
            console.log(user._id);
            Accounts.sendVerificationEmail(user._id);
        }, 2 * 1000);
    }
    return user;
})

Meteor.users.allow({
    update: function (userId, doc, fields, modifier) {
        return true;
    }
});

Meteor.methods({
    'accounts.dropPGTeams': function() {
        console.log('dropping all pgteam accounts');
        const pgteams = Roles.getUsersInRole('pgteam').fetch();
        for (i = 0; i < pgteams.length; i++) {
            Meteor.users.remove({ '_id': pgteams[i]._id });
        }
        return 0;
    },
    'accounts.createTeam': function(data) {
        console.log('adding pgteam');
        const userId = Accounts.createUser({
            username: data.teamName,
            email: data.teamEmail,
            password: data.teamName,
            roles: ['pgteam'],
            address: null,
            allocation: parseFloat(data.teamAllocation),
            hasBudget: false
        });
        return true;
    }
});

Meteor.publish('userData', function() {
    return Meteor.users.find({}, {
        fields: { username: 1, primaryEmail: 1, roles: 1, address: 1, hasBudget: 1, allocation: 1 }
    });
    // if (this.userId) {
    //     return Meteor.users.find({ _id: this.userId }, {
    //         fields: { isAdmin: 1, hasBudget: 1, allocation: 1}
    //     })
    // } else {
    //     this.ready();
    // }
})
