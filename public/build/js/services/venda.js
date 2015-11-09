angular.module('app.services')
.service('Venda', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/venda/:id', {id: '@id'},{
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