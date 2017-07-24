import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './JCCCSubmissionTemplate.html';

Template.JCCCSubmissionTemplate.helpers({
    logDate: function() {
        const data = Template.instance().data;
        this.date = data.submitted.toLocaleString();
        return this.date;
    },
    groupName: function() {
        const data = Template.instance().data;
        return data.name;
    },
    allocation: function() {
        const data = Template.instance().data;
        return "$" + data.allocation;
    },
    requestedAmount: function() {
        const data = Template.instance().data;
        return "$" + data.requestedAmount;
    },
    eventName: function() {
        const data = Template.instance().data;
        return data.eventName;
    },
    applicationStatus: function() {
        const data = Template.instance().data;
        return data.applicationStatus;
    },
    decisionDetails: function() {
        const data = Template.instance().data;
        return data.decisionDetails;
    }
});

Template.JCCCSubmissionTemplate.rendered = function() {
    const data = Template.instance().data;
    const statusId = "td#" + data.eventName + "-status";
    const appStatus = data.applicationStatus;
    $(statusId).addClass('right aligned');

    if (appStatus.toLowerCase().includes("accepted")) {
        $(statusId).addClass('positive');
    } else if (appStatus.toLowerCase().includes("rejected")) {
        $(statusId).addClass('negative');
    }

    this.$('i.info.circle.icon').popup();
};
