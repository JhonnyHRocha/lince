angular.module('app.controllers')
    .controller('ClienteNovoController', ['$scope', '$location', 'User', 'Cliente',function($scope,$location,User,Cliente){
        $scope.usuarios = new Usuario();
        $scope.clientes = Cliente.query();

        $scope.save = function(){
            if($scope.form.$valid){
                $scope.usuarios.$save().then(function(){
                    $location.path('/usuarios');
                });
            }
        }

    }]);