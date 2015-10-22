angular.module('app.controllers')
    .controller('ClienteNovoController', ['$scope', '$location', 'Cliente',function($scope,$location,Cliente){
        $scope.clientes = new Cliente();

        $scope.save = function(){
            if($scope.form.$valid){
                $scope.clientes.$save().then(function(){
                    $location.path('/clientes');
                });
            }
        }

    }]);