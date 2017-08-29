import { Template } from 'meteor/templating';

import { JCCCRequests } from '../../api/jccc-requests.js';

import './JCCCSubmission.js';
import './JCCCSubmissionTemplate.html';
import './JCCCResultsLayout.html';

Template.JCCCResultsLayout.helpers({
    notEmpty() {
            return (JCCCRequests.find().count() > 0);
    },
    submissions() {
        return JCCCRequests.find({}, {sort: {'submitted': -1}})
    }
});
