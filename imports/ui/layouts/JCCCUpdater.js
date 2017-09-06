import { Template } from 'meteor/templating';

import { JCCCRequests } from '../../api/jccc-requests.js';

import './JCCCUpdaterTemplate.html';
import './JCCCUpdateForm.js';

Template.JCCCUpdater.onCreated( function() {
    Meteor.subscribe('jccc-requests');

    this.updating = new ReactiveVar(false);
    this.appInView = new ReactiveVar(undefined);
});

Template.JCCCUpdater.rendered = function() {
    $('#select-update.ui.selection.dropdown').dropdown();
}

Template.JCCCUpdater.events({
    'click .item[name=pending-update]': function(e, template) {
        Template.instance().updating.set(true);
        Template.instance().appInView.set(e.target.id);
    }
});

Template.JCCCUpdater.helpers({
    updateRequests: function() {
        return JCCCRequests.find({
            "$or": [
                { applicationStatus: "Accept" },
                { applicationStatus: "Conditionally Accept" }
            ]}).fetch();
    },
    isUpdating: function() {
        return Template.instance().updating.get();
    },
    appInView: function() {
        return JCCCRequests.findOne({ _id: Template.instance().appInView.get() });
    }
});
