import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const PGBudgets = new Mongo.Collection('pg-budgets');

const BudgetItem = new SimpleSchema({
    "itemName": {type: String, label: "Budget Item Name"},
    "websiteLink": {type: String, label: "Budget Item Link"},
    "distributor": {type: String, label: "Budget Item Distributor"},
    "unitPrice": {type: Number, label: "Budget Item Unit Price", decimal: true},
    "quantity": {type: Number, label: "Budget Item Quantity"},
    "cost": {type: Number, label: "Budget Item Total Cost", decimal: true},
    "shippingCost": {type: Number, label: "Budget Item S/H", decimal: true, optional: true}
})

PGBudgets.schema = new SimpleSchema({
    "teamID": {
        type: String,
        label: "PG Team ID"
    },
    "monthlyBudget": {
        type: [[BudgetItem]],
        label: "PG Monthly Budget"
    },
    "amountSpent": {
        type: Number,
        label: "PG Project Amount Spent",
        decimal: true
    }
});

PGBudgets.attachSchema(PGBudgets.schema);

export { PGBudgets };

Meteor.methods({
    'pg-budgets.insert'(formData) {
        PGBudgets.schema.validate(formData);
        PGBudgets.insert(formData);
    },
    'pg-budgets.update'(settingId, formData) {
        PGBudgets.update({ _id: settingId }, { $set: formData });
    }
});
