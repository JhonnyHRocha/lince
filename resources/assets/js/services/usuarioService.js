angular.module('app.services')
.service('Usuario', ['$resource','$filter','$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {

        function transformData(data){
            if(angular.isObject(data) && data.hasOwnProperty('password')){
                var o = angular.copy(data);

                if(angular.isObject(data) && data.hasOwnProperty('data_validade')){
                    o.data_validade = $filter('date')(o.data_validade, 'yyyy-MM-dd');
                    return appConfig.utils.transformRequest(o);
                }

                return appConfig.utils.transformRequest(o);
            }
            return data;
        };

        return $resource(appConfig.baseUrl + '/cliente/:id/usuario/:idUsuario', {id: '@id', idUsuario: '@idUsuario'},{
            query:{
                isArray: true
            },
            update: {
                method: 'PUT',
                transformRequest: transformData
            },
            get: {
                method: 'GET',
                isArray: false
            }
        });
    }]);