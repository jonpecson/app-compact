/*
 * IIFE to encapsulate code and avoid global variables
 */
(function() {

    /*
     * attaching  controller function to the  module 
     */
    angular
        .module("app")

    .controller("journalsAddCtrl", JournalsAddCtrl);
    JournalsAddCtrl.$inject = ['$state', '$scope', '$filter', '$http', 'Contacts', 'Accounts', 'Journals', 'Tax', 'JournalEntries', 'SweetAlert'];

    function JournalsAddCtrl($state, $scope, $filter, $http, Contacts, Accounts, Journals, Tax, JournalEntries, SweetAlert) {
        var vm = this;
        vm.contacts = [];
        vm.accounts = [];

        vm.line = {};
        vm.line.selectedAccount = {
            acct_id: null
        }
        vm.line.selectedContact = {
            contact_id: null
        }
        vm.line.selectedTax = {
            tax_id: null
        }

        vm.journal = {};
        $scope.response = {};
        vm.journal.date = new Date();

        $scope.showAlert = false;
        var total = 0;

        init();

        function init() {
            Contacts.getAll().success(function(data, status) {
                vm.contacts = data;
                // console.log("Contacts: " + vm.contacts);

            });


            Accounts.getAll().success(function(data, status) {
                vm.accounts = data;
                // console.log("Accounts: " + vm.accounts);
            });

            Journals.getAll().success(function(data, status) {
                vm.journals = data;
                // console.log("Journals: " + JSON.stringify(vm.journals));
            })

            Tax.getAll().success(function(data, status) {
                vm.tax = data;
                console.log("Tax: " + JSON.stringify(vm.tax));
            })

            selected = $filter('filter')(vm.accounts, { acct_name: '' });


            $scope.journalEntries = [
                { acct_id: 1, contact_id: 1, tax_id: null, 'id': '0', 'accountName': 'Account', 'entry_desc': 'Description', 'contactName': 'Contact', 'tax': 'Tax', tax_rate: null, 'entry_debit': 0, 'entry_credit': 0 },
                { acct_id: 1, contact_id: 1, tax_id: null, 'id': '1', 'accountName': 'Account', 'entry_desc': 'Description', 'contactName': 'Contact', 'tax': 'Tax', tax_rate: null, 'entry_debit': 0, 'entry_credit': 0 },
            ];

        }

        $scope.editingData = {};

        for (var i = 0, length = $scope.journalEntries.length; i < length; i++) {
            $scope.editingData[$scope.journalEntries[i].id] = false;
        }

        $scope.modify = function(tableData) {
            $scope.editingData[tableData.id] = true;
            vm.line.desc = tableData.entry_desc;

            vm.line.entry_debit = tableData.entry_debit;
            vm.line.entry_credit = tableData.entry_credit;

        };


        $scope.update = function(tableData, line) {
            $scope.editingData[tableData.id] = false;
            console.log(line);
            var index = tableData.id;

            // if account, contact and tax has been selected
            if (line.selectedAccount.acct_id >= 1 && line.selectedContact.contact_id >= 1) {

                var selectedAccount = {
                    id: line.selectedAccount.acct_id,
                    name: line.selectedAccount.acct_name
                }
                console.log(selectedAccount);

                var selectedContact = {
                    id: line.selectedContact.contact_id,
                    name: line.selectedContact.contact_display_name
                }
                console.log(selectedContact);

                if (line.selectedTax.tax_id > 0) {

                    var selectedTax = {
                        id: line.selectedTax.tax_id,
                        name: line.selectedTax.tax_name + ' [' + line.selectedTax.tax_rate_percentage + ']',
                        rate: line.selectedTax.tax_rate_percentage
                    }
                    console.log(selectedTax);


                    $scope.journalEntries[index].tax = selectedTax.name;
                    $scope.journalEntries[index].tax_id = selectedTax.id;
                    $scope.journalEntries[index].tax_rate = selectedTax.rate;
                }

                // Updates the value of the journal entries
                $scope.journalEntries[index].accountName = selectedAccount.name;
                $scope.journalEntries[index].acct_id = selectedAccount.id;

                $scope.journalEntries[index].entry_desc = line.desc;

                $scope.journalEntries[index].contactName = selectedContact.name;
                $scope.journalEntries[index].contact_id = selectedContact.id;

                $scope.journalEntries[index].entry_debit = line.entry_debit;
                $scope.journalEntries[index].entry_credit = line.entry_credit;


                // Computes Debit and credit
                $scope.debitSum = 0;
                $scope.creditSum = 0;

                $scope.debitVatSum = 0;
                $scope.creditVatSum = 0;

                $scope.debitTotal = 0;
                $scope.creditTotal = 0;

                for (var i = 0; i < $scope.journalEntries.length; i++) {
                    // Debit & Credit Sum
                    $scope.debitSum = $scope.debitSum + $scope.journalEntries[i].entry_debit;
                    $scope.creditSum = $scope.creditSum + $scope.journalEntries[i].entry_credit;

                    // //Debit & Credit VAT SUM
                    // $scope.debitVatSum = $scope.debitVatSum + (($scope.journalEntries[i].tax_rate / 100) * $scope.journalEntries[i].entry_debit);

                    // $scope.creditVatSum = $scope.creditVatSum + (($scope.journalEntries[i].tax_rate / 100) * $scope.journalEntries[i].entry_credit);


                }
                // Total
                $scope.debitTotal = $scope.debitSum;
                $scope.creditTotal = $scope.creditSum;

                if ($scope.debitTotal != $scope.creditTotal) {
                    $scope.showAlert = true;
                } else {
                    $scope.showAlert = false;
                }

                if ($scope.debitTotal == $scope.creditTotal) {
                    total = $scope.debitTotal;
                }

                console.log(JSON.stringify(tableData));

                // $scope.journalEntries
                console.log(JSON.stringify($scope.journalEntries));
            }
        };

        $scope.add = function() {
            var idNo = $scope.journalEntries.length;
            $scope.journalEntries.push({
                'id': idNo,
                'accountName': 'Account',
                'entry_desc': 'Description',
                'contactName': 'Contact',
                'tax': 'Tax',
                'entry_credit': 0,
                'entry_debit': 0,
                acct_id: 1,
                contact_id: 1,
                tax_id: 1,
            });
        };



        $scope.saveJournalEntry = function(data, index) {

            angular.extend(data, { index: index });
            console.log("data after: " + JSON.stringify(data));
            console.log("Journal #:" + index);
        };

        var getJournalId = function(data) {
            // remove all text that precedes the 'msg'
            var str = data.substring(data.indexOf("msg"));

            // remove the [null] keyword
            str = str.substring(0, str.indexOf("[null]"))

            // add '{' to match the '}'
            var str = '{"' + str

            // converts string to object
            var res = JSON.parse(str);

            // return the journal id
            return res.data.journ_id;
        }

        $scope.saveJournal = function() {
            console.log('From controller: ' + JSON.stringify(vm.journal));


            // Add Journal
            Journals.create(vm.journal, total)
                .then(
                    function(response) {
                        var data = response.data;
                        var payload = {
                            journal_id: getJournalId(data),
                            journal_entries: $scope.journalEntries
                        }

                        // Add Journal Entries
                        JournalEntries.create(payload)
                            .then(
                                function(response) {
                                    console.log("Journal Entries: " + JSON.stringify(response));

                                    // Show success message
                                    SweetAlert.swal('Well done!', 'You\'ve added a journal.', 'success');

                                    // Redirect to Journals page
                                    $state.go('app.journals.all');
                                },
                                function(err) {
                                    console.log("Journal Entries error: " + JSON.stringify(err));

                                });
                    },
                    function(response) {
                        // failure callback
                        console.log('Success: ' + JSON.stringify(response));

                    }
                );


        }
    }

})();