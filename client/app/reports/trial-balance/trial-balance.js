/*
 * IIFE to encapsulate code and avoid global variables
 */
(function() {

    /*
     * attaching results controller function to the turtleFacts module 
     */
    angular
        .module("app")
        .controller("trialBalanceCtrl", TrialBalanceCtrl);

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
    TrialBalanceCtrl.$inject = ['$state', '$scope', '$http', '$filter'];

    /*
     * definition of the results controller function itself. Taking 
     * quizMetrics as an argument
     */
    function TrialBalanceCtrl($state, $scope, $http, $filter) {
        var vm = this;

        vm.reportTitle = "Trial Balance";
        vm.companyName = "Hybrain";

        var API_URL = "http://compacct.api.hybrain.co/api/v1/";

        var init = function() {
            var filterByDate = function(filter, startToday, endToday, repStartDate, repEndDate) {

                if(startToday == "0" && endToday == "0" && filter != "filter-by-instances/?opt=cm" ){
                    console.log("No date");
                    vm.startDate = repStartDate;
                    vm.endDate = repEndDate;
                    $http.get(API_URL  + "journals/" + filter)
                    .success(function(response) {
                        var trialBalance = response;
                        // Assets
                        $scope.trialBalanceAssets = Enumerable.From(trialBalance)
                            //Account Type Classification - Assets
                            .Where("$.acc_type_cla_id == 1")
                            .OrderBy("$.acct_name")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        // Liabilities
                        $scope.trialBalanceLiabilities = Enumerable.From(trialBalance)
                            //Account Type Classification - Liabilities
                            .Where("$.acc_type_cla_id == 2")
                            .OrderBy("$.acct_name")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();


                        // Equity
                        $scope.trialBalanceCapital = Enumerable.From(trialBalance)
                            //Account Type Classification - Capital
                            .Where("$.acc_type_cla_id == 3")
                            .OrderBy("$.acct_name")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        // Income
                        $scope.trialBalanceIncome = Enumerable.From(trialBalance)
                            //Account Type Classification - Income
                            .Where("$.acc_type_cla_id == 4")
                            .OrderBy("$.acct_name")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        // Expense
                        $scope.trialBalanceExpense = Enumerable.From(trialBalance)
                            //Account Type Classification - Expense
                            .Where("$.acc_type_cla_id == 5")
                            .OrderBy("$.acct_name")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        
                        $scope.$broadcast('dataLoaded')
                    });

                }else if (startToday == "0" && endToday == "0" && filter == "filter-by-instances/?opt=cm"){
                    //Start Page - Default
                    console.log("Start Page");
                    vm.startDate = repStartDate;
                    vm.endDate = repEndDate;
                    $http.get(API_URL  + "journals/" + filter)
                        .success(function(response) {
                            var trialBalance = response;
                            // Assets
                            $scope.trialBalanceAssets = Enumerable.From(trialBalance)
                                //Account Type Classification - Assets
                                //&& $.journ_date >= 2017-03-01 00:00:00 && $.journ_date <= 2017-03-31 23:59:59
                                .Where("$.acc_type_cla_id == 1")
                                .OrderBy("$.acct_name")
                                .GroupBy("$.acct_name", null,
                                    function(key, g) {
                                        return {
                                            acct_name: key,
                                            entry_credit: g.Sum("$.entry_credit"),
                                            entry_debit: g.Sum("$.entry_debit")
                                        }
                                    })
                                .ToArray();

                            // Liabilities
                            $scope.trialBalanceLiabilities = Enumerable.From(trialBalance)
                                //Account Type Classification - Liabilities
                                .Where("$.acc_type_cla_id == 2")
                                .OrderBy("$.acct_name")
                                .GroupBy("$.acct_name", null,
                                    function(key, g) {
                                        return {
                                            acct_name: key,
                                            entry_credit: g.Sum("$.entry_credit"),
                                            entry_debit: g.Sum("$.entry_debit")
                                        }
                                    })
                                .ToArray();


                            // Equity
                            $scope.trialBalanceCapital = Enumerable.From(trialBalance)
                                //Account Type Classification - Capital
                                .Where("$.acc_type_cla_id == 3")
                                .OrderBy("$.acct_name")
                                .GroupBy("$.acct_name", null,
                                    function(key, g) {
                                        return {
                                            acct_name: key,
                                            entry_credit: g.Sum("$.entry_credit"),
                                            entry_debit: g.Sum("$.entry_debit")
                                        }
                                    })
                                .ToArray();

                            // Income
                            $scope.trialBalanceIncome = Enumerable.From(trialBalance)
                                //Account Type Classification - Income
                                .Where("$.acc_type_cla_id == 4")
                                .OrderBy("$.acct_name")
                                .GroupBy("$.acct_name", null,
                                    function(key, g) {
                                        return {
                                            acct_name: key,
                                            entry_credit: g.Sum("$.entry_credit"),
                                            entry_debit: g.Sum("$.entry_debit")
                                        }
                                    })
                                .ToArray();

                            // Expense
                            $scope.trialBalanceExpense = Enumerable.From(trialBalance)
                                //Account Type Classification - Expense
                                .Where("$.acc_type_cla_id == 5")
                                .OrderBy("$.acct_name")
                                .GroupBy("$.acct_name", null,
                                    function(key, g) {
                                        return {
                                            acct_name: key,
                                            entry_credit: g.Sum("$.entry_credit"),
                                            entry_debit: g.Sum("$.entry_debit")
                                        }
                                    })
                                .ToArray();

                            
                            $scope.$broadcast('dataLoaded')
                        });
                    
                }else {
                    //Custom Date
                    console.log("Custom date");
                    vm.startDate = startToday;
                    vm.endDate = endToday;
                    $http.get(API_URL + filter)
                        .success(function(response) {
                                var trialBalance = response;
                                // Assets
                                $scope.trialBalanceAssets = Enumerable.From(trialBalance)
                                    //Account Type Classification - Assets
                                    .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                                    .Where("$.acc_type_cla_id == 1")
                                    .OrderBy("$.acct_name")
                                    .GroupBy("$.acct_name", null,
                                        function(key, g) {
                                            return {
                                                acct_name: key,
                                                entry_credit: g.Sum("$.entry_credit"),
                                                entry_debit: g.Sum("$.entry_debit")
                                            }
                                        })
                                    .ToArray();

                                // Liabilities
                                $scope.trialBalanceLiabilities = Enumerable.From(trialBalance)
                                    //Account Type Classification - Liabilities
                                    .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                                    .Where("$.acc_type_cla_id == 2")
                                    .OrderBy("$.acct_name")
                                    .GroupBy("$.acct_name", null,
                                        function(key, g) {
                                            return {
                                                acct_name: key,
                                                entry_credit: g.Sum("$.entry_credit"),
                                                entry_debit: g.Sum("$.entry_debit")
                                            }
                                        })
                                    .ToArray();


                                // Equity
                                $scope.trialBalanceCapital = Enumerable.From(trialBalance)
                                    //Account Type Classification - Capital
                                    .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                                    .Where("$.acc_type_cla_id == 3")
                                    .OrderBy("$.acct_name")
                                    .GroupBy("$.acct_name", null,
                                        function(key, g) {
                                            return {
                                                acct_name: key,
                                                entry_credit: g.Sum("$.entry_credit"),
                                                entry_debit: g.Sum("$.entry_debit")
                                            }
                                        })
                                    .ToArray();

                                // Income
                                $scope.trialBalanceIncome = Enumerable.From(trialBalance)
                                    //Account Type Classification - Income
                                    .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                                    .Where("$.acc_type_cla_id == 4")
                                    .OrderBy("$.acct_name")
                                    .GroupBy("$.acct_name", null,
                                        function(key, g) {
                                            return {
                                                acct_name: key,
                                                entry_credit: g.Sum("$.entry_credit"),
                                                entry_debit: g.Sum("$.entry_debit")
                                            }
                                        })
                                    .ToArray();

                                // Expense
                                $scope.trialBalanceExpense = Enumerable.From(trialBalance)
                                    //Account Type Classification - Expense
                                    .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                                    .Where("$.acc_type_cla_id == 5")
                                    .OrderBy("$.acct_name")
                                    .GroupBy("$.acct_name", null,
                                        function(key, g) {
                                            return {
                                                acct_name: key,
                                                entry_credit: g.Sum("$.entry_credit"),
                                                entry_debit: g.Sum("$.entry_debit")
                                            }
                                        })
                                    .ToArray();

                                
                                $scope.$broadcast('dataLoaded')
                            });
                } //End if else statement

                
            }

            //Display Default Monthly Report
            var date = new Date();
            var defaultByMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            var defaultByMonthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            filterByDate('filter-by-instances/?opt=cm', '0', '0', defaultByMonthStart, defaultByMonthEnd);

            $scope.verifyorder = function(option, stDate, enDate, repStartDate, repEndDate) {
                if(option == "custom"){
                    var filter = "journal-entries";

                    var sToday = stDate;
                    var sDd = sToday.getDate();
                    var sMm = sToday.getMonth() + 1;
                    var sYyyy = sToday.getFullYear();

                    if (sDd < 10) { sDd = '0' + sDd }
                    if (sMm < 10) { sMm = '0' + sMm }

                    sToday = sYyyy + '-' + sMm + '-' + sDd;

                    var eToday = enDate;
                    var eDd = eToday.getDate();
                    var eMm = eToday.getMonth() + 1;
                    var eYyyy = eToday.getFullYear();

                    if (eDd < 10) { eDd = '0' + eDd }
                    if (eMm < 10) { eMm = '0' + eMm }

                    eToday = eYyyy + '-' + eMm + '-' + eDd;

                    var startToday = sToday;
                    var endToday = eToday;

                }else if (option == "today") {
                    var filter = "filter-by-instances/?opt=cd";

                    var dateNow = new Date();

                    var repStartDate = dateNow;
                    var repEndDate = dateNow;
                    var startToday = "0";
                    var endToday = "0";

                } else if (option == "weekly") {
                    var filter = "filter-by-instances/?opt=cw";

                    var curr = new Date; // get current date
                    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                    var last = first + 6; // last day is the first day + 6

                    var firstday = new Date(curr.setDate(first));

                    var lastday = new Date(curr.setDate(last));

                    var repStartDate = firstday;
                    var repEndDate = lastday;
                    var startToday = "0";
                    var endToday = "0";

                } else if (option == "monthly") {
                    var filter = "filter-by-instances/?opt=cm";

                    var date = new Date();
                    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                    var repStartDate = firstDay;
                    var repEndDate = lastDay;

                    var startToday = "0";
                    var endToday = "0";
                } else if (option == "quarterly") {
                    var filter = "filter-by-instances/?opt=cq";

                    var currentMonth=(new Date()).getMonth()
                    var yyyy=(new Date()).getFullYear()
                    var start= (Math.floor(currentMonth/3)*3)+1,
                    end= start+3,
                    startDateQuarter=new Date(start+'-01-'+ yyyy),
                    endDateQuarter= end>12?new Date('01-01-'+ (yyyy+1)):new Date(end+'-01-'+ (yyyy));
                    endDateQuarter=new Date((endDateQuarter.getTime())-1);

                    var repStartDate = startDateQuarter;
                    var repEndDate = endDateQuarter;

                    var startToday = "0";
                    var endToday = "0";
                } else if (option == "yearly") {
                    var filter = "filter-by-instances/?opt=cy";

                    var firstDayYear = new Date(new Date().getFullYear(), 0, 1);
                    var lastDayYear = new Date(new Date().getFullYear(), 11, 31);

                    var repStartDate = firstDayYear;
                    var repEndDate = lastDayYear;

                    var startToday = "0";
                    var endToday = "0";
                } else { 
                    var filter = "filter-by-instances/?opt=cm";
                    var startToday = "0";
                    var endToday = "0";
                }
                
                filterByDate(filter, startToday, endToday, repStartDate, repEndDate);
            }

        }
        init();

        $scope.$on('dataLoaded', function(event) {
            console.log('dataLoaded');
            $scope.debitSum = 0;
            $scope.creditSum = 0; // Todo

            // 1. Sum of Debits (Assets, Expense)
            var getDebitTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.debitSum = $scope.debitSum + balance;
                }
            }
            getDebitTotal($scope.trialBalanceAssets);
            getDebitTotal($scope.trialBalanceExpense);
            console.log("Debit Sum: " + $scope.debitSum)




            // 2. Sum of Credits (Liabilities, Capital, Income) Todo

            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.creditSum = $scope.creditSum + balance;
                }
            }
            getTotal($scope.trialBalanceLiabilities);
            getTotal($scope.trialBalanceCapital);
            getTotal($scope.trialBalanceIncome);
            console.log("Credit Sum: " + $scope.creditSum)
        });


        // console.log($scope.trialBalance);

        $scope.getBalance = function(debit, credit) {
            var result = debit - credit;
            var total = $filter('currency')(result, '', 2).toString();
            if (result < 0) {
                total = total.replace(/\B(?=(\d{3})+\b)/g, ",").replace(/-(.*)/, "($1)");
            }
            return total;
        }
    }

})();