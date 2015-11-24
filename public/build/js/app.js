var app = angular.module('app',
    ['ngRoute','ngMask','angular-oauth2','app.controllers', 'app.services', 'app.filters', 'app.directives', 'ngAnimate',
    'ui.bootstrap.modal',
    'http-auth-interceptor', 'angularUtils.directives.dirPagination','ui.bootstrap.dropdown', 'ui.router'
]);

angular.module('app.controllers',['ngMessages','angular-oauth2']);
angular.module('app.filters',[]);
angular.module('app.directives',[]);
angular.module('app.services',['ngResource']);

app.provider('appConfig', ['$httpParamSerializerProvider', function($httpParamSerializerProvider){
    var config = {
        baseUrl: 'http://localhost:8000',

        cliente: {
            status:[
                {value: 0, label: 'Inativo'},
                {value: 1, label: 'Ativo'},
                {value: 2, label: 'Bloqueado'}
            ]
        },
        financeiro: {
            tipo_pagamento:[
                {value: 0, label: 'Nenhum'},
                {value: 1, label: 'Boleto Bancário'},
                {value: 2, label: 'Depósito em Conta'}
            ],
            status_pagamento:[
                {value: 0, label: 'Aguardando Compensação'},
                {value: 1, label: 'Pago'},
                {value: 2, label: 'Não'},
                {value: 3, label: 'Não Compensado'},
            ]
        },
        usuario: {
            tipo_usuario:[
                {value: 0, label: 'Administrador'},
                {value: 1, label: 'Revendedor'},
                {value: 2, label: 'Usuário Master'},
                {value: 3, label: 'Usuário'},
            ],
            status:[
                {value: 0, label: 'Inativo'},
                {value: 1, label: 'Ativo'},
                {value: 2, label: 'Bloqueado'}
            ]
        },
        utils:{
            transformRequest: function(data){
                if(angular.isObject(data)){
                    return $httpParamSerializerProvider.$get()(data);
                }
                return data;
            },
            transformResponse: function(data,headers){
                var headersGetter = headers();

                if(headersGetter['content-type'] == 'application/json' ||
                    headersGetter['content-type'] == 'text/json') {
                    var dataJson = JSON.parse(data);
                    if(dataJson.hasOwnProperty('data') && Object.keys(dataJson).length == 1){
                        dataJson = dataJson.data;
                    }
                    return dataJson;
                }
                return data;
            }
        }
    };

    return {
        config : config,
        $get: function(){
            return config;
        }
    }
}]);

