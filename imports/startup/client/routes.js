import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';

import '../../ui/main.html';
import '../../ui/layouts/MainLayout.html';
import '../../ui/layouts/GeneralInfoLayout.html';
import '../../ui/layouts/FundingLayout.html';
import '../../ui/layouts/LibraryLayout.html';
import '../../ui/layouts/FCULayout.html';
import '../../ui/layouts/FCUResultsLayout.html';
import '../../ui/layouts/JCCC/JCCCLayout.html';
import '../../ui/layouts/JCCC/ConstitutionLayout.html';
import '../../ui/layouts/JCCC/JCCCResultsLayout.html';
import '../../ui/layouts/JCCC/AdminConsole/JCCCAdminLayout.html';
import '../../ui/layouts/CIFLayout.html';
import '../../ui/layouts/CIFApplyLayout.html';
import '../../ui/layouts/CIFResultsLayout.html';
import '../../ui/layouts/PG/PGLayout.html';
import '../../ui/layouts/PG/PGPastLayout.html';
import '../../ui/layouts/PG/PGCurrentLayout.html';
import '../../ui/layouts/PG/Applications/PGSmallLayout.html';
import '../../ui/layouts/PG/Applications/PGLargeLayout.html';
import '../../ui/layouts/PG/TeamConsole/PGHubLayout.html';
import '../../ui/layouts/PG/AdminConsole/PGAdminLayout.html';
import '../../ui/layouts/LoginLayout.html';

const userCollection = Meteor.subscribe('userData');

FlowRouter.wait();

Tracker.autorun(() => {
    console.log('autorunning');
    if (userCollection.ready() && !FlowRouter._initialized) {
        FlowRouter.initialize();
    }
})

FlowRouter.route('/', {
    name: 'main',
    action() {
        BlazeLayout.render('MainLayout', {body: 'GeneralInfoLayout'});
    }
});

var fresources = FlowRouter.group({
    prefix: '/funding-resources'
});
fresources.route('/', {
    name: 'funding-resources',
    action() {
        BlazeLayout.render('MainLayout', {body: 'FundingLayout'});
    }
});
fresources.route('/cosponsorship', {
    name: 'cosponsorship',
    action() {
        BlazeLayout.render('MainLayout', {body: 'CosponsorshipLayout'});
    }
});
fresources.route('/library', {
    name: 'resource-library',
    action() {
        FlowRouter.go('/');
        // BlazeLayout.render('MainLayout', {body: 'LibraryLayout'});
    }
});

var fcu = FlowRouter.group({
    prefix: '/fcu'
});
fcu.route('/', {
    name: 'fcu',
    action() {
        FlowRouter.go('/');
        // BlazeLayout.render('MainLayout', {body: 'FCULayout'});
    }
});
fcu.route('/results', {
    name: 'fcu-results',
    action() {
        FlowRouter.go('/');
        // BlazeLayout.render('MainLayout', {body: 'FCUResultsLayout'});
    }
});

var jccc = FlowRouter.group({
    prefix: '/jccc'
});
jccc.route('/', {
    name: 'jccc',
    action() {
        BlazeLayout.render('MainLayout', {body: 'JCCCLayout'});
    }
});
jccc.route('/apply', {
    name: 'jccc-apply',
    action() {
        BlazeLayout.render('MainLayout', {body: 'JCCCApplyLayout'});
    }
});
jccc.route('/constitution', {
    name: 'jccc-constitution',
    action() {
        BlazeLayout.render('MainLayout', {body: 'ConstitutionLayout'});
    }
});
jccc.route('/results', {
    name: 'jccc-results',
    action() {
        BlazeLayout.render('MainLayout', {body: 'JCCCResultsLayout'});
    }
});
jccc.route('/admin-console', {
    name: 'jccc-admin',
    triggersEnter: [(context, redirect) => {
        if (!Meteor.user() || !Meteor.user().isAdmin) {
            Session.set('redirectURI', '/jccc/admin-console');
            console.log(Session.get('redirectURI'));
            redirect('/login');
        }
    }],
    action() {
        BlazeLayout.render('MainLayout', {body: 'JCCCAdminLayout'});
    }
});

var cif = FlowRouter.group({
    prefix: '/cif'
});
cif.route('/', {
    name: 'cif',
    action() {
        FlowRouter.go('/');
        // BlazeLayout.render('MainLayout', {body: 'CIFLayout'});
    }
});
cif.route('/apply', {
    name: 'cif-apply',
    action() {
        FlowRouter.go('/');
        // BlazeLayout.render('MainLayout', {body: 'CIFApplyLayout'});
    }
});
cif.route('/results', {
    name: 'cif-results',
    action() {
        FlowRouter.go('/');
        // BlazeLayout.render('MainLayout', {body: 'CIFResultsLayout'});
    }
});


var projectgrant = FlowRouter.group({
    prefix: '/project-grant'
});
projectgrant.route('/', {
    name: 'project-grant',
    action() {
        // FlowRouter.go('/');
        BlazeLayout.render('MainLayout', {body: 'PGLayout'});
    }
});
projectgrant.route('/small', {
    name: 'pg-small',
    action() {
        // FlowRouter.go('/');
        BlazeLayout.render('MainLayout', {body: 'PGSmallLayout'});
    }
});
projectgrant.route('/large', {
    name: 'pg-large',
    action() {
        // FlowRouter.go('/');
        BlazeLayout.render('MainLayout', {body: 'PGLargeLayout'});
    }
});
projectgrant.route('/past', {
    name: 'pg-past-projects',
    action() {
        FlowRouter.go('/');
        // BlazeLayout.render('MainLayout', {body: 'PGPastLayout'});
    }
});
projectgrant.route('/current', {
    name: 'pg-current-projects',
    action() {
        FlowRouter.go('/');
        // BlazeLayout.render('MainLayout', {body: 'PGCurrentLayout'});
    }
});
projectgrant.route('/hub', {
    name: 'pg-hub',
    // triggersEnter: [(context, redirect) => {
    //     if (!Meteor.user()) {
    //         redirect('/login');
    //     }
    // }],
    action() {
        // FlowRouter.go('/');
        BlazeLayout.render('MainLayout', {body: 'PGHubLayout'});
    }
});
projectgrant.route('/admin-console', {
    name: 'pg-admin',
    // triggersEnter: [(context, redirect) => {
    //     if (!Meteor.user() || !Meteor.user().isAdmin) {
    //         redirect('/login');
    //     }
    // }],
    action() {
        // FlowRouter.go('/');
        BlazeLayout.render('MainLayout', {body: 'PGAdminLayout'});
    }
});
FlowRouter.route('/login', {
    name: 'login',
    action() {
        BlazeLayout.render('MainLayout', {body: 'LoginLayout'});
    }
});

FlowRouter.notFound = {
    action: function() {
        FlowRouter.go('/');
        console.log('route not found');
    }
}
