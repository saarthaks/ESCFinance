import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var';

import './PGSmallRules.js';
import './PGContactForm.js';
import './PGProjectQuestions.js';

Template.PGSmallLayout.onCreated( function() {
    this.currentTab = new ReactiveVar("PGSmallRules");
    this.formError = new ReactiveVar(false);
    this.errorMessage = new ReactiveVar("");
    this.modalHeader = new ReactiveVar("");
    this.modalMessage = new ReactiveVar("");

    Session.set('pgform', initForm());
});

Template.PGSmallLayout.onDestroyed( function() {
    Session.set('pgform', initForm());
});

var initForm = function() {
    var fields = {
        'acceptTerms': null,
        'names': [null, null, null, null],
        'unis': [null, null, null, null],
        'emails': [null, null, null, null],
        'phones': [null, null, null, null],
        'schools': [null, null, null, null],
        'class': [null, null, null, null],
        'majors': [null, null, null, null],
        'projectName': null,
        'requestedAmount': null,
        'projectedCompletion': null,
        'projectDescription': null,
        'necessaryMaterials': null,
        'costBreakdown': null,
        'estimatedTimeline': null,
        'feasibility': null,
        'communityBenefit': null,
        'additionalInfo': null
    };

    return fields;
}

var saveFormSession = function(templateName) {
    switch (templateName) {
        case "PGSmallRules":
            var formFields = Session.get('pgform');
            formFields['acceptTerms'] = $("[name='acceptTerms']").is(':checked');
            Session.set('pgform', formFields);
            break;
        case "PGContactForm":
            var names = [];
            var unis = [];
            var emails = [];
            var phones = [];
            var schools = [];
            var classes = [];
            var majors = [];
            $('input[name="contactField"]').each( function() {
                const elem = $(this);
                const tag = elem.attr("id");
                if (tag.includes("name")) {
                    names.push(elem.val());
                } else if (tag.includes("uni")) {
                    unis.push(elem.val());
                } else if (tag.includes("email")) {
                    emails.push(elem.val());
                } else if (tag.includes("phone")) {
                    phones.push(elem.val());
                } else if (tag.includes("school")) {
                    schools.push(elem.val());
                } else if (tag.includes("class")) {
                    classes.push(elem.val());
                } else if (tag.includes("major")) {
                    majors.push(elem.val());
                }
            });
            var formFields = Session.get('pgform');
            formFields['names'] = names;
            formFields['unis'] = unis;
            formFields['emails'] = emails;
            formFields['phones'] = phones;
            formFields['schools'] = schools;
            formFields['class'] = classes;
            formFields['majors'] = majors;
            Session.set('pgform', formFields);
            break;
        case "PGProjectQuestions":
            var formFields = Session.get('pgform');
            formFields['projectName'] = $("[name='projectName']").val();
            formFields['requestedAmount'] = $("[name='requestedAmount']").val();
            formFields['projectedCompletion'] = $("[name='projectedCompletion']").val();
            formFields['projectDescription'] = $("[name='projectDescription']").val();
            formFields['necessaryMaterials'] = $("[name='necessaryMaterials']").val();
            formFields['costBreakdown'] = $("[name='costBreakdown']").val();
            formFields['estimatedTimeline'] = $("[name='estimatedTimeline']").val();
            formFields['feasibility'] = $("[name='feasibility']").val();
            formFields['communityBenefit'] = $("[name='communityBenefit']").val();
            formFields['additionalInfo'] = $("[name='additionalInfo']").val();
            Session.set('pgform', formFields);
            break;
        default:
            return undefined;
    }
}

var validateForm = function() {
    const formFields = Session.get('pgform');
    if (!formFields['acceptTerms']) {
        Template.instance().formError.set(true);
        return "AcceptError";
    }
    if (!!formFields['names'][0]
        && !!formFields['unis'][0]
        && !!formFields['emails'][0]
        && !!formFields['phones'][0]
        && !!formFields['schools'][0]
        && !!formFields['class'][0]
        && !!formFields['majors'][0]) {

            if (!!formFields['projectName']
                && !!formFields['requestedAmount']
                && !!formFields['projectedCompletion']
                && !!formFields['projectDescription']
                && !!formFields['necessaryMaterials']
                && !!formFields['costBreakdown']
                && !!formFields['estimatedTimeline']
                && !!formFields['feasibility']
                && !!formFields['communityBenefit']) {
                    Template.instance().formError.set(false);
                    return true
            } else {
                Template.instance().formError.set(true);
                return "ProjectError";
            }
    } else {
        Template.instance().formError.set(true);
        return "ContactError";
    }
    Template.instance().formError.set(true);
    return false;
}

var generateSummary = function(formFields) {
    const header = "Project Name: " + formFields['projectName'] + "\n"
        + "Requested Amount: " + formFields['requestedAmount'] + "\n"
        + "Projected Completion: " + formFields['projectedCompletion'] + "\n";

    var members = "";
    var num = formFields['names'].length;
    for (var i = 0; i < num; i++) {
        members = members + "Member: " + formFields['names'][i] + ", " + formFields['emails'][i] + ", " + formFields['class'][i] + "\n";
    }

    const qa = "Project Description: " + formFields['projectDescription'] + "\n"
        + "Necessary Materials: " + formFields['necessaryMaterials'] + "\n"
        + "Cost Breakdown: " + formFields['costBreakdown'] + "\n"
        + "Estimated Timeline: " + formFields['estimatedTimeline'] + "\n"
        + "Feasibility: " + formFields['feasibility'] + "\n"
        + "Community Benefit: " + formFields['communityBenefit'] + "\n"
        + "Additional Info: " + formFields['additionalInfo'] + "\n";

    const body = header + "\n" + members + "\n" + qa;

    return body;
}

