angular.module('app.services')
    .service('Cadastro', ['$resource', 'appConfig', function ($resource, appConfig) {
        return $resource(appConfig.baseUrl + '/cliente/cnpj/:id', {id: '@id'},{
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