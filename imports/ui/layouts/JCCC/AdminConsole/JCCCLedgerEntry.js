import { Template } from 'meteor/templating';

import './JCCCLedgerEntryTemplate.html';

Template.JCCCLedgerEntry.helpers({
    rowColor: function() {
        return Template.instance().data.entryName === "Deposit" ? "positive" : "negative";
    }
})
