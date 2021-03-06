angular.module('app.services')
    .service('ListagemUsuariosClientes', ['$resource','$filter','$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {

        function transformData(data){
            if(angular.isObject(data) && data.hasOwnProperty('password')){
                var o = angular.copy(data);
                if(angular.isObject(data) && data.hasOwnProperty('data_validade')){
                    var dateArray = data.data_validade.split('/'),
                        month = dateArray[1] - 1;
                    o.data_validade = new Date(dateArray[2],month,dateArray[0]);
                    //o.data_validade = $filter('date')(o.data_validade, 'yyyy-MM-dd');
                    return appConfig.utils.transformRequest(o);
                }
                return appConfig.utils.transformRequest(o);
            }
            return data;
        };

        return $resource(appConfig.baseUrl + '/usuario/listagem/usuarios_clientes',{
            query:{
                isArray: true
            },
            update: {
                method: 'PUT',
                transformRequest: transformData
            },
            get: {
                method: 'GET',
                isArray: true,
                transformResponse: function(data, headers){
                    var o = appConfig.utils.transformResponse(data,headers);
                    if(angular.isObject(o) && o.hasOwnProperty('data_validade')){
                        o.data_validade = $filter('date')(o.data_validade, 'dd/MM/yyyy');
                    }
                    return o;
                }

            }
        });
    }]);

angular.module('app.services')
    .service('Usuarios', ['$resource','$filter','$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {

        function transformData(data){
            if(angular.isObject(data) && data.hasOwnProperty('password')){
                var o = angular.copy(data);
                if(angular.isObject(data) && data.hasOwnProperty('data_validade')){
                    var dateArray = data.data_validade.split('/'),
                        month = dateArray[1] - 1;
                    o.data_validade = new Date(dateArray[2],month,dateArray[0]);
                    //o.data_validade = $filter('date')(o.data_validade, 'yyyy-MM-dd');
                    return appConfig.utils.transformRequest(o);
                }
                return appConfig.utils.transformRequest(o);
            }
            return data;
        };

        return $resource(appConfig.baseUrl + '/usuario/cliente/:id', {id: '@id'},{
            query:{
                isArray: true
            },
            update: {
                method: 'PUT',
                transformRequest: transformData
            },
            get: {
                method: 'GET',
                isArray: true,
                transformResponse: function(data, headers){
                    var o = appConfig.utils.transformResponse(data,headers);
                    if(angular.isObject(o) && o.hasOwnProperty('data_validade')){
                        o.data_validade = $filter('date')(o.data_validade, 'dd/MM/yyyy');
                    }
                    return o;
                }

            }
        });
    }]);

angular.module('app.services')
    .service('UsuariosEditar', ['$resource','$filter','$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {

        function transformData(data){
            if(angular.isObject(data) && data.hasOwnProperty('password')){
                var o = angular.copy(data);
                if(angular.isObject(data) && data.hasOwnProperty('data_validade') && data.data_validade != null){
                    var dateArray = data.data_validade.split('/'),
                        month = dateArray[1] - 1;
                    o.data_validade = new Date(dateArray[2],month,dateArray[0]);
                    //o.data_validade = $filter('date')(o.data_validade, 'yyyy-MM-dd');
                    return appConfig.utils.transformRequest(o);
                }
                return appConfig.utils.transformRequest(o);
            }
            return data;
        };

        return $resource(appConfig.baseUrl + '/usuario/:id', {id: '@id'},{
            query:{
                isArray: false,
                transformResponse: function(data, headers){
                    var o = appConfig.utils.transformResponse(data,headers);
                    if(angular.isObject(o) && o.hasOwnProperty('data_validade')){
                        o.data_validade = $filter('date')(o.data_validade, 'dd/MM/yyyy');
                        o.teste = o.limite_consultas > 0 ? true : false ;
                    }
                    return o;
                }
            },
            update: {
                method: 'PUT',
                transformRequest: transformData
            },
            get: {
                method: 'GET',
                isArray: true,
                transformResponse: function(data, headers){
                    var o = appConfig.utils.transformResponse(data,headers);
                    if(angular.isObject(o) && o.hasOwnProperty('data_validade')){
                        o.data_validade = $filter('date')(o.data_validade, 'dd/MM/yyyy');
                    }
                    return o;
                }

            }
        });
    }]);

angular.module('app.services')
    .service('UsuariosDisponiveis', ['$resource','$filter','$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/usuario/disponiveis/:id', {id: '@id'}, {
            query: {
                isArray: true
            }
        });
    }]);

angular.module('app.services')
    .service('Usuario', ['$resource','$filter','$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {
        return $resource(appConfig.baseUrl + '/usuario/:id', {id: '@id'}, {
            query: {
                isArray: true
            }
        });
    }]);


/*
angular.module('app.services')
.service('UsuarioCliente', ['$resource','$filter','$httpParamSerializer', 'appConfig', function ($resource,$filter,$httpParamSerializer,appConfig) {

        function transformData(data){
            if(angular.isObject(data) && data.hasOwnProperty('password')){
                var o = angular.copy(data);
                if(angular.isObject(data) && data.hasOwnProperty('data_validade')){
                    var dateArray = data.data_validade.split('/'),
                        month = dateArray[1] - 1;
                    o.data_validade = new Date(dateArray[2],month,dateArray[0]);
                    //o.data_validade = $filter('date')(o.data_validade, 'yyyy-MM-dd');
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
                isArray: false,
                transformResponse: function(data, headers){
                    var o = appConfig.utils.transformResponse(data,headers);
                    if(angular.isObject(o) && o.hasOwnProperty('data_validade')){
                        o.data_validade = $filter('date')(o.data_validade, 'dd/MM/yyyy');
                    }
                    return o;
                }

            }
        });
    }]);
    */