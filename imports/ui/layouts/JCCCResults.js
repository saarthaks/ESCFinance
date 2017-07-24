import { Template } from 'meteor/templating';

import './JCCCSubmission.js';
import './JCCCSubmissionTemplate.html';
import './JCCCResultsLayout.html';

Template.JCCCResultsLayout.helpers({
    submissions: [
        {
            "submitted": new Date(),
            "name": "Dummy1",
            "allocation": "1000",
            "requestedAmount": "100",
            "eventName": "Dummy1Name",
            "applicationStatus": "Pending",
            "decisionDetails": "Awaiting more information"
        },
        {
            "submitted": new Date(),
            "name": "Dummy2",
            "allocation": "1000",
            "requestedAmount": "100",
            "eventName": "Dummy2Name",
            "applicationStatus": "Accepted",
            "decisionDetails": "Full request granted"
        },
        {
            "submitted": new Date(),
            "name": "Dummy3",
            "allocation": "1000",
            "requestedAmount": "100",
            "eventName": "Dummy3Name",
            "applicationStatus": "Rejected",
            "decisionDetails": "Extravagent"
        }
    ]
});
