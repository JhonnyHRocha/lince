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

angular.module('app.services')
    .service('ClienteDashboard', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/cliente/dashboard/:id', {id: '@id'},{
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

angular.module('app.services')
    .service('ClienteListagem', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/cliente/listagem/0', {id: '@id'},{
            query:{
                isArray: false
            },
            get:{
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