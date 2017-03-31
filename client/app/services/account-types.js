(function() {

    /*
     * attaching  controller function to the  module 
     */
    angular
        .module("app")
        .factory('AccountTypes', function($http) {
            var factory = {};

            factory.getAll = function() {
                return $http.get('http://compacct.api.hybrain.co/api/v1/account-types');
            }

            return factory;
        })
})();