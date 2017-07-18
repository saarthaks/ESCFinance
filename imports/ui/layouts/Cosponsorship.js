import { Template } from 'meteor/templating';

Template.CosponsorshipLayout.rendered = function() {
    this.$('#recip-drop.ui.multiple.selection.scrolling.dropdown').dropdown();
};

