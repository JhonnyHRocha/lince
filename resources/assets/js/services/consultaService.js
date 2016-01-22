angular.module('app.services')
    .service('ConsultaCPF_CNPJ', ['$resource', 'appConfig', function ($resource, appConfig) {
        return $resource(appConfig.baseUrl + '/consulta/cpf_cnpj',{
            query:{
                method: 'POST'
            }
        });
    }]);