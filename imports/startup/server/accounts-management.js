import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    if ( Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: 'ESCAdmin',
            email: 'ss4754@columbia.edu',
            password: 'password',
            isAdmin: true,
            hasBudget: false,
            allocation: 0
        });

        console.log("New admin created");
    }
})


Accounts.onCreateUser(function(options, user) {
    user.primaryEmail = options.email;
    user.isAdmin = options.isAdmin;
    user.hasBudget = options.hasBudget;
    user.allocation = options.allocation;

    if (!user.isAdmin) {
        Meteor.setTimeout(function() {
            console.log(user._id);
            Accounts.sendVerificationEmail(user._id);
        }, 2 * 1000);
    }
    return user;
})

Meteor.methods({
    'accounts.dropPGTeams': function() {
        console.log('dropping');
        return Meteor.users.remove({});
    },
});

Meteor.publish('userData', function() {
    return Meteor.users.find({}, {
        fields: { primaryEmail: 1, isAdmin: 1, hasBudget: 1, allocation: 1 }
    });
    // if (this.userId) {
    //     return Meteor.users.find({ _id: this.userId }, {
    //         fields: { isAdmin: 1, hasBudget: 1, allocation: 1}
    //     })
    // } else {
    //     this.ready();
    // }
})
