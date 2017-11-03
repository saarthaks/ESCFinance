import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './PGRequestEntryTemplate.html';

var logPurchase = function() {

}

Template.PGRequestEntry.onCreated( function() {
    this.isViewing = new ReactiveVar(false);
    const team = Meteor.users.findOne({"username": Template.instance().data.team});
    if (team.address) {
        this.hasAddress = new ReactiveVar(true)
        this.address = new ReactiveVar(team.address);
        if (this.address.mailAddress) {
            this.hasMailLine = new ReactiveVar(true);
        } else {
            this.hasMailLine = new ReactiveVar(false);
        }
    } else {
        this.hasAddress = new ReactiveVar(false);
        this.hasMailLine = new ReactiveVar(false);
    }

});

Template.PGRequestEntry.events({
    'dblclick tr': function(e, template) {
        Template.instance().isViewing.set(!Template.instance().isViewing.get());
    },
    'submit form': function(e, template) {
        e.preventDefault();
        
        return false;
    }
});

Template.PGRequestEntry.helpers({
    isViewing: function() {
        return Template.instance().isViewing.get();
    },
    hasAddress: function() {
        return Template.instance().hasAddress.get();
    },
    hasMailLine: function() {
        return Template.instance().hasMailLine.get();
    },
    firstName: function() {
        return Template.instance().address.get().firstName;
    },
    lastName: function() {
        return Template.instance().address.get().lastName;
    },
    streetAddress: function() {
        return Template.instance().address.get().streetAddress;
    },
    mailAddress: function() {
        return Template.instance().address.get().mailAddress;
    },
    city: function() {
        return Template.instance().address.get().city;
    },
    state: function() {
        return Template.instance().address.get().state;
    },
    zipcode: function() {
        return Template.instance().address.get().zipcode;
    }
});
