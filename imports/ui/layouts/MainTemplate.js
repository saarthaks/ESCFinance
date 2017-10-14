import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Meteor.subscribe('userData');

Template.MainLayout.rendered = function() {
    $('#funding-drop.ui.dropdown.item').dropdown();
    $('#jccc-drop.ui.dropdown.item').dropdown();
    $('#pg-drop.ui.dropdown.item').dropdown();
}
