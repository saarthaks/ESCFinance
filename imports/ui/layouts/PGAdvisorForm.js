import {Template} from 'meteor/templating';
import { Session } from 'meteor/session'

import './PGAdvisorFormTemplate.html';

Template.PGAdvisorForm.rendered = function() {
    const formFields = Session.get('pgform')
    initFields(formFields);
};

var initFields = function(fields) {
    $("[name='advisorName']").val(fields['advisorName']);
    $("[name='advisorTitle']").val(fields['advisorTitle'] );
    $("[name='advisorEmail']").val(fields['advisorEmail']);
    $("[name='advisorExperience']").val(fields['advisorExperience']);
    $("[name='advisorAssistance']").val(fields['advisorAssistance']);
}
