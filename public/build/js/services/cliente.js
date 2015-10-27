angular.module('app.services')
.service('Cliente', ['$resource', 'appConfig', function ($resource, appConfig) {
        return $resource(appConfig.baseUrl + '/cliente/:id', {id: '@id'},{
            query:{
                isArray: false
            },
            update: {
                method: 'PUT'
            }
        });
    }]);