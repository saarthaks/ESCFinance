import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var'

const validationRules = {
    applicantName: {
        identifier: 'applicantName',
        rules: [{ type: 'empty', prompt: "Please enter your name"}]
    },
    applicantEmail: {
        identifier: 'applicantEmail',
        rules: [{ type: 'email', prompt: "Please enter a valid email"}]
    },
    studentGroup: {
        identifier: 'studentGroup',
        rules: [{ type: 'empty', prompt: "Please enter the name of your student group"}]
    },
    escRecipient: {
        identifier: 'escRecipient',
        rules: [{ type: 'minCount[1]', prompt: "Please select at least one ESC cosponsor"},
                { type: 'maxCount[6]', prompt: "Please don't send this request to everyone"}]
    },
    proposal: {
        identifier: 'proposal',
        rules: [{ type: 'minLength[10]', prompt: "Please give a more complete description of your request"}]
    }
};

var submitForm = function(template) {
    $('.ui.form').form({ fields: validationRules, inline: true });
    
    if( $('.ui.form').form('is valid') ) {
        const data = $('.ui.form').form('get values');
        $('.ui.attached.message').addClass('positive');
        template.helper_text.set("Hooray! You should hear from us soon.")
        console.log(data);
        $('.ui.form').form('clear');
    } else {
        $('.ui.form').form('validate form');
    }
}

Template.CosponsorshipLayout.onCreated(function() {
    this.helper_text = new ReactiveVar("Fill out this form and we'll get in touch with you ASAP!");
});

Template.CosponsorshipLayout.helpers({
    messageText: function() {
        return Template.instance().helper_text.get();
    }
});

Template.CosponsorshipLayout.events({
    'submit form': function(e, template) {
        e.preventDefault();
        submitForm(template);
        return false;
    }
});

Template.CosponsorshipLayout.rendered = function() {
    this.$('#recip-drop.ui.multiple.selection.scrolling.dropdown').dropdown();
};
