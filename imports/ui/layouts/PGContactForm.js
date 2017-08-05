import { Template } from 'meteor/templating';

import './PGContactFormTemplate.html';

Template.PGContactForm.rendered = function() {
    $('.ui.selection.dropdown').dropdown();
    const formFields = Session.get('pgform')
    initFields(formFields);
}

var initFields = function(fields) {
    var name_idx = 0;
    var uni_idx = 0;
    var email_idx = 0;
    var phone_idx = 0;
    var school_idx = 0;
    var class_idx = 0;
    var major_idx = 0;
    $('input[name="contactField"]').each( function() {
        const elem = $(this);
        const tag = elem.attr("id");
        if (tag.includes("name")) {
            elem.val(fields['names'][name_idx]);
            name_idx++;
        } else if (tag.includes("uni")) {
            elem.val(fields['unis'][uni_idx]);
            uni_idx++;
        } else if (tag.includes("email")) {
            elem.val(fields['emails'][email_idx]);
            email_idx++;
        } else if (tag.includes("phone")) {
            elem.val(fields['phones'][phone_idx]);
            phone_idx++;
        } else if (tag.includes("school")) {
            elem.val(fields['schools'][school_idx]).change();
            school_idx++;
        } else if (tag.includes("class")) {
            elem.val(fields['class'][class_idx]).change();
            class_idx++;
        } else if (tag.includes("major")) {
            elem.val(fields['majors'][major_idx]);
            major_idx++;
        }
    });
}

Template.PGContactForm.helpers({
    one_num: function(index) {
        return (index + 1).toString();
    },
    rec_num: function() {
        return (Template.instance().data["max_team_size"] / 2).toString();
    },
    contact_num: function() {
        return [...Array(Template.instance().data["max_team_size"]).keys()];
    },
    name: function(index) {
        return "name" + index.toString();
    },
    uni: function(index) {
        return "uni" + index.toString();
    },
    email: function(index) {
        return "email" + index.toString();
    },
    phone: function(index) {
        return "phone" + index.toString();
    },
    school: function(index) {
        return "school" + index.toString();
    },
    class: function(index) {
        return "class" + index.toString();
    },
    major: function(index) {
        return "major" + index.toString();
    }
});
