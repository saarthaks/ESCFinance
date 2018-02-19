import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const PGRequests = new Mongo.Collection('pg-requests');

PGRequests.schema = new SimpleSchema({
    "fbLink": {
        type: String,
        label: "Request FB Link"
    },
    "requestMonth": {
        type: String,
        label: "Request Month"
    },
    "teamName": {
        type: String,
        label: "Request Team ID"
    },
    "itemName": {
        type: String,
        label: "Request Item Name"
    },
    "websiteLink": {
        type: String,
        label: "Request Item Link"
    },
    "distributor": {
        type: String,
        label: "Request Item Distributor"
    },
    "unitPrice": {
        type: Number,
        label: "Request Item Unit Price",
        decimal: true
    },
    "quantity": {
        type: Number,
        label: "Request Item Quantity"
    },
    "cost": {
        type: Number,
        label: "Request Item Total Cost",
        decimal: true
    },
    "shippingCost": {
        type: Number,
        label: "Request Item S/H",
        decimal: true,
        optional: true
    },
    "complete": {
        type: Boolean,
        label: "Request Complete"
    }
});

PGRequests.attachSchema(PGRequests.schema);

export { PGRequests };

if (Meteor.isServer) {
    Meteor.publish('pg-requests', function PGRequestsPublication() {
        return PGRequests.find();
    });
}

Meteor.methods({
    'pg-requests.insert'(formData) {
        PGRequests.schema.validate(formData);
        PGRequests.insert(formData);
        console.log('inserted');
    },
    'pg-requests.update'(settingId, formData) {
        PGRequests.update({ _id: settingId }, { $set: formData });
    },
    'pg-requests.remove'(team, link) {
        PGRequests.remove({ teamName: team, websiteLink: link });
    }
});
