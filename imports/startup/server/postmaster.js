import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { SyncedCron } from 'meteor/percolate:synced-cron'

futureEmails = new Meteor.Collection('future-emails');

function send(details) {
    Meteor.defer(() => {
        Email.send({
            to: details.to,
            from: details.from,
            subject: details.subject,
            text: details.text,
            cc: details.cc
        });
    });
}

function addEmail(id, details) {
    SyncedCron.add({
        name: id,
        schedule: function(parser) {
            return parser.recur().on(details.date).fullDate();
        },
        job: function() {
            send(details);
            futureEmails.remove(id);
            SyncedCron.remove(id);
            return id;
        }

    });
}

function scheduleMail(details) {

    if (details.date < new Date()) {
        send(details);
    } else {
        var thisId = futureEmails.insert(details);
        addEmail(thisId, defails);
    }
    return true;
}

futureEmails.find().forEach(function(mail) {
    if (mail.date < new Date()) {
        send(mail);
    } else {
        addEmail(mail._id, mail);
    }
});

SyncedCron.start();

Meteor.methods({
    sendEmail(to, from, subject, text) {
        check([to, from, subject, text], [String]);

        Meteor.defer(() => {
            Email.send({
                to: to,
                from: from,
                subject: subject,
                text: text
            });
        });
    },
    sendEmailWithCC(to, from, subject, text, cc) {
        check([to, from, subject, text, cc], [String]);

        Meteor.defer(() => {
            Email.send({
                to: to,
                from: from,
                subject: subject,
                text: text,
                cc: cc
            });
        });
    },
    scheduleMail(details) {
        if (details.date < new Date()) {
            send(details);
        } else {
            var thisId = futureEmails.insert(details);
            addEmail(thisId, details);
        }
        return true;
    }
});
