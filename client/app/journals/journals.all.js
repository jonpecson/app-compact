/*
 * IIFE to encapsulate code and avoid global variables
 */
(function() {

    /*
     * attaching results controller function to the turtleFacts module 
     */
    angular
        .module("app")
        .controller("journalsCtrl", JournalsCtrl);

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
    JournalsCtrl.$inject = ['$state', 'Journals'];

    /*
     * definition of the results controller function itself. Taking 
     * quizMetrics as an argument
     */
    function JournalsCtrl($state, Journals) {
        var vm = this;

        Journals.getAll().success(function(data, status) {
            vm.journals = data;
            console.log("Journals: " + JSON.stringify(vm.journals));
        })

        // console

    }

})();