angular.module('app.services')
.service('Cliente', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/cliente/:id', {id: '@id'},{
            query:{
                isArray: false
            },
            update: {
                method: 'PUT'
            },
            save:{
                method: 'POST'
            }

        });
    }]);