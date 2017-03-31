(function() {

    /*
     * attaching  controller function to the  module 
     */
    angular
        .module("app")
        .factory('AccountClassifications', function($http) {
            var factory = {};

            factory.create = function() {
                return $http.post('/services', { type: 'getSource', ID: 'TP001' });
            };

            factory.getAll = function() {
                return $http.get('https://compacct.api.hybrain.co/api/v1/account-classifications');
            }

            return factory;
        })
})();