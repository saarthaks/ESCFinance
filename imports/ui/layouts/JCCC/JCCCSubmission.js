import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './JCCCSubmissionTemplate.html';

Template.JCCCSubmission.helpers({
    logDate: function() {
        const data = Template.instance().data;
        this.date = data.submitted.toLocaleString();
        return this.date;
    }
});

Template.JCCCSubmission.rendered = function() {
    this.$('i.info.circle.icon').popup();
};

Template.JCCCSubmission.helpers({
    rowColor: function() {
        if (Template.instance().data.applicationStatus.toLowerCase().includes("accept")){
            return "positive";
        } else if (Template.instance().data.applicationStatus.toLowerCase().includes("reject")) {
            return "negative";
        }

        return "";
    }
})
