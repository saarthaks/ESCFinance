import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

import './PGSmallRulesTemplate.html';

Template.PGSmallRules.rendered = function() {
    const formFields = Session.get('pgsmallform')
    initFields(formFields);
};

var initFields = function(fields) {
    const checkboxStatus = !!fields["acceptTerms"];
    console.log('Loading Status: ' + checkboxStatus.toString());
    $("[name='acceptTerms']").prop("checked", checkboxStatus);
}
