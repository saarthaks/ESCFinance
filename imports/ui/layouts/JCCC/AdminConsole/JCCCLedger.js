import { Template } from 'meteor/templating';

import { JCCCFinances } from '../../../../api/jccc-finances.js';
import { JCCCRequests } from '../../../../api/jccc-requests.js';

import './JCCCLedgerTemplate.html';
import './JCCCLedgerEntry.js';

Template.JCCCLedger.onCreated( function() {
    Meteor.subscribe('jccc-finances');
    Meteor.subscribe('jccc-requests');

    this.CCApproved = new ReactiveVar(0.00);
    this.CCReceipted = new ReactiveVar(0.00);
    this.SEASApproved = new ReactiveVar(0.00);
    this.SEASReceipted = new ReactiveVar(0.00);
    this.GSApproved = new ReactiveVar(0.00);
    this.GSReceipted = new ReactiveVar(0.00);
    this.BCApproved = new ReactiveVar(0.00);
    this.BCReceipted = new ReactiveVar(0.00);
});

Template.JCCCLedger.helpers({
    notEmpty: function() {
        return JCCCFinances.find().count() > 0;
    },
    entries: function() {
        const entries = JCCCFinances.find().fetch();
        var totaledEntries = [];
        var lastCCApp = 0;
        var lastCCRec = 0;
        var lastSEASApp = 0;
        var lastSEASRec = 0;
        var lastGSApp = 0;
        var lastGSRec = 0;
        var lastBCApp = 0;
        var lastBCRec = 0;
        for (i in entries) {
            var entry = entries[i];
            var data = {}
            data["updatedDate"] = entry.date.toISOString().slice(0, 10);
            data["entryName"] = entry.applicationName;

            const sign = entry.applicationName === "Deposit" ? 1 : -1;
            lastCCApp = lastCCApp + sign*entry.ccTransaction;
            lastSEASApp = lastSEASApp + sign*entry.seasTransaction;
            lastGSApp = lastGSApp + sign*entry.gsTransaction;
            lastBCApp = lastBCApp + sign*entry.bcTransaction;
            data["ccApproved"] = lastCCApp;
            data["seasApproved"] = lastSEASApp;
            data["gsApproved"] = lastGSApp;
            data["bcApproved"] = lastBCApp;

            const receipt = entry.receiptAmount > 0.0 ? 1 : 0;
            lastCCRec = lastCCRec + sign*receipt*entry.ccTransaction;
            lastSEASRec = lastSEASRec + sign*receipt*entry.seasTransaction;
            lastGSRec = lastGSRec + sign*receipt*entry.gsTransaction;
            lastBCRec = lastBCRec + sign*receipt*entry.bcTransaction;
            data["ccReceipted"] = lastCCRec;
            data["seasReceipted"] = lastSEASRec;
            data["gsReceipted"] = lastGSRec;
            data["bcReceipted"] = lastBCRec;

            totaledEntries.push(data);
        }
        Template.instance().CCApproved.set(lastCCApp);
        Template.instance().CCReceipted.set(lastCCRec);
        Template.instance().SEASApproved.set(lastSEASApp);
        Template.instance().SEASReceipted.set(lastSEASRec);
        Template.instance().GSApproved.set(lastGSApp);
        Template.instance().GSReceipted.set(lastGSRec);
        Template.instance().BCApproved.set(lastBCApp);
        Template.instance().BCReceipted.set(lastBCRec);
        return totaledEntries;
    },
    ccRemaining: function() {
        return Template.instance().CCApproved.get();
    },
    ccReceiptRemaining: function() {
        return Template.instance().CCReceipted.get();
    },
    seasRemaining: function() {
        return Template.instance().SEASApproved.get();
    },
    seasReceiptRemaining: function() {
        return Template.instance().SEASReceipted.get();
    },
    gsRemaining: function() {
        return Template.instance().GSApproved.get();
    },
    gsReceiptRemaining: function() {
        return Template.instance().GSReceipted.get();
    },
    bcRemaining: function() {
        return Template.instance().BCApproved.get();
    },
    bcReceiptRemaining: function() {
        return Template.instance().BCReceipted.get();
    }
})