app.config(['$routeProvider', '$httpProvider' ,'OAuthProvider','OAuthTokenProvider' ,'appConfigProvider',
    function ($routeProvider, $httpProvider, OAuthProvider, OAuthTokenProvider, appConfigProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $httpProvider.defaults.transformRequest = appConfigProvider.config.utils.transformRequest;
        $httpProvider.defaults.transformResponse = appConfigProvider.config.utils.transformResponse;

        $httpProvider.interceptors.push('oauthFixInterceptor');

        $routeProvider
            //INICIO
            .when('/',{
                templateUrl: 'build/views/home.html',
                controller: 'HomeController'
            })

            //LOGIN
            .when('/login',{
                templateUrl: 'build/views/login.html',
                controller: 'LoginController'
            })
            .when('/logout',{
                resolve: {
                    logout: ['$location', 'OAuthToken', function($location, OAuthToken){
                        OAuthToken.removeToken();
                        return $location.path('/login');
                    }]
                }
            })
            .when('/cadastro',{
                templateUrl: 'build/views/cadastro/cadastro.html',
                controller: 'CadastroController'
            })
            .when('/cadastro_concluir',{
                templateUrl: 'build/views/cadastro/cadastro_concluir.html',
                controller: 'CadastroController'
            })


            //INICIO
            .when('/inicio',{
                templateUrl: 'build/views/painel/inicioAdministrador.html',
                controller: 'InicioAdministradorController',
                title: 'Início'
            })
            .when('/inicio_revendedor',{
                templateUrl: 'build/views/painel/inicioRevendedor.html',
                controller: 'InicioRevendedorController',
                title: 'Início'
            })
            .when('/inicio_cliente',{
                templateUrl: 'build/views/painel/inicioCliente.html',
                controller: 'InicioClienteController',
                title: 'Início'
            })

            //CLIENTES
            .when('/clientes',{
                templateUrl: 'build/views/cliente/clientes.html',
                controller: 'ClienteDashboardController',
                title: 'Gerenciamento de Clientes'
            })
            .when('/clientes/novo',{
                templateUrl: 'build/views/cliente/clientesNovo.html',
                controller: 'ClienteNovoController',
                title: 'Clientes'
            })

            //USUARIOS DOS CLIENTES
            .when('/clientes/:id/usuario/:idUsuario',{
                templateUrl: 'build/views/usuario/editar.html',
                controller: 'UsuarioEditarController',
                title: 'Usuários'
            })
            .when('/usuarios/novo',{
                templateUrl: 'build/views/usuario/novo.html',
                controller: 'UsuarioNovoController',
                title: 'Usuários'
            })

            //FINANCEIRO
            .when('/financeiro',{
                templateUrl: 'build/views/financeiro/financeiro.html',
                controller: 'FinanceiroController',
                title: 'Controle Financeiro'
            })
            .when('/financeiro/novaVenda',{
                templateUrl: 'build/views/financeiro/financeiroNovaVenda.html',
                controller: 'FinanceiroNovaVenda',
                title: 'Controle Financeiro - Nova venda'
            })
            .when('/financeiro/editar/:id',{
                templateUrl: 'build/views/financeiro/financeiroEditarVenda.html',
                controller: 'FinanceiroEditarVenda',
                title: 'Controle Financeiro - Edição de venda'
            })

            //USUARIOS DE ACESSO AO SISTEMA
            .when('/usuarios',{
                templateUrl: 'build/views/usuario/usuarios.html',
                controller: 'UsuarioController',
                title: 'Gerenciamento de Usuários'
            })
            .when('/usuarios_cliente',{
                templateUrl: 'build/views/usuario/usuariosCliente.html',
                controller: 'UsuarioClienteController',
                title: 'Gerenciamento de Usuários'
            })
            .when('/usuarios/novo',{
                templateUrl: 'build/views/usuario/novo.html',
                controller: 'UsuarioNovoController',
                title: 'Usuários'
            })

            //RELATORIOS
            .when('/relatorios',{
                templateUrl: 'build/views/relatorio/relatorios.html',
                controller: 'RelatorioController',
                title: 'Relatórios'
            })

            //REVENDEDORES
            .when('/revendedores',{
                templateUrl: 'build/views/revendedor/lista.html',
                controller: 'RevendedoresListaController'
            })
            .when('/revendedores/novo',{
                templateUrl: 'build/views/revendedor/novo.html',
                controller: 'RevendedoresNovoController'
            })
            .when('/revendedores/:id/editar',{
                templateUrl: 'build/views/revendedor/editar.html',
                controller: 'RevendedoresEditarController'
            })
            .when('/revendedores/:id/excluir',{
                templateUrl: 'build/views/revendedor/excluir.html',
                controller: 'RevendedoresExcluirController'
            })
            .otherwise({ redirectTo: '/public' });


        OAuthProvider.configure({
            baseUrl: appConfigProvider.config.baseUrl,
            clientId: 'appid1',
            clientSecret: 'secret', //opcional
            grantPath: 'oauth/access_token'
        });

        OAuthTokenProvider.configure({
            name: 'token',
            options: {
                secure: false
            }
        });
}]);

app.run(['$rootScope', '$location', '$http', 'OAuth', function($rootScope, $location, $http, OAuth) {

    $rootScope.isLoggedIn = function() {
        $http.get('/checklogin')
            .success(function(data) {
                if (data === true)
                    $scope.loggedIn = true;
                else
                    $scope.loggedIn = false;
            })
            .error(function(data) {
                console.log('error: ' + data);
            });
    };

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
        $rootScope.pageTitle = current.$$route.title;
    });


    $rootScope.$on('$routeChangeStart', function(event,next,current){
        //ESTA FUNCAO IRA VERIFICAR SE O A TELA DE CONCLUIR O CADASTRO DO CLIENTE FOI ACESSADA ATRAVÉS DA TELA DE CADASTRO
        //EM CASO NEGATIVO, O USUÁRIO SERÁ LEVADO PARA A TELA DE LOGIN NOVAMENTE, INIBINDO ASSIM O ACESSO DIRETO A PAGINA
        /*try{
            if(next.$$route.originalPath === '/cadastro_concluir' && current.$$route.originalPath != '/cadastro'){
                if(!OAuth.isAuthenticated()){
                    $location.path('login');
                }
            }
        } catch(Exception) {
            $location.path('login');
        }*/

        if(next.$$route.originalPath != '/login' && next.$$route.originalPath != '/cadastro' && next.$$route.originalPath != '/cadastro_concluir'){
            if(!OAuth.isAuthenticated()){
                $location.path('login');
            }
        }
    });

    $rootScope.$on('oauth:error', function(event, data) {
        // Ignore `invalid_grant` error - should be catched on `LoginController`.
        if ('invalid_grant' === data.rejection.data.error) {
            return;
        }

        // Refresh token when a `invalid_token` error occurs.
        if ('access_denied' === data.rejection.data.error) {
            if(!$rootScope.isRefreshingToken){
                $rootScope.isRefreshingToken = true;
                return OAuth.getRefreshToken().then(function(response){
                    $rootScope.isRefreshingToken = false;
                    return $http(data.rejection.config).then(function(response){
                        return data.deferred.resolve(response);
                    });
                });
            }else{
                return $http(data.rejection.config).then(function(response){
                    return data.deferred.resolve(response);
                });
            }
        }

        // Redirect to `/login` with the `error_reason`.
        return $location.path('login');
    });
}]);