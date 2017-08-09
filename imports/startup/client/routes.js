import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/main.html';
import '../../ui/layouts/MainLayout.html';
import '../../ui/layouts/GeneralInfoLayout.html';
import '../../ui/layouts/FundingLayout.html';
import '../../ui/layouts/LibraryLayout.html';
import '../../ui/layouts/FCULayout.html';
import '../../ui/layouts/FCUResultsLayout.html';
import '../../ui/layouts/JCCCLayout.html';
import '../../ui/layouts/ConstitutionLayout.html';
import '../../ui/layouts/JCCCResultsLayout.html';
import '../../ui/layouts/JCCCAdminLayout.html';
import '../../ui/layouts/CIFLayout.html';
import '../../ui/layouts/CIFApplyLayout.html';
import '../../ui/layouts/CIFResultsLayout.html';
import '../../ui/layouts/PGLayout.html';
import '../../ui/layouts/PGPastLayout.html';
import '../../ui/layouts/PGCurrentLayout.html';
import '../../ui/layouts/PGSmallLayout.html';
import '../../ui/layouts/PGLargeLayout.html';
import '../../ui/layouts/PGHubLayout.html';
import '../../ui/layouts/PGAdminLayout.html';
import '../../ui/layouts/LoginLayout.html';

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
        BlazeLayout.render('MainLayout', {body: 'LibraryLayout'});
    }
});

var fcu = FlowRouter.group({
    prefix: '/fcu'
});
fcu.route('/', {
    name: 'fcu',
    action() {
        BlazeLayout.render('MainLayout', {body: 'FCULayout'});
    }
});
fcu.route('/results', {
    name: 'fcu-results',
    action() {
        BlazeLayout.render('MainLayout', {body: 'FCUResultsLayout'});
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
        BlazeLayout.render('MainLayout', {body: 'CIFLayout'});
    }
});
cif.route('/apply', {
    name: 'cif-apply',
    action() {
        BlazeLayout.render('MainLayout', {body: 'CIFApplyLayout'});
    }
});
cif.route('/results', {
    name: 'cif-results',
    action() {
        BlazeLayout.render('MainLayout', {body: 'CIFResultsLayout'});
    }
});


var projectgrant = FlowRouter.group({
    prefix: '/project-grant'
});
projectgrant.route('/', {
    name: 'project-grant',
    action() {
        BlazeLayout.render('MainLayout', {body: 'PGLayout'});
    }
});
projectgrant.route('/small-application', {
    name: 'pg-small',
    action() {
        BlazeLayout.render('MainLayout', {body: 'PGSmallLayout'});
    }
});
projectgrant.route('/large-application', {
    name: 'pg-large',
    action() {
        BlazeLayout.render('MainLayout', {body: 'PGLargeLayout'});
    }
});
projectgrant.route('/past', {
    name: 'pg-past-projects',
    action() {
        BlazeLayout.render('MainLayout', {body: 'PGPastLayout'});
    }
});
projectgrant.route('/current', {
    name: 'pg-current-projects',
    action() {
        BlazeLayout.render('MainLayout', {body: 'PGCurrentLayout'});
    }
});
projectgrant.route('/hub', {
    name: 'pg-hub',
    action() {
        BlazeLayout.render('MainLayout', {body: 'PGHubLayout'});
    }
});
projectgrant.route('/admin-console', {
    name: 'pg-admin',
    action() {
        BlazeLayout.render('MainLayout', {body: 'PGAdminLayout'});
    }
});
FlowRouter.route('/login', {
    name: 'login',
    action() {
        BlazeLayout.render('MainLayout', {body: 'LoginLayout'});
    }
});

