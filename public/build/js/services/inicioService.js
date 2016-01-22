angular.module('app.services')
.service('InicioUltimosMeses', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/inicio/vendas',{
            query:{
                isArray: true
            }
        });
    }]);

angular.module('app.services')
    .service('InicioClienteStatus', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/inicio/cliente_status/:id',({id: '@id'}),{
            query:{
                isArray: true
            }
        });
    }]);

angular.module('app.services')
    .service('InicioRankingVendas', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/inicio/ranking_vendas/:id',({id: '@id'}),{
            query:{
                isArray: true
            }
        });
    }]);

angular.module('app.services')
    .service('InicioHistoricoVendas', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/inicio/historico_vendas/:id',({id: '@id'}),{
            query:{
                isArray: true
            }
        });
    }]);

angular.module('app.services')
    .service('InicioDadosGerals', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/inicio/dados_geral/:id',({id: '@id'}),{
            query:{
                isArray: true
            }
        });
    }]);

angular.module('app.services')
    .service('InicioConsultasUsuarios', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/inicio/consultas_usuarios/:id',({id: '@id'}),{
            query:{
                isArray: true
            }
        });
    }]);

angular.module('app.services')
    .service('InicioUltimasConsultas', ['$resource', '$filter', '$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/inicio/ultimas_consultas/:id',({id: '@id'}),{
            query:{
                isArray: true
            }
        });
    }]);

