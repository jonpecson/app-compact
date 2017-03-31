(function() {

    /*
     * attaching  controller function to the  module 
     */
    angular
        .module("app")
        .factory('Accounts', function($http) {
            var factory = {};

            var url = 'http://compacct.api.hybrain.co/api/v1/accounts/';

            factory.create = function(payload) {
                console.log('From journal entries service: ' + JSON.stringify(payload));

                var data = $.param({
                    acct_type_id: payload.acct_type_id,
                    acct_name: payload.acct_name,
                    acct_code: payload.acct_code,
                    acct_description: payload.acct_description
                })

                var config = {
                    transformRequest: angular.identity,
                    transformResponse: angular.identity,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }
                return $http.post(url + 'create', data, config)
            }

            factory.getAll = function() {
                return $http.get('http://compacct.api.hybrain.co/api/v1/accounts');
            }

            return factory;
        })
})();