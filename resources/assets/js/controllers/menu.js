angular.module('app.controllers')
    .controller('MenuController', ['$scope','$cookies',function($scope,$cookies){
        $scope.user = $cookies.getObject('user');

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
    }]);