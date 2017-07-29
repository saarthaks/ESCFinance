import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const JCCCSettingsDB = new Mongo.Collection('jccc-settings');
JCCCSettingsDB.schema = new SimpleSchema({
    "pocEmail": {
        type: String,
        label: "JCCC Point of Contact Email"
    },
    "emailTag": {
        type: String,
        label: "JCCC Email Subject Tag"
    },
    "formStatus": {
        type: Boolean,
        label: "JCCC Form Status"
    }
});

JCCCSettingsDB.attachSchema(JCCCSettingsDB.schema);

export { JCCCSettingsDB };
