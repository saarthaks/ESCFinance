import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function(options, user) {
    user.profile = options.profile || {};
    //TODO: in the future, we should put this on its own field (user.isAdmin)
    //and then publish this custom field to the client.
    if (user.username === "admin") {
        user.profile.isAdmin = true;
    } else {
        user.profile.isAdmin = false;
    }

    return user;
})
