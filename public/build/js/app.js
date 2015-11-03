var app = angular.module('app',
    ['ngRoute','angular-oauth2','app.controllers', 'app.services', 'app.filters', 'app.directives', 'ngAnimate',
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


            //HOME
            .when('/home',{
                templateUrl: 'build/views/home.html',
                controller: 'HomeController',
                title: 'Dashboard'
            })

            //CLIENTES
            .when('/clientes',{
                templateUrl: 'build/views/cliente/dashboard.html',
                controller: 'ClienteDashboardController',
                title: 'Clientes'
            })
            .when('/clientes/dashboard',{
                templateUrl: 'build/views/cliente/lista.html',
                controller: 'ClienteListaController',
                title: 'Clientes'
            })
            .when('/clientes/novo',{
                templateUrl: 'build/views/cliente/novo.html',
                controller: 'ClienteNovoController',
                title: 'Clientes'
            })
            .when('/clientes/:id/editar',{
                templateUrl: 'build/views/cliente/editar.html',
                controller: 'ClienteEditarController',
                title: 'Clientes'
            })
            .when('/clientes/:id/excluir',{
                templateUrl: 'build/views/cliente/excluir.html',
                controller: 'ClienteExcluirController',
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
            /*
            .when('/usuarios',{
                templateUrl: 'build/views/usuario/dashboard.html',
                controller: 'UsuarioDashboardController',
                title: 'Usuários'
            })
            .when('/usuarios/dashboard',{
                templateUrl: 'build/views/usuario/lista.html',
                controller: 'UsuarioListaController',
                title: 'Usuários'
            })
            .when('/usuarios/novo',{
                templateUrl: 'build/views/usuario/novo.html',
                controller: 'UsuarioNovoController',
                title: 'Usuários'
            })

            .when('/usuarios/:id/excluir',{
                templateUrl: 'build/views/usuario/excluir.html',
                controller: 'UsuarioExcluirController',
                title: 'Usuários'
            })*/

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
                console.log(data);
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
        if(next.$$route.originalPath != '/login' && next.$$route.originalPath != '/cadastro' && next.$$route.originalPath != '/cadastro_concluir'){
            if(!OAuth.isAuthenticated()){

                console.log("teste");
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