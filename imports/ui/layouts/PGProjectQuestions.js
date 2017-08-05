import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

import './PGProjectQuestionsTemplate.html';

Template.PGProjectQuestions.rendered = function() {
    const formFields = Session.get('pgsmallform')
    initFields(formFields);
};

var initFields = function(fields) {
    $("[name='projectName']").val(fields['projectName']);
    $("[name='requestedAmount']").val(fields['requestedAmount'] );
    $("[name='projectedCompletion']").val(fields['projectedCompletion']);
    $("[name='projectDescription']").val(fields['projectDescription']);
    $("[name='necessaryMaterials']").val(fields['necessaryMaterials']);
    $("[name='costBreakdown']").val(fields['costBreakdown']);
    $("[name='estimatedTimeline']").val(fields['estimatedTimeline']);
    $("[name='feasibility']").val(fields['feasibility']);
    $("[name='communityBenefit']").val(fields['communityBenefit']);
    $("[name='additionalInfo']").val(fields['additionalInfo']);
}
