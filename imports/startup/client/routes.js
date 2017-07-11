FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('HomeLayout');
    }
});
FlowRouter.route('/funding-resources', {
    name: 'funding-resources',
    action() {
        BlazeLayout.render('FundingLayout');
    }
});
FlowRouter.route('/funding-resources/cosponsorship', {
    name: 'cosponsorship',
    action() {
        BlazeLayout.render('CosponsorshipLayout');
    }
});
FlowRouter.route('/funding-resources/library', {
    name: 'resource-library',
    action() {
        BlazeLayout.render('LibraryLayout');
    }
});
FlowRouter.route('/fcu', {
    name: 'fcu',
    action() {
        BlazeLayout.render('FCULayout');
    }
});
FlowRouter.route('/fcu/results', {
    name: 'fcu-results',
    action() {
        BlazeLayout.render('FCUResultsLayout');
    }
});
FlowRouter.route('/jccc', {
    name: 'jccc',
    action() {
        BlazeLayout.render('JCCCLayout');
    }
});
FlowRouter.route('/jccc/apply', {
    name: 'jccc-apply',
    action() {
        BlazeLayout.render('JCCCApplyLayout');
    }
});
FlowRouter.route('/jccc/constitution', {
    name: 'jccc-constitution',
    action() {
        BlazeLayout.render('ConstitutionLayout');
    }
});
FlowRouter.route('/jccc/results', {
    name: 'jccc-results',
    action() {
        BlazeLayout.render('JCCCResultsLayout');
    }
});

FlowRouter.route('/jccc/admin-console', {
    name: 'jccc-admin',
    action() {
        BlazeLayout.render('JCCCAdminLayout');
    }
});
FlowRouter.route('/cif', {
    name: 'cif',
    action() {
        BlazeLayout.render('CIFLayout');
    }
});
FlowRouter.route('/cif/apply', {
    name: 'cif-apply',
    action() {
        BlazeLayout.render('CIFApplyLayout');
    }
});
FlowRouter.route('/cif/results', {
    name: 'cif-results',
    action() {
        BlazeLayout.render('CIFResultsLayout');
    }
});
FlowRouter.route('/project-grant', {
    name: 'project-grant',
    action() {
        BlazeLayout.render('PGLayout');
    }
});
FlowRouter.route('/project-grant/small-application', {
    name: 'pg-small',
    action() {
        BlazeLayout.render('PGSmallLayout');
    }
});
FlowRouter.route('/project-grant/large-application', {
    name: 'pg-large',
    action() {
        BlazeLayout.render('PGLargeLayout');
    }
});
FlowRouter.route('/project-grant/past', {
    name: 'pg-past-projects',
    action() {
        BlazeLayout.render('PGPastLayout');
    }
});
FlowRouter.route('/project-grant/current', {
    name: 'pg-current-projects',
    action() {
        BlazeLayout.render('PGCurrentLayout');
    }
});
FlowRouter.route('/project-grant/hub', {
    name: 'pg-hub',
    action() {
        BlazeLayout.render('PGHubLayout');
    }
});
FlowRouter.route('/project-grant/admin-console', {
    name: 'pg-admin',
    action() {
        BlazeLayout.render('PGAdminLayout');
    }
});
FlowRouter.route('/login', {
    name: 'login',
    action() {
        BlazeLayout.render('LoginLayout');
    }
});

