/*
 * IIFE to encapsulate code and avoid global variables
 */
(function() {

    /*
     * attaching results controller function to the turtleFacts module 
     */
    angular
        .module("app")
        .controller("balanceSheetCtrl", BalanceSheetCtrl);

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
    BalanceSheetCtrl.$inject = ['$state', '$scope', '$http', '$filter'];

    /*
     * definition of the results controller function itself. Taking 
     * quizMetrics as an argument
     */
    function BalanceSheetCtrl($state, $scope, $http, $filter) {
        var vm = this;
        
         var API_URL = "http://compacct.api.hybrain.co/api/v1/";

        $http.get(API_URL + "journals/current-month")
            .success(function(response) {
                $scope.journalentries = response;
                // console.log($scope.journalentries);
            });

        var init = function() {
            var filterByDate = function(filter, startToday, endToday, repStartDate, repEndDate) {

                if(startToday == "0" && endToday == "0" && filter != "filter-by-instances/?opt=cm" ){
                    console.log("No date");
                    vm.startDate = repStartDate;
                    vm.endDate = repEndDate;
                    $http.get(API_URL  + "journals/" + filter)
                        .success(function(response) {
                        var balanceSheet = response;
                        // Current Assets
                        $scope.balanceSheetCurrentAssets = Enumerable.From(balanceSheet)
                            /*Account Type 
                            Other Current Assets = 2
                            Bank = 4
                            Stocks = 6
                            */
                            .Where("$.acc_type_id == 2 || $.acc_type_id == 4 || $.acc_type_id == 6") 
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

                        $scope.balanceSheetCash = Enumerable.From(balanceSheet)
                            /*Account Type
                            Cash = 3
                            */
                            .Where("$.acc_type_id == 3")
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

                        $scope.balanceSheetFixedAssets = Enumerable.From(balanceSheet)
                            /*Account Type
                            Fixed Assets = 5
                            Other Assets = 1
                            */
                            .Where("$.acc_type_id == 5 || $.acc_type_id == 1") 
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

                            $scope.balanceSheetCurrentLiabilities = Enumerable.From(balanceSheet)
                            /*Account Type
                            Other Current Liabilities = 7
                            Credit Card = 8
                            */
                            .Where("$.acc_type_id == 7")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            $scope.balanceSheetNonCurrentLiabilities = Enumerable.From(balanceSheet)
                            /*Account Type
                            Other Liabilities = 16
                            Long Term Liabilities = 9
                            */
                            .Where("$.acc_type_id == 16 || $.acc_type_id == 9")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            // =====================================================================

                            $scope.balanceSheetEquity = Enumerable.From(balanceSheet)
                            /* Account Type
                            Equity
                            */
                            .Where("$.acc_type_id == 10")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            $scope.balanceSheetOtherExpense = Enumerable.From(balanceSheet)
                            .Where("$.acc_type_id == 15") //Account Type - Other Expense
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();


                            // =====================================================================

                            // ==========================================================================
                        //Profit/Loss Calculation

                        // Income
                            $scope.profitLossIncome = Enumerable.From(balanceSheet)
                            .Where("$.acc_type_cla_id == 4") //Account Type Classification - Income
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        $scope.profitLossExpense = Enumerable.From(balanceSheet)
                            .Where("$.acct_type_id == 13") //Account Type  - Expense
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        $scope.profitLossCostOfGoodsSold = Enumerable.From(balanceSheet)
                            .Where("$.acct_type_id == 14") //Account Type  - Cost of Goods Sold
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            // =============================================================================
                        

                            $scope.$broadcast('dataLoaded')
                    });

                }else if (startToday == "0" && endToday == "0" && filter == "filter-by-instances/?opt=cm"){
                    //Start Page - Default
                    console.log("Start Page");
                    vm.startDate = repStartDate;
                    vm.endDate = repEndDate;
                    $http.get(API_URL  + "journals/" + filter)
                        .success(function(response) {
                        var balanceSheet = response;
                        // Current Assets
                        $scope.balanceSheetCurrentAssets = Enumerable.From(balanceSheet)
                            /*Account Type 
                            Other Current Assets = 2
                            Bank = 4
                            Stocks = 6
                            */
                            .Where("$.acc_type_id == 2 || $.acc_type_id == 4 || $.acc_type_id == 6") 
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

                        $scope.balanceSheetCash = Enumerable.From(balanceSheet)
                            /*Account Type
                            Cash = 3
                            */
                            .Where("$.acc_type_id == 3")
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

                        $scope.balanceSheetFixedAssets = Enumerable.From(balanceSheet)
                            /*Account Type
                            Fixed Assets = 5
                            Other Assets = 1
                            */
                            .Where("$.acc_type_id == 5 || $.acc_type_id == 1") 
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

                            $scope.balanceSheetCurrentLiabilities = Enumerable.From(balanceSheet)
                            /*Account Type
                            Other Current Liabilities = 7
                            Credit Card = 8
                            */
                            .Where("$.acc_type_id == 7")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            $scope.balanceSheetNonCurrentLiabilities = Enumerable.From(balanceSheet)
                            /*Account Type
                            Other Liabilities = 16
                            Long Term Liabilities = 9
                            */
                            .Where("$.acc_type_id == 16 || $.acc_type_id == 9")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            // =====================================================================

                            $scope.balanceSheetEquity = Enumerable.From(balanceSheet)
                            /* Account Type
                            Equity
                            */
                            .Where("$.acc_type_id == 10")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            $scope.balanceSheetOtherExpense = Enumerable.From(balanceSheet)
                            .Where("$.acc_type_id == 15") //Account Type - Other Expense
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();


                            // =====================================================================

                            // ==========================================================================
                        //Profit/Loss Calculation

                        // Income
                            $scope.profitLossIncome = Enumerable.From(balanceSheet)
                            .Where("$.acc_type_cla_id == 4") //Account Type Classification - Income
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        $scope.profitLossExpense = Enumerable.From(balanceSheet)
                            .Where("$.acct_type_id == 13") //Account Type  - Expense
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        $scope.profitLossCostOfGoodsSold = Enumerable.From(balanceSheet)
                            .Where("$.acct_type_id == 14") //Account Type  - Cost of Goods Sold
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            // =============================================================================
                        

                            $scope.$broadcast('dataLoaded')
                    });
                    
                }else {
                    //Custom Date
                    console.log("Custom date");
                    vm.startDate = startToday;
                    vm.endDate = endToday;
                    $http.get(API_URL + filter)
                        .success(function(response) {
                        var balanceSheet = response;
                        // Current Assets
                        $scope.balanceSheetCurrentAssets = Enumerable.From(balanceSheet)
                            /*Account Type 
                            Other Current Assets = 2
                            Bank = 4
                            Stocks = 6
                            */
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acc_type_id == 2 || $.acc_type_id == 4 || $.acc_type_id == 6") 
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

                        $scope.balanceSheetCash = Enumerable.From(balanceSheet)
                            /*Account Type
                            Cash = 3
                            */
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acc_type_id == 3")
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

                        $scope.balanceSheetFixedAssets = Enumerable.From(balanceSheet)
                            /*Account Type
                            Fixed Assets = 5
                            Other Assets = 1
                            */
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acc_type_id == 5 || $.acc_type_id == 1") 
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

                            $scope.balanceSheetCurrentLiabilities = Enumerable.From(balanceSheet)
                            /*Account Type
                            Other Current Liabilities = 7
                            Credit Card = 8
                            */
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acc_type_id == 7")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            $scope.balanceSheetNonCurrentLiabilities = Enumerable.From(balanceSheet)
                            /*Account Type
                            Other Liabilities = 16
                            Long Term Liabilities = 9
                            */
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acc_type_id == 16 || $.acc_type_id == 9")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            // =====================================================================

                            $scope.balanceSheetEquity = Enumerable.From(balanceSheet)
                            /* Account Type
                            Equity
                            */
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acc_type_id == 10")
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            $scope.balanceSheetOtherExpense = Enumerable.From(balanceSheet)
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acc_type_id == 15") //Account Type - Other Expense
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();


                            // =====================================================================

                            // ==========================================================================
                        //Profit/Loss Calculation

                        // Income
                            $scope.profitLossIncome = Enumerable.From(balanceSheet)
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acc_type_cla_id == 4") //Account Type Classification - Income
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        $scope.profitLossExpense = Enumerable.From(balanceSheet)
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acct_type_id == 13") //Account Type  - Expense
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                        $scope.profitLossCostOfGoodsSold = Enumerable.From(balanceSheet)
                            .Where("$.journ_date >='" + startToday + "' && $.journ_date <= '" +  endToday + "'")
                            .Where("$.acct_type_id == 14") //Account Type  - Cost of Goods Sold
                            .GroupBy("$.acct_name", null,
                                function(key, g) {
                                    return {
                                        acct_name: key,
                                        entry_credit: g.Sum("$.entry_credit"),
                                        entry_debit: g.Sum("$.entry_debit")
                                    }
                                })
                            .ToArray();

                            // =============================================================================
                        

                        $scope.$broadcast('dataLoaded')
                    });
                } //End If else

                

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
            $scope.CurrentAssetsSum = 0;
            $scope.CashSum = 0;
            $scope.FixedAssetsSum = 0;
            $scope.OtherCurrentLiabilitiesSum = 0;
            $scope.EquitySum = 0;
            $scope.OtherExpenseSum = 0;
            $scope.ProfitLossSum = 0;
            

            // 1. Sum of Current Assets
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.CurrentAssetsSum = $scope.CurrentAssetsSum + balance;
                }
            }
            getTotal($scope.balanceSheetCurrentAssets);
            console.log("CurrentAssetsSum: " + $scope.CurrentAssetsSum)

            // 2. Sum of Cash
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.CashSum = $scope.CashSum + balance;
                }
            }
            getTotal($scope.balanceSheetCash);
            console.log("CashSum: " + $scope.CashSum)

            // 3. Sum of Fixed Assets
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.FixedAssetsSum = $scope.FixedAssetsSum + balance;
                }
            }
            getTotal($scope.balanceSheetFixedAssets);
            console.log("FixedAssetsSum: " + $scope.FixedAssetsSum)

            // 4. Sum of Other Current Liabilities
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.OtherCurrentLiabilitiesSum = $scope.OtherCurrentLiabilitiesSum + balance;
                }
            }
            getTotal($scope.balanceSheetCurrentLiabilities);
            getTotal($scope.balanceSheetNonCurrentLiabilities);
            console.log("OtherCurrentLiabilitiesSum: " + $scope.OtherCurrentLiabilitiesSum)

            // 5. Sum of Equity
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.EquitySum = $scope.EquitySum + balance;
                }
            }
            getTotal($scope.balanceSheetEquity);
            console.log("EquitySum: " + $scope.EquitySum)
            
            // 6. Sum of Other Expense
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.OtherExpenseSum = $scope.OtherExpenseSum + balance;
                }
            }
            getTotal($scope.balanceSheetOtherExpense);
            console.log("OtherExpenseSum: " + $scope.OtherExpenseSum)
            
            //======================================================================
            //For Profit and Loss Calculation
            $scope.incomeSum = 0;
            $scope.expenseSum = 0;
            $scope.costofgoodssoldSum = 0;

            // 1. Sum of Income
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.incomeSum = $scope.incomeSum + balance;
                }
            }
            getTotal($scope.profitLossIncome);
            console.log("Income Sum: " + $scope.incomeSum)

             // 2. Sum of Expense
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.expenseSum = $scope.expenseSum + balance;
                }
            }
            getTotal($scope.profitLossExpense);
            console.log("Expense Sum: " + $scope.expenseSum)

            // 3. Sum of Cost of Goods Sold
            var getTotal = function(account) {
                for (var i = 0; i < account.length; i++) {
                    var item = account[i];
                    var balance = item.entry_debit - item.entry_credit;
                    $scope.costofgoodssoldSum = $scope.costofgoodssoldSum + balance;
                }
            }
            getTotal($scope.profitLossCostOfGoodsSold);
            console.log("Cost of Goods Sold Sum: " + $scope.costofgoodssoldSum)
            //======================================================================

        });


    }

})();