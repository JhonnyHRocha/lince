angular.module('app.services')
.service('Venda', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/venda/:id', {id: '@id'},{
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

angular.module('app.services')
    .service('VendasCliente', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/venda/vendas_cliente/:id', {id: '@id'},{
            query:{
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

angular.module('app.services')
    .service('Boleto', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/boleto/:id', {id: '@id'},{
            query:{
                isArray: true
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

angular.module('app.services')
    .service('Valores', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/venda/soma_valores/geral',{
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }]);