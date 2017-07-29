import { Template } from 'meteor/templating';

import { JCCCRequests } from '../../api/jccc-requests.js';

import './JCCCResponderTemplate.html';
import './JCCCDecisionForm.js';

Template.JCCCResponder.onCreated( function() {
    this.responding = new ReactiveVar(false);
    this.appInView = new ReactiveVar(undefined);
});

Template.JCCCResponder.rendered = function() {
    $('#select-request.ui.selection.dropdown').dropdown();
}

Template.JCCCResponder.events({
    'click .item[name=pending-request]': function(e, template) {
        Template.instance().responding.set(true);
        Template.instance().appInView.set(e.target.id);
        console.log(e.target.id);
    }
});

Template.JCCCResponder.helpers({
    pendingRequests: function() {
        return JCCCRequests.find({ applicationStatus: 'Pending' }).fetch();
    },
    isResponding: function() {
        return Template.instance().responding.get();
    },
    appInView: function() {
        return JCCCRequests.findOne({ _id: Template.instance().appInView.get() });
    }
});

