import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const JCCCRequests = new Mongo.Collection('jccc-requests');
JCCCRequests.schema  = new SimpleSchema({
    "submitted": {
        type: Date,
        label: "Date that Request was Submitted",
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            }
        }
    },
    "name": {
        type: String,
        label: "Student Group Name"
    },
    "clubEmail": {
        type: String,
        label: "Student Group Email"
    },
    "allocation": {
        type: String,
        label: "Group Allocation"
    },
    "ccPercentage": {
        type: String,
        label: "CC Percentage"
    },
    "seasPercentage": {
        type: String,
        label: "SEAS Percentage"
    },
    "gsPercentage": {
        type: String,
        label: "GS Percentage"
    },
    "bcPercentage": {
        type: String,
        label: "BC Percentage"
    },
    "governingBoard": {
        type: String,
        label: "Governing Board"
    },
    "requestType": {
        type: String,
        label: "Request Type"
    },
    "eventName": {
        type: String,
        label: "Event Name"
    },
    "eventTime": {
        type: String,
        label: "Event Time"
    },
    "eventLocation": {
        type: String,
        label: "Event Location"
    },
    "requestedAmount": {
        type: String,
        label: "Requested Amount"
    },
    "applicationStatus": {
        type: String,
        label: "Application Status"
    },
    "decisionDetails": {
        type: String,
        label: "Decision Details"
    },
    //
    // Private Information
    //
    "pocName": {
        type: String,
        label: "Point of Contact Name"
    },
    "pocEmail": {
        type: String,
        label: "Point of Contact Email"
    },
    "pocNumber": {
        type: String,
        label: "Point of Contact Phone Number"
    },
    "advisorName": {
        type: String,
        label: "Advisor Name"
    },
    "advisorEmail": {
        type: String,
        label: "Advisor Email"
    },
    "gbRepName": {
        type: String,
        label: "Governing Board Rep Name"
    },
    "gbRepEmail": {
        type: String,
        label: "Governing Board Rep Email"
    },
    "sgaNumber": {
        type: String,
        label: "SGA Account Number"
    },
    "columbiaNumber": {
        type: String,
        label: "Columbia Account Number"
    },
    "departmentNumber": {
        type: String,
        label: "Columbia Department Number"
    },
    "projectNumber": {
        type: String,
        label: "Columbia Project Number"
    },
    "eventDescription": {
        type: String,
        label: "Event Description"
    },
    "estAttendance": {
        type: String,
        label: "Estimated Attendance"
    },
    "audienceDescription": {
        type: String,
        label: "Audience Description"
    },
    "costBreakdown": {
        type: String,
        label: "Cost Breakdown"
    },
    "alternateFunding": {
        type: String,
        label: "Alternate Funding"
    },
    "receiptSubmitted": {
        type: Boolean,
        label: "Receipt Submitted"
    }
});

JCCCRequests.attachSchema(JCCCRequests.schema);

export { JCCCRequests };

Meteor.methods({
    'jccc-requests.insert'(formData) {
        JCCCRequests.schema.validate(formData);
        JCCCRequests.insert(formData);
    },
    'jccc-requests.update'(requestId, formData) {
        JCCCRequests.update({ _id: requestId }, { $set: formData });
    },
    'jccc-requests.drop'() {
        JCCCRequests.remove({});
    }
});