var sendEmails = function(formFields) {
    // send email to applicant
    var to = formFields['emails'][0];
    const from = "ESC Finance Committee <ss4754@columbia.edu>";
    const cc = "ss4754@columbia.edu";
    var subject = "ESC Project Grant Application: Next Steps";
    var body = "Hi!\n\n"
         + "Thank you for beginning your ESC Project Grant! There are still a few parts to the application, so please make sure you’ve completed the following instructions by 11:59pm, October 27th, to be considered in time.\n\n"
         + "Instructions: \n"
         + "1. Visit the following links to generate your budget and presentation templates:\n"
         + "https://docs.google.com/a/columbia.edu/spreadsheets/d/1bsLQc0V0rSFqgfxn1grM6i7FGbtC7BScnycY4HcV_Lk/copy\n"
         + "https://docs.google.com/presentation/d/16SeU_9bi50uQrdl9JLrMWQHZOCsQpkexTO1q_g7wSUU/copy\n"
         + "2. Share the documents with us at ss4754@columbia.edu as well as with the rest of your teammates.\n"
         + "3. Fill in the templates! If you have any questions, feel free to reach out to us at ss4754@columbia.edu and we will help as best we can.\n"
         + "3. Share the documents with us at ss4754@columbia.edu and with your club advisor.\n"
         + "4. Sign up for a presentation slot here:\n"
         + "https://docs.google.com/a/columbia.edu/spreadsheets/d/1BDy05XKuAcDtB4BnWNoQ2W1aUXt07N5GD7TeFDl0BOo/edit?usp=sharing\n\n"
         + "Good luck, and we look forward to reviewing your application!\n\n"
         + "Best Regards,\n"
         + "ESC Finance\n";
    Meteor.call('sendEmailWithCC', to, from, subject, body, cc);

    // send receipt back to me
    to = "ss4754@columbia.edu";
    subject = "[ESC] Small Scale Project Grant Receipt";
    body = generateSummary(formFields);

    Meteor.call('sendEmail', to, from, subject, body)
}

var submitPGForm = function() {
    saveFormSession(Template.instance().currentTab.get());
    const formValidity = validateForm();
    console.log(formValidity);
    const messages = [];
    if (formValidity === true) {
        Template.instance().errorMessage.set("");
        try {
            sendEmails(Session.get('pgform'));

            Template.instance().modalHeader.set("Success!");
            Template.instance().modalMessage.set("You should receive an email with your next steps from us soon. If you don't, please reach out to ss4754@columbia.edu.");
            $('.ui.modal').modal({inverted: true}).modal('show');
            Meteor.setTimeout(() => {
                $('.ui.modal').modal('hide');
                FlowRouter.go('/project-grant');
            }, 5000);
        } catch(e) {
            console.log(e);

            Template.instance().modalHeader.set("Error");
            Template.instance().modalMessage.set("There was an error processing your application. Please reach out to ss4754@columbia.edu with your issue.");
            $('.ui.modal').modal({inverted: true}).modal('show');
            Meteor.setTimeout(() => {
                $('.ui.modal').modal('hide');
            }, 5000);
        }
    } else if (formValidity === "AcceptError") {
        Template.instance().errorMessage.set("Looks like you missed a field in the Rules page! Please complete that page to continue.");
        return false;
    } else if (formValidity === "ContactError") {
        Template.instance().errorMessage.set("Looks like you missed a field in the Contacts page! Please complete that page to continue.");
        return false;
    } else if (formValidity === "ProjectError") {
        Template.instance().errorMessage.set("Looks like you missed a field in the Project page! Please complete that page to continue.");
    }
}

Template.PGSmallLayout.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    },
    tabData: function() {
        switch (Template.instance().currentTab.get()) {
            case "PGSmallRules":
                return undefined;
                break;
            case "PGContactForm":
                return { "max_team_size" : 4 };
                break;
            case "PGProjectQuestions":
                return undefined;
                break;
            default:
                return undefined;
        }
    },
    rules: function() {
        return Template.instance().currentTab.get() === "PGSmallRules";
    },
    contact: function() {
        return Template.instance().currentTab.get() === "PGContactForm";
    },
    questions: function() {
        return Template.instance().currentTab.get() === "PGProjectQuestions";
    },
    hasError: function() {
        return Template.instance().formError.get();
    },
    modalHeader: function() {
        return Template.instance().modalHeader.get();
    },
    modalMessage: function() {
        return Template.instance().modalMessage.get();
    },
    errorMessages: function() {
        return Template.instance().errorMessage.get();
    }
});

Template.PGSmallLayout.events({
    'click': function(e, template) {
        var cTab = undefined;
        if (e.target.id === "form-step") {
            cTab = $(e.target)
        } else if ($(e.target).parents("a#form-step").size()) {
            cTab = $(e.target).parents("a#form-step");
        } else {
            return;
        }
        saveFormSession(Template.instance().currentTab.get());

        $('.active').removeClass('active');
        cTab.addClass('active');
        Template.instance().currentTab.set(cTab.data('template'));
        console.log(Template.instance().currentTab.get());
    },
    'submit form': function(e, template) {
        e.preventDefault();
        submitPGForm();
        console.log(Template.instance().errorMessage.get());
        return false;
    }
});
