angular.module('app.services')
.service('Vendedor', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/revendedor/:id', {id: '@id'},{
            query:{
                isArray: false
            },
            get: {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT'
            },
            save:{
                method: 'POST'
            }

        });
    }]);