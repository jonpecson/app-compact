/*
 * IIFE to encapsulate code and avoid global variables
 */
(function() {

    /*
     * attaching results controller function to the turtleFacts module 
     */
    angular
        .module("app")
        .controller("chartOfAccountsCtrl", ChartOfAccountsCtrl);

    /*
     * injecting the [] into the students controller 
     * using the $inject method.
     *
     * Injecting dependencies like this is done so as to avoid issues when 
     * uglifying the code. Function arguments will get shortened during the 
     * uglify process but strings will not. Therefore by injecting the argument
     * as strings in an array using the $inject method we can be sure angular 
     * still knows what we want to do.
     */
    ChartOfAccountsCtrl.$inject = ['$state', 'Accounts', 'AccountTypes', 'AccountClassifications', 'SweetAlert'];

    /*
     * definition of the results controller function itself. Taking 
     * quizMetrics as an argument
     */
    function ChartOfAccountsCtrl($state, Accounts, AccountTypes, AccountClassifications, SweetAlert) {
        var vm = this;
        vm.accounts = [];
        vm.accountTypes = [];


        vm.save = function() {
            vm.newAccount.acct_type_id = vm.selectedAccount.acc_type_id
            Accounts.create(vm.newAccount)
                .then(function(response) {
                    console.log("Response" + response);
                }).then(function(err) {
                    console.log("Error" + err);
                })

            // Show success message
            SweetAlert.swal('Well done!', 'You\'ve added a new account.', 'success');

        }


        function innerJoin(a, b, select) {
            var m = a.length,
                n = b.length,
                c = [];

            for (var i = 0; i < m; i++) {
                var x = a[i];

                for (var j = 0; j < n; j++) { // cartesian product - all combinations
                    var y = select(x, b[j]); // filter out the rows and columns you want
                    if (y) c.push(y); // if a row is returned add it to the table
                }
            }

            return c;
        }

        function init() {
            Accounts.getAll().success(function(data, status) {
                vm.accounts = data;
                console.log("Accounts: " + JSON.stringify(vm.accounts));
            })

            AccountTypes.getAll().success(function(data, status) {
                vm.accountTypes = data;
                console.log("Account types: " + JSON.stringify(vm.accountTypes));

            })

            AccountClassifications.getAll().success(function(data, status) {
                vm.accountClassfications = data;
                console.log("Account Classifications: " + JSON.stringify(vm.accountClassfications));

            })



        }
        init();


        var join = function() {
            var accountClassfications = vm.accountClassfications
            var accountTypes = vm.accountTypes;

            vm.chartOfAccounts = innerJoin(accountClassfications, accountTypes, function(accountClassfication, accountType) {
                if (accountClassfication.account_type_cla_id === accountType.acc_type_cla_id) {
                    return {
                        acc_type_id: accountType.acc_type_id,
                        acct_type_name: accountType.acct_type_name,
                        account_type_cla_name: accountClassfication.account_type_cla_name
                    };
                }
            });
            console.log("Result: " + JSON.stringify(vm.chartOfAccounts))
        }


        setTimeout(function() {
            join();
        }, 2000);

    }

})();