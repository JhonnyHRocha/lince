angular.module('app.services')
    .service('Revendedores', ['$resource', 'appConfig', function ($resource, appConfig) {
        return $resource(appConfig.baseUrl + '/revendedor/:id', {id: '@id'},{
            update: {
                method: 'PUT'
            }
        });
    }]);