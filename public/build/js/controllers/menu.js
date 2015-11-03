angular.module('app.controllers')
    .controller('MenuController', ['$scope','$cookies', '$location',function($scope,$cookies,$location){
        $scope.user = $cookies.getObject('user');
        $scope.$location = $location;

        $scope.isAdmin = function isAdmin(){
            if($scope.user.tipo_usuario == 1)
                return true;
        };

        $scope.isDealer = function isAdmin(){
            if($scope.user.tipo_usuario == 2)
                return true;
        };

        $scope.isClient = function isAdmin(){
            if($scope.user.tipo_usuario == 3)
                return true;
        };

        $scope.isUser = function isAdmin(){
            if($scope.user.tipo_usuario == 4)
                return true;
        };

        $scope.isLogged = function(){
            if($scope.$location.$$path == "/login" || $scope.$location.$$path == "/cadastro" || $scope.$location.$$path == "/cadastro_concluir" )
                return false;
            else
                return true;
        }
    }]);