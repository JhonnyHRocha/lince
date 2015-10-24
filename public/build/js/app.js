var app = angular.module('app',['ngRoute','angular-oauth2','app.controllers', 'app.services', 'app.filters']);

angular.module('app.controllers',['ngMessages','angular-oauth2']);
angular.module('app.filters',[]);
angular.module('app.services',['ngResource']);

app.provider('appConfig', function(){
    var config = {
        baseUrl: 'http://localhost:8000'
    };

    return {
        config : config,
        $get: function(){
            return config;
        }
    }
});

app.config(['$routeProvider', '$httpProvider' ,'OAuthProvider','OAuthTokenProvider' ,'appConfigProvider',
    function ($routeProvider, $httpProvider, OAuthProvider, OAuthTokenProvider, appConfigProvider) {

        $httpProvider.defaults.transformResponse = function(data,headers){
            var headersGetter = headers();

            if(headersGetter['content-type'] == 'application/json' || headersGetter['content-type'] == 'text/json') {
                var dataJson = JSON.parse(data);
                if(dataJson.hasOwnProperty('data')){
                    dataJson = dataJson.data;
                }
                return dataJson;
            }
            return data;
        };

        $routeProvider
            //LOGIN
            .when('/login',{
                templateUrl: 'build/views/login.html',
                controller: 'LoginController'
            })

            //HOME
            .when('/home',{
                templateUrl: 'build/views/home.html',
                controller: 'HomeController'
            })

            //CLIENTES
            .when('/clientes',{
                templateUrl: 'build/views/cliente/lista.html',
                controller: 'ClienteListaController'
            })
            .when('/clientes/novo',{
                templateUrl: 'build/views/cliente/novo.html',
                controller: 'ClienteNovoController'
            })
            .when('/clientes/:id/editar',{
                templateUrl: 'build/views/cliente/editar.html',
                controller: 'ClienteEditarController'
            })
            .when('/clientes/:id/excluir',{
                templateUrl: 'build/views/cliente/excluir.html',
                controller: 'ClienteExcluirController'
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
            });

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

app.run(['$rootScope', '$window', 'OAuth', function($rootScope, $window, OAuth) {
    $rootScope.$on('oauth:error', function(event, rejection) {
        // Ignore `invalid_grant` error - should be catched on `LoginController`.
        if ('invalid_grant' === rejection.data.error) {
            return;
        }

        // Refresh token when a `invalid_token` error occurs.
        if ('invalid_token' === rejection.data.error) {
            return OAuth.getRefreshToken();
        }

        // Redirect to `/login` with the `error_reason`.
        return $window.location.href = '/login?error_reason=' + rejection.data.error;
    });
}]);