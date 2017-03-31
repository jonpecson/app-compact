'use strict';
angular.module('app').run(['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function() {
            window.scrollTo(0, 0);
        });
        FastClick.attach(document.body);
    },
]).config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // For unmatched routes
        $urlRouterProvider.otherwise('/');
        // Application routes
        $stateProvider.state('app', {
            abstract: true,
            templateUrl: 'views/common/layout.html',
        }).state('app.dashboard', {
            url: '/',
            templateUrl: 'views/dashboard.html'

        })

        // Journals

        .state('app.journals', {
            template: '<div ui-view></div>',
            abstract: true,
            url: '/app',
        }).state('app.journals.all', {
            url: '/journals/all',
            templateUrl: 'app/journals/journals.all.html',

            controller: "journalsCtrl as vm"

        }).state('app.journals.add', {
            url: '/journals/add',
            templateUrl: 'app/journals/journals.add.html',

            controller: "journalsAddCtrl as vm"

        }).state('app.journals.addVoucher', {
            url: '/journals/addVoucher',
            templateUrl: 'app/journals/voucher.add.html',
            controller: "voucherAddCtrl as vm"

        })

        // Contacts
        .state('app.contacts', {
            template: '<div ui-view></div>',
            abstract: true,
            url: '/app',
        }).state('app.contacts.all', {
            url: '/contacts/all',
            templateUrl: 'app/contacts/contacts.all.html',

            controller: "contactsCtrl as vm"

        }).state('app.contacts.add', {
            url: '/contacts/add',
            templateUrl: 'app/contacts/contacts.add.html',

            controller: "contactsCtrlAddCtrl as vm"

        })


        // Chart of Accounts
        .state('app.chartofaccounts', {
            template: '<div ui-view></div>',
            abstract: true,
            url: '/app',
        }).state('app.chartofaccounts.all', {
            url: '/chartofaccounts/all',
            templateUrl: 'app/chartofaccounts/chartofaccounts.all.html',

            controller: "chartOfAccountsCtrl as vm"

        }).state('app.chartofaccounts.add', {
            url: '/chartofaccounts/add',
            templateUrl: 'app/chartofaccounts/chartofaccounts.add.html',

            controller: "chartOfAccountsCtrlAddCtrl as vm"

        })





        //Reports routes

        .state('app.reports.report', {
            url: '/report',
            templateUrl: 'app/reports/report/report.html',

            controller: "reportCtrl as vm"
        })

        // Reportings

        .state('app.reports', {
            template: '<div ui-view></div>',
            abstract: true,
            url: '/reports',
        })

        // 1. Trial Balance
        .state('app.reports.trial-balance', {
            url: '/trial-balance',
            templateUrl: 'app/reports/trial-balance/trial-balance.html',

            controller: "trialBalanceCtrl as vm"

        })

        // 2. Profit/Loss
        .state('app.reports.profit-loss', {
            url: '/profit-loss',
            templateUrl: 'app/reports/profit-loss/profit-loss.html',

            controller: "profitLossCtrl as vm"

        })

        // 3. General Ledger
        .state('app.reports.general-ledger', {
            url: '/general-ledger',
            templateUrl: 'app/reports/general-ledger/general-ledger.html',

            controller: "generalLedgerCtrl as vm"

        })

        // 4. Daily Cash Position
        .state('app.reports.daily-cash-position', {
            url: '/daily-cash-position',
            templateUrl: 'app/reports/daily-cash-position/daily-cash-position.html',

            controller: "dailyCashPositionCtrl as vm"

        })

        // 5. Cash Flow Statement
        .state('app.reports.cash-flow', {
            url: '/cash-flow',
            templateUrl: 'app/reports/cash-flow/cash-flow.html',

            controller: "cashFlowCtrl as vm"

        })

        // 6. Balance Sheet Statement
        .state('app.reports.balance-sheet', {
            url: '/balance-sheet',
            templateUrl: 'app/reports/balance-sheet/balance-sheet.html',

            controller: "balanceSheetCtrl as vm"

        })

        // 7. Aging Summary Bill
        .state('app.reports.aging-summary-bill', {
            url: '/aging-summary-bill',
            templateUrl: 'app/reports/aging-summary-bill/aging-summary-bill.html',

            controller: "agingSummaryBillCtrl as vm"

        })

        // 7. Aging Summary Invoice
        .state('app.reports.aging-summary-invoice', {
            url: '/aging-summary-invoice',
            templateUrl: 'app/reports/aging-summary-invoice/aging-summary-invoice.html',

            controller: "agingSummaryInvoiceCtrl as vm"

        })

        // 7. Journal Report
        .state('app.reports.journal-report', {
            url: '/journal-report',
            templateUrl: 'app/reports/journal-report/journal-report.html',

            controller: "journalReportCtrl as vm"

        })


        // UI Routes
        .state('app.ui', {
            template: '<div ui-view></div>',
            abstract: true,
            url: '/ui',
        }).state('app.extras.blank', {
            url: '/blank',
            templateUrl: 'views/extras-blank.html'
        }).state('user', {
            templateUrl: 'views/common/session.html',
        }).state('user.signin', {
            url: '/signin',
            templateUrl: 'views/extras-signin.html',
            data: {
                appClasses: 'signin usersession',
                contentClasses: 'session-wrapper'
            }
        }).state('user.signin_2', {
            url: '/signin_2',
            templateUrl: 'views/extras-signin-2.html',
            data: {
                appClasses: 'signin v2 usersession',
                contentClasses: 'session-wrapper',
                noFooter: true
            }
        }).state('user.signup', {
            url: '/signup',
            templateUrl: 'views/extras-signup.html',
            data: {
                appClasses: 'signup usersession',
                contentClasses: 'session-wrapper'
            }
        }).state('user.signup_2', {
            url: '/signup_2',
            templateUrl: 'views/extras-signup-2.html',
            data: {
                appClasses: 'signup v2 usersession',
                contentClasses: 'session-wrapper',
                noFooter: true
            }
        }).state('user.forgot', {
            url: '/forgot',
            templateUrl: 'views/extras-forgot.html',
            data: {
                appClasses: 'forgot-password usersession',
                contentClasses: 'session-wrapper'
            }
        }).state('app.404', {
            url: '/404',
            templateUrl: 'views/extras-404.html',
            data: {
                contentClasses: 'no-padding',
            }
        }).state('user.500', {
            url: '/500',
            templateUrl: 'views/extras-500.html',
            data: {
                appClasses: 'error-page usersession',
                contentClasses: 'session-wrapper'
            }
        }).state('user.lockscreen', {
            url: '/lockscreen',
            templateUrl: 'views/extras-lockscreen.html',

            data: {
                appClasses: 'lockscreen usersession',
                contentClasses: 'session-wrapper'
            }
        })
    }
])